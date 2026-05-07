import { useState } from 'react'
import API_BASE_URL from '../config/api.js'

const goals = [
  'Giảm mỡ / Giảm cân',
  'Tăng cơ / Tăng cân',
  'Cải thiện sức khỏe tổng thể',
  'Tăng sức mạnh',
  'Tăng sức bền / Cardio',
  'Chưa rõ mục tiêu',
]

const levels = [
  'Hoàn toàn mới (chưa tập bao giờ)',
  'Mới bắt đầu (dưới 3 tháng)',
  'Đã tập được 3–12 tháng',
  'Trên 1 năm kinh nghiệm',
]

export default function Consultation() {
  const [form, setForm] = useState({
    name: '',
    contact: '',
    goal: '',
    level: '',
    notes: '',
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Vui lòng nhập họ tên'
    if (!form.contact.trim()) errs.contact = 'Vui lòng nhập số điện thoại hoặc email'
    if (!form.goal) errs.goal = 'Vui lòng chọn mục tiêu tập luyện'
    if (!form.level) errs.level = 'Vui lòng chọn trình độ của bạn'
    return errs
  }

  async function submit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    setServerError('')
    try {
      const res = await fetch(`${API_BASE_URL}/api/consultations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Lỗi server')
      }
      setSubmitted(true)
    } catch (err) {
      setServerError(
        err.message && err.message !== 'Failed to fetch'
          ? err.message
          : 'Không thể kết nối server. Vui lòng thử lại sau.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="text-center max-w-lg">
          <div className="text-8xl mb-6">🎉</div>
          <h2 className="text-4xl font-black text-white mb-4">Đăng ký thành công!</h2>
          <p className="text-gray-400 text-lg mb-2">
            Xin chào <span className="text-orange-400 font-semibold">{form.name}</span>! Chúng tôi đã nhận thông tin của bạn.
          </p>
          <p className="text-gray-500 mb-8">
            Chúng tôi sẽ liên hệ qua <strong className="text-white">{form.contact}</strong> trong thời gian sớm nhất.
          </p>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left space-y-3 mb-8">
            <div className="flex gap-3 text-sm">
              <span className="text-gray-400 w-28 flex-shrink-0">Mục tiêu</span>
              <span className="text-white font-medium">{form.goal}</span>
            </div>
            <div className="flex gap-3 text-sm">
              <span className="text-gray-400 w-28 flex-shrink-0">Trình độ</span>
              <span className="text-white font-medium">{form.level}</span>
            </div>
            {form.notes && (
              <div className="flex gap-3 text-sm">
                <span className="text-gray-400 w-28 flex-shrink-0">Ghi chú</span>
                <span className="text-white font-medium">{form.notes}</span>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              setSubmitted(false)
              setForm({ name: '', contact: '', goal: '', level: '', notes: '' })
            }}
            className="btn-primary"
          >
            Đăng ký thêm
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block bg-orange-500/20 text-orange-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 border border-orange-500/30">
            🤝 Hoàn toàn miễn phí
          </div>
          <h1 className="text-5xl font-black mb-4">
            Đăng Ký <span className="gradient-text">Tư Vấn</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Điền thông tin để nhận tư vấn lộ trình tập luyện phù hợp với bạn.
          </p>
        </div>

        <form onSubmit={submit} className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
          {/* Họ tên */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Họ và tên <span className="text-orange-400">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => update('name', e.target.value)}
              placeholder="Nguyễn Văn A"
              className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors ${
                errors.name ? 'border-red-500/60' : 'border-white/10 focus:border-orange-500/60'
              }`}
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Số điện thoại hoặc email */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Số điện thoại hoặc Email <span className="text-orange-400">*</span>
            </label>
            <input
              type="text"
              value={form.contact}
              onChange={e => update('contact', e.target.value)}
              placeholder="0901 234 567 hoặc you@email.com"
              className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors ${
                errors.contact ? 'border-red-500/60' : 'border-white/10 focus:border-orange-500/60'
              }`}
            />
            {errors.contact && <p className="text-red-400 text-xs mt-1">{errors.contact}</p>}
          </div>

          {/* Mục tiêu tập luyện */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Mục tiêu tập luyện <span className="text-orange-400">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {goals.map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => update('goal', g)}
                  className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    form.goal === g
                      ? 'bg-orange-500/20 border border-orange-500/60 text-orange-400'
                      : 'bg-white/5 border border-white/10 text-gray-300 hover:border-white/30'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            {errors.goal && <p className="text-red-400 text-xs mt-1">{errors.goal}</p>}
          </div>

          {/* Trình độ tập luyện */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Trình độ tập luyện <span className="text-orange-400">*</span>
            </label>
            <div className="space-y-2">
              {levels.map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => update('level', l)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    form.level === l
                      ? 'bg-orange-500/20 border border-orange-500/60 text-orange-400'
                      : 'bg-white/5 border border-white/10 text-gray-300 hover:border-white/30'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            {errors.level && <p className="text-red-400 text-xs mt-1">{errors.level}</p>}
          </div>

          {/* Ghi chú thêm */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Ghi chú thêm <span className="text-gray-500">(không bắt buộc)</span>
            </label>
            <textarea
              value={form.notes}
              onChange={e => update('notes', e.target.value)}
              placeholder="Tình trạng sức khỏe, chấn thương cũ, hoặc yêu cầu đặc biệt..."
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/60 transition-colors resize-none"
            />
          </div>

          {serverError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang gửi...' : 'Gửi đăng ký tư vấn'}
          </button>
        </form>
      </div>
    </div>
  )
}
