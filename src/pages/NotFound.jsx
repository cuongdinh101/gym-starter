import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">

        {/* Icon */}
        <div className="text-6xl mb-6">🏋️</div>

        <div className="inline-block bg-red-500/15 text-red-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-red-500/25">
          404 — Trang không tồn tại
        </div>

        <div className="text-8xl md:text-9xl font-black gradient-text mb-4 leading-none select-none">
          404
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
          Trang này không tồn tại
        </h1>

        <p className="text-gray-400 text-lg mb-10 max-w-md mx-auto">
          Đường dẫn bạn truy cập không hợp lệ hoặc đã bị xóa. Hãy quay về trang chủ và tiếp tục hành trình tập luyện.
        </p>

        <Link to="/" className="btn-primary text-base inline-block mb-10">
          Về Trang Chủ
        </Link>

        <div className="border-t border-white/10 pt-8 flex flex-wrap gap-4 justify-center">
          <Link to="/workout" className="text-gray-500 hover:text-orange-400 text-sm font-medium transition-colors">
            Lịch tập →
          </Link>
          <Link to="/nutrition" className="text-gray-500 hover:text-orange-400 text-sm font-medium transition-colors">
            Dinh dưỡng →
          </Link>
          <Link to="/bmi" className="text-gray-500 hover:text-orange-400 text-sm font-medium transition-colors">
            Tính BMI →
          </Link>
          <Link to="/consultation" className="text-gray-500 hover:text-orange-400 text-sm font-medium transition-colors">
            Đăng ký tư vấn →
          </Link>
        </div>
      </div>
    </div>
  )
}
