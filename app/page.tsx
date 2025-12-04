// "use client"

// import { useEffect, useState } from "react"
// import Navbar from "@/components/navbar"
// import { createClient } from "@/lib/supabase/client"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import Link from "next/link"
// import { ChevronLeft, ChevronRight, Music } from "lucide-react"
// import ImageHeroSlider from "@/components/image-hero-slider"
// import StatsCard from "@/components/stats-card"

// interface Post {
//   id: string
//   title: string
//   description: string
//   image_url: string | null
//   users: {
//     full_name: string
//     avatar_url: string | null
//   } | null
// }

// export default function HomePage() {
//   const [posts, setPosts] = useState<Post[]>([])
//   const [currentSlide, setCurrentSlide] = useState(0)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const supabase = createClient()
//     const fetchPosts = async () => {
//       try {
//         const { data, error } = await supabase
//           .from("posts")
//           .select("id, title, description, image_url, users(full_name, avatar_url)")
//           .order("created_at", { ascending: false })
//           .limit(6)

//         if (error) throw error
//         setPosts((data || []) as Post[])
//       } catch (error) {
//         console.error("Error fetching posts:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchPosts()
//   }, [])

//   const nextSlide = () => {
//     setCurrentSlide((prev) => (prev + 1) % Math.max(1, posts.length))
//   }

//   const prevSlide = () => {
//     setCurrentSlide((prev) => (prev - 1 + Math.max(1, posts.length)) % Math.max(1, posts.length))
//   }

//   return (
//     <main className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5">
//       <Navbar />

//       {/* Hero Section */}
//       <section className="relative overflow-hidden pt-16 md:pt-20 pb-8 md:pb-12 px-4 md:px-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="space-y-6 md:space-y-8">
//             <div className="animate-fade-up space-y-3 md:space-y-4">
//               <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-balance">
//                 Welcome to MusiansHub
//               </h1>
//               <p className="text-center text-muted-foreground max-w-2xl mx-auto text-sm md:text-base lg:text-lg text-balance">
//                 Connect with musicians, discover events, and share your passion for music
//               </p>
//             </div>
//             <ImageHeroSlider />
//           </div>
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section className="py-12 md:py-16 px-4 md:px-6 bg-card/30">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-8 md:mb-12 animate-fade-up">
//             <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">Our Community</h2>
//             <p className="text-base md:text-lg text-muted-foreground">Join thousands of musicians worldwide</p>
//           </div>
//           <StatsCard />
//         </div>
//       </section>

//       {/* Posts Slider Section */}
//       <section className="py-16 md:py-20 px-4 md:px-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-8 md:mb-12 animate-fade-up">
//             <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">Latest Posts from Musicians</h2>
//             <p className="text-base md:text-lg text-muted-foreground">Discover what the community is sharing</p>
//           </div>

