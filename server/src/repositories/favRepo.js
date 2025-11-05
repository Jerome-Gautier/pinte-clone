import { promisePool } from "../config/db.js";

export async function getFavoriteImages(currentUserId = null) {
  if (!currentUserId) return [];

  const [rows] = await promisePool.query(
    `
    SELECT
      images.*,
      users.username AS username,
      users.email AS user_email,
      COUNT(f2.image_id) AS favorite_count,
      1 AS is_favorite
    FROM favorites f
    JOIN images ON f.image_id = images.id
    JOIN users ON images.user_id = users.id
    LEFT JOIN favorites f2 ON images.id = f2.image_id
    WHERE f.user_id = ?
    GROUP BY images.id
    ORDER BY images.uploaded_at DESC
    `,    
    [currentUserId]
  );
  return rows;
}

export async function add(userId, imageId) {
  // avoid duplicates
  await promisePool.query(
    "INSERT IGNORE INTO favorites (user_id, image_id) VALUES (?, ?)",
    [userId, imageId]
  );
  const [countRows] = await promisePool.query(
    "SELECT COUNT(*) AS cnt FROM favorites WHERE image_id = ?",
    [imageId]
  );
  return { favorite_count: countRows[0].cnt, is_favorite: true };
}

export async function remove(userId, imageId) {
  await promisePool.query(
    "DELETE FROM favorites WHERE user_id = ? AND image_id = ?",
    [userId, imageId]
  );
  const [countRows] = await promisePool.query(
    "SELECT COUNT(*) AS cnt FROM favorites WHERE image_id = ?",
    [imageId]
  );
  return { favorite_count: countRows[0].cnt, is_favorite: false };
}

export async function isFavorite(userId, imageId) {
  const [rows] = await promisePool.query(
    "SELECT 1 FROM favorites WHERE user_id = ? AND image_id = ? LIMIT 1",
    [userId, imageId]
  );
  return rows.length > 0;
}
