# ReLoop — One Resource, Many Possibilities

> A full-stack, responsive circular resource sharing platform connecting individuals, businesses, NGOs, workshops, repair clinics, and recyclers to divert usable goods from landfills into second lives.

---

## 🌍 Project Overview & Mission

ReLoop is built to solve a critical modern paradox: tons of usable timber, electronics, surplus floral arrangements, fabric scraps, and compostable organics are discarded into landfills every day simply because there is no direct local matching mechanism.

Through **Rule-Based Algorithmic Matching**, **Direct In-App Messaging**, **Google Maps Location Discovery with Privacy Controls**, and our circular **"Next Best Use" Alternative Recommendation Engine**, ReLoop empowers communities to reuse, repair, repurpose, and compost resources locally.

---

## ⚖️ Essential Business Rules & Non-Negotiables

1. **Strictly Independent Direct Collection:**
   - **ReLoop DOES NOT provide delivery services or delivery partners.**
   - All buyers, sellers, and community partners communicate directly to independently inspect items, verify condition, and coordinate collection, vehicle transportation, and payment terms.
2. **Google Maps Without Paid API Keys:**
   - Every listing provides a free Google Maps search or directions link generated from valid addresses or latitude/longitude coordinates without requiring paid Google Maps JavaScript API keys.
3. **Location Privacy Protection:**
   - Resource owners choose their location visibility:
     - `Approximate Area`: General neighborhood shown publicly on Google Maps.
     - `City Only`: City-level discovery without street precision.
     - `Private on Confirmed Request`: Full pickup instructions and address are shared only after an exchange request is formally accepted by the owner.
4. **Transparent Community Data:**
   - Zero fabricated statistics or fake environmental numbers. All metrics represent real recorded platform database activity.
5. **Non-Negotiable Environmental & Safety Rules:**
   - **Zero Spoiled Food:** Spoiled, thawed, or past-shelf-life food must **NEVER** be offered for human consumption.
   - **Hazardous Materials & Certified E-Waste:** Punctured batteries, chemicals, and bio-contaminants must adhere to municipal certified disposal regulations.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 6, JavaScript, React Router v6 |
| **Styling** | Tailwind CSS with custom eco-conscious palette (Forest Green, Fresh Green, Charcoal, Off-White) |
| **Icons** | Lucide React |
| **Forms & Validation** | React Hook Form, Zod |
| **Backend & Database**| Supabase PostgreSQL, Supabase Auth, Supabase Storage, Supabase Realtime |
| **Security** | PostgreSQL Row Level Security (RLS) on all 14 tables |
| **Maps & Location** | Native Google Maps search and directions link generator (Zero paid API dependencies) |
| **Deployment** | Vercel SPA ready (`vercel.json` included) |

---

## 📑 Complete 30-Page Architecture

### Public Website Pages
- **Page 1. Home Page (`/`):** Hero section, 4-step circular process, 13 categories, live recently listed resources, Next Best Use feature, verified database impact metrics.
- **Page 2. Browse Resources (`/resources`):** Searchable marketplace with category, listing type, condition, price, and sorting filters.
- **Page 3. Resource Details (`/resources/:id`):** Multi-photo gallery, specifications matrix, owner verification badge, privacy-aware Google Maps button, reservation modal, report listing modal, and Next Best Use recommendations.
- **Page 4. Resource Categories (`/categories`):** Browse all 13 circular categories with safety rules and alternative pathways.
- **Page 5. About ReLoop (`/about`):** Circular philosophy, linear waste problems, 7 pathways of circular hierarchy, and direct collection policy.
- **Page 6. How It Works (`/how-it-works`):** 4-step workflow, rule-based matching engine breakdown, and detailed guides for all 7 listing types (Giveaway, Donation, Sale, Exchange, Rent/Lend, Repair, Recovery).
- **Page 7. Safety and Guidelines (`/safety-and-guidelines`):** Red lines, prohibited items, safe pickup guidelines, and reporting procedures.
- **Page 8. Contact & Support (`/contact`):** Validated contact form directly logging support tickets into the database.

### Authentication Pages
- **Page 9. Registration (`/register`):** Full name, email, password confirmation, account type selection (individual, business, NGO, educational, workshop, repairer, recycler), and terms agreement.
- **Page 10. Login (`/login`):** Email & password authentication, password visibility controls, session handling, and quick reviewer demo account switcher.
- **Page 11. Forgot Password (`/forgot-password`):** Secure recovery link generator with generic confirmation preventing email enumeration.
- **Page 12. Reset Password (`/reset-password`):** Secure password reset with minimum 8-character validation.
- **Page 13. Auth Callback (`/auth/callback`):** Restores Supabase sessions from email confirmation links.

