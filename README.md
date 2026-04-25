# SinghDomain - Setup Guide

## Step-by-step setup (bilkul shuru se)

### Step 1: Node.js Install karo
- https://nodejs.org pe jao aur LTS version download karo
- Install ho jaaye toh terminal mein type karo:
  ```
  node -v
  npm -v
  ```
  Dono commands mein version number aana chahiye

### Step 2: Project folder mein files daalo
- Ek folder banao naam `singhdomain`
- Saari download ki hui files us folder mein daalo (exact structure maintain karo)

### Expected folder structure:
```
singhdomain/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── AnnouncementBar.tsx
│   ├── Navbar.tsx
│   ├── HeroSection.tsx
│   ├── SponsoredSection.tsx
│   ├── FeaturesSection.tsx
│   ├── MintSection.tsx
│   └── Footer.tsx
├── public/
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── tsconfig.json
```

### Step 3: Dependencies install karo
Terminal mein project folder ke andar jao:
```bash
cd singhdomain
npm install
```
Wait karo, kuch minutes lagenge.

### Step 4: Development server start karo
```bash
npm run dev
```

### Step 5: Browser mein kholo
Browser mein jao aur type karo:
```
http://localhost:3000
```

Website chal jayegi! 🎉

---

## Build for production (live deploy ke liye)
```bash
npm run build
npm run start
```

## Deploy on Vercel (free hosting)
1. https://vercel.com pe account banao
2. GitHub pe project upload karo
3. Vercel mein "New Project" click karo
4. GitHub repo select karo
5. Deploy kar do - automatic ho jaata hai!
