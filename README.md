# 🏥 Healthcare DevKube - 3-Tier Atlas Application

## 📋 Overview

Complete CI/CD implementation for Healthcare application using Google Cloud Platform with Jenkins and GitHub Actions pipelines, featuring MongoDB Atlas integration.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Frontend Tier  │────│  Backend Tier   │────│  Database Tier  │
│   React App     │    │   Node.js API   │    │ MongoDB Atlas   │
│   (Port 3000)   │    │   (Port 5002)   │    │    (Cloud)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
    LoadBalancer            ClusterIP               External Cloud
    (External IP)          (Internal)               (Atlas URI)
```

## ☁️ Infrastructure

- **Project**: `hc-3-monitoring`
- **Region**: `asia-south1` (Mumbai, India)
- **Cluster**: `healthcare3-cluster` (GKE Autopilot)
- **Registry**: `asia-south1-docker.pkg.dev`
- **Database**: MongoDB Atlas (Cloud)

## 🚀 Access Points

### **Application**
- **Frontend**: External LoadBalancer IP (assigned during deployment)
- **Backend**: `healthcare-backend-service:5002` (Internal)
- **Database**: MongoDB Atlas (External cloud service)

### **Monitoring**
- **Grafana**: `http://34.100.250.12:30081/login` (admin/admin123)
- **Prometheus**: `http://34.100.250.12:30080`

## 📖 Documentation

### **🔧 Pipeline Guides**

1. **[GCP Deployment Guide](GCP-DEPLOYMENT-GUIDE.md)**
   - GCP infrastructure overview
   - Network configuration and access points
   - Kubernetes cluster setup
   - Cost optimization tips

2. **[Jenkins Pipeline Guide](JENKINS-PIPELINE-GUIDE.md)**
   - Complete Jenkins CI/CD setup
   - Stage-by-stage pipeline breakdown
   - Build logs analysis
   - Troubleshooting guide

3. **[GitHub Actions Pipeline Guide](GITHUB-ACTIONS-PIPELINE-GUIDE.md)**
   - GitHub Actions workflow configuration
   - Atlas-specific deployment steps
   - Matrix strategy implementation
   - Automated monitoring setup

## ⚡ Quick Start

### **GitHub Actions Deployment**
```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

### **Jenkins Deployment**
1. Access Jenkins dashboard
2. Select "Healthcare Atlas Pipeline"
3. Click "Build Now"

### **Manual Local Testing**
```bash
# Port-forward to test locally
kubectl port-forward service/healthcare-frontend-service 3000:80 -n healthcare-app
# Access: http://localhost:3000

kubectl port-forward service/grafana-service 3001:3000 -n healthcare-app
# Access: http://localhost:3001 (admin/admin123)
```

## 🔍 Verification Commands

```bash
# Check deployment status
kubectl get all -n healthcare-app

# Get external access
kubectl get service healthcare-frontend-service -n healthcare-app

# View logs
kubectl logs -f deployment/healthcare-backend -n healthcare-app
kubectl logs -f deployment/healthcare-frontend -n healthcare-app

# Test health endpoints
curl http://EXTERNAL_IP/
curl http://BACKEND_CLUSTER_IP:5002/health
```

## 📊 Pipeline Features

### **✅ GitHub Actions**
- Atlas-only deployment (no local MongoDB)
- Parallel testing and building
- Comprehensive health checks
- Automatic monitoring setup
- Timeout handling for deployments

### **✅ Jenkins**
- Traditional CI/CD pipeline
- Local MongoDB + Atlas options
- Detailed build logs
- Resource verification
- Production-ready deployment

### **✅ Monitoring Stack**
- **Prometheus**: Metrics collection
- **Grafana**: Visualization dashboards
- **Health Checks**: Automated verification
- **NodePort Access**: External monitoring

## 🚨 Troubleshooting

### **Common Issues**
1. **Backend Deployment Timeout**: Check pod status and logs
2. **LoadBalancer IP Pending**: Wait for GCP IP assignment
3. **Monitoring Access**: Use port-forwarding for local access
4. **Atlas Connection**: Verify connection string in ConfigMap

### **Emergency Commands**
```bash
# Restart deployments
kubectl rollout restart deployment/healthcare-backend -n healthcare-app
kubectl rollout restart deployment/healthcare-frontend -n healthcare-app

# Scale applications
kubectl scale deployment healthcare-frontend --replicas=3 -n healthcare-app
kubectl scale deployment healthcare-backend --replicas=3 -n healthcare-app

# View detailed status
kubectl describe deployment healthcare-backend -n healthcare-app
kubectl get pods -n healthcare-app -o wide
```

## 💰 Cost Estimation

**Monthly GCP Costs (Asia-South1):**
- GKE Autopilot: ₹5,000-7,000
- Artifact Registry: ₹500-1,000
- Load Balancer: ₹1,500-2,000
- Network Egress: ₹1,000-1,500
- **Total**: ₹8,000-11,500 (~$95-140 USD)

## 🛠️ Tech Stack

- **Frontend**: React.js with Docker
- **Backend**: Node.js/Express with Docker
- **Database**: MongoDB Atlas (Cloud)
- **CI/CD**: Jenkins & GitHub Actions
- **Orchestration**: Google Kubernetes Engine (GKE) Autopilot
- **Registry**: GCP Artifact Registry
- **Monitoring**: Prometheus + Grafana
- **Infrastructure**: Google Cloud Platform

---

## 📞 Support

### **Pipeline Documentation**
- **GCP Infrastructure**: [GCP-DEPLOYMENT-GUIDE.md](GCP-DEPLOYMENT-GUIDE.md)
- **Jenkins CI/CD**: [JENKINS-PIPELINE-GUIDE.md](JENKINS-PIPELINE-GUIDE.md)
- **GitHub Actions**: [GITHUB-ACTIONS-PIPELINE-GUIDE.md](GITHUB-ACTIONS-PIPELINE-GUIDE.md)

### **Quick Links**
- **Repository**: https://github.com/Mr-Hemanth/Healthcare-devkube
- **GCP Console**: https://console.cloud.google.com
- **Monitoring**: http://34.100.250.12:30081/login

---

**Status**: Production Ready ✅
**Architecture**: 3-Tier with Atlas Database
**Deployment**: Multi-Pipeline Support (Jenkins + GitHub Actions)
**Monitoring**: Prometheus + Grafana Stack

*"Automated deployment, Atlas-powered data, Production-ready monitoring"*