//           {loading ? (
//             <div className="flex items-center justify-center h-64 md:h-96">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//             </div>
//           ) : posts.length > 0 ? (
//             <div className="relative group">
//               {/* Slider Container */}
//               <div className="overflow-hidden rounded-xl shadow-lg">
//                 <div
//                   className="flex transition-transform duration-500 ease-out"
//                   style={{ transform: `translateX(-${currentSlide * 100}%)` }}
//                 >
//                   {posts.map((post) => (
//                     <div key={post.id} className="w-full flex-shrink-0 px-2 md:px-0">
//                       <Card className="h-auto md:h-96 overflow-hidden border-primary/20 bg-gradient-to-br from-background to-card/50 hover:border-primary/40 transition-all duration-300">
//                         <div className="h-full flex flex-col p-4 md:p-6 lg:p-8">
//                           {/* Image Container */}
//                           {post.image_url ? (
//                             <div className="h-32 md:h-40 lg:h-48 mb-4 md:mb-6 rounded-lg overflow-hidden bg-muted flex-shrink-0">
//                               <img
//                                 src={post.image_url || "/placeholder.svg"}
//                                 alt={post.title}
//                                 className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
//                                 crossOrigin="anonymous"
//                                 onError={(e) => {
//                                   e.currentTarget.src = "/musician-post.jpg"
//                                 }}
//                               />
//                             </div>
//                           ) : (
//                             <div className="h-32 md:h-40 lg:h-48 mb-4 md:mb-6 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center flex-shrink-0">
//                               <Music className="w-8 h-8 md:w-12 md:h-12 text-muted-foreground" />
//                             </div>
//                           )}
//                           <div className="flex-1 space-y-2 md:space-y-3">
//                             <h3 className="text-lg md:text-xl lg:text-2xl font-bold line-clamp-2">{post.title}</h3>
//                             <p className="text-xs md:text-sm lg:text-base text-muted-foreground line-clamp-3">
//                               {post.description}
//                             </p>
//                           </div>
//                           {/* Author Section */}
//                           {post.users && (
//                             <div className="flex items-center gap-2 md:gap-3 mt-4 md:mt-6 pt-3 md:pt-4 border-t border-border">
//                               {post.users.avatar_url && (
//                                 <img
//                                   src={post.users.avatar_url || "/placeholder.svg"}
//                                   alt={post.users.full_name}
//                                   className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover flex-shrink-0"
//                                   crossOrigin="anonymous"
//                                   onError={(e) => {
//                                     e.currentTarget.src = "/diverse-avatars.png"
//                                   }}
//                                 />
//                               )}
//                               <span className="text-xs md:text-sm font-medium truncate">{post.users.full_name}</span>
//                             </div>
//                           )}
//                         </div>
//                       </Card>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Navigation Buttons */}
//               {posts.length > 1 && (
//                 <>
//                   <button
//                     onClick={prevSlide}
//                     className="absolute -left-3 md:-left-4 top-1/2 -translate-y-1/2 z-10 bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/90 transition-all opacity-0 group-hover:opacity-100"
//                     aria-label="Previous post"
//                   >
//                     <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
//                   </button>
//                   <button
//                     onClick={nextSlide}
//                     className="absolute -right-3 md:-right-4 top-1/2 -translate-y-1/2 z-10 bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/90 transition-all opacity-0 group-hover:opacity-100"
//                     aria-label="Next post"
//                   >
//                     <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
//                   </button>

//                   {/* Dots Navigation */}
//                   <div className="flex justify-center gap-2 mt-4 md:mt-6">
//                     {posts.map((_, idx) => (
//                       <button
//                         key={idx}
//                         onClick={() => setCurrentSlide(idx)}
//                         className={`transition-all ${
//                           idx === currentSlide
//                             ? "w-8 h-2 md:w-8 md:h-2.5 bg-primary"
//                             : "w-2 h-2 md:w-2 md:h-2.5 bg-muted-foreground/50 hover:bg-muted-foreground"
//                         } rounded-full`}
//                         aria-label={`Go to post ${idx + 1}`}
//                       />
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>
//           ) : (
//             <Card className="p-8 md:p-12 text-center border-dashed">
//               <Music className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground mx-auto mb-3 md:mb-4" />
//               <p className="text-muted-foreground mb-3 md:mb-4 text-sm md:text-base">
//                 No posts yet. Be the first to share!
//               </p>
//               <Link href="/auth/sign-up">
//                 <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-sm md:text-base">
//                   Join and Share
//                 </Button>
//               </Link>
//             </Card>
//           )}
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-12 md:py-20 px-4 md:px-6 bg-card/50">
//         <div className="max-w-4xl mx-auto text-center animate-fade-up">
//           <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-balance">Ready to Connect?</h2>
//           <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-6 md:mb-8 text-balance">
//             Join thousands of musicians already sharing their passion and collaborating on MusiansHub
//           </p>
//           <div className="flex gap-3 md:gap-4 justify-center flex-wrap">
//             <Link href="/auth/sign-up">
//               <Button size="sm" className="md:size-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90">
//                 Sign Up Free
//               </Button>
//             </Link>
//             <Link href="/events">
//               <Button size="sm" className="md:size-lg bg-transparent" variant="outline">
//                 Explore Events
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </section>
//     </main>
//   )
// }

