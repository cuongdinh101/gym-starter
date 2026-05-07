import Database from 'better-sqlite3'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_PATH = join(__dirname, 'data', 'gym-starter.db')
const DATA_DIR = join(__dirname, 'data')

// Mở (hoặc tạo mới) file database
const db = new Database(DB_PATH)

// Bật WAL mode: tăng performance khi đọc/ghi đồng thời
db.pragma('journal_mode = WAL')

// Tạo bảng nếu chưa tồn tại
db.exec(`
  CREATE TABLE IF NOT EXISTS consultations (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    contact    TEXT NOT NULL,
    goal       TEXT NOT NULL,
    level      TEXT NOT NULL,
    notes      TEXT DEFAULT '',
    created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    subject    TEXT DEFAULT '',
    message    TEXT NOT NULL,
    created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
  );
`)

// Migrate dữ liệu cũ từ JSON sang SQLite
// Chỉ chạy khi bảng đang rỗng — tránh duplicate khi restart server
function migrateFromJSON(jsonFile, tableName, insertFn) {
  const { count } = db.prepare(`SELECT COUNT(*) AS count FROM ${tableName}`).get()
  if (count > 0) return // Đã có data, bỏ qua

  try {
    const data = JSON.parse(readFileSync(join(DATA_DIR, jsonFile), 'utf-8'))
    if (data.length === 0) return
    for (const item of data) insertFn(item)
    console.log(`  Migrated ${data.length} bản ghi từ ${jsonFile}`)
  } catch {
    // File không tồn tại hoặc rỗng — bỏ qua
  }
}

migrateFromJSON('consultations.json', 'consultations', item => {
  db.prepare(
    'INSERT INTO consultations (name, contact, goal, level, notes, created_at) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(item.name, item.contact, item.goal, item.level, item.notes || '', item.createdAt)
})

migrateFromJSON('contacts.json', 'contacts', item => {
  db.prepare(
    'INSERT INTO contacts (name, email, subject, message, created_at) VALUES (?, ?, ?, ?, ?)'
  ).run(item.name, item.email, item.subject || '', item.message, item.createdAt)
})

console.log('Database đã sẵn sàng:', DB_PATH)

export default db
