# 🔗 Hybrid Jenkins-GitHub Actions Setup Guide

## 📋 Jenkins Information

- **Jenkins URL**: http://35.244.31.122:8080/
- **Username**: hemanth
- **Password**: hemanth2222
- **API Token**: 11ea66692dd8158f417776d072bc17a4da
- **Token Name**: testapitoken

## 🔧 Required GitHub Secrets

You need to add these secrets to your GitHub repository:

### **1. Navigate to GitHub Secrets**
1. Go to your repository: https://github.com/Mr-Hemanth/Healthcare-devkube
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

### **2. Add These Secrets:**

#### **JENKINS_USER**
```
Name: JENKINS_USER
Value: hemanth
```

#### **JENKINS_API_TOKEN**
```
Name: JENKINS_API_TOKEN
Value: 11ea66692dd8158f417776d072bc17a4da
```

#### **GCP_SERVICE_ACCOUNT_KEY** (if not already added)
```
Name: GCP_SERVICE_ACCOUNT_KEY
Value: [Your base64 encoded GCP service account JSON key]
```

## 🚀 How to Trigger the Hybrid Pipeline

### **Option 1: Automatic Trigger**
```bash
git add .
git commit -m "Test hybrid pipeline"
git push origin main
```

### **Option 2: Manual Trigger**
1. Go to GitHub repository
2. Click **Actions** tab
3. Select "Hybrid Jenkins-GitHub Actions Pipeline"
4. Click **Run workflow**
5. Select branch and click **Run workflow**

### **Option 3: Test Branch**
```bash
git checkout -b hybrid-pipeline
git add .
git commit -m "Test hybrid Jenkins-GitHub pipeline"
git push origin hybrid-pipeline
```

## 🔄 Pipeline Flow

### **Stage 1: GitHub Actions - Checkout**
- Repository checkout
- Prerequisites verification
- Git information collection

### **Stage 2: Jenkins VM Testing**
```
🔧 Test Jenkins VM Connectivity
  ↓ GET http://35.244.31.122:8080/login

🧪 Trigger Jenkins Testing Job
  ↓ POST http://35.244.31.122:8080/job/healthcare-devkube-pipeline/build
  ↓ Using: hemanth:11ea66692dd8158f417776d072bc17a4da

⏳ Wait for Jenkins Job Completion
  ↓ Monitor build status via API
  ↓ Timeout: 20 minutes
  ↓ Get console logs if failed
```

### **Stage 3: GitHub Actions - Deployment**
```
🔐 Setup GCP Authentication
  ↓
🐳 Build & Push Docker Images (Parallel)
  ↓
🚀 Deploy 3-Tier Atlas Architecture
  ↓
📊 Deploy Monitoring Stack
  ↓
🩺 Final Health Check
```

## 📊 Expected Results

### **Jenkins Testing Output:**
```
✅ Jenkins VM is accessible
✅ Jenkins job triggered successfully
Monitoring Jenkins build #31
Build #31 status: BUILDING
Build #31 status: SUCCESS
✅ Jenkins job completed successfully!
```

### **GitHub Actions Deployment:**
```
🏗️ DEPLOYING 3-TIER ATLAS ARCHITECTURE
🧪 Tested by: Jenkins VM (healthcare-devkube-pipeline)
🚀 Deployed by: GitHub Actions (Cloud Native)
✅ 3-Tier Atlas Architecture deployed successfully!
```

## 🚨 Troubleshooting

### **Common Issues:**

#### **1. Jenkins VM Not Accessible**
```bash
❌ Jenkins VM is not accessible
```
**Solution:**
- Check if Jenkins VM is running: `gcloud compute instances list`
- Verify firewall rules allow port 8080
- Check if Jenkins service is running on VM

#### **2. Jenkins Authentication Failed**
```bash
❌ Failed to trigger Jenkins job
```
**Solution:**
- Verify username: `hemanth`
- Verify API token: `11ea66692dd8158f417776d072bc17a4da`
- Check if token has required permissions

#### **3. Jenkins Job Failed**
```bash
❌ Jenkins job failed with status: FAILURE
```
**Solution:**
- Check Jenkins console output (automatically shown)
- Fix issues in Jenkins environment
- Re-run the GitHub Actions workflow

#### **4. Jenkins Job Timeout**
```bash
❌ Jenkins job timed out after 20 minutes
```
**Solution:**
- Check Jenkins job manually: http://35.244.31.122:8080/job/healthcare-devkube-pipeline/
- Increase timeout in workflow if needed
- Check for stuck builds in Jenkins

## 🔧 Manual Testing

### **Test Jenkins Connectivity:**
```bash
# Test Jenkins login page
curl -f "http://35.244.31.122:8080/login"

# Test Jenkins API with your credentials
curl -u "hemanth:11ea66692dd8158f417776d072bc17a4da" \
  "http://35.244.31.122:8080/api/json"

# Trigger job manually
curl -u "hemanth:11ea66692dd8158f417776d072bc17a4da" \
  -X POST "http://35.244.31.122:8080/job/healthcare-devkube-pipeline/build"
```

### **Monitor Jenkins Job:**
```bash
# Get latest build number
curl -u "hemanth:11ea66692dd8158f417776d072bc17a4da" \
  "http://35.244.31.122:8080/job/healthcare-devkube-pipeline/api/json"

# Check build status
curl -u "hemanth:11ea66692dd8158f417776d072bc17a4da" \
  "http://35.244.31.122:8080/job/healthcare-devkube-pipeline/31/api/json"

# Get console output
curl -u "hemanth:11ea66692dd8158f417776d072bc17a4da" \
  "http://35.244.31.122:8080/job/healthcare-devkube-pipeline/31/consoleText"
```

## ✅ Success Indicators

### **Complete Success Flow:**
1. ✅ Jenkins VM connectivity test passes
2. ✅ Jenkins job triggered successfully (HTTP 201)
3. ✅ Jenkins job completes with SUCCESS status
4. ✅ GCP authentication setup completes
5. ✅ Docker images build and push successfully
6. ✅ Atlas architecture deployment completes
7. ✅ Monitoring stack deploys successfully
8. ✅ Health checks pass with external IP assignment

### **Final Success Message:**
```
🎉 HYBRID PIPELINE DEPLOYMENT COMPLETE
========================================
✅ Testing Platform: Jenkins VM (GCP)
✅ Deployment Platform: GitHub Actions
✅ Database Tier: MongoDB Atlas (External)
✅ Backend Tier: Node.js API (healthcare-backend)
✅ Frontend Tier: React App (healthcare-frontend)
✅ Monitoring: Prometheus + Grafana
🌐 Healthcare App: http://EXTERNAL_IP/
🔗 Hybrid Jenkins-GitHub Actions pipeline complete!
```

---

**Jenkins Server**: http://35.244.31.122:8080/
**GitHub Actions**: https://github.com/Mr-Hemanth/Healthcare-devkube/actions
**Pipeline Type**: Hybrid Testing + Deployment

*"Jenkins testing reliability + GitHub Actions cloud deployment power"*