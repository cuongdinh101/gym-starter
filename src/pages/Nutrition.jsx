import { useState, useEffect } from 'react'
import API_BASE_URL from '../config/api.js'

const goals = ['Tất cả', 'Giảm mỡ', 'Tăng cơ', 'Duy trì']

const tips = [
  { icon: '💧', title: 'Uống đủ nước', desc: 'Uống ít nhất 2–3 lít nước mỗi ngày. Ngày tập nặng nên bổ sung thêm điện giải.' },
  { icon: '⏰', title: 'Thời điểm ăn', desc: 'Ăn mỗi 3–4 tiếng. Ưu tiên protein + tinh bột trong vòng 1 tiếng sau tập.' },
  { icon: '🥩', title: 'Đủ protein', desc: 'Người mới tập cần khoảng 1.5–2g protein/kg cân nặng mỗi ngày để xây dựng cơ.' },
  { icon: '😴', title: 'Ngủ & phục hồi', desc: 'Ngủ 7–8 tiếng mỗi đêm. Cơ bắp phát triển trong lúc nghỉ ngơi, không phải khi tập.' },
]

export default function Nutrition() {
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState('Tất cả')
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/nutrition`)
      .then(res => {
        if (!res.ok) throw new Error('Server lỗi')
        return res.json()
      })
      .then(data => {
        setMeals(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Không thể tải dữ liệu dinh dưỡng — vui lòng kiểm tra server backend đang chạy.')
        setLoading(false)
      })
  }, [])

  const filtered = selected === 'Tất cả' ? meals : meals.filter(m => m.goal === selected)

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-block bg-green-500/20 text-green-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 border border-green-500/30">
            🥗 Dinh dưỡng đơn giản cho người mới
          </div>
          <h1 className="text-5xl font-black mb-4">
            Hướng Dẫn <span className="gradient-text">Dinh Dưỡng</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Nguyên tắc ăn uống cơ bản và gợi ý bữa ăn theo mục tiêu. Đơn giản, dễ áp dụng cho người mới bắt đầu.
          </p>
        </div>

        {/* Tips */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {tips.map(t => (
            <div key={t.title} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">{t.icon}</div>
              <div className="text-white font-bold text-sm mb-1">{t.title}</div>
              <div className="text-gray-400 text-xs leading-relaxed">{t.desc}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {goals.map(g => (
            <button
              key={g}
              onClick={() => setSelected(g)}
              className={`px-5 py-2 rounded-full font-semibold text-sm transition-all ${
                selected === g
                  ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                  : 'bg-white/5 border border-white/15 text-gray-300 hover:border-green-500/50'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-4xl mb-4">⏳</div>
            <p>Đang tải dữ liệu dinh dưỡng...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">⚠️</div>
            <p className="text-red-400 font-semibold">{error}</p>
          </div>
        )}

        {/* Meal Cards */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(meal => (
              <div
                key={meal.id}
                className={`card-hover bg-gradient-to-b ${meal.color} border ${meal.border} rounded-2xl p-6 flex flex-col cursor-pointer`}
                onClick={() => setExpanded(expanded === meal.id ? null : meal.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl">{meal.emoji}</div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-gray-300">
                    {meal.goal}
                  </span>
                </div>

                <h3 className="text-xl font-black text-white mb-4">{meal.name}</h3>

                {/* Macros */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[
                    { label: 'Calo', value: meal.calories },
                    { label: 'Protein', value: `${meal.protein}g` },
                    { label: 'Tinh bột', value: `${meal.carbs}g` },
                    { label: 'Chất béo', value: `${meal.fat}g` },
                  ].map(m => (
                    <div key={m.label} className="bg-black/30 rounded-lg p-2 text-center">
                      <div className="text-white font-bold text-sm">{m.value}</div>
                      <div className="text-gray-400 text-[10px]">{m.label}</div>
                    </div>
                  ))}
                </div>

                {/* Macro bars */}
                <div className="space-y-1.5 mb-4">
                  {[
                    { label: 'Protein', value: meal.protein, max: 70, color: 'bg-blue-500' },
                    { label: 'Tinh bột', value: meal.carbs, max: 100, color: 'bg-orange-500' },
                    { label: 'Chất béo', value: meal.fat, max: 30, color: 'bg-yellow-500' },
                  ].map(bar => (
                    <div key={bar.label} className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 w-14">{bar.label}</span>
                      <div className="flex-1 bg-white/10 rounded-full h-1.5">
                        <div
                          className={`${bar.color} h-1.5 rounded-full`}
                          style={{ width: `${Math.min((bar.value / bar.max) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {expanded === meal.id && (
                  <div className="border-t border-white/10 pt-4 mt-2 space-y-3">
                    <div>
                      <div className="text-sm font-bold text-white mb-2">Nguyên liệu:</div>
                      <ul className="space-y-1">
                        {meal.ingredients.map(ing => (
                          <li key={ing} className="flex items-center gap-2 text-sm text-gray-300">
                            <span className="text-green-400">•</span> {ing}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                      <span className="text-orange-400 text-xs font-bold">💡 Gợi ý: </span>
                      <span className="text-gray-300 text-xs">{meal.tips}</span>
                    </div>
                  </div>
                )}

                <button className="mt-auto pt-4 text-sm text-green-400 font-semibold hover:text-green-300 transition-colors text-left">
                  {expanded === meal.id ? '▲ Thu gọn' : '▼ Xem chi tiết'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
