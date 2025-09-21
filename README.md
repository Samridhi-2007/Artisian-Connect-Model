KalaSaathi – AI-Powered Artisan Marketplace

Forked from: Project Member Repository

Setup / Run Instructions:

cd artist-connect-model
npm i
npm run dev


Prototype Overview:
KalaSaathi is an AI-powered platform that empowers artisans to showcase their handmade products, generate professional product stories, connect with customers directly, and even mint NFT certificates for authenticity. It also includes workshops and a collaborative artisan community.

🌟 Features
1. User Onboarding (Artisan Side)

Step 1: Artisans register on the app/website with basic profile details (name, craft type, location).

Step 2: Dashboard to upload product photos + record short audio/video stories in their own words.

Step 3: AI backend generates polished product stories, captions, and hashtags.

Example:

Artisan: “Ye Madhubani painting maine 2 din me banayi hai, ek festival ke liye.”
AI Output: “Hand-painted Madhubani artwork inspired by Indian festivals. Perfect for home décor. #Handmade #MadhubaniArt”

2. AI Guidance Engine (Virtual Saathi)

Displays trending regions and product demand.

Provides hashtag/SEO suggestions.

Offers market insights for product positioning.

Example:

Trending regions: “Terracotta idols South India me demand me hai.”

Hashtag suggestions: #TerracottaDecor, #EcoFriendlyPottery

Market suggestion: “Your design could attract US buyers looking for authentic handmade pottery.”

3. E-Commerce + Direct Connect (Customer Side)

Customers explore curated artisan product feed.

Each product includes AI-generated story and details.

Options: Buy Now (checkout) or Chat with Artisan (for customization).

Demo:
Customer selects a handloom saree → chats with artisan for live customization.

4. NFT & Authentication Layer

Option for artisans to mint NFT certificate for each product.

Integrated with Verbwire API (Polygon Testnet).

Shows proof of authenticity on OpenSea testnet.

Demo:
Click "Mint NFT" → NFT link displayed on OpenSea testnet.

5. Learning & Tuition System

Artisans can offer workshops via profile tab.

Customers can book classes and join video sessions.

Example:

Workshop: “Learn Madhubani Art – 4 sessions, ₹500/session”

Dummy listing shown in prototype for demo purposes.

6. Community & Collaboration Hub

Artisans can post designs and collaborate with others.

Example:

Rajasthani artisan posts pottery design.

South Indian artisan suggests adding a motif → joint product created.

🔑 Prototype Flow (5-minute Hackathon Demo)

Login as Artisan → create profile + upload product.

Show AI Suggestions Screen → captions, hashtags, market demand.

Customer Side → explore products, use “Buy” + “Chat with Artisan”.

NFT Demo → mint NFT on testnet using Verbwire API.

Workshop Tab → show a paid class listing.

Community Tab → show sample collaboration post.

🛠 Technologies to be used in the solution
Frontend & 🎨 Styling

Next.js (App Router + TypeScript) – SSR, routing & type safety

React (Hooks + Functional Components) – Modern architecture

UI Libraries – Lucide React (icons), Radix UI (accessible UI), Custom components

Styling – Tailwind CSS, PostCSS, and Global CSS overrides

Backend / API

Next.js API Routes – Serverless backend functions

In-memory Mock Data – Temporary users & posts (no external DB)

Google Gemini AI API – AI-powered features (lib/ai-config.ts)

Google Maps API – Location-based insights & regional demand analysis

Deployment / Hosting

Optimized for Vercel (default: @vercel/analytics/next)

Cross-platform support – Can run on any Next.js-compatible host
