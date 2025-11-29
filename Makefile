.PHONY: help install build test deploy clean docker-up docker-down

help:
	@echo "BriberyBuster.xyz - Development Commands"
	@echo ""
	@echo "Available targets:"
	@echo "  install      - Install all dependencies"
	@echo "  build        - Build all components"
	@echo "  test         - Run all tests"
	@echo "  deploy       - Deploy to devnet"
	@echo "  clean        - Clean build artifacts"
	@echo "  docker-up    - Start Docker services"
	@echo "  docker-down  - Stop Docker services"

install:
	@echo "Installing Anchor dependencies..."
	cd anchor && npm install
	@echo "Installing Backend dependencies..."
	cd backend && npm install
	@echo "Installing Frontend dependencies..."
	cd frontend && npm install

build:
	@echo "Building Anchor program..."
	cd anchor && anchor build
	@echo "Building Backend..."
	cd backend && npm run build
	@echo "Building Frontend..."
	cd frontend && npm run build

test:
	@echo "Testing Anchor program..."
	cd anchor && anchor test
	@echo "Testing Backend..."
	cd backend && npm test
	@echo "Testing Frontend..."
	cd frontend && npm test

deploy:
	@echo "Deploying Anchor program to devnet..."
	cd anchor && anchor deploy --provider.cluster devnet

clean:
	@echo "Cleaning build artifacts..."
	find . -name "node_modules" -type d -prune -exec rm -rf {} +
	find . -name "target" -type d -prune -exec rm -rf {} +
	find . -name ".next" -type d -prune -exec rm -rf {} +

docker-up:
	@echo "Starting Docker services..."
	docker-compose up -d

docker-down:
	@echo "Stopping Docker services..."
	docker-compose down

dev-backend:
	cd backend && npm run dev

dev-frontend:
	cd frontend && npm run dev
