# Frontend Rules

## Các trang hiện có

| Route           | File                        | Mô tả                        |
|-----------------|-----------------------------|------------------------------|
| `/`             | `src/pages/Home.jsx`        | Trang chủ, hero + feature cards |
| `/workout`      | `src/pages/Workout.jsx`     | Lịch tập 7 ngày, accordion   |
| `/nutrition`    | `src/pages/Nutrition.jsx`   | Gợi ý bữa ăn + macro cards   |
| `/bmi`          | `src/pages/BMI.jsx`         | Tính BMI, có gauge + phân loại |
| `/consultation` | `src/pages/Consultation.jsx`| Form đăng ký tư vấn 1 bước   |

## Yêu cầu từng trang

### Home
- Hero nổi bật, tên **Gym Starter**, câu slogan truyền cảm hứng
- 3 CTA: Xem lịch tập / Tính BMI / Đăng ký tư vấn
- 4 feature cards dẫn đến các trang

### Workout
- Lịch tập 7 ngày (Thứ 2 → Chủ nhật)
- Dùng accordion — mỗi ngày mở ra bảng bài tập
- Cột: Tên bài tập, Số hiệp, Số lần, Nghỉ, Ghi chú
- Nội dung dễ hiểu, không quá chuyên môn

### Nutrition
- Card cho từng bữa ăn gợi ý
- Filter: Tất cả / Giảm mỡ / Tăng cơ / Duy trì
- Hiển thị macro: Calo, Protein, Tinh bột, Chất béo
- Có thể toggle "Xem chi tiết"

### BMI
- Input: Chiều cao, Cân nặng (hỗ trợ hệ mét và hệ Anh)
- Kết quả: chỉ số BMI + phân loại + gauge bar
- Phân loại: Thiếu cân / Bình thường / Thừa cân / Béo phì I / Béo phì II+
- Ghi chú: BMI chỉ là tham khảo, không thay thế tư vấn y tế
- CTA link đến `/consultation`

### Consultation
- Form 1 bước, các trường: Họ tên, SĐT/Email, Mục tiêu, Trình độ, Ghi chú
- Gọi `POST /api/consultations` khi submit
- Hiển thị màn hình thành công sau khi gửi

## Quy tắc viết code

- Ngôn ngữ hiển thị: **tiếng Việt** toàn bộ
- Dùng `useState`, `useEffect` — không dùng thư viện state phức tạp
- API URL lấy từ `import.meta.env.VITE_API_URL`
- Không hardcode URL
