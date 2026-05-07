# Gym Starter — CLAUDE.md

Website React + Vite dành cho người mới bắt đầu tập gym.
Dự án học full-stack: React frontend + Node.js/Express backend + SQLite database.

## Cách chạy project

**Terminal 1 — Backend:**
```bash
cd /Users/macbook/du_an_ca_nhan/server
npm run dev
# Chạy tại: http://localhost:3001
# Log khởi động: "Database đã sẵn sàng" + "Server đang chạy tại..."
```

**Terminal 2 — Frontend:**
```bash
cd /Users/macbook/du_an_ca_nhan
npm run dev
# Mở: http://localhost:5173
```

> Phải chạy cả 2 terminal. Workout và Nutrition sẽ lỗi nếu backend chưa bật.

## Tài khoản Admin

| Field | Giá trị |
|-------|---------|
| Username | `admin` |
| Password | `admin123` |
| Login route | `/login` |
| Admin route | `/admin` (protected) |

## Các trang frontend

| Trang | Route | File | Ghi chú |
|-------|-------|------|---------|
| Trang chủ | `/` | `Home.jsx` | Hero, feature cards, CTA |
| Lịch tập | `/workout` | `Workout.jsx` | Fetch GET /api/workouts |
| Dinh dưỡng | `/nutrition` | `Nutrition.jsx` | Fetch GET /api/nutrition, filter |
| Tính BMI | `/bmi` | `BMI.jsx` | Local calculation, metric/imperial |
| Đăng ký tư vấn | `/consultation` | `Consultation.jsx` | Form → POST /api/consultations |
| Liên hệ | `/contact` | `Contact.jsx` | Form → POST /api/contacts |
| Đăng nhập Admin | `/login` | `Login.jsx` | POST /api/auth/login → JWT |
| Admin Dashboard | `/admin` | `Admin.jsx` | Protected — stats, tabs, search, sort, delete |
| 404 | `*` | `NotFound.jsx` | Trang không tồn tại |

## API Endpoints

| Method | Endpoint | Auth | Storage | Chức năng |
|--------|----------|------|---------|-----------|
| POST | `/api/auth/login` | Không | — | Đăng nhập, trả JWT (hết hạn 8h) |
| GET | `/api/workouts` | Không | JSON | Lịch tập 7 ngày |
| GET | `/api/nutrition` | Không | JSON | Danh sách bữa ăn |
| POST | `/api/consultations` | Không | SQLite | Lưu đăng ký tư vấn |
| GET | `/api/consultations` | JWT | SQLite | Xem danh sách tư vấn |
| DELETE | `/api/consultations/:id` | JWT | SQLite | Xóa đăng ký tư vấn |
| POST | `/api/contacts` | Không | SQLite | Lưu form liên hệ |
| GET | `/api/contacts` | JWT | SQLite | Xem danh sách liên hệ |
| DELETE | `/api/contacts/:id` | JWT | SQLite | Xóa liên hệ |

## Database — SQLite

- **File:** `server/data/gym-starter.db`
- **Package:** `better-sqlite3` (synchronous, không cần async/await)
- **Tạo tự động** lần đầu khi chạy server
- **Migration:** lần đầu khởi động, tự import data từ JSON cũ nếu bảng rỗng

**Bảng consultations:**
```
id INTEGER PK AUTOINCREMENT
name, contact, goal, level, notes TEXT
created_at TEXT (ISO 8601)
```

**Bảng contacts:**
```
id INTEGER PK AUTOINCREMENT
name, email, subject, message TEXT
created_at TEXT (ISO 8601)
```

> Workouts và Nutrition giữ dạng JSON vì: read-only, không user nào ghi vào, có nested arrays phức tạp (exercises[], ingredients[]) và UI metadata (Tailwind class strings).

## Cấu trúc thư mục hiện tại

```
du_an_ca_nhan/
  src/
    components/
      Navbar.jsx            # Fixed nav; ẩn Admin link khi chưa login
      ProtectedRoute.jsx    # Guard: kiểm tra localStorage token trước khi render /admin
    pages/
      Home.jsx
      Workout.jsx           # useEffect fetch /api/workouts
      Nutrition.jsx         # useEffect fetch /api/nutrition, filter theo goal
      BMI.jsx               # Tính local, không cần API
      Consultation.jsx      # Form → POST /api/consultations
      Contact.jsx           # Form → POST /api/contacts
      Login.jsx             # Form đăng nhập Admin
      Admin.jsx             # Dashboard: stat cards, tabs, search, sort, delete
      NotFound.jsx          # 404
  server/
    index.js                # Express entry point, tất cả routes + JWT middleware
    db.js                   # SQLite init, tạo bảng, migrate từ JSON
    package.json            # express, cors, jsonwebtoken, bcryptjs, better-sqlite3
    data/
      gym-starter.db        # SQLite database (NGUỒN CHÍNH)
      workouts.json         # Static read-only
      nutrition.json        # Static read-only
      consultations.json    # Backup (đã migrate sang SQLite, không còn dùng)
      contacts.json         # Backup (đã migrate sang SQLite, không còn dùng)
  .env                      # VITE_API_URL=http://localhost:3001
```

## Quyết định kỹ thuật quan trọng

**SQLite thay vì JSON file:**
JSON file không hỗ trợ concurrent writes an toàn và không thể query. SQLite phù hợp hơn cho dữ liệu người dùng ghi vào động. Workouts/nutrition giữ JSON vì static, read-only, có cấu trúc lồng nhau phức tạp.

**JWT bảo vệ Admin (không phải session):**
GET/DELETE các endpoint admin cần xác thực để không ai biết URL cũng có thể đọc data người dùng. Token 8h, lưu `localStorage`, tự logout khi API trả 401.

**better-sqlite3 thay vì sqlite3:**
API synchronous — dễ hiểu hơn cho người học, không cần callback/promise chain. `db.prepare('SELECT...').all()` trả kết quả ngay.

**bcryptjs cho mật khẩu Admin:**
Không lưu plain text ngay cả khi hardcode. Hash được tạo sẵn, compare khi login.

## Việc nên làm tiếp theo (chưa làm)

- **Pagination:** Admin hiện tải toàn bộ data — cần khi có > 100 bản ghi
- **Input validation:** Thêm validate email format, độ dài field ở backend
- **Deploy:** Chưa deploy lên server thật (Render, Railway, VPS...)
- **Nâng database:** SQLite đủ dùng cho học và demo; lên production có thể migrate sang PostgreSQL

## Rules chi tiết

- [project-structure.md](.claude/rules/project-structure.md) — tech stack, cấu trúc thư mục
- [frontend.md](.claude/rules/frontend.md) — yêu cầu từng trang, quy tắc React
- [backend.md](.claude/rules/backend.md) — Express server, database, cách chạy
- [ui-style.md](.claude/rules/ui-style.md) — dark theme, màu sắc, layout, UX
- [api-rules.md](.claude/rules/api-rules.md) — endpoints, request/response format

## Nguyên tắc cốt lõi

- Không thêm tính năng khi chưa được yêu cầu
- Code dễ hiểu, ưu tiên người đang học
- Giao diện tiếng Việt toàn bộ
- Không payment, không upload ảnh, không over-engineer
