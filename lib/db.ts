import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl: connectionString?.includes('supabase') || 
       connectionString?.includes('neon') || 
       connectionString?.includes('render') || 
       connectionString?.includes('.com') // Default for cloud DBs
    ? { rejectUnauthorized: false }
    : false,
});

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('Executed query:', { text, duration, rows: res.rowCount });
  return res;
};

export default pool;
