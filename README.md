# VocaLinc 🎙️🛡️

VocaLinc is a next-generation, voice-activated community safety and management platform designed to revolutionize how residential societies operate. Built with a focus on security, accessibility, and seamless communication, VocaLinc empowers residents with hands-free emergency assistance and provides administrators with powerful, AI-driven management tools.

## ✨ Key Features

### 🚨 Aura Safety Engine (Voice-Activated SOS)
- **Hands-Free Emergency Response:** Simply say *"Yes, I need help"* to instantly trigger the emergency sequence without touching a screen.
- **Live Geolocation Tracking:** Automatically fetches your exact GPS coordinates and generates a clickable Google Maps link.
- **Twilio SMS Integration:** Instantly blasts urgent SMS alerts containing your live location to all your designated emergency contacts.

### 🏢 Smart Community Dashboard
- **Role-Based Access Control:** Distinct, tailored experiences for Community Admins and regular Residents, powered by Supabase Authentication.
- **AI Event Management:** Admins can instantly generate engaging community event ideas using AI, and schedule them with a single click.
- **Live Event Analytics:** Real-time visual charts tracking event engagement, overall community feedback, and average ratings.

### 🛠️ Intelligent Ticketing & Maintenance
- **Dynamic Priority Engine:** Maintenance requests are automatically prioritized using smart text-detection (e.g., "fire" instantly triggers P1 Critical status).
- **Automated Technician Assignment:** Instantly routes issues to the correct available maintenance staff based on the required specialty (Plumbing, Electrical, HVAC, etc.).
- **"Mark as Solved" Workflow:** Residents can mark issues as resolved to instantly clear them from both the Resident and Admin dashboards in real-time.

## 🚀 Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS, Framer Motion (for smooth animations)
- **Backend & Database:** Supabase (PostgreSQL, Authentication, Row Level Security)
- **APIs & Integrations:** Twilio REST API (SMS), Web Speech API (Voice Recognition), Geolocation API

## ⚙️ Local Development Setup

To run VocaLinc locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/vocalinc.git
   cd vocalinc
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Navigate to the `localhost` URL provided in your terminal (e.g., `http://localhost:8182`).

## 🗄️ Database Schema Requirements

VocaLinc relies on a properly configured Supabase PostgreSQL database. Ensure you have the following tables created and configured with the correct Row Level Security (RLS) policies:
- `user_profiles` (id, first_name, last_name, role)
- `events` (id, title, location, date, time, description)
- `feedback` (id, rating, comment, event_id)
- `tickets` (id, user_id, complaint, building, specialty, priority, status)
- `emergency_contacts` (id, user_id, name, phone, relationship)

## 🌐 Deployment

This project is optimized for deployment on platforms like **Vercel** or **Netlify**. 
1. Connect your GitHub repository to your preferred hosting provider.
2. Ensure you add the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the production environment variables.
3. Deploy!

---
*Built with passion for safer, smarter communities.*
