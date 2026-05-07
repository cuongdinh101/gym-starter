import { Link, useLocation } from 'react-router-dom'

const footerLinks = [
  { to: '/workout', label: 'Lịch Tập' },
  { to: '/nutrition', label: 'Dinh Dưỡng' },
  { to: '/bmi', label: 'Tính BMI' },
  { to: '/consultation', label: 'Tư Vấn' },
  { to: '/contact', label: 'Liên Hệ' },
]

const techTags = ['React', 'Node.js', 'SQLite', 'Tailwind']

export default function Footer() {
  const { pathname } = useLocation()
  if (pathname === '/login') return null

  return (
    <footer className="border-t border-white/10 bg-black/60 backdrop-blur-sm mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-xl font-black gradient-text">Gym</span>
              <span className="text-xl font-black text-white">Starter</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Kiến thức gym cơ bản, lịch tập rõ ràng và dinh dưỡng đơn giản — dành cho người mới bắt đầu tập luyện.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-gray-400 font-semibold text-xs uppercase tracking-widest mb-4">Khám phá</h4>
            <ul className="space-y-2.5">
              {footerLinks.map(l => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-gray-500 hover:text-orange-400 text-sm transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech stack */}
          <div>
            <h4 className="text-gray-400 font-semibold text-xs uppercase tracking-widest mb-4">Công nghệ</h4>
            <p className="text-gray-500 text-sm mb-4">Dự án học full-stack từ React đến backend.</p>
            <div className="flex flex-wrap gap-2">
              {techTags.map(t => (
                <span
                  key={t}
                  className="bg-white/5 border border-white/10 text-gray-400 text-xs px-3 py-1 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
          <p className="text-gray-600 text-sm">© 2026 Gym Starter. Dành cho người mới bắt đầu tập gym.</p>
          <p className="text-gray-700 text-xs">Made with React + Node.js</p>
        </div>
      </div>
    </footer>
  )
}
