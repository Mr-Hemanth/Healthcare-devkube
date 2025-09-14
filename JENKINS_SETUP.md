# Jenkins Pipeline Setup Guide

This guide covers the complete setup of Jenkins CI/CD pipeline for Healthcare DevKube project.

## Prerequisites

✅ Jenkins server running on GCP (External IP: 34.93.51.43:8080)
✅ GKE cluster (healthcare-cluster) created
✅ Service account (jenkins-sa) with proper permissions
✅ Artifact Registry repository created

## Step 1: Jenkins Pipeline Job Configuration

### 1.1 Create New Pipeline Job

1. Access Jenkins at `http://34.93.51.43:8080`
2. Click "New Item"
3. Enter name: `healthcare-devkube-pipeline`
4. Select "Pipeline" and click OK

### 1.2 Configure Pipeline

**General Settings:**
- ✅ Description: "CI/CD Pipeline for Healthcare DevKube Application"
- ✅ Discard old builds: Keep max 10 builds

**Build Triggers:**
- ✅ GitHub hook trigger for GITScm polling
- ✅ Poll SCM: Leave schedule empty (webhook will trigger)

**Pipeline Configuration:**
- ✅ Definition: Pipeline script from SCM
- ✅ SCM: Git
- ✅ Repository URL: `https://github.com/YOUR_USERNAME/Healthcare-devkube.git`
- ✅ Credentials: Add GitHub personal access token
- ✅ Branch: `*/main`
- ✅ Script Path: `Jenkinsfile`

**Advanced Project Options:**
- ✅ Quiet period: 5 seconds
- ✅ Retry count: 3

### 1.3 Add Required Credentials

#### GCP Service Account Key
1. Go to "Manage Jenkins" → "Credentials"
2. Click "System" → "Global credentials"
3. Click "Add Credentials"
4. Type: "Secret file"
5. File: Upload `jenkins-key.json`
6. ID: `gcp-service-account-key`
7. Description: "GCP Service Account for Healthcare DevKube"

#### GitHub Personal Access Token
1. Create PAT at: https://github.com/settings/tokens
2. Permissions needed:
   - repo (all)
   - admin:repo_hook (for webhooks)
3. Add to Jenkins:
   - Type: "Username with password"
   - Username: Your GitHub username
   - Password: Personal access token
   - ID: `github-pat`

## Step 2: GitHub Webhook Configuration

### 2.1 Add Webhook to Repository

1. Go to your GitHub repository
2. Click "Settings" → "Webhooks"
3. Click "Add webhook"
4. Configure:
   - **Payload URL**: `http://34.93.51.43:8080/github-webhook/`
   - **Content type**: `application/json`
   - **Secret**: Leave empty
   - **Events**: "Just the push event"
   - **Active**: ✅ Checked

### 2.2 Test Webhook

1. After creating webhook, GitHub will send a ping
2. Check "Recent Deliveries" tab
3. Should see green checkmark for successful delivery
4. Response should be 200 OK

## Step 3: Test Pipeline Execution

### 3.1 Manual Trigger

1. Go to Jenkins dashboard
2. Click on "healthcare-devkube-pipeline"
3. Click "Build Now"
4. Monitor build progress in "Build History"

### 3.2 Automatic Trigger Test

1. Make a small change to repository (e.g., README.md)
2. Commit and push to main branch:
   ```bash
   git add .
   git commit -m "Test CI/CD trigger"
   git push origin main
   ```
3. Check Jenkins dashboard - build should start automatically
4. Webhook should appear in GitHub webhook delivery history

## Step 4: Pipeline Stages Verification

Your pipeline includes these stages:

1. **Checkout** - Clone repository ✅
2. **Setup GCP Authentication** - Authenticate with service account ✅
3. **Test Backend** - Run backend tests ✅
4. **Test Frontend** - Run React tests ✅
5. **Build Docker Images** - Build both frontend & backend ✅
6. **Push Images** - Push to Artifact Registry ✅
7. **Deploy to GKE** - Deploy to Kubernetes cluster ✅
8. **Health Check** - Verify deployment health ✅

## Step 5: Monitoring and Logs

### Check Pipeline Logs
```bash
# In Jenkins UI
Build History → Click build number → Console Output
```

### Check Kubernetes Deployment
```bash
# Connect to GKE cluster
gcloud container clusters get-credentials healthcare-cluster --zone=asia-south1

# Check deployment status
kubectl get all -n healthcare-app

# Check application logs
kubectl logs -f deployment/healthcare-backend -n healthcare-app
kubectl logs -f deployment/healthcare-frontend -n healthcare-app
```

### Access Application
```bash
# Get external access URL
kubectl get service healthcare-frontend-service -n healthcare-app
kubectl get nodes -o wide

# Application will be accessible at:
# http://NODE_EXTERNAL_IP:30080
```

## Step 6: Troubleshooting

### Common Issues

**Build Fails at GCP Authentication:**
- Verify service account key is uploaded correctly
- Check service account has required permissions:
  - roles/container.developer
  - roles/artifactregistry.writer

**Docker Build Fails:**
- Check Dockerfile syntax in client/ and server/ directories
- Ensure all dependencies are properly specified

**GKE Deployment Fails:**
- Verify cluster credentials
- Check if namespace exists: `kubectl get ns healthcare-app`
- Verify image names match Artifact Registry format

**Webhook Not Triggering:**
- Check GitHub webhook delivery status
- Verify Jenkins URL is accessible: `http://34.93.51.43:8080/github-webhook/`
- Ensure firewall allows inbound traffic on port 8080

### Useful Commands

```bash
# Check Jenkins logs
sudo journalctl -u jenkins -f

# Restart Jenkins service
sudo systemctl restart jenkins

# Check Docker images
docker images | grep healthcare

# Manual deployment test
cd k8s/
./deploy.sh
```

## Security Considerations

- ✅ Use service accounts instead of user credentials
- ✅ Store sensitive data in Jenkins credentials store
- ✅ Regularly rotate service account keys
- ✅ Review webhook delivery logs for suspicious activity
- ✅ Keep Jenkins and plugins updated

## Expected Results

After successful setup:
- ✅ Every push to main branch triggers automatic deployment
- ✅ Applications are accessible via NodePort service
- ✅ Rolling updates work seamlessly
- ✅ Build history and logs are preserved in Jenkins
- ✅ Container images are stored in Artifact Registry

---

**Next Steps:** [MONITORING_SETUP.md](MONITORING_SETUP.md)