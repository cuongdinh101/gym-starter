import { useState } from 'react'
import { Link } from 'react-router-dom'

const bmiCategories = [
  { range: '< 18.5', label: 'Thiếu cân', color: 'text-blue-400', bg: 'bg-blue-500/20 border-blue-500/30', advice: 'Bạn nên tăng lượng calo từ thực phẩm dinh dưỡng. Tập luyện sức mạnh sẽ giúp tăng cơ và cải thiện thể trạng.' },
  { range: '18.5 – 24.9', label: 'Bình thường', color: 'text-green-400', bg: 'bg-green-500/20 border-green-500/30', advice: 'Tốt lắm! Duy trì lối sống lành mạnh với chế độ ăn cân bằng và tập luyện đều đặn.' },
  { range: '25.0 – 29.9', label: 'Thừa cân', color: 'text-yellow-400', bg: 'bg-yellow-500/20 border-yellow-500/30', advice: 'Giảm nhẹ lượng calo kết hợp cardio và luyện sức mạnh sẽ giúp bạn về mức bình thường.' },
  { range: '30.0 – 34.9', label: 'Béo phì độ I', color: 'text-orange-400', bg: 'bg-orange-500/20 border-orange-500/30', advice: 'Nên tham khảo ý kiến chuyên gia để có lộ trình phù hợp. Tập trung thay đổi lối sống bền vững.' },
  { range: '≥ 35.0', label: 'Béo phì độ II+', color: 'text-red-400', bg: 'bg-red-500/20 border-red-500/30', advice: 'Nên gặp bác sĩ hoặc chuyên gia dinh dưỡng để được hỗ trợ chuyên sâu và an toàn.' },
]

const unitLabels = { metric: 'Hệ mét', imperial: 'Hệ Anh' }

function getCategory(bmi) {
  if (bmi < 18.5) return bmiCategories[0]
  if (bmi < 25) return bmiCategories[1]
  if (bmi < 30) return bmiCategories[2]
  if (bmi < 35) return bmiCategories[3]
  return bmiCategories[4]
}

function getBmiPosition(bmi) {
  const min = 10, max = 40
  return Math.min(Math.max(((bmi - min) / (max - min)) * 100, 0), 100)
}

