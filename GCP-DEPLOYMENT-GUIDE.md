# 🚀 Healthcare DevKube - GCP Deployment Guide

## 📋 Overview

This guide provides comprehensive instructions for deploying the Healthcare 3-Tier Atlas Application on Google Cloud Platform using GitHub Actions and Jenkins CI/CD pipelines.

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

## ☁️ GCP Infrastructure

### **Project Configuration**
- **Project ID**: `hc-3-monitoring`
- **Region**: `asia-south1` (Mumbai, India)
- **Cluster**: `healthcare3-cluster` (GKE Autopilot)
- **Registry**: `asia-south1-docker.pkg.dev`
- **Repository**: `healthcare-repo`

### **Network & Access Points**
- **Frontend**: LoadBalancer service (External IP assigned)
- **Backend**: ClusterIP service (Internal: healthcare-backend-service:5002)
- **Database**: MongoDB Atlas (External cloud service)
- **Monitoring**:
  - Grafana: `http://34.100.250.12:30081/login` (admin/admin123)
  - Prometheus: `http://34.100.250.12:30080`

## 🔧 Deployment Methods

### **Method 1: GitHub Actions (Recommended)**

#### **Workflow Configuration**
File: `.github/workflows/healthcare-atlas-ci-cd.yml`

**Environment Variables:**
```yaml
env:
  PROJECT_ID: hc-3-monitoring
  CLUSTER_NAME: healthcare3-cluster
  CLUSTER_LOCATION: asia-south1
  REGISTRY_HOSTNAME: asia-south1-docker.pkg.dev
  REPOSITORY_NAME: healthcare-repo
  USE_GKE_GCLOUD_AUTH_PLUGIN: True
```

**Pipeline Stages:**
1. **Checkout & Prerequisites** - Code verification and Atlas config check
2. **Test Applications** - Backend syntax check & Frontend test suite
3. **Setup GCP Authentication** - Service account authentication
4. **Build & Push Images** - Docker images to Artifact Registry
5. **Deploy Atlas Architecture** - 3-tier deployment to GKE
6. **Deploy Monitoring** - Prometheus & Grafana stack
7. **Health Check** - Comprehensive application verification

#### **Secrets Required:**
```yaml
secrets:
  GCP_SERVICE_ACCOUNT_KEY: # Base64 encoded service account JSON
```

#### **Trigger Deployment:**
```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

### **Method 2: Jenkins CI/CD**

#### **Jenkins Atlas Pipeline**
File: `Jenkinsfile.atlas`

**Key Features:**
- Atlas-only deployment (NO local MongoDB)
- Parallel image building (Backend & Frontend)
- Health checks with Atlas connection verification
- External IP reporting

**Jenkins Environment:**
```groovy
environment {
    PROJECT_ID = 'hc-3-monitoring'
    CLUSTER_NAME = 'healthcare3-cluster'
    CLUSTER_LOCATION = 'asia-south1'
    REGISTRY_HOSTNAME = 'asia-south1-docker.pkg.dev'
    REPOSITORY_NAME = 'healthcare-repo'
    SERVICE_ACCOUNT_KEY = credentials('gcp-service-account-key')
}
```

#### **Manual Jenkins Deployment:**
1. Access Jenkins dashboard
2. Select "Healthcare Atlas Pipeline"
3. Click "Build Now"
4. Monitor build progress and logs

## 🐳 Container Images

### **Image Registry URLs:**
```
# Backend Image
asia-south1-docker.pkg.dev/hc-3-monitoring/healthcare-repo/healthcare-backend:latest

# Frontend Image
asia-south1-docker.pkg.dev/hc-3-monitoring/healthcare-repo/healthcare-frontend:latest
```

### **Build Arguments:**
```dockerfile
# Frontend Build
--build-arg REACT_APP_API_BASE_URL=""  # Uses internal service discovery
```

## ☸️ Kubernetes Configuration

### **Namespace**
```yaml
namespace: healthcare-app
```

### **Key Deployments**
```yaml
# Backend Deployment
deployment: healthcare-backend
replicas: 2
image: healthcare-backend:latest
port: 5002

# Frontend Deployment
deployment: healthcare-frontend
replicas: 2
image: healthcare-frontend:latest
port: 3000
```

### **Services**
```yaml
# Frontend Service (LoadBalancer)
healthcare-frontend-service:
  type: LoadBalancer
  port: 80
  targetPort: 3000

# Backend Service (ClusterIP)
healthcare-backend-service:
  type: ClusterIP
  port: 5002
  targetPort: 5002
```

### **Monitoring Services**
```yaml
# Prometheus
prometheus-service:
  type: ClusterIP
  port: 9090
  nodePort: 30080

# Grafana
grafana-service:
  type: NodePort
  port: 3000
  nodePort: 30081
```

## 🗄️ Database Configuration

### **MongoDB Atlas Setup**
- **Type**: Cloud-hosted MongoDB Atlas
- **Connection**: Via connection string in ConfigMap
- **No Local MongoDB**: Local MongoDB deployments are cleaned up during deployment

### **ConfigMap Configuration**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: healthcare-atlas-config
data:
  MONGODB_URI: "mongodb+srv://..."  # Atlas connection string
  NODE_ENV: "production"
  API_BASE_URL: "http://healthcare-backend-service:5002"
```

## 📊 Monitoring Stack

