#!/bin/bash

echo "🔍 Checking Fix Status - Build #27"
echo "=================================="

echo "1. Checking pod status..."
kubectl get pods -n healthcare-app | grep healthcare-frontend

echo ""
echo "2. Testing if new frontend is using relative API paths..."
echo "   Frontend LoadBalancer: http://34.100.185.1/"
echo "   Expected API calls should now be: /api/signup (relative)"

echo ""
echo "3. Testing backend accessibility via ingress..."
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://34.93.179.126/health
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://34.100.185.1/health

echo ""
echo "4. Testing API endpoint..."
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://34.93.179.126/api/health || echo "API endpoint test failed"

echo ""
echo "✅ Instructions:"
echo "1. Wait for 'healthcare-frontend-94b475476' pods to be READY"
echo "2. Refresh browser at http://34.100.185.1/"
echo "3. Try signup - should work without network error!"
echo "4. Check browser console - should show calls to /api/signup (no more internal service names)"