import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { WalletProvider } from '@/components/WalletProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BriberyBuster.xyz - Decentralized Corruption Reporting',
  description: 'Anonymous corruption reporting platform on Solana blockchain with CORRUPT token rewards',
  keywords: ['blockchain', 'solana', 'corruption', 'reporting', 'web3', 'anonymous'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
