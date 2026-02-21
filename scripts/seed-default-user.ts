/**
 * Seeds the default dev user (id 1) if missing.
 * Run after db:push: npm run db:seed
 * Uses DATABASE_URL from .env (load with dotenv).
 */
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { users } from '../src/lib/server/db/schema';
import { eq } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
	console.error('DATABASE_URL is not set');
	process.exit(1);
}

const sql = neon(connectionString);
const db = drizzle(sql);

async function seed() {
	const existing = await db.select().from(users).where(eq(users.id, 1)).limit(1);
	if (existing.length > 0) {
		console.log('Default user (id 1) already exists');
		return;
	}
	await db.insert(users).values({
		email: 'dev@localhost'
	});
	console.log('Created default user (id 1, email: dev@localhost)');
}

seed().catch((err) => {
	console.error(err);
	process.exit(1);
});
