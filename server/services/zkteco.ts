import { db } from "@db";
import * as schema from "@shared/schema";
import { attendanceDevices, attendanceLogs } from "@shared/schema";
import { eq } from "drizzle-orm";

interface BioTimeConfig {
    host: string;
    port: string;
    username: string;
    password: string;
}

interface BioTimeAuthResponse {
    token: string;
}

interface BioTimeTransaction {
    id: number;
    emp_code: string;
    punch_time: string;
    punch_state: string;
    verify_type: number;
    work_code: string | null;
    terminal_sn: string;
    terminal_alias: string | null;
    area_alias: string | null;
    longitude: string | null;
    latitude: string | null;
    gps_location: string;
    mobile: string | null;
    source: number;
    purpose: number;
    crc: string | null;
    is_attendance: number;
    reserved: string | null;
    upload_time: string;
    sync_status: number;
    sync_time: string | null;
    is_mask: number;
    temperature: string | null;
}

interface BioTimeTransactionsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    msg: string;
    code: number;
    data: BioTimeTransaction[];
    results?: BioTimeTransaction[];
}

interface BioTimeEmployee {
    id: number;
    emp_code: string;
    first_name: string;
    last_name: string;
    nickname: string | null;
    passport: string | null;
    driver_license_automobile: string | null;
    driver_license_motorcycle: string | null;
    social_security_number: string | null;
    health_insurance_number: string | null;
    birthday: string | null;
    gender: string | null;
    nationality: number | null;
    telephone: string | null;
    mobile: string | null;
    email: string | null;
    department: number | null;
    position: number | null;
    hire_date: string | null;
    verify_mode: number;
    city: string | null;
    emp_type: number;
    enable_att: boolean;
    enable_overtime: boolean;
    enable_holiday: boolean;
    deleted: boolean;
    reserved: string | null;
    del_tag: number;
}

interface BioTimeEmployeesResponse {
    count: number;
    next: string | null;
    previous: string | null;
    msg: string;
    code: number;
    data: BioTimeEmployee[];
    results?: BioTimeEmployee[];
}

export class BioTimeService {
    private baseUrl: string;
    private token: string | null = null;

    constructor(private config: BioTimeConfig) {
        this.baseUrl = `http://${config.host}:${config.port}`;
    }

    /**
     * Helper for robust fetch with retry and timeout
     */
    private async fetchWithRetry(url: string, options: RequestInit = {}, retries = 3, timeout = 30000): Promise<Response> {
        let lastError: any;

        for (let i = 0; i < retries; i++) {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), timeout);
            const { signal } = controller;

            try {
                console.log(`[BioTime] Request attempt ${i + 1}/${retries} to ${url}`);
                const response = await fetch(url, { ...options, signal });
                clearTimeout(id);
                return response;
            } catch (error: any) {
                clearTimeout(id);
                lastError = error;
                console.warn(`[BioTime] Request attempt ${i + 1}/${retries} failed: ${error.message}`);

                if (error.name === 'AbortError') {
                    console.warn(`[BioTime] Request timed out after ${timeout}ms`);
                }

                // Wait before retrying (exponential backoff)
                if (i < retries - 1) {
                    const delay = Math.pow(2, i) * 1000;
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        throw lastError;
    }

    /**
     * Authenticate with BioTime and get JWT token
     */
    private async authenticate(): Promise<string> {
        try {
            const url = `${this.baseUrl}/jwt-api-token-auth/`;
            console.log(`[BioTime] Authenticating with ${url}`);

            const response = await this.fetchWithRetry(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: this.config.username,
                    password: this.config.password,
                }),
            });

            if (!response.ok) {
                throw new Error(`Authentication failed: ${response.status} ${response.statusText}`);
            }

