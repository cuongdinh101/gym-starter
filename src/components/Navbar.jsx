import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const links = [
  { to: '/', label: 'Trang Chủ' },
  { to: '/workout', label: 'Lịch Tập' },
  { to: '/nutrition', label: 'Dinh Dưỡng' },
  { to: '/bmi', label: 'Tính BMI' },
  { to: '/consultation', label: 'Tư Vấn' },
  { to: '/contact', label: 'Liên Hệ' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isLoggedIn = Boolean(localStorage.getItem('token'))

  function handleLogout() {
    localStorage.removeItem('token')
    setOpen(false)
    navigate('/login')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-black gradient-text">Gym</span>
            <span className="text-2xl font-black text-white">Starter</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`text-sm font-medium transition-colors ${
                  pathname === l.to
                    ? 'text-orange-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {l.label}
              </Link>
            ))}

            {/* Admin link — chỉ hiện khi đã đăng nhập */}
            {isLoggedIn && (
              <Link
                to="/admin"
                className={`text-sm font-medium transition-colors ${
                  pathname === '/admin' ? 'text-orange-400' : 'text-gray-300 hover:text-white'
                }`}
              >
                ⚙️ Admin
              </Link>
            )}

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="text-sm font-semibold px-4 py-2 rounded-full bg-white/5 border border-white/15 text-gray-300 hover:border-red-500/50 hover:text-red-400 transition-all"
              >
                Đăng xuất
              </button>
            ) : (
              <Link to="/consultation" className="btn-primary text-sm py-2 px-5">
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <div className={`w-6 h-0.5 bg-white mb-1 transition-all ${open ? 'rotate-45 translate-y-1.5' : ''}`} />
            <div className={`w-6 h-0.5 bg-white mb-1 transition-all ${open ? 'opacity-0' : ''}`} />
            <div className={`w-6 h-0.5 bg-white transition-all ${open ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-black/95 border-t border-white/10 px-4 py-4 flex flex-col gap-4">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`text-base font-medium py-1 transition-colors ${
                pathname === l.to ? 'text-orange-400' : 'text-gray-300'
              }`}
            >
              {l.label}
            </Link>
          ))}

          {isLoggedIn && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className={`text-base font-medium py-1 transition-colors ${
                pathname === '/admin' ? 'text-orange-400' : 'text-gray-300'
              }`}
            >
              ⚙️ Admin
            </Link>
          )}

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-left text-base font-medium py-1 text-red-400"
            >
              Đăng xuất
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="text-base font-medium py-1 text-gray-300"
            >
              Đăng nhập Admin
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
