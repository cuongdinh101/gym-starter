import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import db from './db.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, 'data')
const WORKOUTS_FILE = join(DATA_DIR, 'workouts.json')
const NUTRITION_FILE = join(DATA_DIR, 'nutrition.json')

const JWT_SECRET = process.env.JWT_SECRET || 'gym-starter-secret-key-change-in-production'
const ADMIN_USERNAME = 'admin'
// Hash của mật khẩu 'admin123' — tạo lại bằng bcryptjs.hash() nếu muốn đổi mật khẩu
const ADMIN_PASSWORD_HASH = '$2b$10$Zrr/p6vgkmuMEXjNqoxAU.ZiAJT.hOScdVOs5xwQiLr3RCv7/PACi'

const app = express()
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json())

// Middleware kiểm tra JWT — dùng cho các route chỉ admin mới xem được
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // "Bearer <token>"
  if (!token) return res.status(401).json({ error: 'Chưa đăng nhập' })
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' })
  }
}

// POST /api/auth/login — đăng nhập, trả JWT nếu đúng
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ error: 'Vui lòng nhập tên đăng nhập và mật khẩu' })
  }
  if (username !== ADMIN_USERNAME) {
    return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng' })
  }
  const passwordMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH)
  if (!passwordMatch) {
    return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng' })
  }
  const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '8h' })
  res.json({ token })
})

// GET /api/workouts — lấy lịch tập 7 ngày (public, dữ liệu tĩnh từ JSON)
app.get('/api/workouts', async (_req, res) => {
  try {
    const workouts = JSON.parse(await readFile(WORKOUTS_FILE, 'utf-8'))
    res.json(workouts)
  } catch (err) {
    console.error('Lỗi đọc workouts.json:', err.message, '| path:', WORKOUTS_FILE)
    res.status(500).json({ error: 'Không thể đọc dữ liệu lịch tập' })
  }
})

// GET /api/nutrition — lấy danh sách bữa ăn (public, dữ liệu tĩnh từ JSON)
app.get('/api/nutrition', async (_req, res) => {
  try {
    const meals = JSON.parse(await readFile(NUTRITION_FILE, 'utf-8'))
    res.json(meals)
  } catch (err) {
    console.error('Lỗi đọc nutrition.json:', err.message, '| path:', NUTRITION_FILE)
    res.status(500).json({ error: 'Không thể đọc dữ liệu dinh dưỡng' })
  }
})

// POST /api/consultations — lưu đăng ký tư vấn (public — người dùng gửi form)
app.post('/api/consultations', (req, res) => {
  try {
    const { name, contact, goal, level, notes } = req.body
    if (!name || !name.trim()) return res.status(400).json({ error: 'Vui lòng nhập họ và tên' })
    if (name.trim().length > 100) return res.status(400).json({ error: 'Họ tên không được vượt quá 100 ký tự' })
    if (!contact || !contact.trim()) return res.status(400).json({ error: 'Vui lòng nhập số điện thoại hoặc email' })
    if (contact.trim().length > 200) return res.status(400).json({ error: 'Thông tin liên hệ không được vượt quá 200 ký tự' })
    if (!goal) return res.status(400).json({ error: 'Vui lòng chọn mục tiêu tập luyện' })
    if (!level) return res.status(400).json({ error: 'Vui lòng chọn trình độ của bạn' })
    if (notes && notes.length > 1000) return res.status(400).json({ error: 'Ghi chú không được vượt quá 1000 ký tự' })
    const result = db.prepare(
      'INSERT INTO consultations (name, contact, goal, level, notes) VALUES (?, ?, ?, ?, ?)'
    ).run(name, contact, goal, level, notes || '')
    const entry = db.prepare(
      'SELECT id, name, contact, goal, level, notes, created_at AS createdAt FROM consultations WHERE id = ?'
    ).get(result.lastInsertRowid)
    res.status(201).json({ message: 'Đăng ký thành công', data: entry })
  } catch {
    res.status(500).json({ error: 'Lỗi server, vui lòng thử lại' })
  }
})

