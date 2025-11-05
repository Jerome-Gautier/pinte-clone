import  { promisePool } from '../config/db.js';

export async function getAllImages(currentUserId = null) {
  const viewer = currentUserId ? currentUserId : 0;
  const [rows] = await promisePool.query(
    `
        SELECT 
            images.*,
            users.username AS username,
            users.email AS user_email,
            COUNT(favorites.image_id) AS favorite_count,
            MAX(CASE WHEN favorites.user_id = ? THEN 1 ELSE 0 END) AS is_favorite
        FROM images
        JOIN users ON images.user_id = users.id
        LEFT JOIN favorites ON images.id = favorites.image_id
        GROUP BY images.id
        ORDER BY images.uploaded_at DESC
    `,
    [viewer]
  );

  return rows.map((r) => ({ ...r, is_favorite: Boolean(r.is_favorite) }));
}

export async function getImagesByUser(user_id, currentUserId = null) {
  const viewer = currentUserId ? currentUserId : 0;
  const [rows] = await promisePool.query(
    `
        SELECT
            images.*,
            users.username AS username,
            users.email AS user_email,
            COUNT(favorites.image_id) AS favorite_count,
            MAX(CASE WHEN favorites.user_id = ? THEN 1 ELSE 0 END) AS is_favorite
        FROM images
        JOIN users ON images.user_id = users.id
        LEFT JOIN favorites ON images.id = favorites.image_id
        WHERE images.user_id = ?
        GROUP BY images.id
        ORDER BY images.uploaded_at DESC
    `,
    [viewer, user_id]
  );

  return rows.map((r) => ({ ...r, is_favorite: Boolean(r.is_favorite) }));
}

export async function getImageById(id) {
  const [rows] = await promisePool.query(
    "SELECT * FROM `images` WHERE id = ? LIMIT 1",
    [id]
  );
  return rows.length > 0 ? rows[0] : null;
}

export async function addImage(imageData) {
  const { user_id, url, title } = imageData;
  const [result] = await promisePool.query(
    "INSERT INTO `images` (user_id, url, title) VALUES (?, ?, ?)",
    [user_id, url, title]
  );

  return { id: result.insertId, user_id, url, title };
}

export async function deleteImage(id) {
  const [result] = await promisePool.query("DELETE FROM `images` WHERE id = ?", [id]);

  return result.affectedRows > 0;
}