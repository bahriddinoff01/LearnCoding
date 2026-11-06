import { lazy, Suspense } from 'react'
import Hero from '../components/home/Hero'
import { AiInstructor, Cta, Faq, HowItWorks, TechStrip } from '../components/home/Sections'

// The track cards need all the course content, so they load just after the page appears
const TracksSection = lazy(() => import('../components/home/TracksSection'))

export default function Home() {
  return (
    <>
      <Hero />
      <TechStrip />
      <HowItWorks />
      <AiInstructor />
      <Suspense fallback={<div className="h-[900px]" />}>
        <TracksSection />
      </Suspense>
      <Faq />
      <Cta />
    </>
  )
}
