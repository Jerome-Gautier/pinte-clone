import { promisePool } from '../config/db.js';

export async function findByGithubId(github_id) {
    const [rows] = await promisePool.query(
        'SELECT id, username, email, github_id FROM users WHERE github_id = ? LIMIT 1',
        [github_id]
    );

    return rows[0] ?? null;
}

export async function createFromGithubProfile({ id: github_id, username, emails }) {
    const email = emails && emails[0] && emails[0].value ? emails[0].value : null;
    const uName = username || `gh_${github_id}`;

    const [result] = await promisePool.query(
        'INSERT INTO users (username, email, github_id) VALUES (?, ?, ?)',
        [uName, email, github_id]
    );

    const [rows] = await promisePool.query(
        'SELECT id, username, email, github_id FROM users WHERE id = ?', [result.insertId]
    );

    return rows[0] ?? null;
}