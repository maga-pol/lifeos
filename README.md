# LifeOS

LifeOS is a premium personal productivity dashboard prototype with habits, sleep tracking, notes, goals, planner, analytics, theme switching, search, and data export.

## Open locally

Open `index.html` in a browser, or use the VS Code Live Server extension.

## Deploy to GitHub and Vercel

1. Create a new GitHub repository.
2. Upload or push this `lifeos` folder.
3. In Vercel, choose `Add New Project`.
4. Select the GitHub repository.
5. Keep the default static site settings and deploy.

## Supabase

The UI is ready for Supabase connection. Add your Supabase project URL and anon key in `script.js`, then run the SQL from `supabase-schema.sql` in your Supabase SQL editor.

Recommended tables:

- profiles
- habits
- habit_completions
- sleep_entries
- notes
- goals
- goal_milestones
- tasks
- events
