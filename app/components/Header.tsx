import Link from 'next/link'

interface HeaderProps {
  currentPage?: string
}

export default function Header({ currentPage = 'home' }: HeaderProps) {
  const getLinkClass = (page: string) => {
    return currentPage === page 
      ? "text-indigo-600 font-medium"
      : "text-gray-700 hover:text-indigo-600 transition-colors"
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">Humaling</Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/about" className={getLinkClass('about')}>
              About
            </Link>
            <Link href="/join" className={getLinkClass('join')}>
              Join
            </Link>
            <Link href="https://www.buymeacoffee.com/humaling" className={getLinkClass('support')}>
              Support
            </Link>
            <Link href="/contact" className={getLinkClass('contact')}>
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
} 