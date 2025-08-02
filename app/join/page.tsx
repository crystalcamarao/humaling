import Link from 'next/link'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

export default function Join() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header currentPage="join" />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Join <span className="text-indigo-600">Humaling</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
          We need you!
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg mx-auto text-gray-800">
            <p>Got your own fresh take on Philippine culture?</p>
<p>Whether you’re into food, arts, or lifestyle, we’re looking for great contributors to join our team!</p>
<h2>WHAT YOU’LL DO</h2>

<p>Contribute 1-2 blog articles OR multimedia content per week, and post them on social media.</p>

<h2>WHO WE’RE LOOKING FOR</h2>

<p>Someone who’s highly interested in Philippine culture (whether it’s one aspect of it, or in general), content creator experience OR a strong interest in gaining such experience, and creativity, dependability, and overall someone we’d love to collaborate with.</p>

<h2>WHY JOIN US</h2>

<p>Help us promote Philippine culture, and learn and discover more about it. You’ll also add content to your content creator portfolio.</p>

<h2>HOW TO JOIN</h2>

<p>If interested, please <a href="mailto:humaling@gmail.com">send us a message</a> stating why you want to join and attaching some work samples.</p>

<p>Want to help us in another way? You can <a href="https://www.buymeacoffee.com/humaling" target="_blank">send a donation</a>.</p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
} 