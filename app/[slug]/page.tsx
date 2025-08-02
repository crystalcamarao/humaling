import Link from 'next/link'
import { getPostBySlug, getAllPosts } from '@/lib/posts'
import { getAuthorByName } from '@/lib/authors'
import { notFound } from 'next/navigation'
import { marked } from 'marked'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

// Configure marked to allow HTML
marked.setOptions({
  breaks: true,
  gfm: true
})

// Create a custom renderer that preserves HTML
const renderer = new marked.Renderer()
renderer.html = ({ text }: { text: string }) => text // Preserve HTML content

marked.use({ renderer })

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const authorDetails = post.author ? getAuthorByName(post.author) : null

  // Process content to ensure iframes are preserved
  const processedContent = post.content.replace(
    /<iframe[^>]*src="([^"]*)"[^>]*><\/iframe>/gi,
    (match, src) => {
      // Ensure iframes are properly formatted
      return match.replace(/width="(\d+)"/, 'width="100%" style="max-width: 400px;"')
    }
  )

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header currentPage="home" />

      {/* Article */}
      <article className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link href="/" className="text-indigo-600 hover:text-indigo-800">
              ← Back to Home
            </Link>
          </nav>

          {/* Article Header */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {post.title}
            </h1>
            
            {/* Featured Image */}
            {post.thumbnail && (
              <div className="mb-8">
                <img 
                  src={post.thumbnail} 
                  alt={post.title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                />
              </div>
            )}
            
            <div className="flex items-center text-gray-600 mb-6">
              <time dateTime={post.date} className="mr-4">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              {authorDetails && (
                <span className="mr-4">• {authorDetails.name}</span>
              )}
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-6">
              {post.categories && post.categories.map((category: string) => (
                <span
                  key={category}
                  className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>

          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none text-gray-800">
            <div 
              className="markdown-content"
              dangerouslySetInnerHTML={{ 
                __html: marked(processedContent) 
              }} 
            />
          </div>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200">
            
          <div className="flex flex-wrap gap-2 mb-6">
          {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            </div>
            <div className="flex items-center justify-between">
              <div>
                {authorDetails && (
                  <div className="flex items-center space-x-4">
                    {authorDetails.avatar && (
                      <img 
                        src={authorDetails.avatar} 
                        alt={authorDetails.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="text-gray-600">
                        Written by <span className="font-medium">{authorDetails.name}</span>
                      </p>
                      {authorDetails.bio && (
                        <p className="text-sm text-gray-500 mt-1">{authorDetails.bio}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <Link
                href="/"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                ← Back to Home
              </Link>
            </div>
          </footer>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-8">
                {/* About Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">ABOUT</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Welcome to Humaling, an arts and culture blog that aims to spread awareness on the amazing aspects of Philippine culture. From food, to film, to festivals, it showcases the beauty and diversity Filipinos have to offer to the world.
                  </p>
                </div>

                {/* Support Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">SUPPORT</h3>
                  <a 
                    href="https://www.buymeacoffee.com/humaling" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <img 
                      src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" 
                      alt="Buy me a coffee" 
                      className="w-full h-auto"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  )
} 