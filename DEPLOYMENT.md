# Deployment Guide

## Local Development

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 16 (or use Docker)

### Setup

1. **Clone and install dependencies**
   \`\`\`bash
   git clone <repository>
   cd mini-wallet-service
   npm install
   cd client && npm install && cd ..
   \`\`\`

2. **Configure environment**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your actual values
   \`\`\`

3. **Start Docker services**
   \`\`\`bash
   docker-compose up -d
   \`\`\`

4. **Setup database**
   \`\`\`bash
   npm run prisma:migrate
   npm run prisma:generate
   \`\`\`

5. **Start backend**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Start frontend** (in new terminal)
   \`\`\`bash
   cd client
   npm run dev
   \`\`\`

### Access Points
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- GraphQL: http://localhost:3000/graphql
- pgAdmin: http://localhost:5050

## Production Deployment

### Environment Setup

1. **Create production environment file**
   \`\`\`bash
   # .env.production
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=postgresql://prod_user:prod_password@prod_host:5432/wallet_prod
   JWT_SECRET=<generate-strong-secret>
   ENCRYPTION_KEY=<generate-32-byte-key>
   ALCHEMY_API_KEY=<your-production-key>
   IPFS_API_URL=https://ipfs.infura.io:5001
   \`\`\`

2. **Generate secrets**
   \`\`\`bash
   # Generate JWT_SECRET
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   
   # Generate ENCRYPTION_KEY
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   \`\`\`

### Docker Deployment

1. **Build production image**
   \`\`\`bash
   docker build -t wallet-service:1.0.0 .
   \`\`\`

2. **Push to registry**
   \`\`\`bash
   docker tag wallet-service:1.0.0 registry.example.com/wallet-service:1.0.0
   docker push registry.example.com/wallet-service:1.0.0
   \`\`\`

3. **Deploy with Docker Compose**
   \`\`\`bash
   docker-compose -f docker-compose.prod.yml up -d
   \`\`\`

### Kubernetes Deployment

1. **Create namespace**
   \`\`\`bash
   kubectl create namespace wallet-production
   \`\`\`

2. **Create secrets**
   \`\`\`bash
   kubectl create secret generic wallet-secrets \
     --from-literal=JWT_SECRET=<secret> \
     --from-literal=ENCRYPTION_KEY=<key> \
     -n wallet-production
   \`\`\`

3. **Deploy**
   \`\`\`bash
   kubectl apply -f k8s/deployment.yml -n wallet-production
   kubectl apply -f k8s/service.yml -n wallet-production
   \`\`\`

## CI/CD Pipeline

### GitHub Actions

The project includes automated workflows:

- **Test**: Runs on every push/PR
  - Unit tests with coverage
  - Lint checks
  - Build verification

- **Deploy**: Runs on main branch push
  - Build Docker image
  - Push to registry
  - Deploy to production (configured in workflow)

### Manual Deployment

1. **Tag release**
   \`\`\`bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   \`\`\`

2. **Build and push**
   \`\`\`bash
   npm run build
   docker build -t wallet-service:1.0.0 .
   docker push <registry>/wallet-service:1.0.0
   \`\`\`

## Database Migration

### Local Development
\`\`\`bash
npm run prisma:migrate
\`\`\`

### Production
\`\`\`bash
# Review pending migrations
npx prisma migrate status

# Apply migrations
npx prisma migrate deploy

# Create migration backup before apply
# Run migrations with zero-downtime (if using deployment strategy)
\`\`\`

## Monitoring & Logging

### Application Logs
\`\`\`bash
# View Docker logs
docker logs wallet-api

# Follow logs
docker logs -f wallet-api

# View logs from specific time
docker logs --since 2024-01-01T00:00:00 wallet-api
\`\`\`

### Database Monitoring
\`\`\`bash
# Access pgAdmin
# URL: http://localhost:5050
# Login: admin@wallet.local / admin
\`\`\`

### Health Checks

Add health check endpoint:
\`\`\`typescript
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});
\`\`\`

## Backup & Recovery

### Database Backup
\`\`\`bash
# Backup PostgreSQL
docker exec wallet-db pg_dump -U wallet_user wallet_db > backup.sql

# Restore from backup
docker exec -i wallet-db psql -U wallet_user wallet_db < backup.sql
\`\`\`

### Automated Backups
\`\`\`yaml
# Add to docker-compose.yml
backup:
  image: postgres:16-alpine
  environment:
    PGPASSWORD: wallet_password
  volumes:
    - ./backups:/backups
  command: >
    sh -c "pg_dump -h postgres -U wallet_user wallet_db > 
           /backups/backup_\$(date +%Y%m%d_%H%M%S).sql"
  depends_on:
    - postgres
\`\`\`

## Scaling

### Horizontal Scaling
- Run multiple API instances
- Use load balancer (nginx, HAProxy)
- Shared database for state

### Vertical Scaling
- Increase container resource limits
- Optimize database queries
- Cache frequently accessed data

### Performance Optimization
- Enable database connection pooling
- Implement API caching
- Use CDN for static assets
- Monitor and optimize slow queries

## Rollback Procedure

1. **Identify issue**
   - Check logs and metrics
   - Determine failed deployment

2. **Rollback**
   \`\`\`bash
   # For Docker
   docker-compose down
   git checkout <previous-tag>
   docker-compose up -d
   
   # For Kubernetes
   kubectl rollout undo deployment/wallet-api -n wallet-production
   \`\`\`

3. **Verify**
   - Check application health
   - Verify database connectivity
   - Test critical functionality
