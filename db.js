const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

async function setup() {
  const db = await sqlite.open({
    filename: '/var/whatsapp/db.sqlite3',
    driver: sqlite3.Database
  });

  await db.run(`CREATE TABLE IF NOT EXISTS registrations (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  date TEXT,
                  user_id TEXT,
                  message TEXT
                )`);
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
  return 1;
}

async function usersForTonight() {
}

async function unregisterUser() {
}

module.exports = {
  registerForTonight, usersForTonight, unregisterUser,
};
