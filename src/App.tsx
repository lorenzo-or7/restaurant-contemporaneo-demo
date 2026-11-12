import { MotionConfig } from 'motion/react'
import { Navbar } from './sections/Navbar'
import { Hero } from './sections/Hero'
import { Kitchen } from './sections/Kitchen'
import { Experiences } from './sections/Experiences'
import { Differentials } from './sections/Differentials'
import { Menu } from './sections/Menu'
import { Marquee } from './sections/Marquee'
import { Events } from './sections/Events'
import { Testimonials } from './sections/Testimonials'
import { Reservations } from './sections/Reservations'
import { Gallery } from './sections/Gallery'
import { Location } from './sections/Location'
import { Footer } from './sections/Footer'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Navbar />
      <main id="conteudo">
        <Hero />
        <Kitchen />
        <Experiences />
        <Differentials />
        <Menu />
        <Marquee />
        <Events />
        <Testimonials />
        <Reservations />
        <Gallery />
        <Location />
      </main>
      <Footer />
    </MotionConfig>
  )
}
