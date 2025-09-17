#!/bin/bash

echo "🔍 Testing Backend Access via Ingress"
echo "====================================="

# Test via Ingress (from your logs: 34.93.179.126)
echo "1. Testing backend health via ingress..."
curl -v http://34.93.179.126/health

echo ""
echo "2. Testing backend API endpoint via ingress..."
curl -v http://34.93.179.126/api/health

echo ""
echo "3. Testing if signup endpoint is accessible..."
curl -X POST http://34.93.179.126/api/signup \
  -H "Content-Type: application/json" \
  -d '{"test": "connection"}' \
  -w "\nHTTP Status: %{http_code}\n"

echo ""
echo "4. Testing via LoadBalancer IP (34.100.185.1)..."
curl -v http://34.100.185.1/health

echo ""
echo "5. Testing API via LoadBalancer..."
curl -v http://34.100.185.1/api/signup -X OPTIONS

echo ""
echo "✅ Backend access test completed!"
echo "If you see 200 status codes, the backend is accessible."
echo "If you see connection errors, we need to fix the ingress/backend."