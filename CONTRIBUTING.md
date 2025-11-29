# Contributing to BriberyBuster.xyz

Thank you for your interest in contributing to BriberyBuster.xyz!

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Rust 1.70+
- Solana CLI 1.18+
- Anchor CLI 0.29+
- PostgreSQL 14+
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/grudazgc/briberybuster-xyz.git
cd briberybuster-xyz
```

2. **Install dependencies**
```bash
make install
# or manually:
cd anchor && npm install
cd ../backend && npm install
cd ../frontend && npm install
```

3. **Setup environment variables**
```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your configuration

# Frontend
cd ../frontend
cp .env.local.example .env.local
# Edit .env.local with your configuration
```

4. **Start PostgreSQL**
```bash
docker-compose up -d
```

5. **Run database migrations**
```bash
cd backend
npx prisma migrate dev
```

## 📝 Development Workflow

### Anchor Smart Contract

```bash
cd anchor
anchor build
anchor test
anchor deploy --provider.cluster devnet
```

### Backend API

```bash
cd backend
npm run dev
```

### Frontend

```bash
cd frontend
npm run dev
```

## 🧪 Testing

```bash
make test
# or manually:
cd anchor && anchor test
cd backend && npm test
cd frontend && npm test
```

## 📂 Project Structure

```
briberybuster-xyz/
├── anchor/              # Solana smart contract
│   ├── programs/
│   │   └── bribery_buster/
│   │       ├── src/
│   │       │   ├── lib.rs
│   │       │   ├── state.rs
│   │       │   └── errors.rs
│   │       └── Cargo.toml
│   ├── tests/
│   └── Anchor.toml
│
├── backend/             # Node.js API
│   ├── src/
│   │   ├── index.ts
│   │   ├── config/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   └── middleware/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/            # Next.js app
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── locales/
│   ├── package.json
│   └── next.config.js
│
└── scripts/             # Deployment scripts
```

## 🔧 Adding New Features

### Smart Contract Changes

1. Modify `anchor/programs/bribery_buster/src/lib.rs`
2. Update state in `state.rs` if needed
3. Add tests in `anchor/tests/`
4. Run `anchor test`
5. Deploy to devnet: `anchor deploy`

### Backend API Changes

1. Add new routes in `backend/src/routes/`
2. Create controllers in `backend/src/controllers/`
3. Add business logic in `backend/src/services/`
4. Update Prisma schema if needed
5. Write tests in `backend/tests/`

### Frontend Changes

1. Add components in `frontend/components/`
2. Create pages in `frontend/app/`
3. Add hooks in `frontend/hooks/`
4. Update translations in `frontend/locales/`

## 📋 Code Style

- **TypeScript**: Follow ESLint rules
- **Rust**: Follow `rustfmt` conventions
- **Commits**: Use conventional commits (feat:, fix:, docs:, etc.)

## 🐛 Reporting Bugs

Please open an issue with:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment details

## 💡 Feature Requests

Open an issue with:
- Use case description
- Proposed solution
- Alternative solutions considered

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.
