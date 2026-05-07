# UI Style Rules

## Phong cách tổng thể

- Dark theme — nền tối (`bg-black` hoặc `bg-gray-950`)
- Màu nhấn chính: **cam-đỏ** (`orange-500`, `red-500`)
- Cảm giác: hiện đại, khỏe khoắn, tạo động lực
- Font: đậm, to, impactful cho heading (`font-black`)

## Màu sắc

| Vai trò         | Class Tailwind                          |
|-----------------|-----------------------------------------|
| Gradient chính  | `from-orange-500 to-red-500`            |
| Text gradient   | class `gradient-text` (custom CSS)      |
| Card nền        | `bg-white/5 border border-white/10`     |
| Text phụ        | `text-gray-400`                         |
| Nút primary     | class `btn-primary` (custom CSS)        |

## Components tái dùng

- **Navbar**: sticky top, blur backdrop, logo "Gym Starter"
- **btn-primary**: gradient cam-đỏ, bo tròn, hover scale
- **gradient-text**: text fill cam → đỏ

## Layout

- Max width nội dung: `max-w-5xl` hoặc `max-w-2xl` tùy trang
- Padding top trang: `pt-24` (tránh bị Navbar che)
- Responsive: mobile-first, dùng `sm:`, `lg:` breakpoints
- Card dùng `rounded-2xl`, shadow nhẹ

## Nguyên tắc UX

- Mỗi trang có badge label nhỏ trên tiêu đề (ví dụ: "📊 Chỉ số khối cơ thể")
- CTA rõ ràng trên mỗi trang
- Form field: `rounded-xl`, focus ring màu cam (`focus:border-orange-500/60`)
- Error state: `border-red-500/60`, text `text-red-400`
- Loading state: disabled button + text "Đang gửi..."
