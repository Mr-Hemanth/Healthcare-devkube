#!/bin/bash

# Healthcare Atlas Deployment Debug Script
# This script helps troubleshoot the 3-tier Atlas architecture deployment

echo "🔍 Healthcare Atlas Deployment Debug Script"
echo "=============================================="
echo "Timestamp: $(date)"
echo "Script Version: 1.0"
echo ""

# Function to print section headers
print_section() {
    echo ""
    echo "=== $1 ==="
}

# Function to run command with error handling
run_command() {
    local cmd="$1"
    local description="$2"

    echo "🔧 $description"
    echo "Command: $cmd"

    if eval "$cmd"; then
        echo "✅ Success"
    else
        echo "❌ Failed (exit code: $?)"
    fi
    echo ""
}

print_section "📊 CLUSTER INFORMATION"
run_command "kubectl cluster-info" "Cluster Info"
run_command "kubectl get nodes -o wide" "Node Status"

print_section "🏥 HEALTHCARE NAMESPACE STATUS"
run_command "kubectl get all -n healthcare-app -o wide" "All Resources"
run_command "kubectl get configmaps -n healthcare-app" "ConfigMaps"
run_command "kubectl get secrets -n healthcare-app" "Secrets"
run_command "kubectl get pvc -n healthcare-app" "Persistent Volume Claims"

print_section "🔍 POD DIAGNOSTICS"
echo "🔧 Pod Details and Status:"
kubectl get pods -n healthcare-app -o custom-columns="NAME:.metadata.name,STATUS:.status.phase,READY:.status.containerStatuses[0].ready,RESTARTS:.status.containerStatuses[0].restartCount,NODE:.spec.nodeName"

echo ""
echo "🔧 Pod Events:"
kubectl get events -n healthcare-app --sort-by='.lastTimestamp' | tail -10

echo ""
echo "🔧 Backend Pod Logs (Last 20 lines):"
kubectl logs deployment/healthcare-backend -n healthcare-app --tail=20 | sed 's/^/  /'

echo ""
echo "🔧 Frontend Pod Logs (Last 10 lines):"
kubectl logs deployment/healthcare-frontend -n healthcare-app --tail=10 | sed 's/^/  /'

print_section "🌐 NETWORK CONNECTIVITY"
run_command "kubectl get services -n healthcare-app -o wide" "Services"
run_command "kubectl get endpoints -n healthcare-app" "Endpoints"

echo "🔧 Testing Internal Connectivity:"
# Test backend health endpoint
if kubectl exec deployment/healthcare-backend -n healthcare-app -- curl -f -s http://localhost:5002/health >/dev/null 2>&1; then
    echo "✅ Backend internal health check: PASSED"
    echo "🔧 Backend health response:"
    kubectl exec deployment/healthcare-backend -n healthcare-app -- curl -s http://localhost:5002/health | sed 's/^/  /'
else
    echo "❌ Backend internal health check: FAILED"
fi

# Test frontend
if kubectl exec deployment/healthcare-frontend -n healthcare-app -- curl -f -s http://localhost:3000/ >/dev/null 2>&1; then
    echo "✅ Frontend internal check: PASSED"
else
    echo "❌ Frontend internal check: FAILED"
fi

print_section "☁️ ATLAS DATABASE CONNECTION"
echo "🔧 Checking Atlas connection in backend logs:"
kubectl logs deployment/healthcare-backend -n healthcare-app --tail=50 | grep -i -C2 "mongodb\|atlas\|connected\|database\|error" | sed 's/^/  /' || echo "  ℹ️ No Atlas connection logs found"

echo ""
echo "🔧 Backend Environment Variables (Atlas related):"
kubectl exec deployment/healthcare-backend -n healthcare-app -- env | grep -i "mongo\|atlas\|database" | sed 's/^/  /' || echo "  ℹ️ No Atlas environment variables found"

print_section "🏗️ DEPLOYMENT STATUS"
run_command "kubectl describe deployment healthcare-backend -n healthcare-app" "Backend Deployment"
run_command "kubectl describe deployment healthcare-frontend -n healthcare-app" "Frontend Deployment"

