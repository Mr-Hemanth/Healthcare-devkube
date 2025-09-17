#!/bin/bash

echo "🔧 Fixing LoadBalancer and Pending Pods Issues"
echo "=============================================="

# Get cluster credentials
gcloud container clusters get-credentials healthcare3-cluster --location=asia-south1

echo "Current service status:"
kubectl get services -n healthcare-app

echo ""
echo "1. Checking LoadBalancer service quota..."
gcloud compute project-info describe --format="value(quotas[metric:EXTERNAL_IP_ADDRESSES].limit,quotas[metric:EXTERNAL_IP_ADDRESSES].usage)"

echo ""
echo "2. Deleting and recreating LoadBalancer service..."
kubectl delete service healthcare-frontend-service -n healthcare-app
sleep 5

# Recreate with proper annotations
kubectl apply -f - <<EOF
apiVersion: v1
kind: Service
metadata:
  name: healthcare-frontend-service
  namespace: healthcare-app
  labels:
    app: healthcare-frontend
  annotations:
    cloud.google.com/load-balancer-type: External
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 3000
    protocol: TCP
    name: http
  selector:
    app: healthcare-frontend
EOF

echo ""
echo "3. Checking node resources for pending pods..."
kubectl describe nodes | grep -A 5 "Allocated resources"

echo ""
echo "4. Force restart deployments with resource limits..."
kubectl patch deployment healthcare-backend -n healthcare-app -p '{"spec":{"template":{"spec":{"containers":[{"name":"healthcare-backend","resources":{"requests":{"memory":"128Mi","cpu":"100m"},"limits":{"memory":"256Mi","cpu":"250m"}}}]}}}}'

kubectl patch deployment healthcare-frontend -n healthcare-app -p '{"spec":{"template":{"spec":{"containers":[{"name":"healthcare-frontend","resources":{"requests":{"memory":"128Mi","cpu":"100m"},"limits":{"memory":"256Mi","cpu":"250m"}}}]}}}}'

echo ""
echo "5. Waiting for LoadBalancer IP..."
kubectl get service healthcare-frontend-service -n healthcare-app -w --timeout=300s

echo ""
echo "6. Final status check:"
kubectl get pods -n healthcare-app
kubectl get services -n healthcare-app

echo ""
echo "✅ LoadBalancer fix complete!"
echo "🌐 If still pending, use Ingress: http://34.93.179.126/"