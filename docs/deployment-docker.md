# DEDICATED LINUX SERVER DEPLOYMENT GUIDE (DOCKER)

This guide explains how to deploy Riffat's Classroom to any dedicated Linux server (Ubuntu / Debian / CentOS / Rocky Linux / Arch) using **Docker** and **Docker Compose**.

---

## 1. Dedicated Server Stack Architecture
- **App Service:** Next.js standalone container on Node 22 Alpine (non-root `nextjs` user).
- **Database:** PostgreSQL 16 Alpine with healthchecks and persistent named volume `postgres_data`.
- **Cache/Queue:** Redis 7 Alpine with persistent volume `redis_data`.
- **Reverse Proxy:** Nginx Alpine with gzip compression, static asset caching headers, and HTTP/2 readiness.

---

## 2. Server Prerequisites
Install Docker and Docker Compose on your Linux server:
```bash
# Ubuntu / Debian
sudo apt-get update
sudo apt-get install -y docker.io docker-compose-plugin
sudo systemctl enable --now docker
```

---

## 3. Clone Repository & Setup Environment
```bash
# Clone the repository
git clone <your-repo-url> /opt/riffats-classroom
cd /opt/riffats-classroom

# Copy environment configuration
cp .env.example .env

# Edit .env with your domain and secure passwords:
# nano .env
# Set NEXT_PUBLIC_APP_URL="https://yourdomain.com"
# Set POSTGRES_PASSWORD="your-strong-db-password"
# Set AUTH_SECRET="your-32-char-random-secret"
```

---

## 4. One-Command Automated Deployment
Run the automated deployment script:
```bash
./scripts/deploy-docker.sh
```

Or run Docker Compose directly:
```bash
# Build and launch all containers in background
docker compose up -d --build

# Sync database tables
docker compose exec app node_modules/.bin/prisma db push

# Seed initial educational content
docker compose exec app npx tsx prisma/seed.ts
```

---

## 5. Automated Backups (PostgreSQL)
To set up automated nightly database backups on your Linux server, create a cron job:
```bash
sudo crontab -e
```
Add the following line to backup PostgreSQL daily at 2:00 AM:
```cron
0 2 * * * docker exec riffats_db pg_dump -U postgres riffats_classroom > /backup/riffats_db_$(date +\%F).sql
```

---

## 6. SSL / HTTPS Configuration (Let's Encrypt / Certbot)
To add free automated SSL with Certbot:
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```
Certbot will automatically install SSL certificates and configure HTTPS redirects.

