# Healthcare-devkube CI/CD Pipeline Implementation Guidelines

## Project Overview

This document provides a comprehensive implementation guide for setting up a complete CI/CD pipeline for the Healthcare-devkube application using Google Cloud Platform (GCP) services.

### Target Workflow
```
GitHub Commit → Jenkins Tests → Docker Build → Push to Registry → CI/CD Deploys → Kubernetes Cluster → App Accessible
```

### Architecture Components
- **Source Control**: GitHub (Public Repository)
- **CI/CD Server**: Jenkins on GCP Compute Engine
- **Container Registry**: GCP Artifact Registry
- **Orchestration**: Google Kubernetes Engine (GKE) Autopilot
- **Database**: MongoDB Atlas (Existing)
- **Region**: asia-south1 (South India)

### Application Stack
- **Frontend**: React.js (Port 3000)
- **Backend**: Node.js/Express (Port 5002)
- **Database**: MongoDB Atlas (Cloud)

---

## Implementation Checklist

### ✅ **Step 1: Prerequisites & Repository Setup**
- [ ] Ensure GitHub repository is **public** for free CI/CD minutes
- [ ] Verify client and server applications are **containerized** with proper Dockerfiles
- [ ] Confirm application works locally with Docker containers
- [ ] Test client connects to server on port 5002
- [ ] Validate MongoDB Atlas connection string is working
- [ ] Create or verify GCP account with billing enabled
- [ ] Check GCP free credits availability (~$300)

### ✅ **Step 2: GCP Project & API Setup**
- [ ] Create new GCP project for Healthcare-devkube
- [ ] Enable required APIs:
  - [ ] Compute Engine API
  - [ ] Google Kubernetes Engine API
  - [ ] Artifact Registry API
  - [ ] Container Registry API
  - [ ] Cloud Resource Manager API
- [ ] Set project as default: `gcloud config set project PROJECT_ID`
- [ ] Verify billing account is linked to project
- [ ] Set default region: `gcloud config set compute/region asia-south1`
- [ ] Set default zone: `gcloud config set compute/zone asia-south1-a`

### ✅ **Step 3: GCP Artifact Registry Setup**
- [ ] Create Artifact Registry repository:
  ```bash
  gcloud artifacts repositories create healthcare-repo \
    --repository-format=docker \
    --location=asia-south1 \
    --description="Healthcare application container images"
  ```
- [ ] Configure Docker authentication:
  ```bash
  gcloud auth configure-docker asia-south1-docker.pkg.dev
  ```
- [ ] Test repository access and permissions
- [ ] Create service account for Jenkins with Artifact Registry permissions

### ✅ **Step 4: Jenkins Server Setup on Compute Engine**
- [ ] Create Compute Engine instance:
  ```bash
  gcloud compute instances create jenkins-server \
    --zone=asia-south1-a \
    --machine-type=e2-standard-2 \
    --boot-disk-size=50GB \
    --boot-disk-type=pd-standard \
    --image-family=ubuntu-2004-lts \
    --image-project=ubuntu-os-cloud \
    --tags=jenkins-server
  ```
- [ ] Configure firewall rule for Jenkins (port 8080):
  ```bash
  gcloud compute firewall-rules create allow-jenkins \
    --allow tcp:8080 \
    --source-ranges 0.0.0.0/0 \
    --target-tags jenkins-server
  ```
- [ ] SSH into Jenkins server and install Java 17:
  ```bash
  sudo apt update
  sudo apt install -y openjdk-17-jdk
  ```
- [ ] Install Jenkins:
  ```bash
  curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null
  echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/ | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
  sudo apt update
  sudo apt install -y jenkins
  ```
- [ ] Install Docker:
  ```bash
  sudo apt install -y docker.io
  sudo usermod -aG docker jenkins
  sudo systemctl restart jenkins
  ```
- [ ] Install kubectl and gke-gcloud-auth-plugin:
  ```bash
  sudo apt-get update
  sudo apt-get install -y apt-transport-https ca-certificates gnupg
  curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo gpg --dearmor -o /usr/share/keyrings/kubernetes-archive-keyring.gpg
  echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
  sudo apt-get update
  sudo apt-get install -y kubectl
  gcloud components install gke-gcloud-auth-plugin
  ```
- [ ] Access Jenkins web interface using external IP:8080
- [ ] Complete Jenkins initial setup wizard
- [ ] Install required Jenkins plugins:
  - [ ] Git plugin
  - [ ] Docker plugin
  - [ ] Kubernetes plugin
  - [ ] Google Kubernetes Engine plugin
  - [ ] Pipeline plugin
  - [ ] GitHub Integration plugin

