# Architecture - BriberyBuster.xyz

## System Overview

BriberyBuster.xyz is a decentralized application (dApp) built on Solana blockchain for anonymous corruption reporting with token-based rewards.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Frontend (Next.js)                     │
│  ┌────────────┐  ┌──────────┐  ┌─────────┐  ┌────────────┐│
│  │  Homepage  │  │  Report  │  │   Map   │  │ Dashboard  ││
│  │            │  │   Form   │  │ Leaflet │  │  + Admin   ││
│  └────────────┘  └──────────┘  └─────────┘  └────────────┘│
│         │              │              │             │       │
│         └──────────────┴──────────────┴─────────────┘       │
│                           │                                  │
│                    Wallet Adapter                            │
│                  (Phantom/Solflare)                          │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
         ▼                               ▼
┌─────────────────┐            ┌──────────────────┐
│  Backend API    │            │  Solana Blockchain│
│  (Express.js)   │            │                   │
│  ┌───────────┐  │            │  ┌─────────────┐ │
│  │Controllers│  │            │  │   Program   │ │
│  │           │  │            │  │  (Anchor)   │ │
│  │ Services  │  │◄───────────┼──┤             │ │
│  │           │  │            │  │  Treasury   │ │
│  │Middleware │  │            │  │    PDA      │ │
│  └───────────┘  │            │  └─────────────┘ │
│        │        │            │         │         │
│        ▼        │            │         ▼         │
│  ┌──────────┐  │            │  ┌─────────────┐ │
│  │PostgreSQL│  │            │  │ SPL Tokens  │ │
│  │ (Prisma) │  │            │  │  (CORRUPT)  │ │
│  └──────────┘  │            │  └─────────────┘ │
└─────────────────┘            └──────────────────┘
```

## Components

### 1. Frontend (Next.js 14)

**Technology:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Solana Wallet Adapter
- Leaflet.js

**Key Features:**
- Server-side rendering (SSR)
- Client-side wallet integration
- Interactive map visualization
- Multi-language support (i18n)
- Responsive design

**Pages:**
- `/` - Homepage with hero section
- `/report` - Report submission form
- `/map` - Interactive world map
- `/dashboard` - User reports & balance
- `/admin` - Admin verification panel

### 2. Backend API (Node.js)

**Technology:**
- Node.js 18+
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Solana Web3.js
- Anchor Client

**Architecture Pattern:** Layered Architecture

```
Routes → Controllers → Services → Database/Blockchain
```

**API Endpoints:**

```typescript
// Reports
POST   /api/reports          - Submit new report
GET    /api/reports          - List reports (paginated)
GET    /api/reports/:id      - Get report details

// Admin
POST   /api/admin/login      - Admin authentication
PUT    /api/admin/reports/:id/verify - Verify report
GET    /api/admin/stats      - Platform statistics

// Health
GET    /health               - Health check
```

**Middleware:**
- Rate limiting (express-rate-limit)
- CORS
- Helmet (security headers)
- JWT authentication
- Error handling
- Request logging

### 3. Smart Contract (Solana/Anchor)

**Technology:**
- Rust
- Anchor Framework 0.29+
- Solana 1.18+

**Program Instructions:**

```rust
// Initialize treasury PDA
pub fn initialize(ctx: Context<Initialize>) -> Result<()>

// Submit corruption report hash
pub fn submit_report(
    ctx: Context<SubmitReport>,
    report_hash: [u8; 32]
) -> Result<()>

// Reward user with CORRUPT tokens
pub fn reward_user(
    ctx: Context<RewardUser>,
    amount: u64
) -> Result<()>
```

**Accounts:**

```rust
// Treasury PDA - holds program state
pub struct Treasury {
    pub authority: Pubkey,
    pub bump: u8,
    pub total_reports: u64,
    pub total_rewards_distributed: u64,
}

