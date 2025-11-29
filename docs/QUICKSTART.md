# 🚀 Quick Deployment Guide - BriberyBuster.xyz

## 5-Minute Production Deployment

### Prerequisites
- GitHub account
- Vercel account (free)
- Railway/Render account (free tier)
- Solana wallet with ~2 SOL (devnet: free airdrop)

---

## Step 1: Deploy Smart Contract (5 min)

### A. Setup Solana Wallet

```bash
# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Generate keypair
solana-keygen new --outfile ~/.config/solana/id.json

# Set to devnet
solana config set --url devnet

# Airdrop SOL
solana airdrop 2
solana balance  # Should show ~2 SOL
```

### B. Deploy Anchor Program

```bash
cd anchor

# Install dependencies
npm install

# Build program
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Save Program ID
solana address -k target/deploy/bribery_buster-keypair.json
# Example: Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS
```

✅ **Smart Contract deployed!** Note your Program ID.

---

## Step 2: Create CORRUPT Token (2 min)

```bash
cd ../scripts

# Install dependencies
npm install

# Create token
ts-node create-token.ts

# Save output:
# CORRUPT_TOKEN_MINT=<mint_address>
# TREASURY_TOKEN_ACCOUNT=<account_address>
```

✅ **Token created!** Save mint address.

---

## Step 3: Deploy Database (3 min)

### Option A: Railway (Recommended)

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy PostgreSQL"**
4. Copy **DATABASE_URL** from variables tab

### Option B: Render

1. Go to [render.com](https://render.com)
2. **New** → **PostgreSQL**
3. Copy **Internal Database URL**

✅ **Database ready!** Save DATABASE_URL.

---

## Step 4: Deploy Backend (5 min)

### Option A: Railway

```bash
cd backend

# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize
railway init

# Add environment variables
railway variables set DATABASE_URL="postgresql://..."
railway variables set SOLANA_RPC_URL="https://api.devnet.solana.com"
railway variables set PROGRAM_ID="<your_program_id>"
railway variables set JWT_SECRET="$(openssl rand -base64 32)"
railway variables set CORS_ORIGIN="https://your-app.vercel.app"

# Deploy
railway up

# Run migrations
railway run npx prisma migrate deploy
```

### Option B: Render

1. Connect GitHub repo
2. Select **backend** folder
3. Add environment variables in dashboard
4. Build command: `npm install && npx prisma generate`
5. Start command: `npm start`

✅ **Backend deployed!** Note API URL (e.g., `https://api-xxx.railway.app`)

---

## Step 5: Deploy Frontend (2 min)

### Vercel (Recommended)

```bash
cd frontend

# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables
vercel env add NEXT_PUBLIC_API_URL production
# Enter: https://api-xxx.railway.app

vercel env add NEXT_PUBLIC_SOLANA_NETWORK production
# Enter: devnet

vercel env add NEXT_PUBLIC_PROGRAM_ID production
# Enter: <your_program_id>

# Deploy to production
vercel --prod
```

### Alternative: Netlify

1. Connect GitHub repo
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables

✅ **Frontend deployed!** Your dApp is live!

---

## Step 6: Verify Deployment

### Test Smart Contract

```bash
# Check on Solana Explorer
https://explorer.solana.com/address/<program_id>?cluster=devnet
```

### Test Backend

```bash
curl https://api-xxx.railway.app/health
# Should return: {"status":"ok"}
```

### Test Frontend

1. Visit your Vercel URL
2. Connect wallet (Phantom)
3. Submit test report
4. Check map for marker

✅ **All systems operational!**

---

## Production URLs

Save these for your records:

```
Frontend: https://briberybuster-xyz.vercel.app
Backend API: https://api-xxx.railway.app
Solana Program: <program_id> (devnet)
CORRUPT Token: <mint_address>
```

---

## Next Steps

### 1. Custom Domain (Optional)

**Vercel:**
```bash
vercel domains add briberybuster.xyz
```

**Railway:**
- Settings → Domains → Add custom domain

### 2. Initialize Treasury

```bash
cd anchor
anchor run initialize-treasury
```

### 3. Create Admin Account

```bash
cd backend
npm run create-admin
# Follow prompts
```

### 4. Monitor

- **Frontend:** Vercel Analytics
- **Backend:** Railway Logs
- **Blockchain:** Solana Explorer

---

## Troubleshooting

### Backend can't connect to database
```bash
# Verify DATABASE_URL format
postgresql://user:pass@host:5432/database

# Test connection
cd backend
npx prisma db push
```

### Frontend 500 error
```bash
# Check API URL is correct
vercel env ls

# Rebuild
vercel --prod --force
```

### Anchor deployment failed
```bash
# Check balance
solana balance

# If low, airdrop more
solana airdrop 2

# Try again
anchor deploy --provider.cluster devnet
```

---

## Cost Breakdown

| Service | Free Tier | Paid |
|---------|-----------|------|
| Vercel | ✅ Unlimited | $20/mo |
| Railway | ✅ $5 credit | $5/mo |
| Solana Devnet | ✅ Free | N/A |
| **Total** | **$0/mo** | **$25/mo** |

---

## GitHub Actions Auto-Deploy

Setup automatic deployment on every push:

### 1. Add GitHub Secrets

```
Settings → Secrets → Actions → New repository secret
```

Add:
- `SOLANA_DEPLOYER_KEY` - Your keypair JSON
- `RAILWAY_TOKEN` - Railway API token
- `VERCEL_TOKEN` - Vercel API token

### 2. Push to Main

```bash
git push origin main
```

✅ GitHub Actions will auto-deploy everything!

---

## Support

- **Issues:** [GitHub Issues](https://github.com/grudazgc/briberybuster-xyz/issues)
- **Email:** wojciech.krzeszowski@gmail.com
- **Docs:** [Full Deployment Guide](./DEPLOYMENT.md)

---

## Summary Checklist

- [ ] Solana wallet created
- [ ] Anchor program deployed
- [ ] CORRUPT token created
- [ ] Database provisioned (Railway/Render)
- [ ] Backend deployed with env vars
- [ ] Frontend deployed on Vercel
- [ ] All URLs tested and working
- [ ] Custom domain configured (optional)
- [ ] GitHub Actions enabled (optional)

**🎉 Congratulations! BriberyBuster.xyz is live!**
