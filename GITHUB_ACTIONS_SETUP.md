# 🚀 GitHub Actions CI/CD Setup Guide

This guide helps you migrate from Jenkins to GitHub Actions while maintaining the exact same deployment flow.

## 🔐 Required GitHub Repository Secrets

You need to set up the following secret in your GitHub repository:

### 1. GCP_SERVICE_ACCOUNT_KEY

**Value**: Your GCP Service Account JSON key (the same one used in Jenkins as `gcp-service-account-key`)

**How to add it**:
1. Go to your GitHub repository
2. Click `Settings` → `Secrets and variables` → `Actions`
3. Click `New repository secret`
4. Name: `GCP_SERVICE_ACCOUNT_KEY`
5. Value: Paste the entire JSON content of your service account key

**Required permissions for the service account**:
- Artifact Registry Writer
- Kubernetes Engine Developer
- Service Account User
- Storage Admin (if needed)

## 🔄 Migration Comparison

### Jenkins Pipeline Flow:
```
Commit → Jenkins → Prerequisites → GCP Auth → Tests → Build → Push → Deploy → Monitor → Health Check
```

### GitHub Actions Flow:
```
Commit → GitHub Actions → Prerequisites → GCP Auth → Tests (Parallel) → Build & Push (Parallel) → Deploy → Monitor → Health Check
```

## ✨ Key Improvements in GitHub Actions

1. **Parallel Execution**: Tests and builds run in parallel using matrix strategy
2. **Native Integration**: No separate CI/CD server to maintain
3. **Better Caching**: Node.js dependencies cached automatically
4. **Cleaner Logs**: Better organized with job separation
5. **Free**: 2000 minutes/month for private repos

## 🏗️ Architecture Overview

The GitHub Actions workflow maintains your exact 3-tier architecture:

```
🌐 Tier 1: React Frontend (healthcare-frontend)
    ↓
🔧 Tier 2: Node.js Backend (healthcare-backend)
    ↓
☁️ Tier 3: MongoDB Atlas (External Cloud Database)
    +
📊 Monitoring: Prometheus + Grafana
```

## 🚀 Workflow Triggers

The pipeline triggers on:
- Push to `main`, `master`, or `develop` branches
- Pull requests to `main` or `master`
- Manual execution (`workflow_dispatch`)

## 🏥 Workflow Jobs

### 1. 🚀 Checkout & Prerequisites
- Repository checkout
- Environment verification
- Tool checking
- Atlas configuration validation

### 2. 🧪 Test Applications (Parallel)
- Backend testing (server/ directory)
- Frontend testing (client/ directory)
- Parallel execution using matrix strategy

### 3. 🔐 Setup GCP Authentication
- Google Cloud authentication
- Docker registry configuration
- Project setup

### 4. 🐳 Build & Push Docker Images (Parallel)
- Backend image build and push
- Frontend image build and push
- Parallel execution using matrix strategy

### 5. 🚀 Deploy 3-Tier Atlas Architecture
- Clean up old MongoDB deployments
- Deploy Atlas-only architecture
- Wait for deployments to be ready
- Verify no local MongoDB is running

### 6. 📊 Deploy Monitoring Stack
- Deploy Prometheus metrics collection
- Deploy Grafana visualization
- Health checks for monitoring components
- Access information display

### 7. 🩺 Final Health Check
- Comprehensive health checks
- Atlas connection verification
- External access testing
- Resource usage display

### 8. 🧹 Cleanup
- Docker system cleanup
- Resource cleanup

## 🔧 Environment Variables

All environment variables from Jenkins are preserved:
- `PROJECT_ID`: hc-3-monitoring
- `CLUSTER_NAME`: healthcare3-cluster
- `CLUSTER_LOCATION`: asia-south1
- `REGISTRY_HOSTNAME`: asia-south1-docker.pkg.dev
- `REPOSITORY_NAME`: healthcare-repo
- `USE_GKE_GCLOUD_AUTH_PLUGIN`: True

## 🎯 Benefits of This Migration

1. **Same Flow**: Identical deployment process and results
2. **Better Performance**: Parallel execution reduces build time
3. **No Infrastructure**: No Jenkins server maintenance
4. **Version Control**: Workflow versioned with your code
5. **Better UI**: GitHub's native interface
6. **Cost Effective**: Free for most use cases

## 🔄 Next Steps

1. **Add the secret**: Set up `GCP_SERVICE_ACCOUNT_KEY` in GitHub
2. **Test the workflow**: Push a commit to trigger the pipeline
3. **Monitor results**: Check the Actions tab for pipeline execution
4. **Gradual migration**: Run both Jenkins and GitHub Actions in parallel initially
5. **Decommission Jenkins**: Once confident, disable Jenkins pipeline

## 🚨 Important Notes

- The workflow file is located at `.github/workflows/healthcare-atlas-ci-cd.yml`
- All functionality from both Jenkins files is preserved
- Atlas-specific deployment configuration is maintained
- Monitoring stack deployment is included
- Health checks are comprehensive and match Jenkins behavior

## 📞 Troubleshooting

If you encounter issues:

1. **Secret not found**: Ensure `GCP_SERVICE_ACCOUNT_KEY` is properly set
2. **Permission denied**: Verify service account has required permissions
3. **Deployment timeout**: Check Kubernetes cluster status
4. **Atlas connection**: Verify MongoDB Atlas configuration in backend

Your exact same deployment flow is now powered by GitHub Actions! 🎉