### Private User Pages
- **Page 14. User Dashboard (`/dashboard`):** Real-time summary cards (Active Listings, Published Needs, Incoming Requests, Saved Favorites, Unread Messages, Notifications).
- **Page 15. My Profile (`/profile`):** Public bio, profile picture upload, organization registration details, city, and location privacy preferences.
- **Page 16. Create Resource Listing (`/resources/create`):** Photos, category, condition, quantity, units, partial allowance, transaction type, pricing, location, Google Maps privacy mode, and safety notes.
- **Page 17. Edit Resource Listing (`/resources/:id/edit`):** Availability status switcher (Active, Reserved, Unavailable, Completed), inventory adjustments, and owner authorization guards.
- **Page 18. My Listings (`/my-listings`):** Tabbed interface filtering by active, reserved, unavailable, and completed listings.
- **Page 19. Publish a Need (`/needs/create`):** Declare needed materials, required quantities, acceptable conditions, deadlines, and budgets.
- **Page 20. My Needs (`/my-needs`):** View published needs with status controls and one-click links to find matched resources.
- **Page 21. Matched Resources (`/matches`):** Algorithmic rule-based matching engine ranking resources by category, keywords, condition, budget, quantity, and proximity with transparent match score percentages and reason tags.
- **Page 22. Favorites (`/favorites`):** Saved resources with real-time availability badges and direct removal actions.
- **Page 23. Requests & Reservations (`/requests`):** Incoming and outgoing request manager. Accept or decline requests with automatic quantity reservation and dual-party exchange completion tracking.
- **Page 24. Messaging (`/messages` & `/messages/:conversationId`):** Private conversation threads linked to specific resource listings with Supabase Realtime live chat updates.
- **Page 25. Notifications (`/notifications`):** Activity center with unread badges, mark-all-as-read, and direct links to requests, messages, and matches.
- **Page 26. Account Settings (`/settings`):** Password updates, notification preferences, and permanent account deletion workflow.

### Administration Pages
- **Page 27. Admin Dashboard (`/admin`):** Restricted dashboard with live metrics: total users, active listings, pending reports, open tickets, and completed exchanges.
- **Page 28. User Management (`/admin/users`):** Audit user registrations and toggle verified organization status.
- **Page 29. Listing Moderation (`/admin/listings`):** Review flagged listings, inspect details, dismiss reports, or hide listings.
- **Page 30. Reports & Support (`/admin/reports`):** Review user support tickets, update status (Open, In Progress, Resolved, Closed), and save internal admin notes.

---

## 🗄️ Database Architecture (Supabase PostgreSQL)

The schema in `supabase/schema.sql` establishes 14 relational tables with full Row Level Security (RLS) policies:

1. `profiles`: User account details, account type, verification status, admin flag, and privacy preferences. Auto-created on signup via trigger `on_auth_user_created`.
2. `resources`: Surplus listings with quantity, available units, condition, listing type, price, location privacy, and status.
3. `resource_images`: Image URLs linked to resources with primary image flags.
4. `needs`: Published resource requests with acceptable condition arrays, deadlines, and budgets.
5. `favorites`: Unique user-to-resource bookmark pairings.
6. `resource_requests`: Reservations with requested quantities, status transitions (`pending`, `accepted`, `rejected`, `cancelled`, `completed`), and inventory deductions.
7. `conversations`: Participant pairings linked to specific resource listings.
8. `messages`: Threaded text messages with read status and timestamps.
9. `notifications`: In-app activity alerts for requests, matches, messages, and handoffs.
10. `reports`: Moderation reports with reasons, target listings, and review status.
11. `organization_verifications`: Document submissions for workshop/business verification.
12. `support_requests`: Contact submissions with internal admin notes.
13. `moderation_logs`: Audit trail for administrator actions.
14. `resource_transfers`: Verified outcome logs recording circular diversion (`reuse`, `donation`, `repair`, `upcycle`, `recycle`, `compost`).

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Open `.env` and configure your Supabase project keys:
```env
# Supabase Project URL
VITE_SUPABASE_URL=https://your-project-id.supabase.co

# Supabase Public Anon Key
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Fallback Demo Store Flag (true allows full testing before connecting Supabase)
VITE_ENABLE_DEMO_FALLBACK=true
```

> **Reviewer Mode Note:** If you haven't created a Supabase cloud instance yet, ReLoop automatically activates a resilient browser-based local persistence engine populated with realistic circular economy listings, needs, conversations, and reviewer accounts (Elena, Marcus, Amina, and Admin). You can test all 30 pages and flows immediately!

### 3. Setup Supabase Database
1. Go to your [Supabase Dashboard](https://supabase.com).
2. Open the **SQL Editor**.
3. Copy the contents of `supabase/schema.sql` and click **Run**.
4. (Optional) Run `supabase/seed.sql` to populate sample circular listings and needs.
5. Under **Storage**, create a new public bucket named `resource-images`.

### 4. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 5. Production Build
```bash
npm run build
```
Built files are bundled in the `dist/` directory with optimized code-splitting chunks.

---

## 🚢 Deploying to Vercel

1. Push your code to GitHub.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New Project** and select your ReLoop repository.
3. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy! `vercel.json` ensures all React Router SPA paths resolve correctly.

---

## 🔒 Security & Privacy Architecture

- **PostgreSQL Row Level Security (RLS):** Enforced on all tables. Users can only edit their own listings, read their own private messages, and view their own notifications.
- **Client-Side Key Safety:** Browser code only uses the public Supabase Anon key. Service role keys and database passwords are never exposed.
- **Location Obfuscation:** Private pickup addresses are never rendered publicly. Google Maps links point only to designated public/approximate pickup areas until an owner confirms an exchange request.

---

## 📄 License
MIT License. Built for waste reduction and circular community resilience.
