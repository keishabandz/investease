# Investease Learning Studio

MOOC-style and adaptive learning platform concept for investing education, built for free-tier deployment.

## What is included
- Foundation research workflow and intermediate curriculum modules.
- Adaptive lesson recommendation logic based on learner profile signals.
- Supabase-ready schema for learner profiles and lesson progress.
- Next.js app suitable for deployment on Vercel.

## Local development
```bash
npm install
npm run dev
```

## Free-tier setup (Supabase + Vercel)
1. Create a Supabase project (free tier) and copy project URL + anon key.
2. Add them to `.env.local` using `.env.example`.
3. Run the SQL in `supabase/schema.sql` in Supabase SQL editor.
4. Push this repository to your Git provider and import it into Vercel.
5. In Vercel project settings, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Deploy.

## AI model workflow (cost-aware)
- Start with rule-based adaptation (`lib/adaptive.ts`) to avoid inference cost.
- Add optional model calls only for:
  - feedback generation,
  - reflection summarization,
  - adaptive remediation suggestions.
- Cache generated feedback in Supabase to limit repeated calls.
