import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import API_BASE_URL from '../config/api.js'
import Toast from '../components/Toast.jsx'

const LIMIT = 10

export default function Admin() {
  const [consultations, setConsultations] = useState([])
  const [contacts, setContacts] = useState([])
  const [cTotal, setCTotal] = useState(0)
  const [kTotal, setKTotal] = useState(0)
  const [cTotalPages, setCTotalPages] = useState(1)
  const [kTotalPages, setKTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [tabLoading, setTabLoading] = useState(false)
  const [error, setError] = useState(null)
  const [tab, setTab] = useState('consultations')
  const [page, setPage] = useState(1)
  const [deletingId, setDeletingId] = useState(null)
  const [confirmId, setConfirmId] = useState(null)
  const [deleteError, setDeleteError] = useState('')
  const [toast, setToast] = useState(null)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const initialized = useRef(false)
  const navigate = useNavigate()

  function authHeader() {
    const token = localStorage.getItem('token')
    return { Authorization: `Bearer ${token}` }
  }

  function handleUnauthorized() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  async function fetchTabData(tabName, pageNum, searchStr, sortStr) {
    const params = new URLSearchParams({ page: pageNum, limit: LIMIT, sort: sortStr })
    if (searchStr) params.set('search', searchStr)
    const res = await fetch(
      `${API_BASE_URL}/api/${tabName}?${params}`,
      { headers: authHeader() }
    )
    if (res.status === 401) { handleUnauthorized(); throw new Error('401') }
    if (!res.ok) throw new Error()
    return res.json() // { data, total, page, totalPages }
  }

  function applyResult(tabName, result) {
    if (tabName === 'consultations') {
      setConsultations(result.data)
      setCTotal(result.total)
      setCTotalPages(result.totalPages)
    } else {
      setContacts(result.data)
      setKTotal(result.total)
      setKTotalPages(result.totalPages)
    }
  }

  // Lần đầu load: fetch cả 2 tab để có tổng số cho stat cards
  useEffect(() => {
    async function init() {
      try {
        const [c, k] = await Promise.all([
          fetchTabData('consultations', 1, '', 'newest'),
          fetchTabData('contacts', 1, '', 'newest'),
        ])
        applyResult('consultations', c)
        applyResult('contacts', k)
      } catch (err) {
        if (err.message === '401') return
        setError('Không thể tải dữ liệu — vui lòng kiểm tra server backend đang chạy.')
      } finally {
        setLoading(false)
        initialized.current = true
      }
    }
    init()
  }, [])

  // Debounce: chờ 400ms sau khi dừng gõ rồi mới gửi request tìm kiếm
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(timer)
  }, [search])

  // Khi search hoặc sort thay đổi: luôn fetch lại từ trang 1
  useEffect(() => {
    if (!initialized.current) return
    setPage(1)
    fetchAndUpdate(tab, 1, debouncedSearch, sort)
  }, [debouncedSearch, sort])

  // Khi tab hoặc page thay đổi: fetch trang hiện tại
  useEffect(() => {
    if (!initialized.current) return
    fetchAndUpdate(tab, page, debouncedSearch, sort)
  }, [tab, page])

  async function fetchAndUpdate(tabName, pageNum, searchStr, sortStr) {
    setTabLoading(true)
    try {
      const result = await fetchTabData(tabName, pageNum, searchStr, sortStr)
      applyResult(tabName, result)
    } catch (err) {
      if (err.message !== '401') {
        setError('Không thể tải dữ liệu — vui lòng kiểm tra server backend đang chạy.')
      }
    } finally {
      setTabLoading(false)
    }
  }

  async function handleDelete(type, id) {
    setConfirmId(null)
    setDeletingId(id)
    setDeleteError('')
    try {
      const res = await fetch(`${API_BASE_URL}/api/${type}/${id}`, {
        method: 'DELETE',
        headers: authHeader(),
      })
      if (res.status === 401) { handleUnauthorized(); return }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Xóa thất bại')
      }
      setToast({ message: 'Đã xóa bản ghi thành công', type: 'success' })
      const currentList = type === 'consultations' ? consultations : contacts
      if (currentList.length === 1 && page > 1) {
        setPage(p => p - 1)
      } else {
        fetchAndUpdate(type, page, debouncedSearch, sort)
      }
    } catch (err) {
      setDeleteError(err.message || 'Xóa thất bại — vui lòng thử lại.')
    } finally {
      setDeletingId(null)
    }
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <>
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="inline-block bg-orange-500/20 text-orange-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 border border-orange-500/30">
            ⚙️ Quản trị
          </div>
          <h1 className="text-4xl font-black text-white">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">Xem toàn bộ đăng ký tư vấn và liên hệ từ người dùng.</p>
        </div>

        {/* Loading toàn trang */}
        {loading && (
          <div className="text-center py-24 text-gray-400">
            <div className="text-4xl mb-4">⏳</div>
            <p>Đang tải dữ liệu...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">⚠️</div>
            <p className="text-red-400 font-semibold">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {[
                { value: cTotal, label: 'Đăng ký tư vấn', icon: '🤝', color: 'from-orange-500 to-red-500' },
                { value: kTotal, label: 'Liên hệ', icon: '📬', color: 'from-blue-500 to-cyan-500' },
                { value: LIMIT, label: 'Bản ghi / trang', icon: '📋', color: 'from-purple-500 to-pink-500' },
              ].map(card => (
                <div key={card.label} className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${card.color}`} />
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-3xl font-black gradient-text">{card.value}</div>
                    <div className="p-2 bg-white/5 rounded-xl text-xl">{card.icon}</div>
                  </div>
                  <div className="text-gray-400 text-sm">{card.label}</div>
                </div>
              ))}
            </div>

            {/* Error xóa */}
            {deleteError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-3 mb-6 text-red-400 text-sm flex items-center gap-2">
                <span>⚠️</span>
                <span className="flex-1">{deleteError}</span>
                <button onClick={() => setDeleteError('')} className="opacity-50 hover:opacity-100 transition-opacity">✕</button>
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-3 mb-5">
              <button
                onClick={() => { setTab('consultations'); setPage(1); setConfirmId(null) }}
                className={`px-5 py-2 rounded-full font-semibold text-sm transition-all ${
                  tab === 'consultations'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                    : 'bg-white/5 border border-white/15 text-gray-300 hover:border-orange-500/50'
                }`}
              >
                🤝 Đăng ký tư vấn ({cTotal})
              </button>
              <button
                onClick={() => { setTab('contacts'); setPage(1); setConfirmId(null) }}
                className={`px-5 py-2 rounded-full font-semibold text-sm transition-all ${
                  tab === 'contacts'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                    : 'bg-white/5 border border-white/15 text-gray-300 hover:border-orange-500/50'
                }`}
              >
                📬 Liên hệ ({kTotal})
              </button>
            </div>

            {/* Search & Sort */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm theo tên, email, SĐT, mục tiêu, chủ đề..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/60"
              />
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 cursor-pointer focus:outline-none focus:border-orange-500/60"
              >
                <option value="newest">Mới nhất trước</option>
                <option value="oldest">Cũ nhất trước</option>
              </select>
            </div>

            {/* Bảng — Đăng ký tư vấn */}
            {tab === 'consultations' && (
              tabLoading ? (
                <LoadingRows />
              ) : cTotal === 0 && !debouncedSearch ? (
                <EmptyState text="Chưa có đăng ký tư vấn nào." />
              ) : consultations.length === 0 ? (
                <EmptyState text={`Không tìm thấy kết quả nào cho "${search}".`} />
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                          <th className="text-left px-4 py-3 text-gray-400 font-semibold">#</th>
                          <th className="text-left px-4 py-3 text-gray-400 font-semibold">Họ tên</th>
                          <th className="text-left px-4 py-3 text-gray-400 font-semibold">Liên hệ</th>
                          <th className="text-left px-4 py-3 text-gray-400 font-semibold">Mục tiêu</th>
                          <th className="text-left px-4 py-3 text-gray-400 font-semibold">Trình độ</th>
                          <th className="text-left px-4 py-3 text-gray-400 font-semibold">Ghi chú</th>
                          <th className="text-left px-4 py-3 text-gray-400 font-semibold whitespace-nowrap">Thời gian</th>
                          <th className="px-4 py-3"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {consultations.map((c, i) => (
                          <tr key={c.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3 text-gray-500">{(page - 1) * LIMIT + i + 1}</td>
                            <td className="px-4 py-3 text-white font-semibold">{c.name}</td>
                            <td className="px-4 py-3 text-gray-300">{c.contact}</td>
                            <td className="px-4 py-3">
                              <span className="bg-orange-500/20 text-orange-400 text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                                {c.goal}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{c.level}</td>
                            <td className="px-4 py-3 text-gray-400 max-w-[200px] truncate">{c.notes || '—'}</td>
                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(c.createdAt)}</td>
                            <td className="px-4 py-3">
                              <DeleteButton
                                onConfirm={() => setConfirmId(c.id)}
                                onDelete={() => handleDelete('consultations', c.id)}
                                onCancel={() => setConfirmId(null)}
                                isConfirming={confirmId === c.id}
                                isDeleting={deletingId === c.id}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Pagination
                    page={page}
                    totalPages={cTotalPages}
                    total={cTotal}
                    onPrev={() => setPage(p => p - 1)}
                    onNext={() => setPage(p => p + 1)}
                  />
                </div>
              )
            )}

            {/* Bảng — Liên hệ */}
            {tab === 'contacts' && (
              tabLoading ? (
                <LoadingRows />
              ) : kTotal === 0 && !debouncedSearch ? (
                <EmptyState text="Chưa có liên hệ nào." />
              ) : contacts.length === 0 ? (
                <EmptyState text={`Không tìm thấy kết quả nào cho "${search}".`} />
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                          <th className="text-left px-4 py-3 text-gray-400 font-semibold">#</th>
                          <th className="text-left px-4 py-3 text-gray-400 font-semibold">Họ tên</th>
                          <th className="text-left px-4 py-3 text-gray-400 font-semibold">Email</th>
                          <th className="text-left px-4 py-3 text-gray-400 font-semibold">Chủ đề</th>
                          <th className="text-left px-4 py-3 text-gray-400 font-semibold">Nội dung</th>
                          <th className="text-left px-4 py-3 text-gray-400 font-semibold whitespace-nowrap">Thời gian</th>
                          <th className="px-4 py-3"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {contacts.map((c, i) => (
                          <tr key={c.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3 text-gray-500">{(page - 1) * LIMIT + i + 1}</td>
                            <td className="px-4 py-3 text-white font-semibold">{c.name}</td>
                            <td className="px-4 py-3 text-gray-300">{c.email}</td>
                            <td className="px-4 py-3">
                              {c.subject ? (
                                <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                                  {c.subject}
                                </span>
                              ) : (
                                <span className="text-gray-500">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-gray-400 max-w-[240px] truncate">{c.message}</td>
                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(c.createdAt)}</td>
                            <td className="px-4 py-3">
                              <DeleteButton
                                onConfirm={() => setConfirmId(c.id)}
                                onDelete={() => handleDelete('contacts', c.id)}
                                onCancel={() => setConfirmId(null)}
                                isConfirming={confirmId === c.id}
                                isDeleting={deletingId === c.id}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Pagination
                    page={page}
                    totalPages={kTotalPages}
                    total={kTotal}
                    onPrev={() => setPage(p => p - 1)}
                    onNext={() => setPage(p => p + 1)}
                  />
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>

    {toast && (
      <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
    )}
    </>
  )
}

function Pagination({ page, totalPages, total, onPrev, onNext }) {
  const from = total === 0 ? 0 : (page - 1) * LIMIT + 1
  const to = Math.min(page * LIMIT, total)
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 flex-wrap gap-2">
      <span className="text-gray-400 text-xs">
        {total === 0 ? 'Không có bản ghi' : `${from}–${to} trong tổng ${total} bản ghi`}
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={page <= 1}
          className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:border-white/30 transition-colors"
        >
          ← Trước
        </button>
        <span className="text-gray-400 text-xs px-1">
          Trang {page} / {totalPages}
        </span>
        <button
          onClick={onNext}
          disabled={page >= totalPages}
          className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:border-white/30 transition-colors"
        >
          Sau →
        </button>
      </div>
    </div>
  )
}

function DeleteButton({ onConfirm, onDelete, onCancel, isConfirming, isDeleting }) {
  if (isConfirming) {
    return (
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <button
          onClick={onDelete}
          className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-red-500/25 text-red-400 border border-red-500/50 hover:bg-red-500/35 transition-colors"
        >
          Có
        </button>
        <button
          onClick={onCancel}
          className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white/5 text-gray-400 border border-white/20 hover:border-white/40 transition-colors"
        >
          Hủy
        </button>
      </div>
    )
  }
  return (
    <button
      onClick={onConfirm}
      disabled={isDeleting}
      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
    >
      {isDeleting ? 'Đang xóa...' : 'Xóa'}
    </button>
  )
}

function EmptyState({ text }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl py-16 text-center">
      <div className="text-4xl mb-3">📭</div>
      <p className="text-gray-400">{text}</p>
    </div>
  )
}

function LoadingRows() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-white/5 last:border-0">
                <td className="px-4 py-4"><div className="skeleton h-3 w-6 rounded" /></td>
                <td className="px-4 py-4"><div className="skeleton h-3 w-28 rounded" /></td>
                <td className="px-4 py-4"><div className="skeleton h-3 w-24 rounded" /></td>
                <td className="px-4 py-4"><div className="skeleton h-3 w-20 rounded" /></td>
                <td className="px-4 py-4"><div className="skeleton h-3 w-32 rounded" /></td>
                <td className="px-4 py-4"><div className="skeleton h-3 w-16 rounded" /></td>
                <td className="px-4 py-4"><div className="skeleton h-3 w-20 rounded" /></td>
                <td className="px-4 py-4"><div className="skeleton h-3 w-10 rounded" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
