import { useState } from 'react'
import { Link } from 'react-router-dom'
import { posts } from '../data/posts'

const categories = ['Tất cả', 'Cơ bản', 'Dinh dưỡng', 'Phục hồi', 'Giảm cân', 'Tăng cơ']

const categoryColors = {
  'Cơ bản':     'bg-blue-500/15 text-blue-400 border-blue-500/30',
  'Dinh dưỡng': 'bg-green-500/15 text-green-400 border-green-500/30',
  'Phục hồi':   'bg-purple-500/15 text-purple-400 border-purple-500/30',
  'Giảm cân':   'bg-red-500/15 text-red-400 border-red-500/30',
  'Tăng cơ':    'bg-orange-500/15 text-orange-400 border-orange-500/30',
}

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('Tất cả')

  const filtered = activeCategory === 'Tất cả'
    ? posts
    : posts.filter(p => p.category === activeCategory)

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block bg-orange-500/20 text-orange-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 border border-orange-500/30">
            📚 Tips & Kiến thức
          </div>
          <h1 className="text-5xl font-black mb-4">
            Blog <span className="gradient-text">Gym Starter</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Kiến thức gym thực tế, dễ hiểu — dành riêng cho người mới bắt đầu hành trình tập luyện.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                activeCategory === cat
                  ? 'bg-orange-500/20 text-orange-400 border-orange-500/50'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(post => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col hover:border-orange-500/30 transition-all card-hover"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{post.coverEmoji}</div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${categoryColors[post.category]}`}>
                  {post.category}
                </span>
              </div>
              <h2 className="text-xl font-black text-white mb-3 group-hover:text-orange-400 transition-colors leading-tight">
                {post.title}
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-5 flex-1">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>📖 {post.readTime} phút đọc</span>
                <span className="text-orange-400 font-semibold group-hover:translate-x-1 transition-transform inline-block">
                  Đọc thêm →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <div className="text-5xl mb-4">📭</div>
            <p>Chưa có bài viết trong danh mục này.</p>
          </div>
        )}

      </div>
    </div>
  )
}
