import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { AnchorProvider, Program, Wallet } from '@project-serum/anchor';
import { readFileSync } from 'fs';

// Solana connection
export const connection = new Connection(
  process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
  'confirmed'
);

// Program ID
export const PROGRAM_ID = new PublicKey(
  process.env.PROGRAM_ID || 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS'
);

// Load treasury authority keypair
export const getTreasuryAuthority = (): Keypair => {
  const keypairPath = process.env.TREASURY_AUTHORITY_KEYPAIR || '';
  if (!keypairPath) {
    throw new Error('TREASURY_AUTHORITY_KEYPAIR not configured');
  }
  const secretKey = JSON.parse(readFileSync(keypairPath, 'utf-8'));
  return Keypair.fromSecretKey(Uint8Array.from(secretKey));
};

// Anchor Provider
export const getProvider = (): AnchorProvider => {
  const wallet = new Wallet(getTreasuryAuthority());
  return new AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
  });
};

// Get Anchor Program instance
export const getProgram = async (): Promise<Program> => {
  const provider = getProvider();
  const idl = JSON.parse(
    readFileSync('./anchor/target/idl/bribery_buster.json', 'utf-8')
  );
  return new Program(idl, PROGRAM_ID, provider);
};

// Derive Treasury PDA
export const getTreasuryPDA = async (): Promise<[PublicKey, number]> => {
  const authority = getTreasuryAuthority().publicKey;
  return PublicKey.findProgramAddress(
    [Buffer.from('treasury'), authority.toBuffer()],
    PROGRAM_ID
  );
};
