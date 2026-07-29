import Footer from './components/Footer'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import Solutions from './components/Solutions'
import Testimonials from './components/Testimonials'

export default function App() {
  return (
    <main className="min-h-svh bg-black">
      <Navbar />
      <Hero />

      {/* Solutions runs on its own dark, scroll-lit field. */}
      <Solutions />

      {/* The bright field carries its light into the warm paper footer. The
          section owns the animated wash that makes that handoff continuous. */}
      <Testimonials />

      <Footer />
    </main>
  )
}
