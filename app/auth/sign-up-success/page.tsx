import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/5 flex items-center justify-center px-4">
      <Card className="p-8 max-w-md text-center border-primary/20 animate-fade-up">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-primary" />
        </div>

        <h1 className="text-2xl font-bold mb-3">Check Your Email</h1>
        <p className="text-muted-foreground mb-8">
          We've sent you a confirmation link. Please check your email to verify your account and get started.
        </p>

        <Link href="/">
          <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90">Back to Home</Button>
        </Link>
      </Card>
    </main>
  )
}
