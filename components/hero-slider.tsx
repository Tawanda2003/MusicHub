"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Users, Music, Calendar } from "lucide-react"

export default function HeroSlider() {
  const [stats, setStats] = useState({
    activeMusicians: 0,
    totalPosts: 0,
    totalEvents: 0,
    loading: true,
  })
  const [slideIndex, setSlideIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const supabase = createClient()

        const [{ count: musicians }, { count: posts }, { count: events }] = await Promise.all([
          supabase.from("users").select("*", { count: "exact", head: true }),
          supabase.from("posts").select("*", { count: "exact", head: true }),
          supabase.from("events").select("*", { count: "exact", head: true }),
        ])

        setStats({
          activeMusicians: musicians || 0,
          totalPosts: posts || 0,
          totalEvents: events || 0,
          loading: false,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
        setStats((prev) => ({ ...prev, loading: false }))
      }
    }

    fetchStats()
  }, [])

  const slides = [
    {
      icon: Users,
      value: stats.activeMusicians,
      label: "Active Musicians",
      color: "primary",
      gradient: "from-primary/5 to-secondary/5",
      borderColor: "border-primary/20",
      hoverColor: "hover:border-primary/40",
    },
    {
      icon: Music,
      value: stats.totalPosts,
      label: "Posts Shared",
      color: "secondary",
      gradient: "from-secondary/5 to-primary/5",
      borderColor: "border-secondary/20",
      hoverColor: "hover:border-secondary/40",
    },
    {
      icon: Calendar,
      value: stats.totalEvents,
      label: "Events",
      color: "primary",
      gradient: "from-primary/5 to-secondary/5",
      borderColor: "border-primary/20",
      hoverColor: "hover:border-primary/40",
    },
  ]

  const currentSlide = slides[slideIndex]
  const IconComponent = currentSlide.icon

  return (
    <div className="w-full animate-fade-up" style={{ animationDelay: "0.2s" }}>
      {/* Main Slider Container */}
      <div
        className={`bg-gradient-to-br ${currentSlide.gradient} ${currentSlide.borderColor} ${currentSlide.hoverColor} border rounded-lg p-8 transition-all duration-500 min-h-48 flex flex-col items-center justify-center`}
      >
        <IconComponent className={`w-12 h-12 text-${currentSlide.color} mb-4`} />
        <div className="text-5xl font-bold text-center mb-2 transition-all duration-300">
          {stats.loading ? "..." : currentSlide.value}
        </div>
        <div className="text-lg text-muted-foreground text-center">{currentSlide.label}</div>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setSlideIndex(index)}
            className={`transition-all duration-300 rounded-full ${
              index === slideIndex ? "bg-primary w-3 h-3" : "bg-muted w-2 h-2 hover:bg-muted-foreground"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Desktop Grid View - Hidden on Mobile */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-4 mt-8">
        {slides.map((slide, idx) => {
          const Icon = slide.icon
          return (
            <Card
              key={idx}
              className={`p-6 ${slide.borderColor} bg-gradient-to-br ${slide.gradient} ${slide.hoverColor} transition-colors cursor-pointer hover:shadow-lg`}
              onClick={() => setSlideIndex(idx)}
            >
              <Icon className={`w-8 h-8 text-${slide.color} mb-4`} />
              <div className="text-3xl font-bold">{stats.loading ? "..." : slide.value}</div>
              <div className="text-sm text-muted-foreground">{slide.label}</div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
