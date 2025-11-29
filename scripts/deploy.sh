#!/bin/bash
set -e

echo "🚀 BriberyBuster.xyz - Deployment Script"
echo "==========================================="
echo ""

# Check required commands
for cmd in anchor solana node npm; do
  if ! command -v $cmd &> /dev/null; then
    echo "❌ Error: $cmd is not installed"
    exit 1
  fi
done

# Get network from argument (default: devnet)
NETWORK=${1:-devnet}

if [[ "$NETWORK" != "devnet" && "$NETWORK" != "mainnet" ]]; then
  echo "❌ Invalid network: $NETWORK"
  echo "Usage: ./deploy.sh [devnet|mainnet]"
  exit 1
fi

echo "Network: $NETWORK"
echo ""

# Check Solana balance
echo "Checking Solana balance..."
BALANCE=$(solana balance --url $NETWORK | awk '{print $1}')
echo "Balance: $BALANCE SOL"

if (( $(echo "$BALANCE < 2" | bc -l) )); then
  echo "⚠️ Warning: Low balance. You may need more SOL."
  if [[ "$NETWORK" == "devnet" ]]; then
    echo "Run: solana airdrop 2 --url devnet"
  fi
fi

echo ""

# Build Anchor program
echo "🔨 Building Anchor program..."
cd anchor
anchor build
echo "✅ Build complete"
echo ""

# Deploy to cluster
echo "🚀 Deploying to $NETWORK..."
anchor deploy --provider.cluster $NETWORK
echo "✅ Deployment complete"
echo ""

# Get program ID
PROGRAM_ID=$(solana address -k target/deploy/bribery_buster-keypair.json)
echo "🆔 Program ID: $PROGRAM_ID"
echo ""

# Update Anchor.toml
echo "📝 Updating Anchor.toml..."
sed -i.bak "s/bribery_buster = \".*\"/bribery_buster = \"$PROGRAM_ID\"/g" Anchor.toml
rm Anchor.toml.bak
echo "✅ Anchor.toml updated"
echo ""

cd ..

# Update backend .env
if [ -f backend/.env ]; then
  echo "📝 Updating backend/.env..."
  sed -i.bak "s/PROGRAM_ID=.*/PROGRAM_ID=$PROGRAM_ID/g" backend/.env
  rm backend/.env.bak
  echo "✅ Backend .env updated"
else
  echo "⚠️ backend/.env not found - skipping"
fi

echo ""

# Update frontend .env.local
if [ -f frontend/.env.local ]; then
  echo "📝 Updating frontend/.env.local..."
  sed -i.bak "s/NEXT_PUBLIC_PROGRAM_ID=.*/NEXT_PUBLIC_PROGRAM_ID=$PROGRAM_ID/g" frontend/.env.local
  rm frontend/.env.local.bak
  echo "✅ Frontend .env.local updated"
else
  echo "⚠️ frontend/.env.local not found - skipping"
fi

echo ""
echo "✅ Deployment successful!"
echo ""
echo "Next steps:"
echo "1. Initialize treasury: anchor run initialize-treasury"
echo "2. Create CORRUPT token: npm run create-token"
echo "3. Start backend: cd backend && npm run dev"
echo "4. Start frontend: cd frontend && npm run dev"
echo ""
echo "Explore on Solana Explorer:"
echo "https://explorer.solana.com/address/$PROGRAM_ID?cluster=$NETWORK"
