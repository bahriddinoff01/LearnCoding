import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from '../components/home/Hero'
import { AiInstructor, Cta, Faq, HowItWorks, TechStrip, TracksSection } from '../components/home/Sections'

export default function Home() {
  const { hash } = useLocation()

  // Scroll to a section when the navbar links to /#how, /#ai or /#faq
  useEffect(() => {
    if (hash) document.querySelector(hash)?.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [hash])

  return (
    <>
      <Hero />
      <TechStrip />
      <HowItWorks />
      <AiInstructor />
      <TracksSection />
      <Faq />
      <Cta />
    </>
  )
}
