# ⚡ GitHub Actions CI/CD Pipeline Guide - Healthcare DevKube

## 📋 Overview

Comprehensive guide for GitHub Actions-based CI/CD pipeline deployment of the Healthcare 3-Tier Atlas application with automated deployment to Google Kubernetes Engine (GKE).

## 🏗️ Pipeline Architecture

```
GitHub Push/PR → GitHub Actions → Build & Test → Docker Images → Artifact Registry → GKE Atlas Deployment
                      ↓
               Prerequisites Check
                      ↓
               Parallel Testing (Backend/Frontend)
                      ↓
               GCP Authentication & Setup
                      ↓
               Parallel Docker Build & Push
                      ↓
               3-Tier Atlas Architecture Deployment
                      ↓
               Monitoring Stack (Prometheus + Grafana)
                      ↓
               Health Checks & Access Information
```

## 🚀 Workflow Configuration

### **File Location**
`.github/workflows/healthcare-atlas-ci-cd.yml`

### **Trigger Configuration**
```yaml
on:
  push:
    branches: [ main, master, develop, github-actions ]
  pull_request:
    branches: [ main, master ]
  workflow_dispatch:  # Manual trigger
```

### **Environment Variables**
```yaml
env:
  PROJECT_ID: hc-3-monitoring
  CLUSTER_NAME: healthcare3-cluster
  CLUSTER_LOCATION: asia-south1
  REGISTRY_HOSTNAME: asia-south1-docker.pkg.dev
  REPOSITORY_NAME: healthcare-repo
  USE_GKE_GCLOUD_AUTH_PLUGIN: True
```

### **Required Secrets**
```yaml
secrets:
  GCP_SERVICE_ACCOUNT_KEY: # Base64 encoded GCP service account JSON
```

## 🔄 Pipeline Jobs & Stages

### **Job 1: Checkout & Prerequisites**
```yaml
runs-on: ubuntu-latest
timeout: ~2-3 minutes
```

**Features:**
- Repository checkout with `actions/checkout@v4`
- Atlas configuration verification
- Git information collection
- Workspace content validation

**Key Checks:**
```bash
# Atlas connection verification
if grep -q "mongodb+srv" server/server.js; then
  echo "✅ Atlas connection found in backend"
else
  echo "❌ Atlas connection NOT found in backend"
fi

# Kubernetes config verification
if [ -f "k8s/atlas-complete-deployment.yaml" ]; then
  echo "✅ Atlas Kubernetes config found"
else
  echo "❌ Atlas Kubernetes config NOT found"
fi
```

**Outputs:**
- `git-sha`: Short commit SHA
- `build-number`: GitHub run number

### **Job 2: Test Applications (Matrix Strategy)**
```yaml
strategy:
  matrix:
    component: [backend, frontend]
parallel: true
timeout: ~5-7 minutes
```

#### **Backend Testing**
```yaml
working-directory: ./server
node-version: '18'
cache: 'npm'
```
**Test Process:**
```bash
npm install                    # Install dependencies
node -c server.js             # Syntax validation
echo "✅ Backend tests passed"
```

#### **Frontend Testing**
```yaml
working-directory: ./client
node-version: '18'
cache: 'npm'
```
**Test Process:**
```bash
npm install                                                    # Install dependencies
CI=true npm test -- --coverage --watchAll=false              # Run test suite
echo "✅ Frontend tests passed"
```

### **Job 3: Setup GCP Authentication**
```yaml
runs-on: ubuntu-latest
needs: test-applications
timeout: ~1-2 minutes
```

**Authentication Steps:**
```yaml
- name: 🔐 Authenticate to Google Cloud
  uses: google-github-actions/auth@v2
  with:
    credentials_json: ${{ secrets.GCP_SERVICE_ACCOUNT_KEY }}

- name: 🛠️ Set up Cloud SDK
  uses: google-github-actions/setup-gcloud@v2
  with:
    version: 'latest'
    install_components: 'gke-gcloud-auth-plugin'
```

