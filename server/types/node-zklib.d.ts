declare module 'node-zklib' {
    export default class ZKLib {
        constructor(ip: string, port: number, timeout: number, inport: number);
        createSocket(): Promise<void>;
        getUsers(): Promise<{ data: any[] }>;
        getAttendances(): Promise<{ data: any[] }>;
        disconnect(): Promise<void>;
    }
}
