const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

let db;

async function setup() {
  if (!db) {
    db = await sqlite.open({
      filename: '/var/whatsapp/db.sqlite3',
      driver: sqlite3.Database
    });

    await db.run(`CREATE TABLE IF NOT EXISTS registrations (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  date TEXT,
                  user_id TEXT
                )`);
  }
  return db;
}

function dateToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

async function registerForTonight(userId) {
  const today = dateToday();
  await db.run('BEGIN TRANSACTION');

  try {
    const existingUser = await db.get(`SELECT COUNT(*) AS count FROM registrations WHERE date = ? AND user_id = ?`, [today, userId]);

    if (!existingUser) {
      await db.run(`INSERT INTO registrations (date, user_id) VALUES (?, ?)`, [today, userId]);
    }

    const result = await db.get(`SELECT COUNT(*) AS count FROM registrations WHERE date = ?`, today);

    await db.run('COMMIT');
    return result.count;
  } catch (error) {
    await db.run('ROLLBACK');
    throw error;
  }
}

async function usersForTonight() {
  const today = dateToday();
  const users = await db.all(`SELECT user_id FROM registrations WHERE date = ?`, today);
  return users.map(u => u.user_id);
}

async function unregisterUser(userId) {
  const today = dateToday();
  await db.run(`DELETE FROM registrations WHERE date = ? AND user_id = ?`, [today, userId]);
}

module.exports = {
  setup, registerForTonight, usersForTonight, unregisterUser,
};