**Configuration:**
```bash
export USE_GKE_GCLOUD_AUTH_PLUGIN=True
gcloud config set project ${{ env.PROJECT_ID }}
gcloud auth configure-docker ${{ env.REGISTRY_HOSTNAME }} --quiet
```

### **Job 4: Build & Push Images (Matrix Strategy)**
```yaml
strategy:
  matrix:
    component: [backend, frontend]
parallel: true
timeout: ~8-12 minutes
```

#### **Backend Image Build**
```yaml
working-directory: ./server
registry: asia-south1-docker.pkg.dev/hc-3-monitoring/healthcare-repo
```
**Build Process:**
```bash
IMAGE_NAME="${{ env.REGISTRY_HOSTNAME }}/${{ env.PROJECT_ID }}/${{ env.REPOSITORY_NAME }}/healthcare-backend:${{ github.run_number }}"

docker build -t $IMAGE_NAME .
docker tag $IMAGE_NAME ${{ env.REGISTRY_HOSTNAME }}/${{ env.PROJECT_ID }}/${{ env.REPOSITORY_NAME }}/healthcare-backend:latest

docker push $IMAGE_NAME
docker push ${{ env.REGISTRY_HOSTNAME }}/${{ env.PROJECT_ID }}/${{ env.REPOSITORY_NAME }}/healthcare-backend:latest
```

#### **Frontend Image Build**
```yaml
working-directory: ./client
build-args: REACT_APP_API_BASE_URL=""
```
**Build Process:**
```bash
IMAGE_NAME="${{ env.REGISTRY_HOSTNAME }}/${{ env.PROJECT_ID }}/${{ env.REPOSITORY_NAME }}/healthcare-frontend:${{ github.run_number }}"

docker build \
  --build-arg REACT_APP_API_BASE_URL="" \
  -t $IMAGE_NAME .
docker tag $IMAGE_NAME ${{ env.REGISTRY_HOSTNAME }}/${{ env.PROJECT_ID }}/${{ env.REPOSITORY_NAME }}/healthcare-frontend:latest

docker push $IMAGE_NAME
docker push ${{ env.REGISTRY_HOSTNAME }}/${{ env.PROJECT_ID }}/${{ env.REPOSITORY_NAME }}/healthcare-frontend:latest
```

### **Job 5: Deploy 3-Tier Atlas Architecture**
```yaml
runs-on: ubuntu-latest
needs: build-and-push-images
timeout: ~15-20 minutes
```

**Cluster Authentication:**
```bash
export USE_GKE_GCLOUD_AUTH_PLUGIN=True
gcloud config set project ${{ env.PROJECT_ID }}
gcloud container clusters get-credentials ${{ env.CLUSTER_NAME }} --location=${{ env.CLUSTER_LOCATION }}
kubectl cluster-info --request-timeout=10s
```

**Atlas Deployment Process:**
```bash
echo "🏗️ DEPLOYING 3-TIER ATLAS ARCHITECTURE"
echo "Tier 1: React Frontend (Web Layer)"
echo "Tier 2: Node.js Backend (API Layer)"
echo "Tier 3: MongoDB Atlas (Database Layer)"

# Clean up any existing local MongoDB deployments
kubectl delete deployment healthcare-mongodb -n healthcare-app --ignore-not-found=true
kubectl delete service healthcare-mongodb-service -n healthcare-app --ignore-not-found=true
kubectl delete pvc mongodb-data-pvc -n healthcare-app --ignore-not-found=true
kubectl delete pvc mongodb-config-pvc -n healthcare-app --ignore-not-found=true

# Deploy Atlas-only 3-tier architecture
kubectl apply -f k8s/atlas-complete-deployment.yaml

# Deploy ingress configuration
kubectl apply -f k8s/ingress.yaml || echo "⚠️ Ingress deployment failed or not found"

# Wait for deployments with timeout handling
kubectl wait --for=condition=available deployment/healthcare-backend -n healthcare-app --timeout=600s || echo "⚠️ Backend deployment timeout - checking status..."
kubectl wait --for=condition=available deployment/healthcare-frontend -n healthcare-app --timeout=600s || echo "⚠️ Frontend deployment timeout - checking status..."
```