export default function BMI() {
  const [unit, setUnit] = useState('metric')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [heightFt, setHeightFt] = useState('')
  const [heightIn, setHeightIn] = useState('')
  const [weightLb, setWeightLb] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('male')
  const [result, setResult] = useState(null)

  function calculate() {
    let bmi
    if (unit === 'metric') {
      const w = parseFloat(weight)
      const h = parseFloat(height) / 100
      if (!w || !h || h <= 0) return
      bmi = w / (h * h)
    } else {
      const w = parseFloat(weightLb)
      const ft = parseFloat(heightFt) || 0
      const inch = parseFloat(heightIn) || 0
      const totalInches = ft * 12 + inch
      if (!w || !totalInches) return
      bmi = (w / (totalInches * totalInches)) * 703
    }
    setResult(parseFloat(bmi.toFixed(1)))
  }

  function reset() {
    setWeight(''); setHeight(''); setHeightFt(''); setHeightIn(''); setWeightLb(''); setAge(''); setResult(null)
  }

  const category = result ? getCategory(result) : null

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-block bg-blue-500/20 text-blue-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 border border-blue-500/30">
            📊 Chỉ số khối cơ thể
          </div>
          <h1 className="text-5xl font-black mb-4">
            Tính Chỉ Số <span className="gradient-text">BMI</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Nhập chiều cao và cân nặng để tính chỉ số BMI và xem phân loại cơ thể của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Calculator */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            {/* Unit toggle */}
            <div className="flex bg-white/5 rounded-full p-1 mb-6 w-fit">
              {['metric', 'imperial'].map(u => (
                <button
                  key={u}
                  onClick={() => { setUnit(u); reset() }}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    unit === u ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'text-gray-400'
                  }`}
                >
                  {unitLabels[u]}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {/* Gender */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Giới tính</label>
                <div className="flex gap-3">
                  {[
                    { val: 'male', label: '♂ Nam' },
                    { val: 'female', label: '♀ Nữ' },
                  ].map(g => (
                    <button
                      key={g.val}
                      onClick={() => setGender(g.val)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        gender === g.val
                          ? 'bg-orange-500/20 border border-orange-500/60 text-orange-400'
                          : 'bg-white/5 border border-white/10 text-gray-400 hover:border-white/30'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Tuổi</label>
                <input
                  type="number"
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  placeholder="Ví dụ: 25"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/60 transition-colors"
                />
              </div>

              {/* Height */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Chiều cao {unit === 'metric' ? '(cm)' : '(ft / in)'}
                </label>
                {unit === 'metric' ? (
                  <input
                    type="number"
                    value={height}
                    onChange={e => setHeight(e.target.value)}
                    placeholder="Ví dụ: 170"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/60 transition-colors"
                  />
                ) : (
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={heightFt}
                      onChange={e => setHeightFt(e.target.value)}
                      placeholder="ft"
                      className="w-1/2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/60 transition-colors"
                    />
                    <input
                      type="number"
                      value={heightIn}
                      onChange={e => setHeightIn(e.target.value)}
                      placeholder="in"
                      className="w-1/2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/60 transition-colors"
                    />
                  </div>
                )}
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Cân nặng {unit === 'metric' ? '(kg)' : '(lbs)'}
                </label>
                {unit === 'metric' ? (
                  <input
                    type="number"
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                    placeholder="Ví dụ: 65"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/60 transition-colors"
                  />
                ) : (
                  <input
                    type="number"
                    value={weightLb}
                    onChange={e => setWeightLb(e.target.value)}
                    placeholder="Ví dụ: 143"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/60 transition-colors"
                  />
                )}
              </div>

              <button onClick={calculate} className="btn-primary w-full text-base py-3.5">
                Tính BMI
              </button>
            </div>

            {/* Result */}
            {result && category && (
              <div className={`mt-6 rounded-2xl border p-6 ${category.bg}`}>
                <div className="text-center mb-4">
                  <div className="text-6xl font-black text-white">{result}</div>
                  <div className={`text-xl font-bold mt-1 ${category.color}`}>{category.label}</div>
                </div>

                {/* BMI gauge */}
                <div className="relative mb-4">
                  <div className="h-3 rounded-full overflow-hidden flex">
                    <div className="flex-1 bg-blue-500/60" />
                    <div className="flex-1 bg-green-500/60" />
                    <div className="flex-1 bg-yellow-500/60" />
                    <div className="flex-1 bg-orange-500/60" />
                    <div className="flex-1 bg-red-500/60" />
                  </div>
                  <div
                    className="absolute -top-1 w-4 h-5 bg-white rounded-full shadow-lg transition-all"
                    style={{ left: `calc(${getBmiPosition(result)}% - 8px)` }}
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-2">
                    <span>10</span><span>18.5</span><span>25</span><span>30</span><span>35</span><span>40</span>
                  </div>
                </div>

                <div className={`text-sm leading-relaxed ${category.color.replace('400', '300')}`}>
                  {category.advice}
                </div>
              </div>
            )}
          </div>

          {/* Info panel */}
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Bảng phân loại BMI</h3>
              <div className="space-y-3">
                {bmiCategories.map(cat => (
                  <div key={cat.label} className={`flex items-center justify-between rounded-xl border px-4 py-3 ${cat.bg}`}>
                    <div>
                      <div className={`font-bold text-sm ${cat.color}`}>{cat.label}</div>
                      <div className="text-gray-400 text-xs">{cat.range}</div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${cat.color.replace('text-', 'bg-')}`} />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-3">⚠️ Lưu ý về BMI</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex gap-2"><span className="text-orange-400 mt-0.5">•</span> BMI không phân biệt được cơ bắp và mỡ thừa.</li>
                <li className="flex gap-2"><span className="text-orange-400 mt-0.5">•</span> Người tập gym lâu năm có thể có BMI cao nhưng % mỡ thấp.</li>
                <li className="flex gap-2"><span className="text-orange-400 mt-0.5">•</span> Kết quả có thể khác nhau tùy tuổi, giới tính và thể trạng.</li>
                <li className="flex gap-2"><span className="text-orange-400 mt-0.5">•</span> BMI chỉ là chỉ số tham khảo, không thay thế tư vấn y tế.</li>
              </ul>
            </div>

            <div
              className="rounded-2xl p-6"
              style={{ background: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)' }}
            >
              <h3 className="text-lg font-bold text-white mb-2">Muốn được tư vấn thêm?</h3>
              <p className="text-white/80 text-sm mb-4">
                Đăng ký tư vấn miễn phí để nhận lộ trình tập luyện và dinh dưỡng phù hợp với thể trạng của bạn.
              </p>
              <Link
                to="/consultation"
                className="inline-block bg-white text-orange-500 font-bold text-sm py-2.5 px-5 rounded-full hover:scale-105 transition-transform"
              >
                Đăng ký tư vấn miễn phí
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
