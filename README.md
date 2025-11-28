# Musicians Hub

Musicians Hub is a modern music-centered web application built with **Next.js**, **Supabase** and **TailwindCSS**.  
It allows musicians, event organizers, and users to interact through event listings, authentication, dashboards, hero sliders, and dynamic UI components.

---

##  Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router), React, TailwindCSS |
| Backend | Supabase (Auth, Database, Storage) |
| Database | PostgreSQL via Supabase |
| Testing | Vitest, React Testing Library |
| Styling | TailwindCSS |
| Build Tools | pnpm / npm |

---

## 📁 Project Structure


app/ # Main Next.js pages
auth/ # Login & Sign-Up pages
dashboard/ # User dashboard
events/ # Event listings
(home)/ # Homepage sections
components/ # Reusable UI components
lib/supabase/ # Supabase client & server helpers
public/ # Images & static assets
scripts/ # SQL schema & seed files
styles/ # Global styling
tests/ # Unit tests



---

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
# or
npm install --legacy-peer-deps
