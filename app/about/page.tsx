import Link from 'next/link'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

export default function About() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header currentPage="about" />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            About <span className="text-indigo-600">Humaling</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
          Your guide to Philippine culture
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg mx-auto text-gray-800">
            <h2>About</h2>
            <p>Humaling is an arts and culture blog that aims to spread awareness on the amazing aspects of Philippine culture. From food, to film, to festivals, it showcases the beauty and diversity Filipinos have to offer to the world.</p>
            <h2>Mission</h2>
            <p>The world knows little to nothing about Philippine culture, and we want to change that.</p>
            <p>Our dream is to be the go-to source and discovery tool for Philippine culture, by producing effective, engaging content that helps readers learn about, appreciate, and develop or fuel interest in Philippine culture.</p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
} 