print_section "🔄 AUTO-SCALING STATUS"
run_command "kubectl get hpa -n healthcare-app" "Horizontal Pod Autoscaler"
run_command "kubectl top pods -n healthcare-app" "Resource Usage"

print_section "🌍 EXTERNAL ACCESS"
FRONTEND_IP=$(kubectl get service healthcare-frontend-service -n healthcare-app -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "PENDING")

echo "🔧 LoadBalancer Status:"
echo "  Frontend Service IP: $FRONTEND_IP"

if [ "$FRONTEND_IP" != "PENDING" ] && [ "$FRONTEND_IP" != "" ] && [ "$FRONTEND_IP" != "null" ]; then
    echo "✅ LoadBalancer IP assigned"
    echo "🔧 Testing external access:"
    if timeout 10 curl -f -s "http://$FRONTEND_IP/" >/dev/null 2>&1; then
        echo "✅ External access working"
    else
        echo "❌ External access failed"
    fi
else
    echo "⏳ LoadBalancer IP still pending"
    echo "🔧 Alternative access methods:"
    echo "  kubectl port-forward service/healthcare-frontend-service 3000:80 -n healthcare-app"
fi

print_section "🗄️ ATLAS VERIFICATION"
echo "🔧 Verifying NO local MongoDB:"
if kubectl get deployment healthcare-mongodb -n healthcare-app >/dev/null 2>&1; then
    echo "⚠️ WARNING: Local MongoDB deployment found!"
    echo "🔧 Local MongoDB status:"
    kubectl get deployment healthcare-mongodb -n healthcare-app | sed 's/^/  /'
else
    echo "✅ No local MongoDB deployment found"
fi

echo ""
echo "🔧 Backend configuration check:"
if kubectl exec deployment/healthcare-backend -n healthcare-app -- cat server.js 2>/dev/null | grep -q "mongodb+srv"; then
    echo "✅ Backend configured for Atlas (mongodb+srv found)"
else
    echo "❌ Backend NOT configured for Atlas"
fi

print_section "🚨 TROUBLESHOOTING RECOMMENDATIONS"
echo "Based on the diagnostics above:"
echo ""

# Check for common issues
pod_status=$(kubectl get pods -n healthcare-app --no-headers | grep -v Running | wc -l)
if [ "$pod_status" -gt 0 ]; then
    echo "❌ Non-running pods detected:"
    echo "   1. Check pod logs: kubectl logs POD_NAME -n healthcare-app"
    echo "   2. Check pod events: kubectl describe pod POD_NAME -n healthcare-app"
    echo "   3. Check resource limits and requests"
fi

if [ "$FRONTEND_IP" = "PENDING" ]; then
    echo "⏳ LoadBalancer IP pending:"
    echo "   1. Wait 2-5 minutes for IP assignment"
    echo "   2. Check GCP quotas and billing"
    echo "   3. Use port-forward for testing"
fi

echo ""
echo "📋 Common Commands for Further Debugging:"
echo "   kubectl logs -f deployment/healthcare-backend -n healthcare-app"
echo "   kubectl logs -f deployment/healthcare-frontend -n healthcare-app"
echo "   kubectl describe pod POD_NAME -n healthcare-app"
echo "   kubectl port-forward service/healthcare-frontend-service 3000:80 -n healthcare-app"
echo "   kubectl port-forward service/healthcare-backend-service 5002:5002 -n healthcare-app"

print_section "✅ DEBUG SCRIPT COMPLETE"
echo "If issues persist:"
echo "1. Check the Jenkins logs for deployment errors"
echo "2. Verify Atlas connection string is correct"
echo "3. Check GCP quotas and permissions"
echo "4. Review Kubernetes events: kubectl get events -n healthcare-app"
echo ""
echo "For support, save this output and check the deployment guide:"
echo "📖 ATLAS-DEPLOYMENT-GUIDE.md"
echo "=============================================="