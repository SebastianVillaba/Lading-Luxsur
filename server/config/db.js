import sql from 'mssql';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'Sqlconesfer2468',
  server: process.env.DB_SERVER || '172.25.1.10',
  port: parseInt(process.env.DB_PORT || '1433', 10),
  database: process.env.DB_DATABASE || 'luxsurHotel',
  options: {
    encrypt: false, // Desactivado para conexiones en red local / VPN / SQL 2008 R2
    trustServerCertificate: true,
    enableArithAbort: true,
    connectTimeout: 15000,
    requestTimeout: 30000
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let pool = null;

export async function getConnection() {
  try {
    if (!pool) {
      pool = await sql.connect(config);
      console.log(' Conectado exitosamente a SQL Server (DB: ' + config.database + ' en ' + config.server + ')');
    }
    return pool;
  } catch (error) {
    console.error(' Error conectando a SQL Server en ' + config.server + ':', error.message);
    throw error;
  }
}

export { sql };
export default { getConnection, sql };