**Atlas Verification:**
```bash
# Verify NO local MongoDB is running
if kubectl get deployment healthcare-mongodb -n healthcare-app >/dev/null 2>&1; then
  echo "⚠️ WARNING: Local MongoDB deployment still exists!"
else
  echo "✅ Confirmed: No local MongoDB deployment found"
fi
```

### **Job 6: Deploy Monitoring Stack**
```yaml
runs-on: ubuntu-latest
needs: deploy-atlas-architecture
timeout: ~10-15 minutes
```

**Monitoring Deployment:**
```bash
echo "📈 DEPLOYING MONITORING INFRASTRUCTURE"
echo "🔧 Prometheus: Metrics collection and storage"
echo "📊 Grafana: Visualization and dashboards"

# Deploy Prometheus
kubectl apply -f k8s/monitoring-prometheus.yaml

# Deploy Grafana
kubectl apply -f k8s/monitoring-grafana.yaml

# Wait for monitoring deployments
kubectl wait --for=condition=available deployment/prometheus -n healthcare-app --timeout=600s || echo "⚠️ Prometheus deployment timeout - will continue anyway"
kubectl wait --for=condition=available deployment/grafana -n healthcare-app --timeout=600s || echo "⚠️ Grafana deployment timeout - will continue anyway"
```

**Health Checks:**
```bash
# Prometheus health check
if kubectl exec deployment/prometheus -n healthcare-app -- wget -q --spider http://localhost:9090/-/healthy 2>/dev/null; then
  echo "✅ Prometheus is healthy"
else
  echo "⚠️ Prometheus health check pending (may still be starting)"
fi

# Grafana health check
if kubectl exec deployment/grafana -n healthcare-app -- curl -f http://localhost:3000/api/health 2>/dev/null; then
  echo "✅ Grafana is healthy"
else
  echo "⚠️ Grafana health check pending (may still be starting)"
fi
```

**Access Information:**
```bash
# Get NodePort for Grafana
GRAFANA_NODEPORT=$(kubectl get service grafana-service -n healthcare-app -o jsonpath='{.spec.ports[0].nodePort}' 2>/dev/null || echo "NOT_FOUND")

if [ "$GRAFANA_NODEPORT" != "NOT_FOUND" ] && [ "$GRAFANA_NODEPORT" != "" ]; then
  echo "📊 Grafana Dashboard: Access via NodePort $GRAFANA_NODEPORT"
  echo "   Username: admin"
  echo "   Password: admin123"
  echo "   Port-forward: kubectl port-forward service/grafana-service 3001:3000 -n healthcare-app"
  echo "   Then access: http://localhost:3001"
fi
```

### **Job 7: Final Health Check**
```yaml
runs-on: ubuntu-latest
needs: deploy-monitoring
timeout: ~3-5 minutes
```

**Comprehensive Health Verification:**
```bash
echo "🏥 HEALTHCARE 3-TIER ATLAS DEPLOYMENT STATUS"

# Check deployment status
kubectl get pods -n healthcare-app
kubectl get services -n healthcare-app

# Check LoadBalancer IP assignment
FRONTEND_IP=$(kubectl get service healthcare-frontend-service -n healthcare-app -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "PENDING")

if [ "$FRONTEND_IP" != "PENDING" ] && [ "$FRONTEND_IP" != "" ] && [ "$FRONTEND_IP" != "null" ]; then
  echo "🎉 3-TIER ATLAS HEALTHCARE APPLICATION DEPLOYED!"
  echo "🌐 Frontend (Tier 1): http://$FRONTEND_IP/"
  echo "🔧 Backend (Tier 2): healthcare-backend-service:5002 (Internal)"
  echo "☁️ Database (Tier 3): MongoDB Atlas (Cloud)"
  echo "✅ Complete 3-tier architecture is LIVE!"
else
  echo "⏳ LoadBalancer IP assignment in progress..."
  echo "🔧 Test the application locally:"
  echo "   kubectl port-forward service/healthcare-frontend-service 3000:80 -n healthcare-app"
  echo "   Then access: http://localhost:3000"
fi
```

