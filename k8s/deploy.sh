#!/bin/bash

# Healthcare DevKube Deployment Script
# This script deploys the entire application to Kubernetes

set -e

echo "🚀 Starting Healthcare DevKube Deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    print_error "kubectl is not installed or not in PATH"
    exit 1
fi

# Check if we can connect to the cluster
if ! kubectl cluster-info &> /dev/null; then
    print_error "Cannot connect to Kubernetes cluster. Please check your kubeconfig."
    exit 1
fi

print_status "Connected to Kubernetes cluster"

# Step 1: Apply namespace
print_status "Creating namespace..."
kubectl apply -f namespace.yaml

# Step 2: Apply ConfigMap and Secrets
print_status "Applying configuration..."
kubectl apply -f configmap.yaml

# Step 3: Apply backend deployment
print_status "Deploying backend service..."
kubectl apply -f backend-deployment.yaml

# Step 4: Apply frontend deployment
print_status "Deploying frontend service..."
kubectl apply -f frontend-deployment.yaml

# Step 5: Wait for deployments to be ready
print_status "Waiting for deployments to be ready..."

echo "Waiting for backend deployment..."
kubectl wait --for=condition=available --timeout=300s deployment/healthcare-backend -n healthcare-app

echo "Waiting for frontend deployment..."
kubectl wait --for=condition=available --timeout=300s deployment/healthcare-frontend -n healthcare-app

# Step 6: Display deployment status
print_status "Deployment Status:"
kubectl get all -n healthcare-app

# Step 7: Get access information
print_status "Getting access information..."

FRONTEND_NODEPORT=$(kubectl get service healthcare-frontend-service -n healthcare-app -o jsonpath='{.spec.ports[0].nodePort}')
NODE_IP=$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="ExternalIP")].address}')

if [ -z "$NODE_IP" ]; then
    NODE_IP=$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="InternalIP")].address}')
    print_warning "Using Internal IP. You may need to configure firewall rules."
fi

echo ""
echo "==========================================="
echo "🎉 Deployment Complete!"
echo "==========================================="
echo "Frontend URL: http://${NODE_IP}:${FRONTEND_NODEPORT}"
echo "Backend URL: http://${NODE_IP}:${FRONTEND_NODEPORT}/api"
echo ""
echo "To access your application:"
echo "1. Open http://${NODE_IP}:${FRONTEND_NODEPORT} in your browser"
echo "2. The frontend will automatically connect to the backend"
echo ""
echo "To monitor your deployment:"
echo "kubectl get pods -n healthcare-app"
echo "kubectl logs -f deployment/healthcare-backend -n healthcare-app"
echo "kubectl logs -f deployment/healthcare-frontend -n healthcare-app"
echo "==========================================="