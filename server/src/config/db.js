import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export async function findUserByGithubId(githubId) {
    const [rows] = await pool.promise().query(
        "SELECT * FROM users WHERE github_id = ? LIMIT 1",
        [githubId]
    );
    return rows.length ? rows[0] : null;
}

export async function createUserFromGithub(profile) {
    const username = profile.username || profile.displayName || 'github_user';
    const email = (profile.emails && profile.emails[0] && profile.emails[0].value) || null;
    const github_id = profile.id;
    const [result] = await pool.promise.query(
        "INSERT INTO users (username, email, github_id) VALUES (?, ?, ?)",
        [username, email, github_id]
    );
    const id = result.insertId;
    const [rows] = await pool.promise().query(
        "SELECT * FROM users WHERE id = ?", [id]);
    return rows.length ? rows[0] : null;
}

export const promisePool = pool.promise();
export default pool;
