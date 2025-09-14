# Healthcare DevKube CI/CD Pipeline

Complete CI/CD implementation for Healthcare application using Google Cloud Platform, Jenkins, and Kubernetes.

## 🎯 Project Overview

**Healthcare DevKube** is a full-stack healthcare management application with automated CI/CD pipeline that demonstrates modern DevOps practices on Google Cloud Platform.

### Architecture
```
GitHub → Jenkins → Docker Build → Artifact Registry → GKE Autopilot → Production
```

### Tech Stack
- **Frontend**: React.js (Port 3000)
- **Backend**: Node.js/Express (Port 5002)
- **Database**: MongoDB Atlas
- **CI/CD**: Jenkins on GCP Compute Engine
- **Orchestration**: Google Kubernetes Engine (GKE) Autopilot
- **Registry**: GCP Artifact Registry
- **Region**: asia-south1 (Mumbai, India)

## 🚀 Quick Start

### Prerequisites
- GCP account with billing enabled
- GitHub repository (public recommended)
- Basic knowledge of Docker, Kubernetes, and Jenkins

### Infrastructure Components
- **Jenkins Server**: `34.93.51.43:8080` (e2-standard-2)
- **GKE Cluster**: `healthcare-cluster` (Autopilot)
- **Artifact Registry**: `healthcare-repo` (Docker)
- **Namespace**: `healthcare-app`

## 📁 Project Structure

```
Healthcare-devkube/
├── client/                 # React frontend
│   ├── Dockerfile
│   └── package.json
├── server/                 # Node.js backend
│   ├── Dockerfile
│   ├── server.js
│   └── package.json
├── k8s/                    # Kubernetes manifests
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   └── deploy.sh
├── Jenkinsfile            # CI/CD pipeline
├── guidelines.md          # Implementation guide
├── JENKINS_SETUP.md       # Jenkins configuration
├── TESTING_WORKFLOW.md    # Testing procedures
└── MONITORING_SETUP.md    # Monitoring guide
```

## ⚡ Getting Started

### 1. Application Access
```bash
# Get application URL
kubectl get service healthcare-frontend-service -n healthcare-app
kubectl get nodes -o wide

# Access application
Frontend: http://NODE_IP:30080
Backend API: http://NODE_IP:30080/api/
```

### 2. Local Development
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/Healthcare-devkube.git
cd Healthcare-devkube

# Start backend
cd server
npm install
node server.js

# Start frontend (new terminal)
cd client
npm install
npm start
```

### 3. Deploy Changes
```bash
# Make code changes
git add .
git commit -m "Your changes"
git push origin main

# Jenkins will automatically:
# 1. Run tests
# 2. Build Docker images
# 3. Push to Artifact Registry
# 4. Deploy to Kubernetes
# 5. Perform health checks
```

## 🔧 Pipeline Stages

The Jenkins pipeline includes:

1. **Checkout** - Clone latest code
2. **Setup GCP Auth** - Authenticate with service account
3. **Test Backend** - Node.js syntax validation
4. **Test Frontend** - React test suite
5. **Build Images** - Docker build (parallel)
6. **Push to Registry** - Artifact Registry upload
7. **Deploy to GKE** - Kubernetes deployment
8. **Health Check** - Verify application health

## 📊 Monitoring & Health

### Application Health
- **Frontend Health**: `http://NODE_IP:30080/`
- **Backend Health**: `http://NODE_IP:30080/api/`
- **Kubernetes Dashboard**: Available via `kubectl proxy`

### Key Metrics
- **Build Time**: ~8-12 minutes
- **Deployment Time**: ~3-5 minutes
- **Replica Count**: 2 pods per service
- **Resource Limits**: 512Mi memory, 500m CPU per pod

### Monitoring Commands
```bash
# Check application status
kubectl get all -n healthcare-app

# View logs
kubectl logs -f deployment/healthcare-backend -n healthcare-app
kubectl logs -f deployment/healthcare-frontend -n healthcare-app

# Resource usage
kubectl top pods -n healthcare-app
kubectl top nodes
```

## 🛠️ Configuration

### Environment Variables (ConfigMap)
- `NODE_ENV`: production
- `MONGODB_URI`: MongoDB Atlas connection
- `API_BASE_URL`: Backend service URL
- `LOG_LEVEL`: info

