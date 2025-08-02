import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import { getAuthorByName } from '@/lib/authors'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

// Get all posts from the content directory
const posts = getAllPosts().map(post => ({
  ...post,
  authorDetails: post.author ? getAuthorByName(post.author) : null
}))

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header currentPage="home" />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-indigo-600">Humaling</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
          There’s more to the Philippines than nice beaches and a famous boxer. We help you get to know Philippine culture.
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.slug} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200">
                  {post.thumbnail ? (
                    <img 
                      src={post.thumbnail} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center">
                      <span className="text-gray-500">📝</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                    {post.authorDetails && (
                      <span className="ml-2">• {post.authorDetails.name}</span>
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    <Link href={`/${post.slug}`} className="hover:text-indigo-600 transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt || 'No excerpt available'}
                  </p>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <Link
                    href={`/${post.slug}`}
                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                  >
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600 mb-6">
                Check back soon for our first blog post, or visit the admin panel to create one!
              </p>
              <Link
                href="/admin"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create Your First Post
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
} 