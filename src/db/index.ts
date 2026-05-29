import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';
import dotenv from 'dotenv';

// Load environment variables from .env for raw Node.js runners (drizzle-kit, tsx, test scripts)
dotenv.config();

// Support both Astro SSR environment loading and Node environment fallback safely
const connectionString = 
  (typeof import.meta.env !== 'undefined' && import.meta.env.DATABASE_URL) || 
  process.env.DATABASE_URL || 
  '';

// Connection pool setup for MySQL (mysql2 directly parses the connection URI string)
export const connection = mysql.createPool(connectionString);

export const db = drizzle(connection, { schema, mode: 'default' });

