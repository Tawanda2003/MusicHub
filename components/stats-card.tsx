"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Users, Music, Calendar } from "lucide-react"

export default function StatsCard() {
  const [stats, setStats] = useState({
    activeMusicians: 0,
    totalPosts: 0,
    totalEvents: 0,
    loading: true,
  })

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

  const statsList = [
    {
      icon: Users,
      value: stats.activeMusicians,
      label: "Active Musicians",
      color: "text-primary",
      bgColor: "bg-primary/5",
    },
    {
      icon: Music,
      value: stats.totalPosts,
      label: "Posts Shared",
      color: "text-secondary",
      bgColor: "bg-secondary/5",
    },
    {
      icon: Calendar,
      value: stats.totalEvents,
      label: "Events",
      color: "text-primary",
      bgColor: "bg-primary/5",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12">
      {statsList.map((stat, idx) => {
        const Icon = stat.icon
        return (
          <Card
            key={idx}
            className={`p-6 md:p-8 border-primary/20 ${stat.bgColor} hover:border-primary/40 transition-all duration-300`}
          >
            <Icon className={`w-8 h-8 ${stat.color} mb-4`} />
            <div className="text-3xl md:text-4xl font-bold mb-2">{stats.loading ? "..." : stat.value}</div>
            <div className="text-sm md:text-base text-muted-foreground">{stat.label}</div>
          </Card>
        )
      })}
    </div>
  )
}