            const data: BioTimeAuthResponse = await response.json();
            this.token = data.token;
            return data.token;
        } catch (error) {
            throw new Error(`Failed to authenticate: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Get authentication headers
     */
    private async getHeaders(): Promise<HeadersInit> {
        if (!this.token) {
            await this.authenticate();
        }

        return {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${this.token}`,
        };
    }

    /**
     * Test connection to BioTime server
     */
    async testConnection(): Promise<{ success: boolean; message: string }> {
        try {
            await this.authenticate();
            return {
                success: true,
                message: 'Successfully connected to BioTime server',
            };
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : String(error),
            };
        }
    }

    /**
     * Get all employees from BioTime
     */
    async getEmployees(page = 1, pageSize = 100): Promise<BioTimeEmployee[]> {
        try {
            const headers = await this.getHeaders();
            const url = `${this.baseUrl}/personnel/api/employees/?page=${page}&page_size=${pageSize}`;

            console.log(`[BioTime] Fetching employees from ${url}`);
            const response = await this.fetchWithRetry(url, { headers });

            if (!response.ok) {
                throw new Error(`Failed to fetch employees: ${response.status} ${response.statusText}`);
            }

            const data: BioTimeEmployeesResponse = await response.json();
            return data.data || data.results || [];
        } catch (error) {
            throw new Error(`Failed to get employees: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Get attendance transactions (punch records)
     */
    async getTransactions(params: {
        empCode?: string;
        startTime?: Date;
        endTime?: Date;
        page?: number;
        pageSize?: number;
    }): Promise<BioTimeTransaction[]> {
        try {
            const headers = await this.getHeaders();

            // Build query parameters
            const queryParams = new URLSearchParams();

            if (params.empCode) {
                queryParams.append('emp_code', params.empCode);
            }

            if (params.startTime) {
                queryParams.append('start_time', this.formatDateTime(params.startTime));
            }

            if (params.endTime) {
                queryParams.append('end_time', this.formatDateTime(params.endTime));
            }

            queryParams.append('page', String(params.page || 1));
            queryParams.append('page_size', String(params.pageSize || 100));

            const url = `${this.baseUrl}/iclock/api/transactions/?${queryParams.toString()}`;

            console.log(`[BioTime] Fetching transactions from ${url}`);
            const response = await this.fetchWithRetry(url, { headers });

            if (!response.ok) {
                throw new Error(`Failed to fetch transactions: ${response.status} ${response.statusText}`);
            }

            const data: BioTimeTransactionsResponse = await response.json();
            return data.data || data.results || [];
        } catch (error) {
            throw new Error(`Failed to get transactions: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Get all transactions with pagination
     */
    async getAllTransactions(params: {
        empCode?: string;
        startTime?: Date;
        endTime?: Date;
    }): Promise<BioTimeTransaction[]> {
        const allTransactions: BioTimeTransaction[] = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
            const transactions = await this.getTransactions({
                ...params,
                page,
                pageSize: 100,
            });

            allTransactions.push(...transactions);

            // If we got less than the page size, we've reached the end
            hasMore = transactions.length === 100;
            page++;
        }

        return allTransactions;
    }

    /**
     * Format date for BioTime API
     */
    private formatDateTime(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    /**
     * Sync device - pull employees and attendance records from BioTime
     */
    static async syncDevice(device: typeof attendanceDevices.$inferSelect) {
        console.log(`[BioTime] Starting sync for device ${device.name} (${device.ipAddress}:${device.port})`);

        const startTime = Date.now();
        let recordCount = 0;
        let employeesCreated = 0;

        try {
            // Set device status to syncing
            await db.update(attendanceDevices)
                .set({ status: "syncing", lastError: null })
                .where(eq(attendanceDevices.id, device.id));

            // Log sync start
            await db.insert(schema.deviceActivityLogs).values({
                deviceId: device.id,
                activityType: "sync_start",
                details: `Starting sync for ${device.name}`,
            });

            const biotime = new BioTimeService({
                host: device.ipAddress,
                port: device.port,
                username: device.username,
                password: device.password,
            });

            // Step 1: Sync employees from BioTime
            console.log(`[BioTime] Fetching employees from device ${device.name}`);
            const biotimeEmployees = await biotime.getEmployees();
            console.log(`[BioTime] Found ${biotimeEmployees.length} employees on device`);

            // Step 2: Auto-create missing employees
            for (const biotimeEmp of biotimeEmployees) {
                const existing = await db.query.employees.findFirst({
                    where: (employees, { eq }) => eq(employees.biometricId, biotimeEmp.emp_code)
                });

                if (!existing) {
                    try {
                        await db.insert(schema.employees).values({
                            biometricId: biotimeEmp.emp_code,
                            firstName: biotimeEmp.first_name || 'Unknown',
                            lastName: biotimeEmp.last_name || '',
                            email: biotimeEmp.email || `${biotimeEmp.emp_code}@biotime.local`,
                            phone: biotimeEmp.mobile || null,
                            role: 'Employee',
                            status: biotimeEmp.enable_att ? 'active' : 'inactive',
                            joiningDate: new Date().toISOString().split('T')[0],
                            departmentId: null,
                        });
                        employeesCreated++;
                        console.log(`[BioTime] Created employee: ${biotimeEmp.first_name} ${biotimeEmp.last_name} (${biotimeEmp.emp_code})`);
                    } catch (error) {
                        console.error(`[BioTime] Failed to create employee ${biotimeEmp.emp_code}:`, error);
                    }
                }
            }

            if (employeesCreated > 0) {
                console.log(`[BioTime] Created ${employeesCreated} new employees from device`);
            }

            // Step 3: Get and process attendance transactions
            // Default to last 30 days to avoid timeout on large datasets
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            thirtyDaysAgo.setHours(0, 0, 0, 0);

            console.log(`[BioTime] Fetching transactions since ${thirtyDaysAgo.toISOString()}`);

            const transactions = await biotime.getAllTransactions({
                startTime: thirtyDaysAgo
            });

            recordCount = transactions.length;
            console.log(`[BioTime] Retrieved ${recordCount} transactions from device ${device.name}`);

            // Step 4: Process attendance records
            let recordsProcessed = 0;
            for (const transaction of transactions) {
                const employee = await db.query.employees.findFirst({
                    where: (employees, { eq }) => eq(employees.biometricId, transaction.emp_code)
                });

                if (employee) {
                    const punchTime = new Date(transaction.punch_time);
                    await db.insert(attendanceLogs).values({
                        employeeId: employee.id,
                        deviceId: device.id,
                        checkIn: transaction.punch_state === "0" ? punchTime : null,
                        checkOut: transaction.punch_state === "1" ? punchTime : null,
                        date: punchTime.toISOString().split('T')[0],
                    }).onConflictDoNothing();
                    recordsProcessed++;
                } else {
                    console.warn(`[BioTime] No employee found for biometric ID: ${transaction.emp_code}`);
                }
            }

            console.log(`[BioTime] Processed ${recordsProcessed} attendance records`);

            const duration = Date.now() - startTime;

            // Update device with success status and stats
            await db.update(attendanceDevices)
                .set({
                    status: "idle",
                    lastError: null,
                    lastSyncAt: new Date(),
                    lastSyncRecordCount: recordCount,
                    lastSyncDuration: duration,
                    lastSyncSuccess: true,
                })
                .where(eq(attendanceDevices.id, device.id));

            // Log sync success
            await db.insert(schema.deviceActivityLogs).values({
                deviceId: device.id,
                activityType: "sync_success",
                details: `Successfully synced ${recordCount} transactions, created ${employeesCreated} new employees`,
                recordCount,
                duration,
            });

            console.log(`[BioTime] Sync completed for device ${device.name} in ${duration}ms`);
        } catch (error: any) {
            const duration = Date.now() - startTime;
            const errorMessage = error?.message || "Unknown error";

            console.error(`[BioTime] Sync failed for device ${device.name}:`, error);

            // Update device with error status
            await db.update(attendanceDevices)
                .set({
                    status: "error",
                    lastError: errorMessage,
                    lastSyncAt: new Date(),
                    lastSyncRecordCount: recordCount,
                    lastSyncDuration: duration,
                    lastSyncSuccess: false,
                })
                .where(eq(attendanceDevices.id, device.id));

            // Log sync error
            await db.insert(schema.deviceActivityLogs).values({
                deviceId: device.id,
                activityType: "sync_error",
                details: errorMessage,
                recordCount,
                duration,
            });

            throw error;
        }
    }
}
