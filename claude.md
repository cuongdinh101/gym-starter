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
| Blog | `/blog` | `Blog.jsx` | Danh sách 7 bài viết, filter theo category |
| Chi tiết bài viết | `/blog/:slug` | `BlogPost.jsx` | Render structured content, CTA tư vấn |
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
    data/
      posts.js              # 7 bài viết Blog tĩnh (không cần backend)
    pages/
      Home.jsx
      Workout.jsx           # useEffect fetch /api/workouts
      Nutrition.jsx         # useEffect fetch /api/nutrition, filter theo goal
      BMI.jsx               # Tính local, không cần API
      Blog.jsx              # Danh sách bài viết, filter theo category
      BlogPost.jsx          # Chi tiết bài viết (useParams slug), related posts
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

## Deploy — Production URLs

| Service | URL | Ghi chú |
|---------|-----|---------|
| GitHub | https://github.com/cuongdinh101/gym-starter | Source code |
| Frontend (Vercel) | https://gym-starter-seven.vercel.app | React SPA |
| Backend (Render) | https://gym-starter-api.onrender.com | Express API |

### Cấu hình deploy

**Vercel:**
- Env var: `VITE_API_URL=https://gym-starter-api.onrender.com`
- `vercel.json` rewrites `/(.*) → /index.html` để React Router hoạt động với direct URL access

**Render:**
- Env vars: `JWT_SECRET`, `FRONTEND_URL=https://gym-starter-seven.vercel.app`, `PORT` (tự set)
- `server/.env.example` có template cho tất cả biến
- `dotenv/config` import ở đầu `server/index.js`

**CORS:** `origin: process.env.FRONTEND_URL || '*'` — chỉ cho phép Vercel domain gọi API production

**API URL (frontend):** Tập trung tại `src/config/api.js`:
```js
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"
export default API_BASE_URL
```
Tất cả 6 page files import từ đây thay vì inline `import.meta.env.VITE_API_URL`.

**SQLite trên Render:** Ephemeral filesystem — db reset mỗi lần deploy. Đủ cho học/demo; cần PostgreSQL cho production thật.

### Deploy lessons learned

- Vite env vars (`VITE_*`) được bake vào build lúc build time — phải set trên Vercel dashboard trước khi deploy
- React Router cần `vercel.json` rewrites — Vercel mặc định trả 404 cho các route không phải file tĩnh
- Render `PORT` phải dùng `process.env.PORT` — không hardcode 3001
- `catch {}` không log → không debug được trên cloud; cần `catch (err) { console.error(err) }`
- Render Free tier có **cold start ~30 giây** sau khi không dùng — lần đầu gọi API chậm là bình thường, không phải lỗi code

## Performance — Code Splitting & Loading UX (đã hoàn thành)

### Fetch pattern theo trang

| Trang | Fetch khi nào | Ghi chú |
|-------|---------------|---------|
| `/` (Home) | **Không fetch** | Load tĩnh ngay lập tức |
| `/workout` | Khi user navigate đến | `useEffect []` — chỉ fetch 1 lần khi mount |
| `/nutrition` | Khi user navigate đến | `useEffect []` — chỉ fetch 1 lần khi mount |
| `/bmi` | **Không fetch** | Tính local |
| `/admin` | Sau khi login và navigate đến | ProtectedRoute chặn trước khi mount |

### Code splitting với React.lazy

`App.jsx` dùng `React.lazy()` + `Suspense` cho 8 trang (trừ Home):

```jsx
import Home from './pages/Home'               // eager — landing page phải nhanh
const Workout = lazy(() => import('./pages/Workout'))
const Admin   = lazy(() => import('./pages/Admin'))   // chỉ tải khi vào /admin
```

- Bundle ban đầu chứa Home + React + Router + posts.js data (~257 KB)
- Mỗi trang tải thêm 1 chunk JS nhỏ lần đầu navigate (~2–15 KB), sau đó browser cache
- `posts.js` nằm trong initial bundle vì Home.jsx (eager) import để hiển thị blog preview

### Cold start hint (Workout & Nutrition)

Sau 5 giây vẫn loading → hiện text nhỏ:
> "Server đang khởi động, vui lòng đợi thêm vài giây..."

Dùng `useState(false)` + `useEffect` + `setTimeout(5000)` với cleanup `clearTimeout`.

## Blog/Tips — Static Content (đã hoàn thành 2026-05-07)

**7 bài viết** trong `src/data/posts.js` — không cần backend, không cần fetch:

| Category | Số bài | Ví dụ |
|----------|--------|-------|
| Cơ bản | 2 | 5 Nguyên Tắc Vàng, 6 Bài Tập Cơ Bản |
| Dinh dưỡng | 2 | Chế Độ Dinh Dưỡng, Protein Bao Nhiêu Là Đủ |
| Phục hồi | 1 | Tầm Quan Trọng Của Phục Hồi |
| Giảm cân | 1 | Giảm Mỡ Không Nhịn Đói |
| Tăng cơ | 1 | Tránh 5 Sai Lầm Khi Tăng Cơ |

**Cấu trúc mỗi post:** `{ id, slug, title, excerpt, category, coverEmoji, readTime, publishedAt, content[] }`

**Content blocks:** `paragraph` | `heading` | `list` | `tip` — render bằng switch/case, không dùng `dangerouslySetInnerHTML`.

**Slug không tồn tại** → BlogPost hiển thị inline "Bài viết không tồn tại" + link về `/blog`.

## Việc nên làm tiếp theo (chưa làm)

- **Admin CRUD Blog posts:** Cho phép admin thêm/sửa/xóa bài viết blog qua giao diện (hiện tại static trong `posts.js`)
- **Admin CRUD Workout/Nutrition:** Cho phép admin thêm/sửa/xóa lịch tập và bữa ăn qua giao diện
- **MySQL/AWS RDS:** Thay SQLite bằng MySQL có persistent storage — Railway/PlanetScale cho cloud free tier
- **Input validation backend:** Validate email format, độ dài field ở server
- **Refresh token:** Token 8h hết hạn → user bị logout; thêm refresh token flow
- **CI/CD:** GitHub Actions auto-deploy khi push main
- **Custom domain:** Thêm domain riêng thay `*.vercel.app` / `*.onrender.com`

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