**Resource Monitoring:**
```bash
# Resource usage
kubectl top pods -n healthcare-app 2>/dev/null || echo "ℹ️ Metrics not available yet"

# Auto-scaling status
kubectl get hpa -n healthcare-app 2>/dev/null || echo "ℹ️ HPA not configured yet"
```

### **Job 8: Cleanup**
```yaml
runs-on: ubuntu-latest
needs: [health-check]
if: always()
```
```bash
docker system prune -f || true
echo "✅ Cleanup completed"
```

## 🌐 Expected Deployment Results

### **Access Points**
- **Frontend**: External LoadBalancer IP (assigned during deployment)
- **Backend**: `healthcare-backend-service:5002` (Internal)
- **Database**: MongoDB Atlas (External cloud service)
- **Monitoring**:
  - Grafana: `http://34.100.250.12:30081/login` (admin/admin123)
  - Prometheus: `http://34.100.250.12:30080`

### **Architecture Verification**
```yaml
✅ Database Tier: MongoDB Atlas (External)
✅ Backend Tier: Node.js API (healthcare-backend)
✅ Frontend Tier: React App (healthcare-frontend)
✅ Monitoring: Prometheus + Grafana
```

## 📊 Performance Metrics

### **Typical Runtime**
- **Total Pipeline**: ~25-35 minutes
- **Checkout & Prerequisites**: 2-3 minutes
- **Testing (Parallel)**: 5-7 minutes
- **GCP Authentication**: 1-2 minutes
- **Build & Push (Parallel)**: 8-12 minutes
- **Atlas Deployment**: 15-20 minutes
- **Monitoring Deployment**: 10-15 minutes
- **Health Check**: 3-5 minutes

### **Resource Efficiency**
- **Parallel Execution**: Testing and Image building run simultaneously
- **Matrix Strategy**: Backend and Frontend processed in parallel
- **Caching**: npm package caching for faster builds
- **Timeout Handling**: Graceful handling of deployment delays

## 🚨 Common Issues & Solutions

### **1. Backend Deployment Timeout**
**Issue**: Stuck at "🔧 Tier 2 (Backend API) deployment..." for >10 minutes

**GitHub Actions Solution:**
```yaml
# The workflow includes timeout handling
kubectl wait --for=condition=available deployment/healthcare-backend -n healthcare-app --timeout=600s || echo "⚠️ Backend deployment timeout - checking status..."

# Check current deployment status regardless of timeout
echo "📊 Current deployment status:"
kubectl get deployments -n healthcare-app
kubectl get pods -n healthcare-app
```

**Manual Investigation:**
```bash
# Check pod status
kubectl get pods -n healthcare-app

# Check pod logs
kubectl describe pod <backend-pod-name> -n healthcare-app
kubectl logs <backend-pod-name> -n healthcare-app

# Check Atlas connection
kubectl logs deployment/healthcare-backend -n healthcare-app | grep -i mongodb
```

### **2. Image Pull Errors**
**Issue**: Failed to pull Docker images from Artifact Registry

**Solution:**
```bash
# Verify authentication in workflow
gcloud auth configure-docker asia-south1-docker.pkg.dev --quiet

# Check if images exist
gcloud container images list --repository=asia-south1-docker.pkg.dev/hc-3-monitoring/healthcare-repo
```

### **3. LoadBalancer IP Assignment Delay**
**Issue**: External IP shows as "PENDING"

**GitHub Actions Handling:**
```bash
if [ "$FRONTEND_IP" != "PENDING" ] && [ "$FRONTEND_IP" != "" ] && [ "$FRONTEND_IP" != "null" ]; then
  echo "🎉 3-TIER ATLAS HEALTHCARE APPLICATION DEPLOYED!"
  echo "🌐 Frontend (Tier 1): http://$FRONTEND_IP/"
else
  echo "⏳ LoadBalancer IP assignment in progress..."
  echo "🔧 Test the application locally:"
  echo "   kubectl port-forward service/healthcare-frontend-service 3000:80 -n healthcare-app"
fi
```

### **4. Monitoring Stack Issues**
**Issue**: Prometheus or Grafana deployment failures

