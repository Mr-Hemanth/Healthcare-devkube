#!/bin/bash

# Atlas-Only Deployment Script
# Use this for minimal setup with MongoDB Atlas (no local DB issues)

set -e

echo "🚀 Healthcare Atlas Deployment - Minimal 2-Tier Setup"
echo "======================================================"

# Check if we're authenticated to kubectl
echo "🔍 Checking Kubernetes connection..."
kubectl cluster-info --request-timeout=10s

# Deploy namespace
echo "📦 Creating namespace..."
kubectl apply -f namespace.yaml

# Deploy Atlas configuration
echo "⚙️ Deploying Atlas configuration..."
kubectl apply -f atlas-only-config.yaml

# Deploy applications (Frontend + Backend only)
echo "🏗️ Deploying applications..."
kubectl apply -f atlas-deployments.yaml

# Wait for deployments
echo "⏳ Waiting for deployments to be ready..."
kubectl wait --for=condition=available deployment/healthcare-backend-atlas -n healthcare-app --timeout=300s
kubectl wait --for=condition=available deployment/healthcare-frontend-atlas -n healthcare-app --timeout=300s

# Get status
echo ""
echo "🎉 ATLAS DEPLOYMENT COMPLETE!"
echo "============================="
kubectl get pods -n healthcare-app
echo ""
kubectl get services -n healthcare-app

# Get external access info
FRONTEND_IP=$(kubectl get service healthcare-frontend-service-atlas -n healthcare-app -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "PENDING")

echo ""
echo "📱 ACCESS INFORMATION:"
echo "====================="
if [ "$FRONTEND_IP" != "PENDING" ] && [ "$FRONTEND_IP" != "" ]; then
    echo "🌐 Frontend: http://$FRONTEND_IP/"
    echo "🏥 Backend: Internal service communication only"
else
    echo "🌐 Frontend: LoadBalancer IP is being assigned..."
    echo "🔧 Test with: kubectl port-forward service/healthcare-frontend-service-atlas 3000:80 -n healthcare-app"
fi
echo "💾 Database: MongoDB Atlas (External)"
echo ""
echo "✅ Minimal 2-tier setup complete - No local DB issues!"