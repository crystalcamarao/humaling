import Link from 'next/link'

export default function Admin() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">Humaling</Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-indigo-600 transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-indigo-600 transition-colors">
                About
              </Link>
              <Link href="/blog" className="text-gray-700 hover:text-indigo-600 transition-colors">
                Blog
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-indigo-600 transition-colors">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Admin Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Content <span className="text-indigo-600">Management</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Access the DecapCMS admin panel to manage your website content.
          </p>
          
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">DecapCMS Admin</h2>
            <p className="text-gray-600 mb-6">
              Manage your blog posts, pages, and site settings through our intuitive content management system.
            </p>
            <Link
              href="/admin/index.html"
              className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Open Admin Panel
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              What you can do
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The admin panel gives you full control over your website content.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📰</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Blog Posts</h4>
              <p className="text-gray-600">Create, edit, and manage your blog posts with rich text editing and image uploads.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📄</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Pages</h4>
              <p className="text-gray-600">Update page content, hero sections, and manage your site's main pages.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚙️</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Site Settings</h4>
              <p className="text-gray-600">Configure your site title, description, contact information, and social links.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h4 className="text-xl font-semibold mb-4">Humaling</h4>
            <p className="text-gray-400 mb-6">
              Built with Next.js and DecapCMS for modern web development.
            </p>
            <div className="flex justify-center space-x-6">
              <Link href="/admin" className="text-indigo-400 font-medium">
                Admin Panel
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
} 