### **Prometheus Configuration**
- **Port**: 9090
- **Access**: `http://34.100.250.12:30080`
- **Metrics**: Application and infrastructure metrics
- **Health**: `/metrics` endpoint

### **Grafana Configuration**
- **Port**: 3000 (NodePort: 30081)
- **Access**: `http://34.100.250.12:30081/login`
- **Credentials**: admin/admin123
- **Dashboards**: Pre-configured healthcare monitoring

## 🔍 Health Checks & Verification

### **Application Health Endpoints**
```bash
# Frontend Health
curl http://FRONTEND_IP/

# Backend Health
curl http://BACKEND_CLUSTER_IP:5002/health

# Monitoring Health
curl http://34.100.250.12:30080/-/healthy  # Prometheus
curl http://34.100.250.12:30081/api/health # Grafana
```

### **Deployment Verification Commands**
```bash
# Check all resources
kubectl get all -n healthcare-app

# Pod status
kubectl get pods -n healthcare-app

# Service status
kubectl get services -n healthcare-app

# Check external IPs
kubectl get service healthcare-frontend-service -n healthcare-app

# View logs
kubectl logs -f deployment/healthcare-backend -n healthcare-app
kubectl logs -f deployment/healthcare-frontend -n healthcare-app
```

## 🚨 Troubleshooting

### **Common Issues**

#### **Backend Deployment Timeout**
If stuck at "Tier 2 (Backend API) deployment..." for >7 minutes:

```bash
# Check pod status
kubectl get pods -n healthcare-app

# Check pod logs
kubectl logs deployment/healthcare-backend -n healthcare-app

# Check resource constraints
kubectl describe pod <backend-pod-name> -n healthcare-app

# Check Atlas connection
kubectl logs deployment/healthcare-backend -n healthcare-app | grep -i mongodb
```

#### **Image Pull Errors**
```bash
# Verify registry authentication
gcloud auth configure-docker asia-south1-docker.pkg.dev

# Check image exists
gcloud container images list --repository=asia-south1-docker.pkg.dev/hc-3-monitoring/healthcare-repo
```

#### **Service Discovery Issues**
```bash
# Test internal connectivity
kubectl exec -it deployment/healthcare-frontend -n healthcare-app -- curl healthcare-backend-service:5002/health

# Check DNS resolution
kubectl exec -it deployment/healthcare-frontend -n healthcare-app -- nslookup healthcare-backend-service
```

### **Emergency Commands**
```bash
# Restart deployments
kubectl rollout restart deployment/healthcare-backend -n healthcare-app
kubectl rollout restart deployment/healthcare-frontend -n healthcare-app

# Scale down/up
kubectl scale deployment healthcare-backend --replicas=0 -n healthcare-app
kubectl scale deployment healthcare-backend --replicas=2 -n healthcare-app

# Delete and redeploy
kubectl delete -f k8s/atlas-complete-deployment.yaml
kubectl apply -f k8s/atlas-complete-deployment.yaml
```

## 📈 Scaling & Performance

### **Horizontal Pod Autoscaler**
```yaml
# Backend HPA
healthcare-backend-hpa:
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilization: 70%

# Frontend HPA
healthcare-frontend-hpa:
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilization: 70%
```

### **Resource Limits**
```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

## 🔐 Security Configuration

### **Network Policies**
- **Ingress**: Only frontend accessible externally
- **Backend**: Internal ClusterIP only
- **Database**: Atlas cloud connection only

### **Service Account**
- **Type**: Workload Identity enabled
- **Permissions**: Minimal required for deployment
- **Secret**: Stored in GitHub Secrets / Jenkins Credentials

## 💰 Cost Optimization

### **Monthly Estimates (GCP Asia-South1)**
- **GKE Autopilot**: ₹5,000-7,000
- **Artifact Registry**: ₹500-1,000
- **Load Balancer**: ₹1,500-2,000
- **Network Egress**: ₹1,000-1,500
- **Total**: ₹8,000-11,500 (~$95-140 USD)

### **Cost Optimization Tips**
- Use GCP $300 free credits
- Monitor with billing alerts
- Clean up old container images
- Use committed use discounts for predictable workloads

## 📞 Support & Maintenance

### **Access Points**
- **Application**: Get external IP via `kubectl get svc healthcare-frontend-service -n healthcare-app`
- **Monitoring**: `http://34.100.250.12:30081/login`
- **Logs**: `kubectl logs -f deployment/<service> -n healthcare-app`

### **Regular Maintenance**
1. **Weekly**: Check resource usage and logs
2. **Monthly**: Update container images and security patches
3. **Quarterly**: Review costs and optimize resources

---

## ✅ Deployment Checklist

### **Pre-Deployment**
- [ ] GCP Project setup with billing enabled
- [ ] Service account with required permissions
- [ ] MongoDB Atlas cluster configured
- [ ] GitHub secrets or Jenkins credentials configured

### **Post-Deployment Verification**
- [ ] All pods running in healthcare-app namespace
- [ ] Frontend accessible via external LoadBalancer IP
- [ ] Backend health check responding
- [ ] MongoDB Atlas connection established
- [ ] Monitoring stack operational
- [ ] Auto-scaling configured and active

---

**Status**: Production Ready ✅
**Last Updated**: September 2025
**Maintained By**: DevOps Team

*"Automated deployment, Atlas-powered data, Production-ready monitoring"*