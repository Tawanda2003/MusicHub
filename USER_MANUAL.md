# User Manual — Musicians Hub

## Overview
Musicians Hub is a platform for artists to share posts, create events, and let attendees register.

## How to register
1. Click "Sign up" at the top-right.
2. Fill in: Email, Password, Display name.
3. Confirm your email (link will be sent — set up Supabase SMTP for production).

## How to log in
1. Click "Log in".
2. Enter credentials and press "Log in".

## Creating an event
1. Go to Dashboard → Create Event.
2. Fill Title, Date & Time, Location, Description.
3. Optionally enable "Require registration" — attendees will be able to provide email to register.
4. Click "Publish".

## Registering to attend
1. On the event page, click "Register".
2. Provide your email and name.
3. You should receive a registration confirmation email.

## Managing your events
- Dashboard lists your events.
- Click an event to view attendees, edit details, or cancel.

## Image upload guidelines
- Accepted formats: JPG, PNG
- Max file size: 5MB (change as needed)

## Troubleshooting
- No email received: confirm SMTP/Supabase settings and check spam folder.
- Image upload failing: check bucket permissions (public/private) in Supabase storage.

## Admin notes (for maintainers)
- Database seed scripts are in `/scripts/*.sql`.
- Supabase client helpers are in `/lib/supabase`.
- To run seeds locally, run psql or use Supabase CLI.

