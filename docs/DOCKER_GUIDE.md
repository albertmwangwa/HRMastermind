# HRMS - Docker Deployment Guide

## Overview

This guide covers running the HRMS application using Docker and Docker Compose for both development and production environments.

## Prerequisites

- Docker Engine 20.10+ ([Install Docker](https://docs.docker.com/get-docker/))
- Docker Compose 2.0+ ([Install Docker Compose](https://docs.docker.com/compose/install/))
- Git (to clone the repository)

### Verify Installation

```bash
docker --version
# Docker version 24.0.0 or higher

docker compose version
# Docker Compose version v2.20.0 or higher
```

---

## Quick Start (Development)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd hrms-project
```

### 2. Start Development Environment

```bash
# Start all services (app + PostgreSQL)
docker compose up

# Or run in detached mode (background)
docker compose up -d
```

This command will:
- Build the development Docker image
- Start PostgreSQL database
- Start the HRMS application with hot reload
- Map port 5000 to your localhost

### 3. Access the Application

Open your browser to: **http://localhost:5000**

### 4. View Logs

```bash
# View all logs
docker compose logs -f

# View app logs only
docker compose logs -f app

# View database logs only
docker compose logs -f db
```

### 5. Stop Services

```bash
# Stop and remove containers
docker compose down

# Stop, remove containers, and delete volumes (clears database)
docker compose down -v
```

---

## Development Environment Details

### File Structure

```
hrms-project/
├── Dockerfile              # Production multi-stage build
├── Dockerfile.dev          # Development build with hot reload
├── docker-compose.yml      # Development configuration
├── docker-compose.prod.yml # Production configuration
├── .dockerignore           # Files to exclude from Docker
└── .env.example            # Environment variables template
```

### Hot Reload

The development setup mounts your source code as volumes, enabling hot reload:

- **Frontend (React)**: Changes to `client/` directory auto-reload via Vite
- **Backend (Express)**: Changes to `server/` directory auto-restart via tsx
- **Shared Types**: Changes to `shared/` directory trigger rebuilds

### Default Credentials

**Development Database:**
- Host: `localhost` (or `db` from within Docker network)
- Port: `5432`
- Database: `hrms_development`
- Username: `postgres`
- Password: `postgres`

**Application:**
- Port: `5000`
- URL: `http://localhost:5000`

### Initialize Database Schema

After first start, initialize the database:

```bash
# Enter the app container
docker compose exec app sh

# Push database schema
npm run db:push

# Exit container
exit
```

Or run it directly:

```bash
docker compose exec app npm run db:push
```

### Creating First Admin User

```bash
# Access PostgreSQL
docker compose exec db psql -U postgres -d hrms_development

# Create admin user (replace email/password)
INSERT INTO users (email, first_name, last_name, password_hash, role)
VALUES (
  'admin@company.com',
  'System',
  'Admin',
  '$2b$10$YourHashedPasswordHere',
  'system_admin'
);

# Exit psql
\q
```

**Better approach:** Create a script and mount it:

```bash
# Create scripts/create-admin.ts (see Quick Start guide)
# Then run:
docker compose exec app npx tsx scripts/create-admin.ts
```

---

## Production Deployment

### 1. Create Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your production values:

```bash
# Database
POSTGRES_USER=hrms_admin
POSTGRES_PASSWORD=your_secure_password_change_this
POSTGRES_DB=hrms_production

# Session Secret (generate with: openssl rand -base64 32)
SESSION_SECRET=your-random-32-character-secret-key-here

# Email Service
RESEND_API_KEY=re_your_actual_resend_api_key
```

### 2. Build Production Images

```bash
docker compose -f docker-compose.prod.yml build
```

This uses multi-stage builds to create optimized images:
- **Frontend**: Built with Vite, bundled into static assets
- **Backend**: Built with esbuild, production dependencies only
- **Total Size**: ~200MB (vs ~1.2GB for development)

### 3. Start Production Services

```bash
docker compose -f docker-compose.prod.yml up -d
```

### 4. Initialize Database

```bash
# Push schema to production database
docker compose -f docker-compose.prod.yml exec app npm run db:push
```

### 5. Health Check

```bash
# Check container status
docker compose -f docker-compose.prod.yml ps

# View logs
docker compose -f docker-compose.prod.yml logs -f app
```

### 6. Access Application

Open your browser to: **http://localhost:5000**

For production, configure a reverse proxy (nginx/Apache) with SSL.

---

## Docker Commands Reference

### Container Management

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# Restart services
docker compose restart

# Restart specific service
docker compose restart app

# View running containers
docker compose ps

# View all containers (including stopped)
docker compose ps -a
```

### Logs & Debugging

```bash
# View logs (all services)
docker compose logs

# Follow logs (real-time)
docker compose logs -f

# View logs for specific service
docker compose logs app
docker compose logs db

# Last 100 lines
docker compose logs --tail=100 app
```

### Execute Commands Inside Containers

```bash
# Open shell in app container
docker compose exec app sh

# Run npm command
docker compose exec app npm run db:push
docker compose exec app npm run check

# Access PostgreSQL
docker compose exec db psql -U postgres -d hrms_development
```

### Database Operations

```bash
# Create database backup
docker compose exec db pg_dump -U postgres hrms_development > backup.sql

# Restore database backup
docker compose exec -T db psql -U postgres -d hrms_development < backup.sql

# Access psql
docker compose exec db psql -U postgres

# List databases
docker compose exec db psql -U postgres -c "\l"

# List tables
docker compose exec db psql -U postgres -d hrms_development -c "\dt"
```

### Image Management

```bash
# Build/rebuild images
docker compose build

# Build without cache
docker compose build --no-cache

# Pull latest images
docker compose pull

# List images
docker images | grep hrms

# Remove unused images
docker image prune

# Remove all unused data
docker system prune -a
```

### Volume Management

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect hrms-project_postgres_data

# Remove volumes (WARNING: deletes database data)
docker compose down -v

# Backup volume
docker run --rm -v hrms-project_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz /data
```

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `POSTGRES_USER` | Database username | `postgres` |
| `POSTGRES_PASSWORD` | Database password | `secure_password` |
| `POSTGRES_DB` | Database name | `hrms_production` |
| `SESSION_SECRET` | Session encryption key (32+ chars) | `openssl rand -base64 32` |
| `RESEND_API_KEY` | Email service API key | `re_abc123...` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Application port | `5000` |
| `NODE_ENV` | Environment mode | `production` |
| `PGHOST` | Database host | `db` |
| `PGPORT` | Database port | `5432` |

### Generating SESSION_SECRET

```bash
# On Linux/macOS
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## Networking

### Docker Network

All services communicate via `hrms-network` bridge network:

- **App**: Accessible at `http://localhost:5000` from host
- **Database**: Accessible at `db:5432` from app container
- **Database**: Accessible at `localhost:5432` from host (for dev tools)

### Connecting to Database from Host

Use connection string:
```
postgresql://postgres:postgres@localhost:5432/hrms_development
```

### Connecting to Database from App Container

Use connection string:
```
postgresql://postgres:postgres@db:5432/hrms_development
```

**Note:** Use service name (`db`) not `localhost` when connecting from within Docker network.

---

## Reverse Proxy Setup (Production)

### Nginx Configuration

Create `/etc/nginx/sites-available/hrms`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Proxy to Docker container
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and restart nginx:

```bash
sudo ln -s /etc/nginx/sites-available/hrms /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is configured automatically
```

---

## Troubleshooting

### Issue: Container Won't Start

```bash
# Check logs
docker compose logs app

# Check if port 5000 is in use
lsof -i :5000

# Kill process using port 5000
kill -9 <PID>
```

### Issue: Database Connection Failed

```bash
# Verify database is running
docker compose ps db

# Check database health
docker compose exec db pg_isready -U postgres

# Verify environment variables
docker compose exec app env | grep -i pg

# Test connection manually
docker compose exec app sh
psql postgresql://postgres:postgres@db:5432/hrms_development
```

### Issue: Changes Not Reflecting

```bash
# Rebuild containers
docker compose up --build

# Clear volumes and rebuild
docker compose down -v
docker compose up --build
```

### Issue: Out of Disk Space

```bash
# Check Docker disk usage
docker system df

# Clean up
docker system prune -a --volumes

# Remove specific volumes
docker volume rm hrms-project_postgres_data
```

### Issue: npm install Fails

```bash
# Build without cache
docker compose build --no-cache

# Or rebuild specific service
docker compose build --no-cache app
```

---

## Performance Optimization

### 1. Multi-Stage Builds

Production Dockerfile uses multi-stage builds:
- **Stage 1 (Builder)**: Installs all dependencies and builds
- **Stage 2 (Production)**: Copies only built files and production dependencies

**Result:** 70-80% smaller image size

### 2. Layer Caching

Optimize build speed by ordering Dockerfile commands:
1. Copy package files (least frequently changed)
2. Run npm install (cached if package.json unchanged)
3. Copy source code (most frequently changed)

### 3. Resource Limits

Add resource limits to `docker-compose.prod.yml`:

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 512M
  
  db:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 512M
```

### 4. PostgreSQL Tuning

Create `postgresql.conf` and mount it:

```yaml
services:
  db:
    volumes:
      - ./postgresql.conf:/etc/postgresql/postgresql.conf
    command: postgres -c config_file=/etc/postgresql/postgresql.conf
```

---

## Backup & Restore

### Database Backup

```bash
# Create backup
docker compose exec db pg_dump -U postgres hrms_production > backup_$(date +%Y%m%d_%H%M%S).sql

# Automated daily backup (cron)
0 2 * * * cd /path/to/hrms && docker compose exec -T db pg_dump -U postgres hrms_production > backups/backup_$(date +\%Y\%m\%d).sql
```

### Database Restore

```bash
# Restore from backup
docker compose exec -T db psql -U postgres -d hrms_production < backup_20250122.sql
```

### Full System Backup

```bash
# Backup database volume
docker run --rm -v hrms-project_postgres_data_prod:/data -v $(pwd):/backup alpine tar czf /backup/postgres_volume_backup.tar.gz /data

# Restore database volume
docker run --rm -v hrms-project_postgres_data_prod:/data -v $(pwd):/backup alpine tar xzf /backup/postgres_volume_backup.tar.gz -C /data --strip 1
```

---

## Security Best Practices

### 1. Use Strong Passwords

```bash
# Generate secure password
openssl rand -base64 32
```

### 2. Don't Expose Database Port in Production

Remove from `docker-compose.prod.yml`:
```yaml
ports:
  - "5432:5432"  # Remove this line
```

Database should only be accessible from app container.

### 3. Use Environment Variables

Never hardcode secrets in Docker files. Always use `.env` file.

### 4. Run as Non-Root User

Production Dockerfile already includes:
```dockerfile
USER nodejs
```

### 5. Regular Updates

```bash
# Update base images
docker compose pull

# Rebuild
docker compose up --build -d
```

---

## Monitoring

### Container Health

```bash
# Check container health
docker compose ps

# View health check logs
docker inspect --format='{{json .State.Health}}' hrms_app_prod
```

### Resource Usage

```bash
# Real-time stats
docker stats

# Specific container
docker stats hrms_app_prod
```

### Application Logs

```bash
# Follow logs
docker compose logs -f app

# Export logs
docker compose logs app > app_logs_$(date +%Y%m%d).log
```

---

## CI/CD Integration

### GitHub Actions Example

`.github/workflows/docker-deploy.yml`:

```yaml
name: Docker Build and Deploy

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: docker compose -f docker-compose.prod.yml build
      
      - name: Push to registry (optional)
        run: |
          echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin
          docker push your-registry/hrms:latest
      
      - name: Deploy (via SSH)
        run: |
          ssh user@your-server "cd /path/to/hrms && docker compose -f docker-compose.prod.yml pull && docker compose -f docker-compose.prod.yml up -d"
```

---

## FAQ

**Q: Can I use Docker Desktop?**
A: Yes, Docker Desktop includes both Docker Engine and Docker Compose.

**Q: How do I update the application?**
```bash
git pull
docker compose up --build -d
```

**Q: How do I scale the application?**
A: Currently designed as a monolith. For horizontal scaling, consider:
- Load balancer (nginx)
- Multiple app containers
- Shared database
- Session store in Redis

**Q: Can I use external PostgreSQL?**
A: Yes, set `DATABASE_URL` in `.env` to point to external database and remove `db` service from docker-compose.

**Q: How do I migrate from development to production?**
```bash
# Backup dev database
docker compose exec db pg_dump -U postgres hrms_development > dev_backup.sql

# Restore to production
docker compose -f docker-compose.prod.yml exec -T db psql -U postgres -d hrms_production < dev_backup.sql
```

---

## Support

For issues or questions:
- Check logs: `docker compose logs -f`
- Review environment variables
- Verify database connectivity
- Consult main documentation: `/docs`

---

**Last Updated:** November 22, 2025  
**Docker Version Tested:** 24.0.7  
**Docker Compose Version Tested:** 2.23.0
