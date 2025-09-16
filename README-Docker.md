# Healthcare DevKube - Docker 3-Tier Architecture

## 🏗️ Architecture Overview

This Docker setup provides a complete **3-tier architecture** with monitoring:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Presentation   │────│  Application    │────│     Data        │
│     Tier        │    │     Tier        │    │     Tier        │
│   React App     │    │   Node.js API   │    │   MongoDB       │
│  (Port 3000)    │    │  (Port 5002)    │    │  (Port 27017)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Monitoring    │
                    │ Prometheus +    │
                    │    Grafana      │
                    │ (Ports 9090,    │
                    │      3001)      │
                    └─────────────────┘
```

## 🚀 Quick Start

### Production Mode
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Development Mode
```bash
# Start with development overrides
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Stop development environment
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down
```

## 🌐 Service Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| **Frontend App** | http://localhost:3000 | - |
| **Backend API** | http://localhost:5002 | - |
| **MongoDB** | mongodb://localhost:27017 | admin/mongopassword |
| **Prometheus** | http://localhost:9090 | - |
| **Grafana** | http://localhost:3001 | admin/grafana123 |

## 🗃️ Database Configuration

The MongoDB container includes:
- **Root User**: admin/mongopassword
- **Database**: healthcare
- **Persistent Storage**: Docker volumes
- **Health Checks**: Built-in ping tests

Connection strings:
- **Local**: `mongodb://admin:mongopassword@mongodb:27017/healthcare?authSource=admin`
- **External**: `mongodb://admin:mongopassword@localhost:27017/healthcare?authSource=admin`

## 📊 Monitoring Setup

### Prometheus
- Scrapes metrics from all services
- Stores 30 days of data
- Auto-discovery of Docker containers
- Custom healthcare application metrics

### Grafana
- Pre-configured dashboards
- Prometheus datasource
- Healthcare-specific monitoring panels
- Container resource monitoring

## 🐳 Container Details

### Services
1. **healthcare-frontend** - React application (Presentation Tier)
2. **healthcare-backend** - Node.js API (Application Tier)
3. **healthcare-mongodb** - MongoDB database (Data Tier)
4. **healthcare-prometheus** - Metrics collection
5. **healthcare-grafana** - Monitoring dashboards

### Volumes
- `mongodb_data` - Database storage
- `mongodb_config` - Database configuration
- `prometheus_data` - Metrics storage
- `grafana_data` - Dashboard storage

### Network
- Custom bridge network: `172.20.0.0/16`
- All containers can communicate by service name

## 🛠️ Development Features

### Hot Reload
- Frontend: Live reload with React development server
- Backend: Live reload with nodemon (when configured)

### Volume Mounting
- Source code mounted for live editing
- Node modules excluded from mounting

## 🔧 Environment Variables

All configuration is managed through `.env` file:

```env
# Database
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=mongopassword

# Application
MONGODB_URI=mongodb://admin:mongopassword@mongodb:27017/healthcare?authSource=admin
REACT_APP_API_BASE_URL=http://localhost:5002

# Monitoring
GRAFANA_ADMIN_PASSWORD=grafana123
```

## 🧪 Health Checks

All services include health checks:
- **MongoDB**: `mongosh --eval "db.adminCommand('ping')"`
- **Backend**: `curl -f http://localhost:5002/`
- **Frontend**: `curl -f http://localhost:3000/`
- **Prometheus**: `wget --spider http://localhost:9090/-/healthy`
- **Grafana**: `curl -f http://localhost:3000/api/health`

## 📈 Monitoring Dashboards

Pre-configured Grafana dashboards include:
- Application health status
- Container CPU/Memory usage
- HTTP response times
- Database connection metrics
- Custom healthcare application metrics

## 🔒 Security Notes

- MongoDB uses authentication
- Grafana has admin credentials
- Internal network isolation
- Health check endpoints exposed

## 🚀 Production Deployment

For production, this Docker setup can be:
1. **Kubernetes**: Use generated K8s manifests
2. **Docker Swarm**: Convert to swarm stack
3. **Cloud**: Deploy to ECS, GKE, or AKS
4. **CI/CD**: Integrate with Jenkins pipeline

## 📝 Commands Reference

```bash
# Build and start all services
docker-compose up --build -d

# View logs for specific service
docker-compose logs -f backend

# Scale a service
docker-compose up -d --scale backend=3

# Execute command in container
docker-compose exec backend sh

# Remove everything including volumes
docker-compose down -v --remove-orphans
```

## 🎉 Complete 3-Tier Architecture

✅ **Presentation Tier**: React Frontend with Docker
✅ **Application Tier**: Node.js Backend with Docker
✅ **Data Tier**: MongoDB with Docker
✅ **Monitoring**: Prometheus + Grafana
✅ **Networking**: Custom Docker bridge network
✅ **Storage**: Persistent volumes for data
✅ **Health Checks**: All services monitored
✅ **Development**: Hot reload support