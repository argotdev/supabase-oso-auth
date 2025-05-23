This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Prerequisites

### [Supabase](https://supabase.com/)

1. Create a project
2. Note the Supabase URL and anon key from the Data API settings
3. Add a User to the Project `Project Settings -> Configuration -> Authentication -> General User Signup -> Manage -> Users`

### [Oso](https://osohq.com)

1. Create a [free account](https://ui.osohq.com)
1. Create a [Read-Write API Key](https://ui.osohq.com/settings/)
1. Save the API Key somewhere where you can refer to it later

## Getting Started

First, install dependencies:

```bash
npm install
```

Copy `.env.example` to `.env.local` and replace the placeholder text with the correct Supabase and Oso configuration for your environment.

```bash
# Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Oso Cloud configuration
OSO_CLOUD_URL=https://cloud.osohq.com
OSO_API_KEY=your-oso-api-key

```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
