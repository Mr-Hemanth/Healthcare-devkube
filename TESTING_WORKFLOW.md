# End-to-End Testing Workflow Guide

This guide covers comprehensive testing of the Healthcare DevKube CI/CD pipeline.

## Pre-Test Verification

Before testing the complete workflow, ensure all components are properly configured:

### Infrastructure Checklist
- [ ] GCP Project: `healthcare-devkube` is active
- [ ] Jenkins Server: Accessible at `34.93.51.43:8080`
- [ ] GKE Cluster: `healthcare-cluster` in `asia-south1`
- [ ] Artifact Registry: `healthcare-repo` repository exists
- [ ] Service Account: `jenkins-sa` has proper permissions

### Jenkins Configuration Checklist
- [ ] Pipeline job `healthcare-devkube-pipeline` created
- [ ] GCP service account key credential added
- [ ] GitHub personal access token configured
- [ ] GitHub webhook configured and active
- [ ] Jenkinsfile exists in repository root

## Test 1: Manual Pipeline Execution

### Purpose
Verify that the pipeline can run successfully when manually triggered.

### Steps
1. **Access Jenkins Dashboard**
   ```
   Open: http://34.93.51.43:8080
   Navigate to: healthcare-devkube-pipeline
   ```

2. **Trigger Manual Build**
   ```
   Click: "Build Now"
   Monitor: Build progress in real-time
   ```

3. **Verify Each Stage**
   - ✅ **Checkout**: Repository cloned successfully
   - ✅ **GCP Auth**: Service account authenticated
   - ✅ **Backend Test**: Node.js syntax check passes
   - ✅ **Frontend Test**: React tests complete
   - ✅ **Docker Build**: Both images built successfully
   - ✅ **Push Images**: Images pushed to Artifact Registry
   - ✅ **GKE Deploy**: Kubernetes deployment successful
   - ✅ **Health Check**: Application health verified

4. **Expected Results**
   - Build status: ✅ SUCCESS
   - All stages: ✅ PASSED
   - Console output shows no critical errors
   - Deployment completes within 10-15 minutes

## Test 2: Automatic Webhook Trigger

### Purpose
Verify that GitHub webhooks properly trigger Jenkins builds.

### Steps
1. **Make Code Change**
   ```bash
   # Clone repository locally
   git clone https://github.com/YOUR_USERNAME/Healthcare-devkube.git
   cd Healthcare-devkube

   # Make a small change
   echo "# Test webhook trigger - $(date)" >> README.md
   ```

2. **Commit and Push**
   ```bash
   git add README.md
   git commit -m "Test: Webhook trigger verification"
   git push origin main
   ```

3. **Verify Webhook Delivery**
   ```
   GitHub → Repository → Settings → Webhooks
   Check: Recent Deliveries tab
   Status: Should show 200 OK response
   ```

4. **Monitor Jenkins**
   ```
   Jenkins Dashboard → healthcare-devkube-pipeline
   Expected: New build should start automatically within 30 seconds
   ```

5. **Expected Results**
   - GitHub webhook: ✅ Delivered successfully
   - Jenkins build: ✅ Started automatically
   - Build completion: ✅ All stages pass
   - Time from push to deployment: < 15 minutes

## Test 3: Application Functionality

### Purpose
Verify that the deployed application is working correctly.

### Steps
1. **Get Application URL**
   ```bash
   # Connect to cluster
   gcloud container clusters get-credentials healthcare-cluster --zone=asia-south1

   # Get access information
   kubectl get service healthcare-frontend-service -n healthcare-app
   kubectl get nodes -o wide

   # Application URL: http://NODE_IP:30080
   ```

2. **Test Frontend Access**
   ```bash
   # Test frontend accessibility
   curl -I http://NODE_IP:30080
   # Expected: HTTP 200 OK
   ```

3. **Test Backend API**
   ```bash
   # Test backend through frontend service
   curl -I http://NODE_IP:30080/api/
   # Expected: HTTP 200 OK with "Backend server is running!"
   ```

4. **Test Database Connectivity**
   ```bash
   # Check backend logs for MongoDB connection
   kubectl logs deployment/healthcare-backend -n healthcare-app | grep -i mongodb
   # Expected: "MongoDB connected" message
   ```

5. **UI Functional Tests**
   - Open `http://NODE_IP:30080` in browser
   - ✅ Homepage loads correctly
   - ✅ Navigation menu works
   - ✅ User registration form accessible
   - ✅ Login form accessible
   - ✅ Admin panel accessible (admin/admin123)

## Test 4: Rolling Update

### Purpose
Verify that code changes trigger rolling updates without downtime.