"use client"
import { useEffect, useState } from "react"
import Navbar from "@/components/navbar"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Music } from "lucide-react"
import ImageHeroSlider from "@/components/image-hero-slider"
import StatsCard from "@/components/stats-card"
import { Button } from "@/components/ui/button"

interface Post {
  id: string
  title: string
  description: string
  image_url: string | null
  users: {
    full_name: string
    avatar_url: string | null
  } | null
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("id, title, description, image_url, users(full_name, avatar_url)")
          .order("created_at", { ascending: false })
          .limit(8)

        if (error) throw error
        setPosts((data || []) as Post[])
      } catch (error) {
        console.error("Error fetching posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-16 md:pt-20 pb-8 md:pb-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6 md:space-y-8">
            <div className="animate-fade-up space-y-3 md:space-y-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-balance">
                Welcome to MusiansHub
              </h1>
              <p className="text-center text-muted-foreground max-w-2xl mx-auto text-sm md:text-base lg:text-lg text-balance">
                Connect with musicians, discover events, and share your passion for music
              </p>
            </div>
            <ImageHeroSlider />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 md:py-16 px-4 md:px-6 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12 animate-fade-up">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">Our Community</h2>
            <p className="text-base md:text-lg text-muted-foreground">Join thousands of musicians worldwide</p>
          </div>
          <StatsCard />
        </div>
      </section>

      {/* POSTS GRID (no buttons) */}
      <section className="py-16 md:py-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12 animate-fade-up">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">Latest Posts from Musicians</h2>
            <p className="text-base md:text-lg text-muted-foreground">Discover what the community is sharing</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {posts.map((post) => (
                <Card
                  key={post.id}
                  className="p-4 border-primary/20 bg-gradient-to-br from-background to-card/50 hover:border-primary/40 transition-all"
                >
                  {/* Image */}
                  {post.image_url ? (
                    <div className="h-40 w-full rounded-lg overflow-hidden mb-4 bg-muted">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition"
                        onError={(e) => (e.currentTarget.src = "/musician-post.jpg")}
                      />
                    </div>
                  ) : (
                    <div className="h-40 w-full rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <Music className="w-10 h-10 text-muted-foreground" />
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-lg font-bold line-clamp-2">{post.title}</h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{post.description}</p>

                  {/* Author */}
                  {post.users && (
                    <div className="flex items-center gap-2 mb-4">
                      {post.users.avatar_url && (
                        <img
                          src={post.users.avatar_url}
                          className="w-8 h-8 rounded-full object-cover"
                          onError={(e) => (e.currentTarget.src = "/diverse-avatars.png")}
                        />
                      )}
                      <span className="text-sm font-medium">{post.users.full_name}</span>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 md:p-12 text-center border-dashed">
              <Music className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground mx-auto mb-3 md:mb-4" />
              <p className="text-muted-foreground mb-3 md:mb-4 text-sm md:text-base">
                No posts yet. Be the first to share!
              </p>
              <Link href="/auth/sign-up">
                <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-sm md:text-base">
                  Join and Share
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-card/50">
        <div className="max-w-4xl mx-auto text-center animate-fade-up">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-balance">Ready to Connect?</h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-6 md:mb-8 text-balance">
            Join thousands of musicians already sharing their passion and collaborating on MusiansHub
          </p>
          <div className="flex gap-3 md:gap-4 justify-center flex-wrap">
            <Link href="/auth/sign-up">
              <Button size="sm" className="md:size-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                Sign Up Free
              </Button>
            </Link>
            <Link href="/events">
              <Button size="sm" className="md:size-lg bg-transparent" variant="outline">
                Explore Events
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

