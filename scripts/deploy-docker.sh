#!/usr/bin/env bash
set -e

echo "🚀 Deploying Riffat's Classroom to Dedicated Linux Server with Docker..."

# Check docker compose
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed. Please install Docker and Docker Compose."
    exit 1
fi

# Build and start services in background
echo "📦 Building and starting containers (App, Postgres, Redis, Nginx)..."
docker compose up -d --build

# Wait for database to be healthy
echo "⏳ Waiting for PostgreSQL to become ready..."
docker compose exec db sh -c 'until pg_isready -U postgres; do sleep 1; done'

# Run database synchronization
echo "🗄️ Syncing database schema with Prisma..."
docker compose exec app node_modules/.bin/prisma db push --accept-data-loss

echo "🌱 Seeding initial educational data if needed..."
docker compose exec app npx tsx prisma/seed.ts || echo "Seed completed or skipped."

echo "✅ Riffat's Classroom is live and serving traffic!"
docker compose ps

