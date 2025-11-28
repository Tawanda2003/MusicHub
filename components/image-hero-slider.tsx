"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface HeroSlide {
  id: string
  title: string
  description: string
  image_url: string
}

export default function ImageHeroSlider() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("hero_sliders")
          .select("*")
          .order("order_index", { ascending: true })

        if (error) throw error
        setSlides(data || [])
      } catch (error) {
        console.error("Error fetching hero slides:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSlides()
  }, [])

  useEffect(() => {
    if (slides.length === 0) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(1, slides.length))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.max(1, slides.length)) % Math.max(1, slides.length))
  }

  if (loading) {
    return <div className="w-full h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl animate-pulse" />
  }

  if (slides.length === 0) {
    return (
      <div className="w-full h-96 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl flex items-center justify-center">
        <p className="text-muted-foreground">No hero slides available</p>
      </div>
    )
  }

  const slide = slides[currentSlide]

  return (
    <div className="w-full animate-fade-up">
      {/* Main Slider */}
      <div className="relative overflow-hidden rounded-xl h-64 sm:h-80 md:h-96 lg:h-[500px] group shadow-lg">
        <div className="absolute inset-0 transition-opacity duration-700 ease-in-out" style={{ opacity: 1 }}>
          <img
            src={slide.image_url || "/placeholder.svg?height=500&width=1200&query=music-hero"}
            alt={slide.title}
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
            onError={(e) => {
              e.currentTarget.src = "/music-hero.jpg"
            }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 md:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2 md:mb-4 drop-shadow-lg text-balance">
            {slide.title}
          </h2>
          {slide.description && (
            <p className="text-sm md:text-lg lg:text-xl text-white/90 max-w-2xl drop-shadow-md text-balance">
              {slide.description}
            </p>
          )}
        </div>

        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white rounded-full p-1.5 md:p-3 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4 md:w-8 md:h-8" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white rounded-full p-1.5 md:p-3 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4 md:w-8 md:h-8" />
            </button>
          </>
        )}
      </div>

      {slides.length > 1 && (
        <div className="flex justify-center gap-2 mt-4 md:mt-6">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === currentSlide ? "bg-primary w-3 h-3" : "bg-muted-foreground/50 w-2 h-2 hover:bg-muted-foreground"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
