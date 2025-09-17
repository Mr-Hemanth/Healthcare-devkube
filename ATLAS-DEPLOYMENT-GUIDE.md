# Healthcare 3-Tier Architecture with MongoDB Atlas - Complete Deployment Guide

## 🏗️ Architecture Overview

**3-Tier Architecture Components:**
- **Tier 1 (Presentation)**: React.js Frontend - Web application interface
- **Tier 2 (Application)**: Node.js Backend - API and business logic
- **Tier 3 (Database)**: MongoDB Atlas - Cloud database service

**Key Features:**
✅ **No Local Database**: Eliminates MongoDB installation and maintenance
✅ **Cloud-Native**: Uses MongoDB Atlas for scalability and reliability
✅ **Auto-scaling**: Kubernetes HPA for dynamic scaling
✅ **CI/CD Pipeline**: Automated GitHub Actions + Jenkins deployment
✅ **Monitoring**: Prometheus and Grafana for observability

---

## 🚀 Quick Start - GitHub Actions + Jenkins Automation

### Step 1: Repository Setup

1. **Push your code to GitHub:**
```bash
cd Healthcare-devkube
git add .
git commit -m "Setup 3-tier Atlas architecture with CI/CD pipeline 🚀

🏗️ Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
git push origin main
```

2. **GitHub Actions will automatically:**
   - Run tests for both frontend and backend
   - Build Docker images
   - Trigger Jenkins pipeline for deployment

### Step 2: GitHub Secrets Configuration

Add these secrets to your GitHub repository (`Settings > Secrets and Variables > Actions`):

```yaml
JENKINS_URL: "http://your-jenkins-server:8080"
JENKINS_API_TOKEN: "your-jenkins-api-token"
MONGODB_ATLAS_URI: "mongodb+srv://devops:devops@devops.o4ykiod.mongodb.net/?retryWrites=true&w=majority&appName=devops"
```

### Step 3: Jenkins Configuration

Ensure your Jenkins has these credentials configured:
- `gcp-service-account-key`: GCP service account JSON
- MongoDB Atlas connection string in environment

---

## 🎯 Manual Deployment Options

### Option 1: Kubernetes Deployment (Recommended)

```bash
# Deploy complete 3-tier architecture
kubectl apply -f k8s/atlas-complete-deployment.yaml

# Check deployment status
kubectl get all -n healthcare-app

# Get frontend URL
kubectl get service healthcare-frontend-service -n healthcare-app
```

### Option 2: Docker Compose (Local Development)

```bash
# Use Atlas-only docker compose
docker-compose -f docker-compose.atlas.yml up -d

# Check services
docker-compose -f docker-compose.atlas.yml ps

# View logs
docker-compose -f docker-compose.atlas.yml logs -f backend
```

### Option 3: Jenkins Pipeline

```bash
# Trigger Jenkins build manually
curl -X POST \
  -H "Authorization: Bearer YOUR_JENKINS_TOKEN" \
  "http://your-jenkins-server:8080/job/Healthcare-DevKube/build"
```

---

## 🔧 Configuration Details

### Environment Variables

**Backend Configuration:**
```env
NODE_ENV=production
MONGODB_ATLAS_URI=mongodb+srv://devops:devops@devops.o4ykiod.mongodb.net/?retryWrites=true&w=majority&appName=devops
PORT=5002
CORS_ORIGIN=*
LOG_LEVEL=info
```

**Frontend Configuration:**
```env
NODE_ENV=production
REACT_APP_API_BASE_URL=""
```

### MongoDB Atlas Connection

Your Atlas connection string is already configured:
```
mongodb+srv://devops:devops@devops.o4ykiod.mongodb.net/?retryWrites=true&w=majority&appName=devops
```

**Database Details:**
- **Cluster**: devops.o4ykiod.mongodb.net
- **Username**: devops
- **Password**: devops
- **App Name**: devops
- **Features**: Retryable writes enabled, Write concern majority

---

## 🌐 Access Your Application

### After Kubernetes Deployment:

1. **Get LoadBalancer IP:**
```bash
kubectl get service healthcare-frontend-service -n healthcare-app
```

2. **If LoadBalancer is pending, use port-forward:**
```bash
kubectl port-forward service/healthcare-frontend-service 3000:80 -n healthcare-app
```

3. **Access the application:**
   - Frontend: `http://EXTERNAL_IP/` or `http://localhost:3000`
   - Backend API: Internal service mesh
   - Database: MongoDB Atlas (automatic)

### After Docker Compose:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5002
- Monitoring: http://localhost:9090 (Prometheus), http://localhost:3001 (Grafana)

---

## 📊 Monitoring & Health Checks

### Health Endpoints

```bash
# Backend health check
curl http://localhost:5002/health

# Frontend health check
curl http://localhost:3000/

# Metrics endpoint
curl http://localhost:5002/metrics
```

### Kubernetes Monitoring

```bash
# Check pod status
kubectl get pods -n healthcare-app

# View backend logs
kubectl logs -f deployment/healthcare-backend -n healthcare-app

# View frontend logs
kubectl logs -f deployment/healthcare-frontend -n healthcare-app

# Resource usage
kubectl top pods -n healthcare-app
```

### Auto-scaling Status

