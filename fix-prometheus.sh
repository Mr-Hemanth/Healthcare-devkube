#!/bin/bash

echo "🔧 Fixing Prometheus CrashLoopBackOff Issue"
echo "=========================================="

# Get cluster credentials
gcloud container clusters get-credentials healthcare3-cluster --location=asia-south1

echo "1. Checking Prometheus pod logs..."
kubectl logs deployment/prometheus -n healthcare-app --tail=50

echo ""
echo "2. Current Prometheus pods:"
kubectl get pods -n healthcare-app | grep prometheus

echo ""
echo "3. Deleting problematic Prometheus deployment..."
kubectl delete deployment prometheus -n healthcare-app --cascade=foreground

echo ""
echo "4. Recreating Prometheus with fixed configuration..."
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prometheus
  namespace: healthcare-app
  labels:
    app: prometheus
    component: monitoring
spec:
  replicas: 1
  selector:
    matchLabels:
      app: prometheus
  template:
    metadata:
      labels:
        app: prometheus
        component: monitoring
    spec:
      serviceAccount: prometheus-service-account
      containers:
      - name: prometheus
        image: prom/prometheus:v2.48.0
        ports:
        - containerPort: 9090
          protocol: TCP
        args:
          - '--config.file=/etc/prometheus/prometheus.yml'
          - '--storage.tsdb.path=/prometheus'
          - '--web.console.libraries=/etc/prometheus/console_libraries'
          - '--web.console.templates=/etc/prometheus/consoles'
          - '--storage.tsdb.retention.time=15d'
          - '--web.enable-lifecycle'
          - '--web.enable-admin-api'
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        volumeMounts:
        - name: prometheus-config
          mountPath: /etc/prometheus
        - name: prometheus-data
          mountPath: /prometheus
        livenessProbe:
          httpGet:
            path: /-/healthy
            port: 9090
          initialDelaySeconds: 30
          periodSeconds: 15
        readinessProbe:
          httpGet:
            path: /-/ready
            port: 9090
          initialDelaySeconds: 5
          periodSeconds: 5
      volumes:
      - name: prometheus-config
        configMap:
          name: prometheus-config
      - name: prometheus-data
        persistentVolumeClaim:
          claimName: prometheus-data-pvc
EOF

echo ""
echo "5. Waiting for Prometheus to be ready..."
kubectl wait --for=condition=available deployment/prometheus -n healthcare-app --timeout=300s

echo ""
echo "6. Final Prometheus status:"
kubectl get pods -n healthcare-app | grep prometheus
kubectl get services -n healthcare-app | grep prometheus

echo ""
echo "✅ Prometheus fix complete!"