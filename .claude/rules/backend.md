# Backend Rules

## Cấu trúc

```
server/
  index.js          # Express app, tất cả routes
  data/
    consultations.json
  package.json      # "type": "module", express + cors
```

## Chạy server

```bash
cd server
npm run dev        # node --watch index.js
```

Server chạy tại: `http://localhost:3001`

## API hiện có

| Method | Endpoint              | Chức năng                        |
|--------|-----------------------|----------------------------------|
| POST   | `/api/consultations`  | Lưu đăng ký tư vấn vào JSON      |
| GET    | `/api/consultations`  | Lấy danh sách đăng ký tư vấn     |

## Dữ liệu lưu trữ

- Dùng file JSON trong `server/data/`
- Đọc/ghi bằng `fs/promises` (`readFile`, `writeFile`)
- Mỗi consultation entry có: `name`, `contact`, `goal`, `level`, `notes`, `createdAt`

## Quy tắc

- Luôn có `try/catch` khi đọc/ghi file
- Trả về JSON với status code rõ ràng (`200`, `201`, `400`, `500`)
- Dùng `cors()` để cho phép frontend kết nối
- Không dùng database nặng, không authentication trong giai đoạn này
- ES Modules (`import/export`), không dùng `require()`

## Biến môi trường (frontend)

```
VITE_API_URL=http://localhost:3001
```

Khai báo trong `.env` ở root project (không commit lên git).