### ✅ **Step 5: GKE Autopilot Cluster Setup**
- [ ] Create GKE Autopilot cluster:
  ```bash
  gcloud container clusters create-auto healthcare-cluster \
    --location=asia-south1 \
    --service-account=jenkins-sa@PROJECT_ID.iam.gserviceaccount.com
  ```
- [ ] Configure kubectl access:
  ```bash
  gcloud container clusters get-credentials healthcare-cluster \
    --location=asia-south1
  ```
- [ ] Verify cluster access: `kubectl get nodes`
- [ ] Create namespace for application:
  ```bash
  kubectl create namespace healthcare-app
  ```
- [ ] Test cluster connectivity from Jenkins server

### ✅ **Step 6: Service Account & IAM Setup**
- [ ] Create Jenkins service account:
  ```bash
  gcloud iam service-accounts create jenkins-sa \
    --description="Service account for Jenkins CI/CD" \
    --display-name="Jenkins Service Account"
  ```
- [ ] Grant necessary permissions:
  ```bash
  gcloud projects add-iam-policy-binding PROJECT_ID \
    --member="serviceAccount:jenkins-sa@PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/container.developer"

  gcloud projects add-iam-policy-binding PROJECT_ID \
    --member="serviceAccount:jenkins-sa@PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/artifactregistry.writer"
  ```
- [ ] Create and download service account key
- [ ] Configure Jenkins credentials with service account key
- [ ] Test service account permissions

### ✅ **Step 7: Kubernetes Deployment Manifests**
- [ ] Create deployment manifest for React frontend
- [ ] Create deployment manifest for Node.js backend
- [ ] Create service manifests (ClusterIP for backend, NodePort for frontend)
- [ ] Create ConfigMap for environment variables
- [ ] Create namespace and resource quotas
- [ ] Test manifests locally: `kubectl apply --dry-run=client -f manifests/`
- [ ] Validate YAML syntax and Kubernetes API compatibility

### ✅ **Step 8: Jenkins Pipeline Configuration**
- [ ] Create new Pipeline job in Jenkins
- [ ] Configure GitHub webhook for automatic triggering
- [ ] Set up GitHub credentials in Jenkins
- [ ] Create Jenkinsfile with stages:
  - [ ] Checkout stage
  - [ ] Test stage (npm test for both client and server)
  - [ ] Docker build stage
  - [ ] Push to Artifact Registry stage
  - [ ] Deploy to GKE stage
  - [ ] Health check stage
- [ ] Configure pipeline to trigger on main branch commits
- [ ] Test manual pipeline execution
- [ ] Verify webhook functionality

### ✅ **Step 9: GitHub Integration**
- [ ] Add Jenkins webhook URL to GitHub repository
- [ ] Configure webhook for push events on main branch
- [ ] Test webhook delivery from GitHub settings
- [ ] Verify Jenkins receives webhook notifications
- [ ] Create GitHub personal access token for Jenkins
- [ ] Configure GitHub credentials in Jenkins credential store
- [ ] Test manual trigger from GitHub interface

### ✅ **Step 10: End-to-End Testing & Verification**
- [ ] Perform complete workflow test:
  - [ ] Make a code change and commit to main branch
  - [ ] Verify Jenkins pipeline triggers automatically
  - [ ] Check all pipeline stages execute successfully
  - [ ] Verify Docker images are built and pushed
  - [ ] Confirm Kubernetes deployment updates
  - [ ] Test application accessibility
- [ ] Verify application health endpoints
- [ ] Test database connectivity from deployed application
- [ ] Validate frontend-backend communication
- [ ] Check application logs in Kubernetes: `kubectl logs -f deployment/healthcare-backend -n healthcare-app`
- [ ] Perform rollback test if needed
- [ ] Document external access URLs and credentials

### ✅ **Step 11: Monitoring & Cleanup**
- [ ] Set up basic monitoring for GKE cluster
- [ ] Configure resource limits and requests for deployments
- [ ] Set up log aggregation for troubleshooting
- [ ] Document pipeline execution times and resource usage
- [ ] Create troubleshooting guide for common issues
- [ ] Set up automated cleanup policies for old Docker images
- [ ] Configure backup strategy for Jenkins configuration
- [ ] Document cost optimization recommendations

---

## Expected Outcomes

Upon successful completion:
- ✅ Fully automated CI/CD pipeline from GitHub to Kubernetes
- ✅ Containerized Healthcare application running on GKE
- ✅ Automatic deployment on every main branch commit
- ✅ Production-ready infrastructure on Google Cloud Platform
- ✅ Monitoring and logging capabilities
- ✅ Scalable and maintainable deployment architecture

