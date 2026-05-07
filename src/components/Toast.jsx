import { useEffect } from 'react'

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3200)
    return () => clearTimeout(t)
  }, [onClose])

  const isSuccess = type === 'success'

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border max-w-xs toast-enter ${
        isSuccess
          ? 'bg-green-500/15 border-green-500/40 text-green-300'
          : 'bg-red-500/15 border-red-500/40 text-red-300'
      }`}
    >
      <span className="text-lg flex-shrink-0">{isSuccess ? '✅' : '⚠️'}</span>
      <span className="text-sm font-semibold flex-1">{message}</span>
      <button
        onClick={onClose}
        className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity text-base leading-none ml-1"
        aria-label="Đóng"
      >
        ✕
      </button>
    </div>
  )
}
