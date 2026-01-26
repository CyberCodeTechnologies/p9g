
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config({ path: "src/.env.development" });

async function main() {
  const connection = await mysql.createConnection(process.env.DB_URL!);
  const db = drizzle(connection);

  console.log("Updating database schema...");

  try {
    // Add dueDate to task table
    console.log("Adding dueDate to task table...");
    try {
        await connection.execute("ALTER TABLE task ADD COLUMN dueDate DATETIME(3)");
        console.log("dueDate added.");
    } catch (e: any) {
        if (e.code === 'ER_DUP_FIELDNAME') {
            console.log("dueDate already exists.");
        } else {
            console.error(e);
        }
    }

    // Create taskNote table
    console.log("Creating taskNote table...");
    try {
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS taskNote (
                id char(36) NOT NULL,
                taskId char(36) NOT NULL,
                content text NOT NULL,
                type varchar(50) NOT NULL DEFAULT 'NOTE',
                createdAtUTC datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
                createdBy char(36) NOT NULL,
                PRIMARY KEY (id),
                KEY taskNote_taskId_idx (taskId),
                CONSTRAINT taskNote_taskId_fk FOREIGN KEY (taskId) REFERENCES task (id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
        `);
        console.log("taskNote table created.");
    } catch (e) {
        console.error(e);
    }

  } catch (error) {
    console.error("Error updating database:", error);
  } finally {
    await connection.end();
  }
}

main();
