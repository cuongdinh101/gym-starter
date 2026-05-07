import { useState } from 'react'
import { Link } from 'react-router-dom'
import API_BASE_URL from '../config/api.js'

const subjectOptions = [
  'Tư vấn lịch tập',
  'Hỏi về dinh dưỡng',
  'Tính BMI và sức khỏe',
  'Góp ý website',
  'Khác',
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState('')

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Vui lòng nhập họ và tên'
    if (!form.email.trim()) e.email = 'Vui lòng nhập email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email không hợp lệ'
    if (!form.message.trim()) e.message = 'Vui lòng nhập nội dung liên hệ'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length > 0) {
      setErrors(e2)
      return
    }
    setLoading(true)
    setServerError('')
    try {
      const res = await fetch(`${API_BASE_URL}/api/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Lỗi server')
      }
      setSubmitted(true)
    } catch (err) {
      setServerError(
        err.message && err.message !== 'Failed to fetch'
          ? err.message
          : 'Gửi thất bại — vui lòng kiểm tra kết nối và thử lại.'
      )
    } finally {
      setLoading(false)
    }
  }

  function handleChange(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }))
  }

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-6">✉️</div>
          <h2 className="text-3xl font-black text-white mb-3">Gửi thành công!</h2>
          <p className="text-gray-400 mb-2">
            Cảm ơn <span className="text-white font-semibold">{form.name}</span> đã liên hệ.
          </p>
          <p className="text-gray-400 mb-8">
            Chúng tôi sẽ phản hồi qua email <span className="text-orange-400">{form.email}</span> sớm nhất có thể.
          </p>
          {form.subject && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-8 text-left">
              <div className="text-gray-400 text-sm mb-1">Chủ đề</div>
              <div className="text-white font-semibold">{form.subject}</div>
            </div>
          )}
          <button
            onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
            className="btn-primary"
          >
            Gửi liên hệ khác
          </button>
        </div>
      </div>
    )
  }

  const fieldClass = (field) =>
    `w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/60 transition-colors ${
      errors[field] ? 'border-red-500/60' : 'border-white/10'
    }`

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-orange-500/20 text-orange-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 border border-orange-500/30">
            📬 Liên hệ với chúng tôi
          </div>
          <h1 className="text-5xl font-black mb-4">
            Gửi <span className="gradient-text">Liên Hệ</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Có câu hỏi về lịch tập, dinh dưỡng hoặc muốn góp ý? Điền form bên dưới và chúng tôi sẽ phản hồi sớm nhất.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">

          {/* Họ tên */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Họ và tên <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Nguyễn Văn A"
              value={form.name}
              onChange={e => handleChange('name', e.target.value)}
              className={fieldClass('name')}
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
              className={fieldClass('email')}
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Chủ đề */}
          <div>
            <label className="block text-white font-semibold mb-2">Chủ đề</label>
            <select
              value={form.subject}
              onChange={e => handleChange('subject', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/60 transition-colors"
            >
              <option value="" className="bg-gray-900">-- Chọn chủ đề (không bắt buộc) --</option>
              {subjectOptions.map(s => (
                <option key={s} value={s} className="bg-gray-900">{s}</option>
              ))}
            </select>
          </div>

          {/* Nội dung */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Nội dung <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={5}
              placeholder="Nhập câu hỏi hoặc nội dung bạn muốn liên hệ..."
              value={form.message}
              onChange={e => handleChange('message', e.target.value)}
              className={`${fieldClass('message')} resize-none`}
            />
            {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message}</p>}
          </div>

          {/* Server error */}
          {serverError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm flex items-start gap-2 relative">
              <span className="mt-0.5 flex-shrink-0">⚠️</span>
              <span className="flex-1">{serverError}</span>
              <button
                type="button"
                onClick={() => setServerError('')}
                className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity ml-1"
              >
                ✕
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-base disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang gửi...' : 'Gửi liên hệ'}
          </button>
        </form>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
            <div className="text-2xl mb-2">💬</div>
            <div className="text-white font-semibold text-sm mb-1">Tư vấn lịch tập</div>
            <div className="text-gray-400 text-xs">Hỏi về bài tập, kỹ thuật, hoặc xây dựng lộ trình riêng</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
            <div className="text-2xl mb-2">🥗</div>
            <div className="text-white font-semibold text-sm mb-1">Hỏi về dinh dưỡng</div>
            <div className="text-gray-400 text-xs">Chế độ ăn, thực đơn, bổ sung dinh dưỡng phù hợp</div>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          Muốn đăng ký tư vấn cá nhân?{' '}
          <Link to="/consultation" className="text-orange-400 hover:text-orange-300 font-semibold">
            Điền form tư vấn →
          </Link>
        </p>
      </div>
    </div>
  )
}
