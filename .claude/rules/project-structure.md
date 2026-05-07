# Project Structure

## Tên & mục tiêu

- Tên: **Gym Starter**
- Đối tượng: người mới bắt đầu tập gym
- Mục tiêu học: xây dựng website full-stack đơn giản, dễ hiểu

## Tech stack

| Layer     | Công nghệ                         |
|-----------|-----------------------------------|
| Frontend  | React 19 + Vite 8                 |
| Styling   | Tailwind CSS 4                    |
| Routing   | react-router-dom 7                |
| Backend   | Node.js + Express 4               |
| Database  | SQLite (better-sqlite3)           |
| Auth      | JWT (jsonwebtoken) + bcryptjs     |
| Ngôn ngữ  | JavaScript (không TypeScript)     |

## Cấu trúc thư mục

```
du_an_ca_nhan/
  src/
    components/
      Navbar.jsx            # Fixed nav, ẩn Admin khi chưa login
      ProtectedRoute.jsx    # Guard component kiểm tra JWT token
    pages/
      Home.jsx
      Workout.jsx           # Fetch /api/workouts
      Nutrition.jsx         # Fetch /api/nutrition
      BMI.jsx
      Consultation.jsx      # Form → /api/consultations
      Contact.jsx           # Form → /api/contacts
      Login.jsx             # Admin login
      Admin.jsx             # Dashboard: stats, tabs, search, sort, delete
      NotFound.jsx          # 404
  server/
    index.js                # Express app, routes, JWT middleware
    db.js                   # SQLite init + migration từ JSON
    package.json
    data/
      gym-starter.db        # SQLite database (nguồn chính)
      workouts.json         # Static, read-only
      nutrition.json        # Static, read-only
      consultations.json    # Backup cũ
      contacts.json         # Backup cũ
  .env                      # VITE_API_URL=http://localhost:3001
```

## Giai đoạn phát triển

- **Giai đoạn 1** — Frontend 5 trang ✅
- **Giai đoạn 2** — Backend Express + lưu tư vấn ✅
- **Giai đoạn 3** — Contact form, Workout/Nutrition API, Admin Dashboard ✅
- **Giai đoạn 4** — Login/JWT bảo vệ Admin ✅
- **Giai đoạn 5** — SQLite database thay JSON ✅
- **Giai đoạn 6** — Pagination, Deploy (làm khi được yêu cầu)

## Nguyên tắc chung

- Không thêm tính năng khi chưa được yêu cầu
- Không dùng TypeScript, không payment, không upload ảnh
- Ưu tiên code dễ đọc, cấu trúc rõ ràng, học được từng bước
