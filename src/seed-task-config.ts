
import 'dotenv/config';
import mysql from "mysql2/promise";
import { v4 as uuidv4 } from 'uuid';

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  console.log("Connected to DB!");

  const statuses = [
      { text: "Open", value: "OPEN" },
      { text: "Done", value: "DONE" },
      { text: "Closed", value: "CLOSED" }
  ];

  const departments = [
      { text: "HR", value: "HR" },
      { text: "IT", value: "IT" },
      { text: "Finance", value: "FINANCE" },
      { text: "Marketing", value: "MARKETING" },
      { text: "Sales", value: "SALES" },
      { text: "Operations", value: "OPERATIONS" }
  ];

  // Insert Statuses
  for (const status of statuses) {
      const [rows] = await connection.query("SELECT id FROM config WHERE `group` = 'TASK_STATUS' AND `value` = ?", [status.value]);
      if ((rows as any[]).length === 0) {
          const id = uuidv4();
          const now = new Date();
          await connection.query(
              "INSERT INTO config (`id`, `group`, `value`, `text`, `createdAtUTC`, `createdBy`, `updatedAtUTC`, `updatedBy`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
              [id, 'TASK_STATUS', status.value, status.text, now, 'SYSTEM', now, 'SYSTEM']
          );
          console.log(`Inserted status: ${status.text}`);
      } else {
          console.log(`Status exists: ${status.text}`);
      }
  }

  // Insert Departments
  for (const dept of departments) {
      const [rows] = await connection.query("SELECT id FROM config WHERE `group` = 'DEPARTMENT' AND `value` = ?", [dept.value]);
      if ((rows as any[]).length === 0) {
          const id = uuidv4();
          const now = new Date();
          await connection.query(
              "INSERT INTO config (`id`, `group`, `value`, `text`, `createdAtUTC`, `createdBy`, `updatedAtUTC`, `updatedBy`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
              [id, 'DEPARTMENT', dept.value, dept.text, now, 'SYSTEM', now, 'SYSTEM']
          );
          console.log(`Inserted department: ${dept.text}`);
      } else {
          console.log(`Department exists: ${dept.text}`);
      }
  }

  await connection.end();
}
main().catch(console.error);
