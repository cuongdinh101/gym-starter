# API Rules

## Quy ước chung

- Base URL: `import.meta.env.VITE_API_URL` (frontend) = `http://localhost:3001` (local)
- Tất cả request/response dùng `Content-Type: application/json`
- Response luôn là JSON object

## Endpoints

### POST `/api/consultations`

Lưu đăng ký tư vấn mới.

**Request body:**
```json
{
  "name": "Nguyễn Văn A",
  "contact": "0901234567",
  "goal": "Giảm mỡ / Giảm cân",
  "level": "Mới bắt đầu (dưới 3 tháng)",
  "notes": "..."
}
```

**Response 201:**
```json
{ "message": "Đăng ký thành công", "data": { ...entry } }
```

### GET `/api/consultations`

Lấy danh sách tất cả đăng ký.

**Response 200:**
```json
[{ "name": "...", "contact": "...", "createdAt": "..." }]
```

## Xử lý lỗi

| Status | Ý nghĩa                            |
|--------|------------------------------------|
| 400    | Thiếu dữ liệu bắt buộc             |
| 500    | Lỗi server (đọc/ghi file thất bại) |

## Frontend gọi API

```js
const res = await fetch(`${import.meta.env.VITE_API_URL}/api/consultations`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(form),
})
if (!res.ok) throw new Error('Server error')
```

- Luôn bọc trong `try/catch`
- Hiển thị lỗi thân thiện cho người dùng (tiếng Việt)
- Không expose stack trace ra UI
