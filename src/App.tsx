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

      {/* The page's one bright field, between two dark ones. Modelled on
          docs/image.png: a radial anchored at the top-left corner, sampled
          #2c85e5 → #b7defb, so the section opens saturated and fades out into
          the footer. */}
      <div className="bg-[radial-gradient(120%_140%_at_0%_0%,#2c85e5_0%,#62aaea_30%,#97cbf4_62%,#b7defb_100%)]">
        <Testimonials />
      </div>

      <Footer />
    </main>
  )
}