// GET /api/consultations — xem danh sách có phân trang, tìm kiếm, sắp xếp (chỉ admin)
app.get('/api/consultations', verifyToken, (req, res) => {
  try {
    const page   = Math.max(1, parseInt(req.query.page)  || 1)
    const limit  = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10))
    const search = (req.query.search || '').trim()
    const order  = req.query.sort === 'oldest' ? 'ASC' : 'DESC'
    const offset = (page - 1) * limit

    let where = ''
    let params = []
    if (search) {
      where = 'WHERE name LIKE ? OR contact LIKE ? OR goal LIKE ? OR level LIKE ? OR notes LIKE ?'
      const q = `%${search}%`
      params = [q, q, q, q, q]
    }

    const { total } = db.prepare(
      `SELECT COUNT(*) AS total FROM consultations ${where}`
    ).get(...params)

    const data = db.prepare(
      `SELECT id, name, contact, goal, level, notes, created_at AS createdAt
       FROM consultations ${where} ORDER BY id ${order} LIMIT ? OFFSET ?`
    ).all(...params, limit, offset)

    res.json({ data, total, page, totalPages: Math.ceil(total / limit) || 1 })
  } catch {
    res.status(500).json({ error: 'Không thể đọc danh sách đăng ký' })
  }
})

// DELETE /api/consultations/:id — xóa đăng ký tư vấn (chỉ admin)
app.delete('/api/consultations/:id', verifyToken, (req, res) => {
  try {
    const id = Number(req.params.id)
    const result = db.prepare('DELETE FROM consultations WHERE id = ?').run(id)
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Không tìm thấy bản ghi' })
    }
    res.json({ message: 'Đã xóa' })
  } catch {
    res.status(500).json({ error: 'Lỗi server, vui lòng thử lại' })
  }
})

// POST /api/contacts — lưu form liên hệ (public — người dùng gửi form)
app.post('/api/contacts', (req, res) => {
  try {
    const { name, email, subject, message } = req.body
    if (!name || !name.trim()) return res.status(400).json({ error: 'Vui lòng nhập họ và tên' })
    if (name.trim().length > 100) return res.status(400).json({ error: 'Họ tên không được vượt quá 100 ký tự' })
    if (!email || !email.trim()) return res.status(400).json({ error: 'Vui lòng nhập email' })
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return res.status(400).json({ error: 'Email không hợp lệ' })
    if (email.trim().length > 200) return res.status(400).json({ error: 'Email không được vượt quá 200 ký tự' })
    if (subject && subject.length > 100) return res.status(400).json({ error: 'Chủ đề không được vượt quá 100 ký tự' })
    if (!message || !message.trim()) return res.status(400).json({ error: 'Vui lòng nhập nội dung liên hệ' })
    if (message.trim().length > 2000) return res.status(400).json({ error: 'Nội dung không được vượt quá 2000 ký tự' })
    const result = db.prepare(
      'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)'
    ).run(name, email, subject || '', message)
    const entry = db.prepare(
      'SELECT id, name, email, subject, message, created_at AS createdAt FROM contacts WHERE id = ?'
    ).get(result.lastInsertRowid)
    res.status(201).json({ message: 'Gửi liên hệ thành công', data: entry })
  } catch {
    res.status(500).json({ error: 'Lỗi server, vui lòng thử lại' })
  }
})

// GET /api/contacts — xem danh sách có phân trang, tìm kiếm, sắp xếp (chỉ admin)
app.get('/api/contacts', verifyToken, (req, res) => {
  try {
    const page   = Math.max(1, parseInt(req.query.page)  || 1)
    const limit  = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10))
    const search = (req.query.search || '').trim()
    const order  = req.query.sort === 'oldest' ? 'ASC' : 'DESC'
    const offset = (page - 1) * limit

    let where = ''
    let params = []
    if (search) {
      where = 'WHERE name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?'
      const q = `%${search}%`
      params = [q, q, q, q]
    }

    const { total } = db.prepare(
      `SELECT COUNT(*) AS total FROM contacts ${where}`
    ).get(...params)

    const data = db.prepare(
      `SELECT id, name, email, subject, message, created_at AS createdAt
       FROM contacts ${where} ORDER BY id ${order} LIMIT ? OFFSET ?`
    ).all(...params, limit, offset)

    res.json({ data, total, page, totalPages: Math.ceil(total / limit) || 1 })
  } catch {
    res.status(500).json({ error: 'Không thể đọc danh sách liên hệ' })
  }
})

// DELETE /api/contacts/:id — xóa liên hệ (chỉ admin)
app.delete('/api/contacts/:id', verifyToken, (req, res) => {
  try {
    const id = Number(req.params.id)
    const result = db.prepare('DELETE FROM contacts WHERE id = ?').run(id)
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Không tìm thấy bản ghi' })
    }
    res.json({ message: 'Đã xóa' })
  } catch {
    res.status(500).json({ error: 'Lỗi server, vui lòng thử lại' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`)
  console.log('WORKOUTS_FILE:', WORKOUTS_FILE)
  console.log('NUTRITION_FILE:', NUTRITION_FILE)
})
