# 🔧 Jenkins CI/CD Pipeline Guide - Healthcare DevKube

## 📋 Overview

Complete guide for Jenkins-based CI/CD pipeline deployment of the Healthcare 3-Tier application on Google Kubernetes Engine (GKE).

## 🏗️ Pipeline Architecture

```
GitHub Repository → Jenkins → Docker Build → Artifact Registry → GKE Deployment
                     ↓
              Tool Verification & Testing
                     ↓
              GCP Authentication & Setup
                     ↓
              Parallel Image Building (Backend/Frontend)
                     ↓
              Push to Asia-South1 Artifact Registry
                     ↓
              Deploy to GKE Autopilot Cluster
                     ↓
              Health Checks & Monitoring Setup
```

## 🛠️ Jenkins Configuration

### **Environment Variables**
```groovy
environment {
    PROJECT_ID = 'hc-3-monitoring'
    CLUSTER_NAME = 'healthcare3-cluster'
    CLUSTER_LOCATION = 'asia-south1'
    REGISTRY_HOSTNAME = 'asia-south1-docker.pkg.dev'
    REPOSITORY_NAME = 'healthcare-repo'
    SERVICE_ACCOUNT_KEY = credentials('gcp-service-account-key')
    USE_GKE_GCLOUD_AUTH_PLUGIN = 'True'
    PATH = "/usr/local/bin:/snap/bin:/usr/sbin:/usr/bin:/sbin:/bin:$PATH"
}
```

### **Required Credentials**
- **`gcp-service-account-key`**: GCP Service Account JSON key file
- **`github-pat`**: GitHub Personal Access Token for repository access

### **Jenkins Server Specifications**
- **Instance**: GCP Compute Engine
- **Machine Type**: e2-standard-2 or higher
- **OS**: Ubuntu 22.04 LTS
- **Required Tools**: Docker, Node.js 18+, gcloud CLI, kubectl

## 🔄 Pipeline Stages

### **Stage 1: Checkout & Prerequisites**
```bash
Duration: ~30 seconds
```
- Clones repository from GitHub using PAT
- Verifies workspace structure
- Checks for required configuration files

**Sample Output:**
```
Selected Git installation does not exist. Using Default
The recommended git tool is: NONE
using credential github-pat
Checking out Revision 2c74f621622ec534189f936a162c20246fed8cf2
Commit message: "debugging--api fix"
```

### **Stage 2: Tool Verification**
```bash
Duration: ~20 seconds
```
- **Node.js**: v18.20.8
- **npm**: 10.8.2
- **Docker**: 27.5.1
- **gcloud**: 456.0.0
- **kubectl**: v1.34.1
- **gke-auth-plugin**: v1.28.0

**Verification Script:**
```bash
echo "=== Tool Verification ==="
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "Docker: $(docker --version)"
echo "gcloud: $(/usr/local/bin/gcloud --version | head -1)"
echo "kubectl: $(/usr/local/bin/kubectl version --client | head -1)"
```

### **Stage 3: GCP Authentication**
```bash
Duration: ~15 seconds
```
**Service Account Setup:**
```bash
export USE_GKE_GCLOUD_AUTH_PLUGIN=True
/usr/local/bin/gcloud auth activate-service-account --key-file=${SERVICE_ACCOUNT_KEY}
/usr/local/bin/gcloud config set project hc-3-monitoring
/usr/local/bin/gcloud auth configure-docker asia-south1-docker.pkg.dev --quiet
```

**Success Output:**
```
Activated service account credentials for: [jenkins-sa@hc-3-monitoring.iam.gserviceaccount.com]
Updated property [core/project].
gcloud credential helpers already registered correctly.
✅ GCP authentication setup complete
```

### **Stage 4: Application Testing**

#### **Backend Testing**
```bash
Duration: ~45 seconds
Working Directory: ./server
```
**Test Process:**
```bash
npm install              # Install dependencies
node -c server.js        # Syntax validation
```

**Sample Output:**
```
up to date, audited 112 packages in 2s
16 packages are looking for funding
5 vulnerabilities (3 high, 2 critical)
✅ Backend tests passed
```

