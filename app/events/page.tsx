 "use client"

import type React from "react"

import { useEffect, useState } from "react"
import Navbar from "@/components/navbar"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Calendar, MapPin, Users, X } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { User } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"

type Event = Database['public']['Tables']['events']['Row'] & {
  users?: {
    id: string
    full_name: string
    avatar_url: string | null
    email: string
  }
  event_registrations?: { count: number }[]
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [registeredEvents, setRegisteredEvents] = useState(new Set<string>())
  const [registering, setRegistering] = useState(new Set<string>())
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [registrationForm, setRegistrationForm] = useState({ full_name: "", email: "", phone: "" })

  useEffect(() => {
    const supabase = createClient()

    const fetchData = async () => {
      try {
        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)

        // Fetch events with creator details
        const { data: eventsData, error: eventsError } = await supabase
          .from("events")
          .select(`
            id,
            title,
            description,
            date,
            location,
            image_url,
            capacity,
            user_id,
            created_at,
            updated_at,
            users!events_user_id_fkey(id, full_name, avatar_url, email),
            event_registrations(count)
          `)
          .order("date", { ascending: true })

        if (eventsError) {
          console.log("[v0] Query error:", eventsError)
          // Fallback: fetch without relationships
          const { data: fallbackData } = await supabase
            .from("events")
            .select("id, title, description, date, location, image_url, capacity, user_id")
            .order("date", { ascending: true })
          setEvents((fallbackData || []) as Event[])
        } else {
          setEvents((eventsData || []) as Event[])
        }

        // Fetch user's registrations
        if (user) {
          const { data: registrations, error: regError } = await supabase
            .from("event_registrations")
            .select("event_id")
            .eq("user_id", user.id)

          if (regError) throw regError
          setRegisteredEvents(new Set(registrations?.map((r) => r.event_id) || []))
        }
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleRegisterClick = (event: any) => {
    if (!user) {
      window.location.href = "/auth/login"
      return
    }
    setSelectedEvent(event)
    setRegistrationForm({
      full_name: user.user_metadata?.full_name || "",
      email: user.email || "",
      phone: "",
    })
  }

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !selectedEvent) return

    const supabase = createClient()
    setRegistering((prev) => new Set([...prev, selectedEvent.id]))

    try {
      const { error } = await supabase.from("event_registrations").insert({
        event_id: selectedEvent.id,
        user_id: user.id,
      })

      if (error) throw error

      try {
        await fetch("/api/send-registration-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId: selectedEvent.id,
            userId: user.id,
            eventTitle: selectedEvent.title,
            eventDate: formatDate(selectedEvent.date),
            registrantName: registrationForm.full_name,
            registrantEmail: registrationForm.email,
            registrantPhone: registrationForm.phone,
            creatorEmail: selectedEvent.users?.email,
          }),
        })
      } catch (emailError) {
        console.error("Error sending notification:", emailError)
      }

      setRegisteredEvents((prev) => new Set([...prev, selectedEvent.id]))
      setSelectedEvent(null)
      setRegistrationForm({ full_name: "", email: "", phone: "" })

      // Refresh events to update registration count
      const { data: eventsData } = await supabase
        .from("events")
        .select(`
          id,
          title,
          description,
          date,
          location,
          image_url,
          capacity,
          user_id,
          created_at,
          updated_at,
          users!events_user_id_fkey(id, full_name, avatar_url, email),
          event_registrations(count)
        `)
        .order("date", { ascending: true })

      setEvents(eventsData || [])
    } catch (error) {
      console.error("Error registering for event:", error)
    } finally {
      setRegistering((prev) => {
        const next = new Set(prev)
        next.delete(selectedEvent.id)
        return next
      })
    }
  }

  const handleUnregister = async (eventId: string) => {
    if (!user) return

    const supabase = createClient()
    setRegistering((prev) => new Set([...prev, eventId]))

    try {
      const { error } = await supabase
        .from("event_registrations")
        .delete()
        .eq("event_id", eventId)
        .eq("user_id", user.id)

      if (error) throw error
      setRegisteredEvents((prev) => {
        const next = new Set(prev)
        next.delete(eventId)
        return next
      })
    } catch (error) {
      console.error("Error unregistering:", error)
    } finally {
      setRegistering((prev) => {
        const next = new Set(prev)
        next.delete(eventId)
        return next
      })
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
      <Navbar />

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-up">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Upcoming Events
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect, collaborate, and create with musicians in your area
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : events.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, idx) => {
                const registrationCount = event.event_registrations?.[0]?.count || 0
                const isRegistered = registeredEvents.has(event.id)
                const isRegistering = registering.has(event.id)

                return (
                  <Card
                    key={event.id}
                    className="overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-lg animate-fade-up border-primary/20"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    {event.image_url ? (
                      <div className="h-48 overflow-hidden bg-muted">
                        <img
                          src={event.image_url || "/placeholder.svg"}
                          alt={event.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          crossOrigin="anonymous"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg"
                          }}
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3 line-clamp-2">{event.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        {event.capacity && (
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-primary" />
                            <span>
                              {registrationCount} / {event.capacity} registered
                            </span>
                          </div>
                        )}
                      </div>

                      {event.users && (
                        <div className="flex items-center gap-2 mb-6 pb-6 border-b border-border">
                          {event.users.avatar_url && (
                            <img
                              src={event.users.avatar_url || "/placeholder.svg"}
                              alt={event.users.full_name}
                              className="w-8 h-8 rounded-full object-cover"
                              crossOrigin="anonymous"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg"
                              }}
                            />
                          )}
                          <span className="text-xs text-muted-foreground">by {event.users.full_name}</span>
                        </div>
                      )}

                      {isRegistered ? (
                        <Button
                          onClick={() => handleUnregister(event.id)}
                          disabled={isRegistering}
                          className="w-full bg-muted text-foreground hover:bg-muted/80"
                        >
                          {isRegistering ? "Processing..." : "Unregister"}
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleRegisterClick(event)}
                          disabled={isRegistering}
                          className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                        >
                          {isRegistering ? "Processing..." : "Register Now"}
                        </Button>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="p-12 text-center border-dashed">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No events available yet</p>
              <Link href="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </Card>
          )}
        </div>
      </section>

      {/* Registration Form Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 md:p-4 z-50 animate-fade-up">
          <Card className="w-full max-w-md p-4 md:p-6 border-primary/20 rounded-lg md:rounded-xl">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h3 className="text-lg md:text-xl font-bold">Register for Event</h3>
              <button
                onClick={() => {
                  setSelectedEvent(null)
                  setRegistrationForm({ full_name: "", email: "", phone: "" })
                }}
                className="hover:opacity-70"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 md:mb-6">
              <h4 className="font-semibold text-sm md:text-base mb-2">{selectedEvent.title}</h4>
              <p className="text-xs md:text-sm text-muted-foreground">{formatDate(selectedEvent.date)}</p>
            </div>

            <form onSubmit={handleSubmitRegistration} className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={registrationForm.full_name}
                  onChange={(e) => setRegistrationForm({ ...registrationForm, full_name: e.target.value })}
                  placeholder="Your full name"
                  className="w-full px-3 md:px-4 py-2 rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={registrationForm.email}
                  onChange={(e) => setRegistrationForm({ ...registrationForm, email: e.target.value })}
                  placeholder="Your email"
                  className="w-full px-3 md:px-4 py-2 rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={registrationForm.phone}
                  onChange={(e) => setRegistrationForm({ ...registrationForm, phone: e.target.value })}
                  placeholder="Your phone number"
                  className="w-full px-3 md:px-4 py-2 rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2 md:pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-sm"
                >
                  Complete Registration
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent text-sm"
                  onClick={() => {
                    setSelectedEvent(null)
                    setRegistrationForm({ full_name: "", email: "", phone: "" })
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </main>
  )
}
