import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '@/db/schema'

import { getEnv } from '@/libs/get-env'

/**
 * Drizzle ORM database connection
 *
 * Pastikan DATABASE_URL sudah diset di .env:
 * DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
 */
const connectionString = getEnv('DATABASE_URL')

// Disable prefetch karena tidak didukung untuk transaction mode
const client = postgres(connectionString, { prepare: false })

export const db = drizzle(client, { schema })