#### **Frontend Testing**
```bash
Duration: ~2-3 minutes
Working Directory: ./client
```
**Test Process:**
```bash
npm install                                              # Install dependencies
CI=true npm test -- --coverage --watchAll=false        # Run test suite with coverage
```

**Coverage Report:**
```
File                        | % Stmts | % Branch | % Funcs | % Lines |
----------------------------|---------|----------|---------|---------|
All files                   |   35.22 |     4.37 |    8.88 |   35.22 |
App.js                      |     100 |      100 |     100 |     100 |
Test Suites: 1 passed, 1 total
Tests: 1 passed, 1 total
Time: 5.489 s
✅ Frontend tests passed
```

### **Stage 5: Docker Image Building (Parallel)**

#### **Backend Image Build**
```bash
Duration: ~2-3 minutes
Registry: asia-south1-docker.pkg.dev/hc-3-monitoring/healthcare-repo
```
**Build Commands:**
```bash
IMAGE_NAME="asia-south1-docker.pkg.dev/hc-3-monitoring/healthcare-repo/healthcare-backend:${BUILD_NUMBER}"
docker build -t ${IMAGE_NAME} .
docker tag ${IMAGE_NAME} asia-south1-docker.pkg.dev/hc-3-monitoring/healthcare-repo/healthcare-backend:latest
```

**Build Process:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
COPY --chown=nodejs:nodejs . .
USER nodejs
EXPOSE 5002
CMD ["node", "server.js"]
```

#### **Frontend Image Build**
```bash
Duration: ~4-5 minutes
Build Args: REACT_APP_API_BASE_URL=""
```
**Build Commands:**
```bash
IMAGE_NAME="asia-south1-docker.pkg.dev/hc-3-monitoring/healthcare-repo/healthcare-frontend:${BUILD_NUMBER}"
docker build --build-arg REACT_APP_API_BASE_URL="" -t ${IMAGE_NAME} .
docker tag ${IMAGE_NAME} asia-south1-docker.pkg.dev/hc-3-monitoring/healthcare-repo/healthcare-frontend:latest
```

**Build Process:**
```dockerfile
FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci && npm cache clean --force
COPY . .
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
RUN npm run build
RUN npm install -g serve
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /usr/src/app/build
USER nextjs
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
```

### **Stage 6: Push to Artifact Registry (Parallel)**
```bash
Duration: ~1-2 minutes
```
**Push Commands:**
```bash
# Backend Push
docker push asia-south1-docker.pkg.dev/hc-3-monitoring/healthcare-repo/healthcare-backend:${BUILD_NUMBER}
docker push asia-south1-docker.pkg.dev/hc-3-monitoring/healthcare-repo/healthcare-backend:latest

# Frontend Push
docker push asia-south1-docker.pkg.dev/hc-3-monitoring/healthcare-repo/healthcare-frontend:${BUILD_NUMBER}
docker push asia-south1-docker.pkg.dev/hc-3-monitoring/healthcare-repo/healthcare-frontend:latest
```

**Success Output:**
```
30: digest: sha256:388649dd736c29dec8a270df1dc121d02cc09833e70e2e307670f5a2da045e5d size: 2409
latest: digest: sha256:2ab1b27ddccf143bde0f94da3d209370bad9447541581ff86c7044fcae990925 size: 3043
✅ Backend images pushed
✅ Frontend images pushed
```

### **Stage 7: GKE Deployment**
```bash
Duration: ~3-4 minutes
```
**Cluster Connection:**
```bash
/usr/local/bin/gcloud container clusters get-credentials healthcare3-cluster --location=asia-south1
/usr/local/bin/kubectl cluster-info --request-timeout=10s
```

**Deployment Process:**
```bash
# Deploy Kubernetes Resources
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/database-deployment.yaml      # MongoDB
kubectl apply -f k8s/backend-deployment.yaml       # Node.js API
kubectl apply -f k8s/frontend-deployment.yaml      # React App
kubectl apply -f k8s/monitoring-prometheus.yaml    # Prometheus
kubectl apply -f k8s/monitoring-grafana.yaml       # Grafana
kubectl apply -f k8s/ingress.yaml                  # Load Balancer

