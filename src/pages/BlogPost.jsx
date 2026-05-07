import { Link, useParams } from 'react-router-dom'
import { posts } from '../data/posts'

const categoryColors = {
  'Cơ bản':     'bg-blue-500/15 text-blue-400 border-blue-500/30',
  'Dinh dưỡng': 'bg-green-500/15 text-green-400 border-green-500/30',
  'Phục hồi':   'bg-purple-500/15 text-purple-400 border-purple-500/30',
  'Giảm cân':   'bg-red-500/15 text-red-400 border-red-500/30',
  'Tăng cơ':    'bg-orange-500/15 text-orange-400 border-orange-500/30',
}

function ContentBlock({ block }) {
  switch (block.type) {
    case 'paragraph':
      return <p className="text-gray-300 leading-relaxed">{block.text}</p>
    case 'heading':
      return <h3 className="text-xl font-black text-white pt-2">{block.text}</h3>
    case 'list':
      return (
        <ul className="space-y-2">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-300">
              <span className="text-orange-400 mt-1 flex-shrink-0">▸</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )
    case 'tip':
      return (
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl px-5 py-4 text-orange-300 text-sm leading-relaxed">
          💡 {block.text}
        </div>
      )
    default:
      return null
  }
}

export default function BlogPost() {
  const { slug } = useParams()
  const post = posts.find(p => p.slug === slug)

  if (!post) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-black text-white mb-3">Bài viết không tồn tại</h2>
          <p className="text-gray-400 mb-6">Đường dẫn này không hợp lệ hoặc bài viết đã bị xóa.</p>
          <Link to="/blog" className="btn-primary">← Quay lại Blog</Link>
        </div>
      </div>
    )
  }

  const related = posts.filter(p => p.id !== post.id).slice(0, 3)

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Back */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium mb-8 transition-colors"
        >
          ← Quay lại Blog
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="text-6xl mb-4">{post.coverEmoji}</div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${categoryColors[post.category]}`}>
              {post.category}
            </span>
            <span className="text-gray-500 text-sm">📖 {post.readTime} phút đọc</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-3">
            {post.title}
          </h1>
          <p className="text-gray-400 leading-relaxed">{post.excerpt}</p>
        </div>

        <div className="border-t border-white/10 mb-8" />

        {/* Content */}
        <div className="space-y-5">
          {post.content.map((block, i) => (
            <ContentBlock key={i} block={block} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-8 text-center">
          <div className="text-3xl mb-3">🤝</div>
          <h3 className="text-xl font-black text-white mb-2">Muốn tư vấn cá nhân?</h3>
          <p className="text-gray-400 text-sm mb-5">
            Điền form để nhận lộ trình tập luyện được xây dựng riêng cho bạn — hoàn toàn miễn phí.
          </p>
          <Link to="/consultation" className="btn-primary">
            Đăng ký tư vấn miễn phí
          </Link>
        </div>

        {/* Related posts */}
        <div className="mt-12">
          <h3 className="text-lg font-black text-white mb-5">Bài viết khác</h3>
          <div className="space-y-3">
            {related.map(p => (
              <Link
                key={p.slug}
                to={`/blog/${p.slug}`}
                className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4 hover:border-orange-500/30 transition-all group"
              >
                <div className="text-2xl flex-shrink-0">{p.coverEmoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-sm group-hover:text-orange-400 transition-colors line-clamp-1">
                    {p.title}
                  </div>
                  <div className="text-gray-500 text-xs mt-0.5">{p.category} · {p.readTime} phút đọc</div>
                </div>
                <span className="text-gray-500 group-hover:text-orange-400 transition-colors flex-shrink-0">→</span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
