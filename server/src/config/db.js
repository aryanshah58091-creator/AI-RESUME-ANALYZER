import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'resume_analyzer',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Helper to initialize custom tables if missing
export async function initDatabase() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database:', process.env.DB_NAME || 'resume_analyzer');

    // Create users table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        ai_credits INT DEFAULT 100,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Ensure role column exists if users was created without it
    try {
      await connection.query(`ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user'`);
    } catch (e) {
      // Column likely already exists
    }

    // Ensure ai_credits column exists
    try {
      await connection.query(`ALTER TABLE users ADD COLUMN ai_credits INT DEFAULT 100`);
    } catch (e) {
      // Column likely already exists
    }

    // Create resumes table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS resumes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_type VARCHAR(50) NOT NULL,
        job_description TEXT NULL,
        extracted_text LONGTEXT NOT NULL,
        analysis JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create tailored_resumes table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS tailored_resumes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        resume_id INT NULL,
        target_role VARCHAR(255) NOT NULL,
        company_name VARCHAR(255) NULL,
        job_description TEXT NOT NULL,
        tailored_content LONGTEXT NOT NULL,
        ats_score_delta INT DEFAULT 15,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create interview_sessions table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS interview_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        resume_id INT NULL,
        target_role VARCHAR(255) NOT NULL,
        questions JSON NOT NULL,
        evaluations JSON NULL,
        overall_score INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Seed default demo & candidate accounts if missing
    try {
      const defaultUsers = [
        { name: 'Candidate (Fresher)', email: 'candidate@careerconnect.com', role: 'user' },
        { name: 'Admin SDE', email: 'admin@careerconnect.com', role: 'admin' },
        { name: 'Demo Candidate', email: 'demo@careerconnect.com', role: 'user' },
      ];

      for (const u of defaultUsers) {
        const [existing] = await connection.query('SELECT id FROM users WHERE email = ?', [u.email]);
        if (existing.length === 0) {
          // bcrypt hash of 'demo123'
          const defaultHash = '$2a$10$wTf2Eeqe09Bv1r2E1tKve.G55BvFwJ73P45p1N5w79iXb58hB5U.C';
          await connection.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [u.name, u.email, defaultHash, u.role]
          );
          console.log(`👤 Seeded default account: ${u.email}`);
        }
      }
    } catch (seedErr) {
      console.warn('Seeding note:', seedErr.message);
    }

    connection.release();
  } catch (error) {
    console.error('❌ MySQL Connection Failed:', error.message);
  }
}