```bash
# Check HPA status
kubectl get hpa -n healthcare-app

# Describe auto-scaling
kubectl describe hpa healthcare-backend-hpa -n healthcare-app
```

---

## 🔍 Troubleshooting Guide

### Common Issues & Solutions

**1. Database Connection Issues:**
```bash
# Check backend logs for Atlas connectivity
kubectl logs deployment/healthcare-backend -n healthcare-app | grep -i mongodb

# Verify Atlas URI is correctly set
kubectl get configmap healthcare-atlas-config -n healthcare-app -o yaml
```

**2. Frontend Not Loading:**
```bash
# Check frontend service
kubectl get service healthcare-frontend-service -n healthcare-app

# Check if backend is reachable
kubectl exec -it deployment/healthcare-frontend -n healthcare-app -- curl healthcare-backend-service:5002/health
```

**3. Pipeline Failures:**
```bash
# GitHub Actions logs: Check GitHub repository > Actions tab
# Jenkins logs: Check Jenkins console output
# Docker issues: docker system prune -f
```

**4. Scaling Issues:**
```bash
# Manual scaling
kubectl scale deployment healthcare-backend --replicas=3 -n healthcare-app

# Check resource limits
kubectl describe deployment healthcare-backend -n healthcare-app
```

---

## 📈 Performance Optimization

### Resource Allocation

**Current Limits:**
- Backend: 256Mi-512Mi memory, 250m-500m CPU
- Frontend: 128Mi-256Mi memory, 100m-200m CPU

**Scaling Configuration:**
- Min replicas: 2
- Max replicas: 10
- Target CPU: 70%
- Target Memory: 80%

### Atlas Performance

**Connection Optimization:**
- Connection pooling enabled
- Retry writes configured
- Write concern: majority
- Read preference: primary

---

## 🔐 Security Features

### Network Security
- Kubernetes Network Policies
- Service mesh communication
- Private Atlas connection

### Authentication
- JWT tokens for API authentication
- Admin credentials stored in Kubernetes secrets
- MongoDB Atlas authentication

### Data Security
- HTTPS termination at load balancer
- Encrypted Atlas connections
- Secret management via Kubernetes

---

## 💰 Cost Optimization

### Atlas Costs
- **Database**: MongoDB Atlas M0 (Free) to M10 ($9/month)
- **Data Transfer**: Minimal within same region
- **Backup**: Automated backups included

### GKE Costs (Estimated)
- **Cluster**: $73/month (3 nodes, e2-medium)
- **Load Balancer**: $18/month
- **Storage**: $5/month
- **Total**: ~$100/month

### Cost Reduction Tips
1. Use GKE Autopilot for better resource utilization
2. Enable cluster autoscaling
3. Use preemptible nodes for development
4. Monitor Atlas usage in Atlas console

---

## 🚀 Advanced Operations

### Blue-Green Deployment

```bash
# Create new deployment version
kubectl apply -f k8s/atlas-complete-deployment.yaml

# Switch traffic (edit service selector)
kubectl patch service healthcare-frontend-service -n healthcare-app -p '{"spec":{"selector":{"version":"new"}}}'
```

### Database Migration

```bash
# Export from old database
mongodump --uri="mongodb://old-connection-string"

# Import to Atlas
mongorestore --uri="mongodb+srv://devops:devops@devops.o4ykiod.mongodb.net/?retryWrites=true&w=majority&appName=devops"
```

### Backup & Recovery

```bash
# Atlas automatic backups are enabled
# Manual backup using mongodump:
mongodump --uri="mongodb+srv://devops:devops@devops.o4ykiod.mongodb.net/?retryWrites=true&w=majority&appName=devops"
```

---

## 📞 Support & Resources

### Useful Commands Reference

```bash
# Quick status check
kubectl get all -n healthcare-app

# Application logs
kubectl logs -f deployment/healthcare-backend -n healthcare-app
kubectl logs -f deployment/healthcare-frontend -n healthcare-app

# Scale application
kubectl scale deployment healthcare-backend --replicas=5 -n healthcare-app

# Update deployment
kubectl rollout restart deployment/healthcare-backend -n healthcare-app

# Port forwarding for testing
kubectl port-forward service/healthcare-frontend-service 3000:80 -n healthcare-app
kubectl port-forward service/healthcare-backend-service 5002:5002 -n healthcare-app
```

### Documentation Links
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

## 🎉 Success Checklist

✅ **GitHub Actions pipeline triggers on push**
✅ **Jenkins builds and deploys automatically**
✅ **Frontend accessible via LoadBalancer**
✅ **Backend API responding on internal service**
✅ **MongoDB Atlas connection established**
✅ **Health checks passing**
✅ **Auto-scaling configured**
✅ **Monitoring stack deployed**
✅ **No local database dependencies**
✅ **3-tier architecture fully operational**

---

## 📧 Next Steps

1. **Test the complete flow**: Make a code change and push to GitHub
2. **Monitor the pipeline**: Watch GitHub Actions → Jenkins → GKE deployment
3. **Scale the application**: Test auto-scaling under load
4. **Set up alerts**: Configure Prometheus alerts for production
5. **Backup strategy**: Set up Atlas backup policies
6. **Performance tuning**: Optimize based on actual usage patterns

**Your 3-tier architecture with MongoDB Atlas is now ready for production! 🎯**