### Steps
1. **Make Application Change**
   ```javascript
   // Edit server/server.js
   // Change line 16 from:
   res.send('Backend server is running!');
   // To:
   res.send('Backend server v2.0 is running!');
   ```

2. **Deploy Change**
   ```bash
   git add server/server.js
   git commit -m "Update: Backend version message v2.0"
   git push origin main
   ```

3. **Monitor Rolling Update**
   ```bash
   # Watch pods during update
   kubectl get pods -n healthcare-app -w

   # Check deployment status
   kubectl rollout status deployment/healthcare-backend -n healthcare-app
   ```

4. **Verify Update**
   ```bash
   # Test new version
   curl http://NODE_IP:30080/api/
   # Expected: "Backend server v2.0 is running!"
   ```

5. **Expected Results**
   - ✅ Zero downtime during update
   - ✅ Rolling update completes successfully
   - ✅ New version accessible
   - ✅ Old pods terminated gracefully

## Test 5: Failure Recovery

### Purpose
Test how the system handles failures and recovers.

### Steps
1. **Introduce Syntax Error**
   ```javascript
   // Edit server/server.js - introduce syntax error
   // Add invalid JavaScript syntax
   const invalidSyntax = {;
   ```

2. **Trigger Deployment**
   ```bash
   git add server/server.js
   git commit -m "Test: Syntax error handling"
   git push origin main
   ```

3. **Verify Failure Handling**
   - Jenkins build should FAIL at test stage
   - No new deployment should occur
   - Current application should remain running
   - Build logs should show clear error message

4. **Fix and Redeploy**
   ```bash
   # Fix the syntax error
   git add server/server.js
   git commit -m "Fix: Correct syntax error"
   git push origin main
   ```

5. **Expected Results**
   - ✅ Failed build prevents bad deployment
   - ✅ Application remains accessible during failure
   - ✅ Fix triggers successful deployment
   - ✅ Service recovery is automatic

## Test 6: Load and Performance

### Purpose
Basic load testing to verify application stability.

### Steps
1. **Install Load Testing Tool**
   ```bash
   # Install Apache Bench or similar
   sudo apt-get install apache2-utils
   ```

2. **Run Load Test**
   ```bash
   # Test frontend
   ab -n 100 -c 10 http://NODE_IP:30080/

   # Test backend API
   ab -n 100 -c 10 http://NODE_IP:30080/api/
   ```

3. **Monitor Resources**
   ```bash
   # Check pod resource usage
   kubectl top pods -n healthcare-app

   # Check node resources
   kubectl top nodes
   ```

4. **Expected Results**
   - ✅ All requests successful (no failures)
   - ✅ Response times under 1 second
   - ✅ Pods remain stable under load
   - ✅ Memory/CPU usage within limits

## Test Results Documentation

### Test Summary Template

```
Healthcare DevKube CI/CD Testing Report
=====================================
Date: ___________
Tester: _________

Test Results:
├── Manual Pipeline Execution: ✅/❌
├── Webhook Trigger: ✅/❌
├── Application Functionality: ✅/❌
├── Rolling Updates: ✅/❌
├── Failure Recovery: ✅/❌
└── Load Testing: ✅/❌

Performance Metrics:
├── Build Time: _______ minutes
├── Deployment Time: _______ minutes
├── Application Response: _______ ms
└── Resource Usage: CPU __% / Memory __%

Issues Found:
1. _________________________________
2. _________________________________
3. _________________________________

Recommendations:
1. _________________________________
2. _________________________________
3. _________________________________
```

## Troubleshooting Common Issues

### Build Failures
```bash
# Check Jenkins logs
sudo journalctl -u jenkins -f

# Check build console output
Jenkins UI → Build History → Console Output
```

### Deployment Issues
```bash
# Check Kubernetes events
kubectl get events -n healthcare-app --sort-by='.lastTimestamp'

# Check pod status
kubectl describe pod POD_NAME -n healthcare-app
```

### Application Access Issues
```bash
# Check service status
kubectl get svc -n healthcare-app

# Check ingress/firewall rules
gcloud compute firewall-rules list
```

### Resource Issues
```bash
# Check cluster capacity
kubectl describe nodes

# Check resource quotas
kubectl describe quota -n healthcare-app
```

## Next Steps After Testing

Once all tests pass successfully:

1. **Document Final URLs and Access Info**
2. **Set up monitoring and alerting** (MONITORING_SETUP.md)
3. **Configure backup strategies**
4. **Plan production security hardening**
5. **Create operational runbooks**

---

**Status:** Testing Phase Complete ✅
**Next:** [MONITORING_SETUP.md](MONITORING_SETUP.md)