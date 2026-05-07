import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="inline-block bg-red-500/20 text-red-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-red-500/30">
          404 — Trang không tồn tại
        </div>

        <div className="text-8xl md:text-9xl font-black gradient-text mb-4 leading-none">
          404
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
          Trang này không tồn tại
        </h1>

        <p className="text-gray-400 text-lg mb-10">
          Đường dẫn bạn truy cập không hợp lệ hoặc đã bị xóa. Hãy quay về trang chủ và tiếp tục hành trình tập luyện.
        </p>

        <Link to="/" className="btn-primary text-base mb-8 inline-block">
          Về Trang Chủ
        </Link>

        <div className="flex gap-4 justify-center mt-8">
          <Link to="/workout" className="text-gray-400 hover:text-orange-400 text-sm font-medium transition-colors">
            Lịch tập →
          </Link>
          <Link to="/bmi" className="text-gray-400 hover:text-orange-400 text-sm font-medium transition-colors">
            Tính BMI →
          </Link>
          <Link to="/consultation" className="text-gray-400 hover:text-orange-400 text-sm font-medium transition-colors">
            Đăng ký tư vấn →
          </Link>
        </div>
      </div>
    </div>
  )
}
