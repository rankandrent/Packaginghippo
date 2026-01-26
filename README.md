# Packaging Hippo

Packaging Hippo is a modern, programmatic SEO and CMS platform tailored for the packaging industry. It enables dynamic product page generation, blog management, and efficient inquiry tracking.

## 🚀 Features

- **Programmatic SEO**: Automatically generated city and niche-specific pages for maximum search visibility.
- **Dynamic CMS**: Easy-to-use dashboard for managing products, categories, blogs, and inquiries.
- **Inquiry System**: Integrated form and dashboard for tracking customer requests.
- **Modern UI**: Built with Tailwind CSS, Framer Motion, and Shadcn UI for a premium, responsive experience.
- **Rich Text Editing**: Tiptap-powered editor for blogs and product descriptions.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Database**: [Prisma](https://www.prisma.io/) with [Supabase](https://supabase.com/) (PostgreSQL)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Editor**: [Tiptap](https://tiptap.dev/)
- **Authentication**: Custom authentication (Jose/JWT)

## 🏁 Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project (PostgreSQL database)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Packaginghippo
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add your credentials:
   ```env
   DATABASE_URL="your-postgresql-connection-string"
   SUPABASE_URL="your-supabase-url"
   SUPABASE_ANON_KEY="your-supabase-anon-key"
   JWT_SECRET="your-jwt-secret"
   ```

4. **Initialize Prisma**:
   ```bash
   npx prisma generate
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

- `src/app`: Next.js App Router pages and API routes.
- `src/components`: Reusable UI components.
- `src/lib`: Utility functions and shared logic.
- `prisma`: Database schema and migrations.
- `scripts`: Helper scripts for database verification and seeding.

## 🌐 Deployment

The project is configured for deployment on platforms like Netlify or Vercel. Ensure all environment variables are correctly set in your deployment dashboard.

---
Built with ❤️ by the Packaging Hippo Team.