## Estimated Timeline
- **Setup Phase**: 1-2 days
- **Testing & Optimization**: 1 day
- **Documentation & Cleanup**: 0.5 day
- **Total**: 2.5-3.5 days

## Budget Estimation
- **GKE Autopilot**: ₹5,000-7,000/month
- **Compute Engine (Jenkins)**: ₹3,000-4,000/month
- **Artifact Registry**: ₹500-1,000/month
- **Network & Storage**: ₹1,000-1,500/month
- **Total Monthly**: ₹9,500-13,500 (within $300 GCP credits)

---

*Last Updated: January 2025*
*Compatible with: GKE v1.31+, Jenkins LTS, Docker 24.0+*



Healthcare-devkube CI/CD Pipeline Implementation Plan                     │
     │                                                                           │
     │ Complete Workflow                                                         │
     │                                                                           │
     │ GitHub Commit → Jenkins Tests → Docker Build → Push to Registry → CI/CD   │
     │ Deploys → Kubernetes Cluster → App Accessible                             │
     │                                                                           │
     │ Infrastructure Setup (GCP - South India)                                  │
     │                                                                           │
     │ 1. Jenkins VM: e2-standard-2 in asia-south1-a with Docker + kubectl       │
     │ 2. GKE Autopilot Cluster: Regional cluster in asia-south1                 │
     │ 3. Artifact Registry: Docker repository for healthcare images             │
     │ 4. External Access: Simple NodePort or Ingress (no LoadBalancer needed)   │
     │                                                                           │
     │ Pipeline Configuration                                                    │
     │                                                                           │
     │ - Database: Keep MongoDB Atlas connection (no changes needed)             │
     │ - Tests: Basic npm test commands for React + Node.js                      │
     │ - Trigger: Auto-deploy on main branch commits via GitHub webhook          │
     │ - Registry: GCP Artifact Registry for Docker images                       │
     │                                                                           │
     │ Kubernetes Architecture                                                   │
     │                                                                           │
     │ - Frontend: React app deployment (Port 3000)                              │
     │ - Backend: Node.js API deployment (Port 5002)                             │
     │ - Services: ClusterIP for backend, NodePort for frontend access           │
     │ - No custom domain: Access via GKE node IP + port                         │
     │                                                                           │
     │ Implementation Steps                                                      │
     │                                                                           │
     │ 1. Setup GCP project and enable required APIs                             │
     │ 2. Create and configure Jenkins VM with necessary tools                   │
     │ 3. Setup GKE Autopilot cluster                                            │
     │ 4. Configure Artifact Registry repository                                 │
     │ 5. Create Jenkins pipeline job with GitHub integration                    │
     │ 6. Setup GitHub webhook for main branch triggers                          │
     │ 7. Create Kubernetes deployment manifests                                 │
     │ 8. Test complete CI/CD workflow                                           │
     │                                                                           │
     │ Budget: ~₹8,000-10,000/month from GCP credits                             │
     │                                                                           │
     └───────────────────────────────────────────────────────────────────────────┘

## 🎉 IMPLEMENTATION STATUS: COMPLETE ✅

### ✅ **INFRASTRUCTURE DEPLOYED**
- **GCP Project**: healthcare-devkube ✅
- **Jenkins Server**: 34.93.51.43:8080 ✅
- **GKE Cluster**: healthcare-cluster (asia-south1) ✅
- **Artifact Registry**: healthcare-repo ✅
- **Service Account**: jenkins-sa with IAM roles ✅

### ✅ **CI/CD PIPELINE OPERATIONAL**
- **GitHub Integration**: Webhook configured ✅
- **Automated Testing**: Frontend + Backend tests ✅
- **Docker Builds**: Both applications containerized ✅
- **Image Registry**: Auto-push to Artifact Registry ✅
- **Kubernetes Deployment**: Auto-deploy to GKE ✅
- **kubectl Authentication**: Fixed gke-gcloud-auth-plugin ✅

### ✅ **APPLICATION DEPLOYED**
- **Frontend**: React app running on Kubernetes ✅
- **Backend**: Node.js API running on Kubernetes ✅
- **Database**: MongoDB Atlas connected ✅
- **Access**: Available via NodePort service ✅

### 🚀 **PIPELINE WORKFLOW VERIFIED**
```
GitHub Push → Jenkins Triggered → Tests Pass → Images Built →
Registry Push → Kubernetes Deploy → Health Checks → App Live ✅
```

**Final Status**: Healthcare-devkube CI/CD Pipeline **PRODUCTION READY** 🎉
     │ Timeline: 2-3 days for complete setup