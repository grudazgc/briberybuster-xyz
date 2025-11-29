# 🚨 BriberyBuster.xyz

> Zdecentralizowana platforma zgłaszania korupcji na blockchainie Solana

[![Solana](https://img.shields.io/badge/Solana-Blockchain-blue)](https://solana.com)
[![Anchor](https://img.shields.io/badge/Anchor-Framework-orange)](https://www.anchor-lang.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 Przegląd

BriberyBuster.xyz to globalna, zdecentralizowana aplikacja Web3 umożliwiająca **anonimowe zgłaszanie przypadków korupcji** z systemem nagród w tokenach **CORRUPT**. Każde zgłoszenie jest zapisywane na blockchainie Solana, zapewniając niezmienność i transparentność danych.

### 🎯 Kluczowe Funkcjonalności

- 🔒 **Anonimowe zgłaszanie** - użytkownicy nie ujawniają tożsamości (tylko adres portfela)
- 💰 **System nagród** - 100 tokenów CORRUPT za każde zweryfikowane zgłoszenie
- ⛓️ **Trwałość blockchain** - hash każdego zgłoszenia na Solana
- 🗺️ **Globalna mapa** - interaktywna wizualizacja z Leaflet.js
- 👤 **User Dashboard** - historia zgłoszeń i saldo tokenów
- 🛡️ **Admin Panel** - weryfikacja zgłoszeń z autoryzacją JWT
- 🌍 **Wielojęzyczność** - wsparcie i18n (EN, PL, ES)
- 🔐 **Rate Limiting** - ochrona API przed nadużyciami

## 🛠️ Stack Technologiczny

### Blockchain
- **Solana** - Layer 1 blockchain
- **Anchor Framework** - Rust smart contracts
- **SPL Token** - CORRUPT token standard

### Backend
- **Node.js** + **Express** - REST API
- **TypeScript** - type safety
- **PostgreSQL** - relacyjna baza danych
- **Prisma ORM** - database abstraction
- **JWT** - autoryzacja admin

### Frontend
- **Next.js 14** - React framework
- **Tailwind CSS** - styling
- **Solana Wallet Adapter** - integracja portfeli
- **Leaflet.js** - interaktywne mapy
- **i18next** - internationalization

## 📁 Struktura Projektu

```
briberybuster-xyz/
├── anchor/              # Smart Contract (Solana Program)
│   ├── programs/
│   │   └── bribery_buster/
│   ├── tests/
│   └── Anchor.toml
├── backend/             # Node.js API Server
│   ├── src/
│   ├── prisma/
│   └── package.json
├── frontend/            # Next.js Application
│   ├── app/
│   ├── components/
│   └── package.json
├── scripts/             # Deployment Scripts
└── docs/                # Documentation
```

## 🚀 Szybki Start

### Wymagania

- Node.js 18+
- Rust 1.70+
- Solana CLI 1.18+
- Anchor CLI 0.29+
- PostgreSQL 14+

### 1. Instalacja Anchor Program

```bash
cd anchor
anchor build
anchor test
anchor deploy --provider.cluster devnet
```

### 2. Konfiguracja Backendu

```bash
cd backend
cp .env.example .env
# Edytuj .env - ustaw DATABASE_URL, SOLANA_RPC_URL, PROGRAM_ID
npm install
npx prisma migrate dev
npm run dev
```

### 3. Konfiguracja Frontendu

```bash
cd frontend
cp .env.local.example .env.local
# Edytuj .env.local - ustaw NEXT_PUBLIC_API_URL
npm install
npm run dev
```

## 🔄 Workflow Aplikacji

1. **Połączenie portfela** - użytkownik łączy Phantom/Solflare
2. **Wypełnienie formularza** - opis, lokalizacja, kategoria
3. **Wysłanie do API** - `POST /api/report`
4. **Walidacja & hash** - SHA-256, zapis w PostgreSQL
5. **Zapis on-chain** - wywołanie `submit_report` w smart contract
6. **Weryfikacja admin** - moderacja w panelu
7. **Wypłata nagrody** - 100 CORRUPT z treasury PDA
8. **Aktualizacja mapy** - nowe zgłoszenie na Leaflet

## 🔐 Bezpieczeństwo

- **PDA Treasury** - tokeny w Program Derived Address
- **Rate Limiting** - max 10 zgłoszeń/godzinę/IP
- **JWT Admin** - autoryzacja panelu admina
- **Input Validation** - walidacja wszystkich danych
- **Hash Verification** - SHA-256 dla integralności
- **CORS Policy** - restrykcje cross-origin

## 🧪 Testowanie

```bash
# Smart contract tests
cd anchor && anchor test

# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm run test
```

## 📚 Dokumentacja

- [Architecture](docs/ARCHITECTURE.md)
- [API Documentation](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Security](docs/SECURITY.md)

## 🗺️ Roadmap

### ✅ Faza 1: MVP (Aktualna)
- [x] Smart contract z treasury PDA
- [x] Backend API z PostgreSQL
- [x] Frontend Next.js z Leaflet
- [x] Admin panel z JWT
- [x] Rate limiting i i18n

### 🚧 Faza 2: Rozszerzenia
- [ ] Stake-based voting weryfikacja
- [ ] Email/push notifications
- [ ] Geokodowanie (adresy → GPS)
- [ ] Upload zdjęć dowodów

### 🔮 Faza 3: Skalowanie
- [ ] Mobile app (React Native)
- [ ] Mainnet deployment
- [ ] DAO governance
- [ ] Token exchange listing

## 🤝 Contributing

Wkład w projekt jest mile widziany! Zobacz [CONTRIBUTING.md](CONTRIBUTING.md) dla szczegółów.

## 📄 Licencja

MIT License - zobacz [LICENSE](LICENSE) dla szczegółów.

## 👥 Autor

**Wojciech Krzeszowski**
- GitHub: [@grudazgc](https://github.com/grudazgc)
- Email: wojciech.krzeszowski@gmail.com

## 🔗 Linki

- [Website](https://briberybuster.xyz) (coming soon)
- [Documentation](docs/)
- [Solana Program](https://explorer.solana.com/) (devnet)

---

**⚠️ Uwaga:** Projekt jest w fazie rozwoju. Nie używaj na Mainnet bez dokładnych testów.