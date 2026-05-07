import { Link } from 'react-router-dom'

const features = [
  {
    icon: '🏋️',
    title: 'Lịch Tập 7 Ngày',
    desc: 'Lịch tập đơn giản, rõ ràng dành cho người mới. Mỗi ngày ghi rõ bài tập, số hiệp, số lần và thời gian nghỉ.',
    to: '/workout',
    cta: 'Xem lịch tập',
  },
  {
    icon: '🥗',
    title: 'Dinh Dưỡng Cơ Bản',
    desc: 'Nguyên tắc ăn uống đơn giản cho người mới tập. Gợi ý bữa ăn, hướng dẫn về protein, tinh bột, chất béo và nước.',
    to: '/nutrition',
    cta: 'Xem dinh dưỡng',
  },
  {
    icon: '📊',
    title: 'Tính Chỉ Số BMI',
    desc: 'Nhập chiều cao và cân nặng để biết chỉ số BMI của bạn và phân loại cơ thể một cách nhanh chóng.',
    to: '/bmi',
    cta: 'Tính BMI',
  },
  {
    icon: '🤝',
    title: 'Đăng Ký Tư Vấn',
    desc: 'Điền form để nhận tư vấn cơ bản về lộ trình tập luyện phù hợp với mục tiêu và thể trạng của bạn.',
    to: '/consultation',
    cta: 'Đăng ký ngay',
  },
  {
    icon: '📬',
    title: 'Liên Hệ',
    desc: 'Có câu hỏi về tập luyện, dinh dưỡng hay muốn góp ý cho website? Gửi tin nhắn và chúng tôi sẽ phản hồi sớm.',
    to: '/contact',
    cta: 'Gửi liên hệ',
  },
]

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section
        className="min-h-screen flex items-center justify-center relative"
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a00 50%, #0a0a0a 100%)',
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="inline-block bg-orange-500/20 text-orange-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-orange-500/30">
            🔥 Dành cho người mới bắt đầu
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            Bắt Đầu Hành Trình{' '}
            <br />
            <span className="gradient-text">Gym Của Bạn</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Gym Starter giúp bạn hiểu kiến thức cơ bản, có lịch tập rõ ràng và nắm được nguyên tắc dinh dưỡng đơn giản — không cần kinh nghiệm trước.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/workout" className="btn-primary text-lg">
              Xem lịch tập
            </Link>
            <Link to="/bmi" className="border border-white/30 text-white font-bold py-3 px-8 rounded-full hover:bg-white/10 transition-colors text-lg">
              Tính BMI
            </Link>
            <Link to="/consultation" className="border border-orange-500/50 text-orange-400 font-bold py-3 px-8 rounded-full hover:bg-orange-500/10 transition-colors text-lg">
              Đăng ký tư vấn
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-gray-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-24 max-w-6xl mx-auto px-4">
        <h2 className="section-title">
          Website có những gì <span className="gradient-text">dành cho bạn?</span>
        </h2>
        <p className="section-subtitle">
          Tất cả kiến thức và công cụ cần thiết để bắt đầu tập gym đúng cách.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map(f => (
            <div
              key={f.title}
              className="card-hover bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col"
            >
              <div className="text-5xl mb-5">{f.icon}</div>
              <h3 className="text-2xl font-black text-white mb-3">{f.title}</h3>
              <p className="text-gray-400 leading-relaxed mb-6 flex-1">{f.desc}</p>
              <Link
                to={f.to}
                className="inline-block text-center btn-primary text-sm py-2.5 px-6 self-start"
              >
                {f.cta} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-4">
        <div
          className="max-w-4xl mx-auto rounded-3xl p-12 text-center"
          style={{ background: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)' }}
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Sẵn sàng bắt đầu chưa?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Đăng ký nhận tư vấn miễn phí — chúng tôi sẽ giúp bạn xây dựng lộ trình phù hợp nhất.
          </p>
          <Link
            to="/consultation"
            className="inline-block bg-white text-orange-500 font-black py-4 px-10 rounded-full text-lg hover:scale-105 transition-transform"
          >
            Đăng ký tư vấn miễn phí
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black gradient-text">Gym</span>
            <span className="text-xl font-black text-white">Starter</span>
          </div>
          <p className="text-gray-500 text-sm">© 2026 Gym Starter. Dành cho người mới bắt đầu tập gym.</p>
          <div className="flex gap-4 text-gray-400 text-sm">
            <Link to="/workout" className="hover:text-white transition-colors">Lịch tập</Link>
            <Link to="/nutrition" className="hover:text-white transition-colors">Dinh dưỡng</Link>
            <Link to="/bmi" className="hover:text-white transition-colors">BMI</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Liên hệ</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
