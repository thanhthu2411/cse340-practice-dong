import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Pool } from 'pg';

// Determine __dirname in ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the CA certificate content
const caCert = fs.readFileSync(path.join(__dirname, 'byuicse-psql-cert.pem'));

// Create a new PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
        ca: caCert,  // Use the certificate content, not the file path
        rejectUnauthorized: true,  // Keep this true for proper security
        checkServerIdentity: () => { return undefined; }  // Skip hostname verification but keep cert chain validation
    }
});