# SpyFall

A polished, mobile-first web version of the Spyfall party game — built for playing with friends, no accounts or backend required.

## How to play

One player is secretly the **spy**. Everyone else shares a secret location and a role within it. Players take turns asking each other questions to figure out who doesn't know the location — while the spy tries to blend in and guess the location before being caught.

## Features

- **No accounts needed** — each player gets a unique shareable link with their role encoded
- **Mobile-first design** — works great on phones; share links via iMessage or WhatsApp
- **Adjustable timer** — 3 to 15 minutes
- **1 or 2 spies** — crank up the chaos
- **27 built-in locations** — Airplane, Casino, Pirate Ship, Space Station, and more
- **Location filter** — pick exactly which locations are in play
- **Live countdown** with urgency indicator when time is running low
- **All locations list** visible to every player to aid deduction

## Getting started

```bash
git clone https://github.com/LUCASDREYER/spyfall.git
cd spyfall
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How a round works

1. **Host opens the app**, enters all player names, sets the timer and spy count, picks locations, then clicks **Generate Cards**.
2. **Host sends each player their unique link** — copy it and paste it into a group chat, or open it directly on their phone.
3. **Each player opens their own link** and taps **Reveal** to see their role (or "YOU ARE THE SPY").
4. Players take turns asking and answering one question each. Anyone can call a vote to accuse the spy.
5. When time runs out (or a vote passes), the spy reveals themselves and tries to guess the location.

## Tech stack

- [Next.js 14](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)

## Deploying

The easiest option is [Vercel](https://vercel.com/) — connect your GitHub repo and it deploys automatically on every push, for free.

## Roadmap

- [ ] Voting round UI
- [ ] Custom location creator
- [ ] QR codes on the host page
- [ ] Real-time shared timer via Supabase