### Secrets
- JWT tokens
- Admin credentials
- Database passwords

### Resource Limits
- **Memory**: 256Mi request, 512Mi limit
- **CPU**: 250m request, 500m limit
- **Replicas**: 2 per deployment

## 🎛️ Operations

### Manual Deployment
```bash
cd k8s/
./deploy.sh
```

### Scale Application
```bash
# Scale backend
kubectl scale deployment healthcare-backend --replicas=3 -n healthcare-app

# Scale frontend
kubectl scale deployment healthcare-frontend --replicas=3 -n healthcare-app
```

### Rollback Deployment
```bash
# View rollout history
kubectl rollout history deployment/healthcare-backend -n healthcare-app

# Rollback to previous version
kubectl rollout undo deployment/healthcare-backend -n healthcare-app
```

### Update Configuration
```bash
# Edit ConfigMap
kubectl edit configmap healthcare-config -n healthcare-app

# Restart deployments to pick up changes
kubectl rollout restart deployment/healthcare-backend -n healthcare-app
kubectl rollout restart deployment/healthcare-frontend -n healthcare-app
```

## 🔐 Security Features

- **Service Account**: Dedicated Jenkins SA with minimal permissions
- **Network Policies**: Isolated namespace
- **Resource Quotas**: Prevent resource abuse
- **Secret Management**: Encrypted secrets in Kubernetes
- **Image Security**: Private Artifact Registry
- **RBAC**: Role-based access control

## 💰 Cost Optimization

### Monthly Estimates (GCP South India)
- **GKE Autopilot**: ₹5,000-7,000
- **Compute Engine (Jenkins)**: ₹3,000-4,000
- **Artifact Registry**: ₹500-1,000
- **Network & Storage**: ₹1,000-1,500
- **Total**: ₹9,500-13,500 (~$115-165 USD)

### Cost Optimization Tips
- Use GCP free credits ($300)
- Enable autoscaling
- Clean up old Docker images
- Monitor resource usage
- Use preemptible nodes for development

## 🚨 Troubleshooting

### Common Issues

**Build Failures**
```bash
# Check Jenkins logs
sudo journalctl -u jenkins -f

# Clear Docker cache
docker system prune -f
```

**Pod Failures**
```bash
# Check pod logs
kubectl describe pod POD_NAME -n healthcare-app
kubectl logs POD_NAME -n healthcare-app
```

**Connectivity Issues**
```bash
# Check services
kubectl get svc -n healthcare-app

# Test internal connectivity
kubectl exec -it deployment/healthcare-backend -n healthcare-app -- curl localhost:5002
```

**Database Connection**
```bash
# Check backend logs for MongoDB errors
kubectl logs deployment/healthcare-backend -n healthcare-app | grep -i mongodb
```

## 📚 Documentation

Detailed guides available:

- **[Implementation Guidelines](guidelines.md)** - Complete setup steps
- **[Jenkins Setup](JENKINS_SETUP.md)** - Jenkins configuration
- **[Testing Workflow](TESTING_WORKFLOW.md)** - End-to-end testing
- **[Monitoring Setup](MONITORING_SETUP.md)** - Monitoring & alerting

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

### Useful Commands
```bash
# Get cluster credentials
gcloud container clusters get-credentials healthcare-cluster --zone=asia-south1

# Access Jenkins
ssh jenkins-server
# or visit: http://34.93.51.43:8080

# Quick health check
curl http://NODE_IP:30080/api/
```

### Emergency Contacts
- **GCP Console**: https://console.cloud.google.com
- **Jenkins Dashboard**: http://34.93.51.43:8080
- **GitHub Repository**: https://github.com/YOUR_USERNAME/Healthcare-devkube

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🏆 Achievements

✅ **Infrastructure as Code**: Complete Kubernetes manifests
✅ **Automated CI/CD**: Zero-touch deployments
✅ **Production Ready**: Health checks, monitoring, logging
✅ **Scalable Architecture**: Auto-scaling capable
✅ **Cost Optimized**: Efficient resource utilization
✅ **Security First**: RBAC, secrets management, private registry

---

**Status**: Production Ready ✅
**Last Updated**: January 2025
**Maintained By**: DevOps Team

*"Continuous Integration, Continuous Deployment, Continuous Improvement"*