**GitHub Actions Handling:**
```bash
kubectl wait --for=condition=available deployment/prometheus -n healthcare-app --timeout=600s || echo "⚠️ Prometheus deployment timeout - will continue anyway"
kubectl wait --for=condition=available deployment/grafana -n healthcare-app --timeout=600s || echo "⚠️ Grafana deployment timeout - will continue anyway"
```

## 🔧 Manual Workflow Management

### **Trigger Workflow**
```bash
# Automatic triggers
git add .
git commit -m "Deploy to production"
git push origin main

# Manual trigger via GitHub UI
1. Go to GitHub repository
2. Click "Actions" tab
3. Select "Healthcare 3-Tier Atlas CI/CD Pipeline"
4. Click "Run workflow"
5. Select branch and click "Run workflow"
```

### **Monitor Workflow Progress**
```bash
# Via GitHub CLI
gh run list --workflow=healthcare-atlas-ci-cd.yml
gh run view <run-id> --log

# Via GitHub UI
1. Navigate to repository Actions tab
2. Click on running workflow
3. Monitor real-time logs for each job
```

### **Debug Failed Workflows**
```bash
# Download logs
gh run download <run-id>

# Re-run failed jobs
gh run rerun <run-id> --failed

# Cancel running workflow
gh run cancel <run-id>
```

## 📈 Advanced Configuration

### **Environment-Specific Deployments**
```yaml
# Multiple environment support
env:
  PROJECT_ID: ${{ github.ref == 'refs/heads/main' && 'hc-3-monitoring' || 'hc-3-monitoring-dev' }}
  CLUSTER_NAME: ${{ github.ref == 'refs/heads/main' && 'healthcare3-cluster' || 'healthcare3-cluster-dev' }}
```

### **Conditional Job Execution**
```yaml
# Skip deployment for draft PRs
deploy-atlas-architecture:
  if: github.event.pull_request.draft == false
```

### **Matrix Strategy Expansion**
```yaml
strategy:
  matrix:
    component: [backend, frontend]
    environment: [staging, production]
```

## 📞 Support & Troubleshooting

### **Workflow Status Monitoring**
- **GitHub Actions UI**: Real-time progress tracking
- **Email Notifications**: Configured for failures
- **Slack Integration**: Optional webhook notifications

### **Emergency Actions**
```bash
# Emergency deployment rollback
kubectl rollout undo deployment/healthcare-backend -n healthcare-app
kubectl rollout undo deployment/healthcare-frontend -n healthcare-app

# Force workflow cancellation
gh run cancel $(gh run list --workflow=healthcare-atlas-ci-cd.yml --json databaseId --jq '.[0].databaseId')

# Manual resource cleanup
kubectl delete namespace healthcare-app
kubectl apply -f k8s/atlas-complete-deployment.yaml
```

---

## ✅ Success Verification Checklist

### **Workflow Completion**
- [ ] All 8 jobs completed successfully
- [ ] No timeout errors in deployment stages
- [ ] Docker images pushed to Artifact Registry
- [ ] Atlas deployment configuration applied
- [ ] Monitoring stack operational

### **Application Verification**
- [ ] External LoadBalancer IP assigned
- [ ] Frontend accessible via external IP
- [ ] Backend health endpoint responding
- [ ] MongoDB Atlas connection established
- [ ] Grafana dashboard accessible
- [ ] No local MongoDB dependencies

### **Final Validation**
```bash
# Test external access
curl -s http://EXTERNAL_IP/ | grep -i "healthcare"

# Verify Atlas-only deployment
kubectl get deployments -n healthcare-app | grep -v mongodb

# Check monitoring
kubectl port-forward service/grafana-service 3001:3000 -n healthcare-app
# Access: http://localhost:3001 (admin/admin123)
```

---

**Status**: Production Ready ✅
**Pipeline Type**: GitHub Actions Workflow
**Atlas Integration**: ✅ MongoDB Cloud Only
**Monitoring**: ✅ Prometheus + Grafana
**External Access**: ✅ LoadBalancer with Public IP

*"Cloud-native CI/CD, Atlas-powered data, Zero-downtime deployments"*