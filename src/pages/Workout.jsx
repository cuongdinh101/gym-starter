import { useState, useEffect } from 'react'

export default function Workout() {
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/workouts`)
      .then(res => {
        if (!res.ok) throw new Error('Server lỗi')
        return res.json()
      })
      .then(data => {
        setSchedule(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Không thể tải lịch tập — vui lòng kiểm tra server backend đang chạy.')
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-block bg-orange-500/20 text-orange-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 border border-orange-500/30">
            📅 Lịch tập dành cho người mới
          </div>
          <h1 className="text-5xl font-black mb-4">
            Lịch Tập <span className="gradient-text">7 Ngày</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Lịch tập đơn giản, đủ các nhóm cơ chính. Mỗi ngày ghi rõ bài tập, số hiệp, số lần lặp, thời gian nghỉ và ghi chú cho người mới.
          </p>
        </div>

        {/* Note */}
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 mb-10 text-sm text-orange-300">
          <strong>Lưu ý cho người mới:</strong> Khởi động 5–10 phút trước khi tập (xoay khớp, đi bộ nhẹ). Uống đủ nước. Nếu đau cơ nặng, hãy nghỉ thêm một ngày.
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-4xl mb-4">⏳</div>
            <p>Đang tải lịch tập...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">⚠️</div>
            <p className="text-red-400 font-semibold">{error}</p>
          </div>
        )}

        {/* Schedule */}
        {!loading && !error && (
          <div className="space-y-4">
            {schedule.map((day, idx) => (
              <div
                key={day.day}
                className={`bg-gradient-to-r ${day.color} border ${day.border} rounded-2xl overflow-hidden`}
              >
                {/* Day header */}
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                  onClick={() => setExpanded(expanded === idx ? null : idx)}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{day.icon}</div>
                    <div>
                      <div className="text-gray-400 text-sm font-medium">{day.day}</div>
                      <div className={`text-xl font-black ${day.accent}`}>{day.label}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-sm hidden sm:block">
                      {day.exercises.length} bài tập
                    </span>
                    <span className={`text-lg transition-transform ${expanded === idx ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </div>
                </button>

                {/* Exercises table */}
                {expanded === idx && (
                  <div className="px-6 pb-6">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left py-2 pr-4 text-gray-500 font-semibold">Bài tập</th>
                            <th className="text-center py-2 px-3 text-gray-500 font-semibold">Hiệp</th>
                            <th className="text-center py-2 px-3 text-gray-500 font-semibold">Số lần</th>
                            <th className="text-center py-2 px-3 text-gray-500 font-semibold">Nghỉ</th>
                            <th className="text-left py-2 pl-4 text-gray-500 font-semibold hidden md:table-cell">Ghi chú</th>
                          </tr>
                        </thead>
                        <tbody>
                          {day.exercises.map((ex, i) => (
                            <tr key={i} className="border-b border-white/5 last:border-0">
                              <td className="py-3 pr-4 text-white font-medium">{ex.name}</td>
                              <td className="py-3 px-3 text-center text-gray-300">{ex.sets}</td>
                              <td className={`py-3 px-3 text-center font-semibold ${day.accent}`}>{ex.reps}</td>
                              <td className="py-3 px-3 text-center text-gray-400">{ex.rest}</td>
                              <td className="py-3 pl-4 text-gray-400 text-xs hidden md:table-cell">{ex.note}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile notes */}
                    <div className="md:hidden mt-4 space-y-2">
                      {day.exercises.map((ex, i) => (
                        <div key={i} className="bg-black/20 rounded-lg p-3">
                          <div className="text-white text-sm font-semibold mb-1">{ex.name}</div>
                          <div className="text-gray-400 text-xs">{ex.note}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
