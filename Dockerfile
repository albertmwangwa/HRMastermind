# ============================================
# Multi-Stage Production Dockerfile for HRMS
# ============================================

# Stage 1: Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
# This builds both frontend (Vite) and backend (esbuild)
RUN npm run build

# Stage 2: Production Runtime
FROM node:20-alpine AS production

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Copy shared folder (needed for types/schemas at runtime)
COPY --from=builder /app/shared ./shared

# Copy drizzle config (needed for migrations)
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of app directory
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port 5000 (application port)
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/user', (r) => {process.exit(r.statusCode === 200 || r.statusCode === 401 ? 0 : 1)})"

# Start the application
CMD ["node", "dist/index.js"]