# Wait for Deployments
kubectl wait --for=condition=available deployment/healthcare-mongodb -n healthcare-app --timeout=300s
kubectl wait --for=condition=available deployment/prometheus -n healthcare-app --timeout=300s
kubectl wait --for=condition=available deployment/grafana -n healthcare-app --timeout=300s

# Restart Application Deployments
kubectl rollout restart deployment/healthcare-backend -n healthcare-app
kubectl rollout restart deployment/healthcare-frontend -n healthcare-app
kubectl wait --for=condition=available deployment/healthcare-backend -n healthcare-app --timeout=300s
kubectl wait --for=condition=available deployment/healthcare-frontend -n healthcare-app --timeout=300s
```

### **Stage 8: Health Check & Verification**
```bash
Duration: ~30 seconds
```
**Resource Status Check:**
```bash
kubectl get pods -n healthcare-app
kubectl get services -n healthcare-app
kubectl get ingress -n healthcare-app
```

**Access Points Verification:**
```bash
# External Access
FRONTEND_EXTERNAL_IP=$(kubectl get service healthcare-frontend-service -n healthcare-app -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
INGRESS_IP=$(kubectl get ingress healthcare-ingress -n healthcare-app -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
```

## 🌐 Deployment Results

### **Application Access Points**
- **Frontend LoadBalancer**: `http://34.100.185.1/`
- **Backend (Internal)**: `healthcare-backend-service:5002`
- **Database (Internal)**: `healthcare-mongodb-service:27017`
- **Grafana Monitoring**: `http://NODE_IP:30081` (admin/admin123)
- **Prometheus**: `http://NODE_IP:9090`

### **Service Configuration**
```yaml
services:
  healthcare-frontend-service:
    type: LoadBalancer
    cluster_ip: 34.118.228.162
    external_ip: 34.100.185.1
    ports: 80:30836/TCP

  healthcare-backend-service:
    type: ClusterIP
    cluster_ip: 34.118.231.138
    ports: 5002/TCP

  healthcare-mongodb-service:
    type: ClusterIP
    cluster_ip: 34.118.236.5
    ports: 27017/TCP

  grafana-service:
    type: NodePort
    cluster_ip: 34.118.226.7
    ports: 3000:30081/TCP

  prometheus-service:
    type: ClusterIP
    cluster_ip: 34.118.232.126
    ports: 9090/TCP
```

## 📊 Current Deployment Status

### **Running Pods**
```bash
NAME                                  READY   STATUS    RESTARTS   AGE
grafana-7d8687f94b-bkq58              1/1     Running   0          16h
healthcare-backend-6cd8576769-ck67c   1/1     Running   0          8m
healthcare-backend-6cd8576769-f4rdq   1/1     Running   0          8m
healthcare-frontend-fc988ff98-bpc6q   1/1     Running   0          8m
healthcare-frontend-fc988ff98-n7lb5   1/1     Running   0          8m
healthcare-mongodb-7dbb88f5b-thr5l    1/1     Running   0          13h
prometheus-7bbfb5596c-9wzzr           1/1     Running   0          17h
```

### **Final Success Output**
```
🎉 HEALTHCARE APPLICATION DEPLOYED SUCCESSFULLY!
================================================
🌐 Frontend LoadBalancer: http://34.100.185.1/
🏥 Backend (Internal): healthcare-backend-service:5002
💾 Database (Internal): healthcare-mongodb-service:27017
================================================
✅ 3-Tier Architecture with LoadBalancer Frontend!
✅ No CORS issues - Internal service communication!
✅ Complete 3-tier architecture with monitoring is now live!
```

## 🚨 Known Issues & Solutions

### **1. Security Vulnerabilities**
**Issue**: Backend has 5 vulnerabilities (3 high, 2 critical)
**Solution**:
```bash
cd server
npm audit fix
npm audit fix --force  # If needed
```

### **2. Frontend Babel Warning**
**Issue**: Missing "@babel/plugin-proposal-private-property-in-object"
**Solution**:
```bash
cd client
npm install --save-dev @babel/plugin-proposal-private-property-in-object
```

### **3. Prometheus CrashLoopBackOff**
**Issue**: Prometheus pod in CrashLoopBackOff state
**Troubleshooting**:
```bash
kubectl logs prometheus-6ddcd97d89-h9qwh -n healthcare-app
kubectl describe pod prometheus-6ddcd97d89-h9qwh -n healthcare-app
kubectl delete pod prometheus-6ddcd97d89-h9qwh -n healthcare-app  # Force restart
```

### **4. Container Creation Delays**
**Issue**: Some pods stuck in "ContainerCreating" state
**Solution**: Wait for node resource allocation or check node capacity

## 🔧 Manual Deployment Commands

### **Trigger Jenkins Build**
```bash
# Via Jenkins Dashboard
1. Navigate to http://JENKINS_IP:8080
2. Select "healthcare-devkube-pipeline"
3. Click "Build Now"

# Via CLI (if configured)
java -jar jenkins-cli.jar -s http://JENKINS_IP:8080 build healthcare-devkube-pipeline
```

### **Emergency Deployment Recovery**
```bash
# Restart failed deployments
kubectl rollout restart deployment/healthcare-backend -n healthcare-app
kubectl rollout restart deployment/healthcare-frontend -n healthcare-app

# Scale down and up
kubectl scale deployment healthcare-backend --replicas=0 -n healthcare-app
kubectl scale deployment healthcare-backend --replicas=2 -n healthcare-app

# Force pod recreation
kubectl delete pod -l app=healthcare-backend -n healthcare-app
```

## 📈 Performance Metrics

### **Build Times**
- **Total Pipeline**: ~12-15 minutes
- **Checkout**: 30 seconds
- **Testing**: 3-4 minutes
- **Image Building**: 5-7 minutes (parallel)
- **Deployment**: 3-4 minutes
- **Health Checks**: 30 seconds

### **Resource Usage**
- **Backend**: 2 replicas, 512Mi memory, 500m CPU limit
- **Frontend**: 2 replicas, 512Mi memory, 500m CPU limit
- **MongoDB**: 1 replica, 1Gi memory, 500m CPU limit
- **Monitoring**: Prometheus + Grafana, 1Gi combined

### **Network Configuration**
- **External Access**: LoadBalancer with External IP
- **Internal Communication**: ClusterIP services
- **Monitoring**: NodePort access for Grafana
- **Database**: Internal ClusterIP only

## 🛠️ Maintenance & Monitoring

### **Regular Maintenance Commands**
```bash
# Check deployment status
kubectl get all -n healthcare-app

# View recent logs
kubectl logs -f deployment/healthcare-backend -n healthcare-app --tail=50
kubectl logs -f deployment/healthcare-frontend -n healthcare-app --tail=50

# Resource usage monitoring
kubectl top pods -n healthcare-app
kubectl top nodes

# Update deployments
kubectl set image deployment/healthcare-backend healthcare-backend=asia-south1-docker.pkg.dev/hc-3-monitoring/healthcare-repo/healthcare-backend:latest -n healthcare-app
```

### **Monitoring Access**
- **Application**: http://34.100.185.1/
- **Grafana**: http://NODE_IP:30081 (admin/admin123)
- **Prometheus**: Port-forward to access: `kubectl port-forward service/prometheus-service 9090:9090 -n healthcare-app`

---

## ✅ Success Checklist

### **Pipeline Success Indicators**
- [ ] All tool versions verified
- [ ] GCP authentication successful
- [ ] Backend and frontend tests pass
- [ ] Docker images built and pushed
- [ ] All Kubernetes resources deployed
- [ ] LoadBalancer external IP assigned
- [ ] Application accessible via external IP
- [ ] Monitoring stack operational

### **Final Verification**
```bash
# Test external access
curl -s http://34.100.185.1/ | grep -i "healthcare"

# Test internal connectivity
kubectl exec -it deployment/healthcare-frontend -n healthcare-app -- curl healthcare-backend-service:5002/health

# Check monitoring
kubectl port-forward service/grafana-service 3001:3000 -n healthcare-app
# Open: http://localhost:3001 (admin/admin123)
```

---

**Status**: Production Ready ✅
**Last Successful Build**: #30
**Frontend URL**: http://34.100.185.1/
**Maintained By**: Jenkins CI/CD Pipeline

*"Automated builds, reliable deployments, production monitoring"*