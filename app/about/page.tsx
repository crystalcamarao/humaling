import Link from 'next/link'

export default function About() {
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
              <Link href="/about" className="text-indigo-600 font-medium">
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

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            About <span className="text-indigo-600">Humaling</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            We're building the future of content management with modern web technologies.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg mx-auto">
            <h2>Our Mission</h2>
            <p>
              At Humaling, we believe that managing website content should be simple, 
              intuitive, and powerful. Our mission is to provide developers and content 
              creators with the tools they need to build and maintain beautiful, 
              performant websites without compromising on user experience or functionality.
            </p>

            <h2>The Technology</h2>
            <p>
              Built on the foundation of Next.js, Humaling leverages the latest web 
              technologies to deliver exceptional performance and developer experience. 
              We've integrated DecapCMS to provide a seamless content management 
              experience that works directly with your Git workflow.
            </p>

            <h3>Key Features</h3>
            <ul>
              <li><strong>Static Site Generation:</strong> Lightning-fast loading times and excellent SEO</li>
              <li><strong>Git-based CMS:</strong> Version control for all your content changes</li>
              <li><strong>Netlify Integration:</strong> Seamless deployment and hosting</li>
              <li><strong>Responsive Design:</strong> Beautiful on all devices</li>
              <li><strong>TypeScript Support:</strong> Type-safe development experience</li>
            </ul>

            <h2>Why Choose Humaling?</h2>
            <p>
              Unlike traditional CMS platforms that lock you into their ecosystem, 
              Humaling gives you complete control over your content and codebase. 
              All your content is stored as Markdown files in your Git repository, 
              making it easy to backup, version control, and migrate.
            </p>

            <h2>Get Started</h2>
            <p>
              Ready to build your next website with Humaling? Visit our 
              <Link href="/admin" className="text-indigo-600 hover:text-indigo-800 mx-1">
                admin panel
              </Link> 
              to start managing your content, or explore our 
              <Link href="/blog" className="text-indigo-600 hover:text-indigo-800 mx-1">
                blog
              </Link> 
              for more insights and tutorials.
            </p>
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
              <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
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