// Report - stores report hash on-chain
pub struct Report {
    pub reporter: Pubkey,
    pub hash: [u8; 32],
    pub timestamp: i64,
    pub verified: bool,
}
```

**PDA Derivation:**
```
Treasury PDA = ["treasury", authority.pubkey]
```

### 4. Database (PostgreSQL)

**Schema (Prisma):**

```prisma
model Report {
  id            String   @id @default(cuid())
  description   String
  latitude      Float
  longitude     Float
  category      Category
  walletAddress String
  hash          String   @unique
  status        Status   @default(PENDING)
  evidenceUrls  String[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

enum Category {
  BRIBERY
  EMBEZZLEMENT
  FRAUD
  NEPOTISM
  ABUSE_OF_POWER
  OTHER
}

enum Status {
  PENDING
  VERIFIED
  REJECTED
}

model Admin {
  id        String   @id
  username  String   @unique
  password  String
  email     String   @unique
  role      Role
  createdAt DateTime @default(now())
}
```

## Data Flow

### Report Submission Flow

1. **User connects wallet** (Phantom/Solflare)
2. **Fills report form** (description, location, category)
3. **Frontend sends to backend** (`POST /api/reports`)
4. **Backend validates data**
5. **Backend computes SHA-256 hash** of report
6. **Backend saves to PostgreSQL** (status: PENDING)
7. **Backend calls Anchor program** `submit_report()`
8. **Smart contract saves hash on-chain**
9. **Backend returns success to frontend**
10. **Map updates with new marker**

### Reward Distribution Flow

1. **Admin reviews report** in admin panel
2. **Admin clicks "Verify"**
3. **Backend updates status** to VERIFIED
4. **Backend calls Anchor program** `reward_user(100 CORRUPT)`
5. **Smart contract transfers tokens** from treasury PDA
6. **Tokens arrive in user's wallet**
7. **User sees balance update** in dashboard

## Security

### Frontend
- Client-side wallet integration (no private keys on server)
- Environment variables for configuration
- HTTPS only in production

### Backend
- Rate limiting (10 reports/hour per IP)
- JWT for admin authentication
- Input validation with Zod
- SQL injection prevention (Prisma)
- CORS restrictions
- Helmet security headers

### Smart Contract
- PDA for treasury (program-controlled)
- Authority checks
- Integer overflow protection
- Anchor framework security

### Database
- Encrypted connections
- Regular backups
- Access control

## Scalability

### Current Capacity
- Backend: ~1000 requests/minute
- Smart Contract: ~1000 TPS (Solana)
- Database: ~10K concurrent connections

### Optimization Strategies
- Caching (Redis for frequently accessed data)
- CDN for static assets (Vercel Edge)
- Database indexing on walletAddress, status, createdAt
- Pagination for all list endpoints

### Future Improvements
- Horizontal scaling with load balancer
- Read replicas for PostgreSQL
- IPFS for evidence storage
- GraphQL for flexible queries

## Monitoring

- **Backend Logs:** Winston + PM2
- **Solana Explorer:** Transaction monitoring
- **Database:** Prisma Studio
- **Uptime:** Vercel Analytics
- **Errors:** Sentry (optional)

## Technology Stack Summary

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React, TypeScript, Tailwind |
| Backend | Node.js, Express, Prisma, PostgreSQL |
| Blockchain | Solana, Anchor, Rust |
| DevOps | Docker, PM2, Vercel, GitHub Actions |
| Testing | Jest, Mocha, Anchor Test |

## Development Workflow

```bash
# Local Development
1. Start PostgreSQL (docker-compose)
2. Run backend (npm run dev)
3. Run frontend (npm run dev)
4. Test Anchor (anchor test)

# Testing
- Backend: npm test
- Frontend: npm test
- Anchor: anchor test

# Deployment
- Smart Contract: anchor deploy
- Backend: PM2 on VPS
- Frontend: Vercel
```

## Links

- [GitHub Repository](https://github.com/grudazgc/briberybuster-xyz)
- [Deployment Guide](./DEPLOYMENT.md)
- [Contributing Guide](../CONTRIBUTING.md)
