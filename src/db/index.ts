import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Table } from "./schema";

const db = drizzle(process.env.DATABASE_URL!, {
    schema: Table
});

export default db;