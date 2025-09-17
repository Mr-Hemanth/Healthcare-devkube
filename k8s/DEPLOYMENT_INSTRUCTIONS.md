# Healthcare App K8s Deployment Instructions

## Issues Fixed

### 1. **Frontend-Backend Communication**
- ✅ Fixed hardcoded external IP to use internal service names
- ✅ Frontend now connects to `healthcare-backend-service:5002`

### 2. **Image Pull Policy**
- ✅ Changed from `imagePullPolicy: Never` to `Always` for GKE compatibility

### 3. **Service Architecture**
- ✅ Frontend: `LoadBalancer` (port 80 → 3000) for external access
- ✅ Backend: `ClusterIP` (port 5002) for internal communication only
- ✅ Database: `ClusterIP` (port 27017) for internal communication only

## Port Configuration Summary

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   Port: 3000    │    │   Port: 5002    │    │  Port: 27017    │
│   External: 80  │────┤   Internal Only │────┤   Internal Only │
│   LoadBalancer  │    │   ClusterIP     │    │   ClusterIP     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Deployment Options

### Option 1: Full 3-Tier with Local MongoDB (Recommended)
```bash
# Deploy namespace
kubectl apply -f k8s/namespace.yaml

# Deploy secrets and config
kubectl apply -f k8s/configmap.yaml

# Deploy all services
kubectl apply -f k8s/database-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml

# Check status
kubectl get pods -n healthcare-app
kubectl get services -n healthcare-app
```

### Option 2: Atlas-Only Setup (Minimal - No Local DB Issues)
```bash
# Deploy namespace
kubectl apply -f k8s/namespace.yaml

# Deploy Atlas configuration
kubectl apply -f k8s/atlas-only-config.yaml

# Deploy only frontend and backend (no local MongoDB)
kubectl apply -f k8s/atlas-deployments.yaml

# Check status
kubectl get pods -n healthcare-app
kubectl get services -n healthcare-app
```

## Key Configuration Changes Made

### frontend-deployment.yaml
- `imagePullPolicy: Always` (was: Never)
- `REACT_APP_API_BASE_URL: http://healthcare-backend-service:5002` (was: hardcoded IP)
- Service type: `LoadBalancer` port 80→3000 (was: NodePort 30080)

### backend-deployment.yaml
- `imagePullPolicy: Always` (was: Never)
- Service type: `ClusterIP` port 5002 (was: NodePort 30082)

### Database Options
- **Local**: `mongodb://admin:mongopassword@healthcare-mongodb-service:27017/healthcare?authSource=admin`
- **Atlas**: `mongodb+srv://devops:devops@devops.o4ykiod.mongodb.net/healthcare?retryWrites=true&w=majority&appName=devops`

## Troubleshooting

### If frontend can't reach backend:
```bash
# Check if services are running
kubectl get services -n healthcare-app

# Check DNS resolution inside frontend pod
kubectl exec -it <frontend-pod> -n healthcare-app -- nslookup healthcare-backend-service

# Check backend health
kubectl port-forward service/healthcare-backend-service 5002:5002 -n healthcare-app
curl http://localhost:5002/health
```

### If using GKE and images not pulling:
1. Ensure images are pushed to the registry: `asia-south1-docker.pkg.dev/hc-3-monitoring/healthcare-repo/`
2. Check GKE has access to the registry
3. Verify `imagePullPolicy: Always` is set

### For MongoDB Atlas connectivity:
- Use the Atlas-only deployment option
- Ensure Atlas cluster allows connections from GKE IPs
- Check MongoDB connection string in configmap

## Next Steps

1. **Test locally first**: `kubectl apply -f k8s/` (full 3-tier)
2. **If DB issues persist**: Use Atlas-only option
3. **For production**: Use Atlas with proper secrets management
4. **Monitor**: Check logs with `kubectl logs -f <pod-name> -n healthcare-app`

## Access Your App

After deployment, get the external IP:
```bash
kubectl get services -n healthcare-app
# Access via LoadBalancer external IP on port 80
```