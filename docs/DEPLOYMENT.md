# Deployment Guide - BriberyBuster.xyz

Complete guide for deploying BriberyBuster.xyz to Solana devnet and mainnet.

## Prerequisites

- Solana CLI 1.18+
- Anchor CLI 0.29+
- Node.js 18+
- PostgreSQL 14+
- At least 5 SOL for devnet (airdrop) or mainnet (purchase)

## 1. Solana Wallet Setup

```bash
# Generate new keypair
solana-keygen new --outfile ~/.config/solana/id.json

# Check address
solana address

# For devnet - airdrop SOL
solana airdrop 2 --url devnet
```

## 2. Deploy Anchor Program

### Devnet

```bash
cd anchor

# Build program
anchor build

# Run tests
anchor test

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Save program ID
solana address -k target/deploy/bribery_buster-keypair.json
```

### Mainnet

```bash
# Set Solana to mainnet
solana config set --url mainnet-beta

# Check balance (need ~2-5 SOL)
solana balance

# Deploy
anchor deploy --provider.cluster mainnet
```

## 3. Create CORRUPT Token

```bash
cd scripts

# Install dependencies
npm install

# Create token
npm run create-token

# Save output:
# CORRUPT_TOKEN_MINT=<mint_address>
# TREASURY_TOKEN_ACCOUNT=<account_address>
```

## 4. Initialize Treasury

```bash
# In anchor directory
anchor run initialize-treasury

# This creates the treasury PDA and associates it with your authority
```

## 5. Deploy Backend

### Environment Variables

Create `backend/.env`:

```env
PORT=3001
NODE_ENV=production

DATABASE_URL="postgresql://user:pass@host:5432/briberybuster"

SOLANA_RPC_URL="https://api.mainnet-beta.solana.com"
SOLANA_NETWORK="mainnet"
PROGRAM_ID="<your_program_id>"
TREASURY_AUTHORITY_KEYPAIR="/path/to/keypair.json"
CORRUPT_TOKEN_MINT="<your_mint_address>"

JWT_SECRET="<random_secret>"
JWT_EXPIRES_IN="24h"

CORS_ORIGIN="https://briberybuster.xyz"
```

### Database Setup

```bash
cd backend

# Install dependencies
npm install

# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

### Start Backend

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

### Deploy to VPS (Digital Ocean, AWS, etc.)

```bash
# Using PM2
npm install -g pm2
pm2 start dist/index.js --name briberybuster-api
pm2 save
pm2 startup
```

## 6. Deploy Frontend

### Environment Variables

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL="https://api.briberybuster.xyz"
NEXT_PUBLIC_SOLANA_NETWORK="mainnet-beta"
NEXT_PUBLIC_PROGRAM_ID="<your_program_id>"
```

### Build and Deploy

```bash
cd frontend

# Install dependencies
npm install

# Build
npm run build

# Test production build locally
npm start
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Or connect GitHub repo in Vercel dashboard
```

## 7. Verification

### Test Smart Contract

```bash
# Submit test report
anchor run submit-test-report

# Check on Solana Explorer
https://explorer.solana.com/address/<program_id>?cluster=mainnet
```

### Test Backend

```bash
curl https://api.briberybuster.xyz/health
```

### Test Frontend

Visit `https://briberybuster.xyz` and:
1. Connect wallet
2. Submit test report
3. Check dashboard
4. Verify map loads

## 8. Monitoring

### Backend Logs

```bash
# PM2
pm2 logs briberybuster-api

# Docker
docker logs -f briberybuster-backend
```

### Solana Program

Monitor on [Solana Explorer](https://explorer.solana.com/)

### Database

```bash
# Connect to Prisma Studio
npx prisma studio
```

## Troubleshooting

### Insufficient Balance

```bash
solana balance
# For mainnet, purchase SOL from exchange
# For devnet: solana airdrop 2
```

### Program Deployment Failed

```bash
# Clean and rebuild
anchor clean
anchor build

# Check program size
ls -lh target/deploy/*.so
```

### Backend Can't Connect to Solana

- Check RPC URL in `.env`
- Verify program ID matches deployed program
- Ensure keypair file exists and is readable

### Frontend Wallet Issues

- Check network matches (devnet vs mainnet)
- Verify wallet extension is installed
- Clear browser cache

## Production Checklist

- [ ] Anchor program deployed to mainnet
- [ ] CORRUPT token created and funded
- [ ] Treasury initialized
- [ ] Backend deployed with SSL
- [ ] Frontend deployed to Vercel/Netlify
- [ ] Database backups configured
- [ ] Monitoring set up (PM2, Sentry, etc.)
- [ ] Domain DNS configured
- [ ] Rate limiting enabled
- [ ] Admin accounts created
- [ ] Security audit completed

## Maintenance

### Update Smart Contract

```bash
# Build new version
anchor build

# Upgrade program (requires upgrade authority)
anchor upgrade <program_id> target/deploy/bribery_buster.so
```

### Update Backend

```bash
# Pull latest code
git pull origin main

# Install dependencies
npm install

# Run migrations
npx prisma migrate deploy

# Restart
pm2 restart briberybuster-api
```

### Update Frontend

```bash
# Vercel auto-deploys on git push to main
git push origin main

# Or manual deploy
vercel --prod
```

## Support

For deployment issues:
- Check [GitHub Issues](https://github.com/grudazgc/briberybuster-xyz/issues)
- Contact: wojciech.krzeszowski@gmail.com
