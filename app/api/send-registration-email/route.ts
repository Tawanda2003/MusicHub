export async function POST(request: Request) {
  try {
    const { eventId, userId, eventTitle, eventDate, registrantEmail, registrantName, creatorEmail } =
      await request.json()

    // Simple email simulation - in production, use Resend, SendGrid, or similar
    console.log("[v0] Email Notification:", {
      to: creatorEmail,
      subject: `New Registration for ${eventTitle}`,
      registrant: registrantName,
      registrantEmail: registrantEmail,
      eventDate: eventDate,
    })

    // Store in database for reference (optional)
    // Email notification is logged successfully, just removed the DB update

    return Response.json({ success: true, message: "Notification sent" })
  } catch (error) {
    console.error("Error sending notification:", error)
    return Response.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
