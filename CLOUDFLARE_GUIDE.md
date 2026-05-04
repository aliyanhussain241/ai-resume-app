# Cloudflare Pages, D1 (SQL), and R2 Deployment Guide

Aapne successfully Cloudflare ki configuration add kar li hai! Jab aap apna code GitHub par push karenge, to in steps ko follow karke D1 aur R2 ko Cloudflare Pages se connect kar sakte hain.

## 1. Cloudflare Dashboard Setup
1. Cloudflare par login karein.
2. **Workers & Pages** > **D1** me jayen aur ek naya database banayen `resubeat-d1` ke naam se.
3. Uska **Database ID** copy karein aur `wrangler.toml` file me `YOUR_D1_DATABASE_ID_HERE` ki jagah paste karein.
4. **Workers & Pages** > **R2** me jayen aur ek bucket banayen `resubeat-r2` ke naam se.

## 2. GitHub se Deploy Karna
1. Apna code GitHub repository me push kar dein.
2. Cloudflare Dashboard me **Workers & Pages** > **Create application** > **Pages** > **Connect to Git** par click karein.
3. Apni GitHub repository select karein.
4. **Build settings:**
   - Framework preset: `Vite` (ya None rakhein)
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Deploy par click kar dein. (First deploy me backend APIs nahi chalengi kyunki abhi Hum Node.js/Express use kar rahay hain).

## 3. Database Tables Banana (D1)
Terminal me (apne local PC par) Cloudflare Wrangler CLI install karein:
```bash
npm install -g wrangler
```
Cloudflare me login karein:
```bash
wrangler login
```
D1 me tables banayen (schema.sql ko Cloudflare par execute karne ke liye):
```bash
wrangler d1 execute resubeat-d1 --file=schema.sql --remote
```

## 4. NEXT STEPS (Important!)
Abhi apka backend `server.ts` me **Express.js** aur Node.js core libraries (`multer`, `pdf-parse`) use kar raha hai. Cloudflare Pages edge runtime par chalta hai, isliye Node.js ki sari cheezain wahan nahi chaltin. 

**GitHub par push karne ke baad aapko API routes ko Cloudflare standard me shift karna hoga:**
1. Aapko apne express routes (e.g. `/api/generate-resume`) ko Cloudflare Pages Functions (`functions/api/generate-resume.ts`) me convert karna hoga.
2. Cloudflare Workers me PDF parse karne ke liye aapko R2 bucket me PDF save karni hogi aur external endpoint ya light-weight parser use karna hoga.
3. CMS Posts fetch karne ke liye aap D1 SQL ko directly call karenge:
   ```ts
   // Example Cloudflare Function: functions/api/posts.ts
   export async function onRequest(context) {
     const { results } = await context.env.DB.prepare("SELECT * FROM posts").all();
     return Response.json(results);
   }
   ```
