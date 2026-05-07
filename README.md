# Gym Starter

Website hỗ trợ người mới bắt đầu tập gym — xem lịch tập, tra dinh dưỡng, tính BMI, đăng ký tư vấn và liên hệ. Có trang Admin quản lý dữ liệu người dùng.

Dự án học full-stack: React frontend + Node.js/Express backend + SQLite database.

---

## Tech Stack

| Layer | Công nghệ |
|-------|-----------|
| Frontend | React 19 + Vite 8 |
| Styling | Tailwind CSS 4 |
| Routing | React Router DOM 7 |
| Backend | Node.js + Express 4 |
| Database | SQLite (better-sqlite3) |
| Auth | JWT (jsonwebtoken) + bcryptjs |

---

## Tính năng chính

- **Home** — Trang chủ, hero section, feature cards
- **Workout** — Lịch tập 7 ngày dạng accordion, bảng bài tập chi tiết
- **Nutrition** — Gợi ý bữa ăn, filter theo mục tiêu, hiển thị macro
- **BMI** — Tính chỉ số BMI, hỗ trợ hệ mét và hệ Anh, phân loại kết quả
- **Consultation** — Form đăng ký tư vấn, lưu vào SQLite
- **Contact** — Form liên hệ, lưu vào SQLite
- **Login / JWT** — Đăng nhập admin, trả JWT token, tự logout khi hết hạn
- **Admin Dashboard** — Xem danh sách tư vấn và liên hệ, tìm kiếm, sắp xếp, phân trang, xóa (yêu cầu JWT)

---

## Cách chạy

Cần mở **2 terminal** chạy song song.

**Terminal 1 — Backend (port 3001):**

```bash
cd server
npm install
npm run dev
```

**Terminal 2 — Frontend (port 5173):**

```bash
npm install
npm run dev
```

Mở trình duyệt: [http://localhost:5173](http://localhost:5173)

---

## Cấu hình môi trường

**Frontend — file `.env` ở thư mục gốc:**

```env
VITE_API_URL=http://localhost:3001
```

**Backend — file `server/.env`:**

```env
JWT_SECRET=your-secret-key-here
FRONTEND_URL=http://localhost:5173
PORT=3001
```

Xem `server/.env.example` để biết các biến cần thiết.

---

## Tài khoản Admin

| Field | Giá trị |
|-------|---------|
| Username | `admin` |
| Password | `admin123` |
| Route | `/login` → `/admin` |

---

## API chính

| Method | Endpoint | Auth | Chức năng |
|--------|----------|------|-----------|
| POST | `/api/auth/login` | — | Đăng nhập, trả JWT |
| GET | `/api/workouts` | — | Lịch tập 7 ngày |
| GET | `/api/nutrition` | — | Danh sách bữa ăn |
| POST | `/api/consultations` | — | Lưu đăng ký tư vấn |
| GET | `/api/consultations` | JWT | Xem danh sách tư vấn (có phân trang) |
| DELETE | `/api/consultations/:id` | JWT | Xóa đăng ký tư vấn |
| POST | `/api/contacts` | — | Lưu form liên hệ |
| GET | `/api/contacts` | JWT | Xem danh sách liên hệ (có phân trang) |
| DELETE | `/api/contacts/:id` | JWT | Xóa liên hệ |

### Query params cho GET có phân trang

```
?page=1&limit=10&search=keyword&sort=newest|oldest
```

---

## Cấu trúc thư mục

```
gym-starter/
  src/
    components/
      Navbar.jsx
      ProtectedRoute.jsx
    pages/
      Home.jsx
      Workout.jsx
      Nutrition.jsx
      BMI.jsx
      Consultation.jsx
      Contact.jsx
      Login.jsx
      Admin.jsx
      NotFound.jsx
  server/
    index.js          # Express app, tất cả routes
    db.js             # SQLite init + migration
    .env.example      # Mẫu biến môi trường
    data/
      gym-starter.db  # SQLite database (tạo tự động)
      workouts.json   # Dữ liệu tĩnh
      nutrition.json  # Dữ liệu tĩnh
  .env.example        # Mẫu biến môi trường frontend
```

---

## Lưu ý

- Không commit file `.env` và `server/.env` lên git — đã có trong `.gitignore`
- Không commit file database `*.db` lên git — đã có trong `.gitignore`
- File `server/data/gym-starter.db` được tạo tự động lần đầu chạy server
- Workouts và Nutrition giữ dạng JSON vì read-only, không cần ghi vào database

---

## Deploy (dự kiến)

| Phần | Platform |
|------|----------|
| Frontend | Vercel — kết nối GitHub, build tự động |
| Backend | Render — Web Service, start command: `node index.js` |
| Database | SQLite trên Render (Persistent Disk) hoặc migrate sang PostgreSQL |

**Env vars cần set khi deploy:**

- Vercel: `VITE_API_URL=https://your-api.onrender.com`
- Render: `JWT_SECRET`, `FRONTEND_URL=https://your-app.vercel.app`
