"use client"

import type React from "react"
import { ImageUpload } from "@/components/image-upload"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Edit2, Trash2, X } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNewPostModal, setShowNewPostModal] = useState(false)
  const [showNewEventModal, setShowNewEventModal] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [editingEvent, setEditingEvent] = useState(null)
  const [newPost, setNewPost] = useState({ title: "", description: "", image_url: "" })
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    capacity: "",
    image_url: "",
  })

  useEffect(() => {
    const supabase = createClient()

    const checkAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          router.push("/auth/login")
          return
        }
        setUser(user)

        // Fetch user's posts
        const { data: postsData } = await supabase
          .from("posts")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        setPosts(postsData || [])

        // Fetch user's events
        const { data: eventsData } = await supabase
          .from("events")
          .select("*")
          .eq("user_id", user.id)
          .order("date", { ascending: true })

        setEvents(eventsData || [])
      } catch (error) {
        console.error("Error checking auth:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleCreateOrUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const supabase = createClient()
    try {
      if (editingPost) {
        const { error } = await supabase
          .from("posts")
          .update({
            title: newPost.title,
            description: newPost.description,
            image_url: newPost.image_url,
          })
          .eq("id", editingPost.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("posts").insert({
          user_id: user.id,
          title: newPost.title,
          description: newPost.description,
          image_url: newPost.image_url,
        })

        if (error) throw error
      }

      setNewPost({ title: "", description: "", image_url: "" })
      setEditingPost(null)
      setShowNewPostModal(false)

      // Refresh posts
      const { data: postsData } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      setPosts(postsData || [])
    } catch (error) {
      console.error("Error creating/updating post:", error)
    }
  }

  const handleCreateOrUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const supabase = createClient()
    try {
      if (editingEvent) {
        const { error } = await supabase
          .from("events")
          .update({
            title: newEvent.title,
            description: newEvent.description,
            date: newEvent.date,
            location: newEvent.location,
            capacity: Number.parseInt(newEvent.capacity),
            image_url: newEvent.image_url,
          })
          .eq("id", editingEvent.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("events").insert({
          user_id: user.id,
          title: newEvent.title,
          description: newEvent.description,
          date: newEvent.date,
          location: newEvent.location,
          capacity: Number.parseInt(newEvent.capacity),
          image_url: newEvent.image_url,
        })

        if (error) throw error
      }

      setNewEvent({ title: "", description: "", date: "", location: "", capacity: "", image_url: "" })
      setEditingEvent(null)
      setShowNewEventModal(false)

      // Refresh events
      const { data: eventsData } = await supabase
        .from("events")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: true })

      setEvents(eventsData || [])
    } catch (error) {
      console.error("Error creating/updating event:", error)
    }
  }

  const handleDeletePost = async (postId: string) => {
    const supabase = createClient()
    try {
      const { error } = await supabase.from("posts").delete().eq("id", postId)

      if (error) throw error
      setPosts(posts.filter((p) => p.id !== postId))
    } catch (error) {
      console.error("Error deleting post:", error)
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    const supabase = createClient()
    try {
      const { error } = await supabase.from("events").delete().eq("id", eventId)

      if (error) throw error
      setEvents(events.filter((e) => e.id !== eventId))
    } catch (error) {
      console.error("Error deleting event:", error)
    }
  }

  const openEditPostModal = (post: any) => {
    setNewPost({ title: post.title, description: post.description, image_url: post.image_url || "" })
    setEditingPost(post)
    setShowNewPostModal(true)
  }

  const openEditEventModal = (event: any) => {
    setNewEvent({
      title: event.title,
      description: event.description,
      date: event.date?.split("T")[0] || "",
      location: event.location || "",
      capacity: event.capacity?.toString() || "",
      image_url: event.image_url || "",
    })
    setEditingEvent(event)
    setShowNewEventModal(true)
  }

  const closePostModal = () => {
    setShowNewPostModal(false)
    setEditingPost(null)
    setNewPost({ title: "", description: "", image_url: "" })
  }

  const closeEventModal = () => {
    setShowNewEventModal(false)
    setEditingEvent(null)
    setNewEvent({ title: "", description: "", date: "", location: "", capacity: "", image_url: "" })
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-purple-950/20">
      <Navbar />

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <div className="mb-12 animate-fade-up">
            <h1 className="text-4xl font-bold mb-2">Your Dashboard</h1>
            <p className="text-muted-foreground">Manage your posts and events</p>
          </div>

          {/* Posts Section */}
          <div className="mb-12 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Posts</h2>
              <Button
                onClick={() => {
                  setEditingPost(null)
                  setNewPost({ title: "", description: "", image_url: "" })
                  setShowNewPostModal(true)
                }}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </div>

            {posts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map((post) => (
                  <Card
                    key={post.id}
                    className="p-4 border-primary/20 hover:border-primary/40 transition-colors overflow-hidden"
                  >
                    {post.image_url && (
                      <div className="h-32 mb-3 overflow-hidden rounded-lg bg-muted">
                        <img
                          src={post.image_url || "/placeholder.svg"}
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                          crossOrigin="anonymous"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg"
                          }}
                        />
                      </div>
                    )}
                    <h3 className="font-bold mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{post.description}</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => openEditPostModal(post)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center border-dashed">
                <p className="text-muted-foreground mb-4">No posts yet</p>
                <Button
                  onClick={() => {
                    setEditingPost(null)
                    setNewPost({ title: "", description: "", image_url: "" })
                    setShowNewPostModal(true)
                  }}
                  variant="outline"
                >
                  Create Your First Post
                </Button>
              </Card>
            )}
          </div>

          {/* Events Section */}
          <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Events</h2>
              <Button
                onClick={() => {
                  setEditingEvent(null)
                  setNewEvent({ title: "", description: "", date: "", location: "", capacity: "", image_url: "" })
                  setShowNewEventModal(true)
                }}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Event
              </Button>
            </div>

            {events.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.map((event) => (
                  <Card
                    key={event.id}
                    className="p-4 border-primary/20 hover:border-primary/40 transition-colors overflow-hidden"
                  >
                    {event.image_url && (
                      <div className="h-32 mb-3 overflow-hidden rounded-lg bg-muted">
                        <img
                          src={event.image_url || "/placeholder.svg"}
                          alt={event.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                          crossOrigin="anonymous"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg"
                          }}
                        />
                      </div>
                    )}
                    <h3 className="font-bold mb-2 line-clamp-2">{event.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.location}</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => openEditEventModal(event)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center border-dashed">
                <p className="text-muted-foreground mb-4">No events yet</p>
                <Button
                  onClick={() => {
                    setEditingEvent(null)
                    setNewEvent({ title: "", description: "", date: "", location: "", capacity: "", image_url: "" })
                    setShowNewEventModal(true)
                  }}
                  variant="outline"
                >
                  Create Your First Event
                </Button>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* New/Edit Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 md:p-4 z-50 animate-fade-up">
          <Card className="w-full max-w-md p-4 md:p-6 border-primary/20 max-h-[90vh] overflow-y-auto rounded-lg md:rounded-xl">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h3 className="text-lg md:text-xl font-bold">{editingPost ? "Edit Post" : "Create New Post"}</h3>
              <button onClick={closePostModal} className="hover:opacity-70">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdatePost} className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="Post title"
                  className="w-full px-3 md:px-4 py-2 rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium mb-2">Description</label>
                <textarea
                  value={newPost.description}
                  onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                  placeholder="Tell us about your post"
                  className="w-full px-3 md:px-4 py-2 rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none h-20 md:h-24 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium mb-2">Image URL</label>
                <ImageUpload
                  value={newPost.image_url}
                  onImageUrl={(url) => setNewPost({ ...newPost, image_url: url })}
                />
              </div>

              <div className="flex gap-2 pt-2 md:pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-sm"
                >
                  {editingPost ? "Update Post" : "Create Post"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent text-sm"
                  onClick={closePostModal}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* New/Edit Event Modal */}
      {showNewEventModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 md:p-4 z-50 animate-fade-up">
          <Card className="w-full max-w-md p-4 md:p-6 border-primary/20 max-h-[90vh] overflow-y-auto rounded-lg md:rounded-xl">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h3 className="text-lg md:text-xl font-bold">{editingEvent ? "Edit Event" : "Create New Event"}</h3>
              <button onClick={closeEventModal} className="hover:opacity-70">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdateEvent} className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Event title"
                  className="w-full px-3 md:px-4 py-2 rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium mb-2">Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Tell us about your event"
                  className="w-full px-3 md:px-4 py-2 rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none h-20 md:h-24 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium mb-2">Date</label>
                <input
                  type="datetime-local"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="w-full px-3 md:px-4 py-2 rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  placeholder="Event location"
                  className="w-full px-3 md:px-4 py-2 rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium mb-2">Capacity</label>
                <input
                  type="number"
                  value={newEvent.capacity}
                  onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })}
                  placeholder="Max attendees"
                  className="w-full px-3 md:px-4 py-2 rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium mb-2">Image URL</label>
                <ImageUpload
                  value={newEvent.image_url}
                  onImageUrl={(url) => setNewEvent({ ...newEvent, image_url: url })}
                />
              </div>

              <div className="flex gap-2 pt-2 md:pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-sm"
                >
                  {editingEvent ? "Update Event" : "Create Event"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent text-sm"
                  onClick={closeEventModal}
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
