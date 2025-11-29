import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { createMint, getMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import * as fs from 'fs';
import * as path from 'path';

const TOTAL_SUPPLY = 1_000_000_000; // 1 billion tokens
const DECIMALS = 9;

async function main() {
  console.log('🪙 Creating CORRUPT token on Solana...');

  // Connect to devnet
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

  // Load payer keypair
  const keypairPath = process.env.SOLANA_KEYPAIR_PATH || path.join(process.env.HOME!, '.config/solana/id.json');
  const secretKey = JSON.parse(fs.readFileSync(keypairPath, 'utf-8'));
  const payer = Keypair.fromSecretKey(Uint8Array.from(secretKey));

  console.log('Payer address:', payer.publicKey.toString());

  // Check balance
  const balance = await connection.getBalance(payer.publicKey);
  console.log('Balance:', balance / 1e9, 'SOL');

  if (balance < 0.1 * 1e9) {
    console.error('❌ Insufficient balance. Please airdrop some SOL first:');
    console.log(`solana airdrop 2 ${payer.publicKey.toString()} --url devnet`);
    process.exit(1);
  }

  // Create token mint
  console.log('\nCreating token mint...');
  const mint = await createMint(
    connection,
    payer,
    payer.publicKey, // mint authority
    payer.publicKey, // freeze authority
    DECIMALS
  );

  console.log('✅ Token mint created:', mint.toString());

  // Get mint info
  const mintInfo = await getMint(connection, mint);
  console.log('Decimals:', mintInfo.decimals);
  console.log('Supply:', mintInfo.supply.toString());

  // Create associated token account
  console.log('\nCreating treasury token account...');
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer.publicKey
  );

  console.log('✅ Token account created:', tokenAccount.address.toString());

  // Mint initial supply
  console.log('\nMinting initial supply...');
  const mintTx = await mintTo(
    connection,
    payer,
    mint,
    tokenAccount.address,
    payer.publicKey,
    TOTAL_SUPPLY * 10 ** DECIMALS
  );

  console.log('✅ Minted', TOTAL_SUPPLY.toLocaleString(), 'CORRUPT tokens');
  console.log('Transaction signature:', mintTx);

  // Save to .env format
  console.log('\n📝 Add these to your .env file:');
  console.log(`CORRUPT_TOKEN_MINT=${mint.toString()}`);
  console.log(`TREASURY_TOKEN_ACCOUNT=${tokenAccount.address.toString()}`);

  // Save to JSON
  const config = {
    mint: mint.toString(),
    treasuryTokenAccount: tokenAccount.address.toString(),
    decimals: DECIMALS,
    totalSupply: TOTAL_SUPPLY,
    network: 'devnet',
    createdAt: new Date().toISOString(),
  };

  fs.writeFileSync('token-config.json', JSON.stringify(config, null, 2));
  console.log('\n✅ Configuration saved to token-config.json');
}

main().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
