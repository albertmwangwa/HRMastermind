import bcrypt from "bcrypt";
import { db } from "@db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

const SALT_ROUNDS = 10;

export async function seedUsers() {
  console.log("Starting user seed...");

  // Hash the password
  const passwordHash = await bcrypt.hash("admin123", SALT_ROUNDS);

  const initialUsers = [
    {
      email: "albert.mwangwa@suhara.com",
      firstName: "Albert",
      lastName: "Mwangwa",
      role: "system_admin" as const,
      passwordHash,
    },
    {
      email: "mariam.kambarage@suhara.com",
      firstName: "Mariam",
      lastName: "Kambarage",
      role: "hr_manager" as const,
      passwordHash,
    },
    {
      email: "clinton.expedito@suhara.com",
      firstName: "Clinton",
      lastName: "Expedito",
      role: "department_manager" as const,
      passwordHash,
    },
  ];

  for (const user of initialUsers) {
    try {
      // Check if user already exists
      const existing = await db
        .select()
        .from(users)
        .where(eq(users.email, user.email))
        .limit(1);

      if (existing.length > 0) {
        console.log(`User ${user.email} already exists, skipping...`);
        continue;
      }

      // Create the user
      await db.insert(users).values(user);
      console.log(`✓ Created user: ${user.email} (${user.role})`);
    } catch (error) {
      console.error(`Error creating user ${user.email}:`, error);
    }
  }

  console.log("\nSeed complete!");
  console.log("\nYou can now login with:");
  console.log("- albert.mwangwa@suhara.com (System Admin)");
  console.log("- mariam.kambarage@suhara.com (HR Manager)");
  console.log("- clinton.expedito@suhara.com (Department Manager)");
  console.log("Password for all users: admin123");
}

// Run directly if executed as a script
if (import.meta.url === `file://${process.argv[1]}`) {
  seedUsers().catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
}
