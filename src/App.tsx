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

      {/* The page's one bright field, between two dark ones. The section owns
          it now — the gradient has grain, drifting light and a seam at each
          end, and all of that has to live inside the element that clips it. */}
      <Testimonials />

      <Footer />
    </main>
  )
}
