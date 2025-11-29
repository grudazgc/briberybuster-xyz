'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-surface">
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">🚨 BriberyBuster.xyz</h1>
        <WalletMultiButton />
      </nav>

      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6">
          Decentralized Corruption Reporting
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Anonymous, blockchain-verified corruption reports. Get rewarded with CORRUPT tokens for verified submissions.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link
            href="/report"
            className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition"
          >
            Submit Report
          </Link>
          <Link
            href="/map"
            className="border-2 border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition"
          >
            View Map
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-3">🔒 Anonymous</h3>
          <p className="text-gray-600">
            Your identity is protected. Only your wallet address is recorded on-chain.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-3">⛓️ Blockchain Verified</h3>
          <p className="text-gray-600">
            Every report is hashed and stored immutably on Solana blockchain.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-3">💰 Get Rewarded</h3>
          <p className="text-gray-600">
            Earn 100 CORRUPT tokens for each verified corruption report.
          </p>
        </div>
      </section>
    </main>
  );
}
