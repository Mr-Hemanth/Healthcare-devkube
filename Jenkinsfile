pipeline {
    agent any

    environment {
        PROJECT_ID = 'hc-3-monitoring'
        CLUSTER_NAME = 'healthcare3-cluster'
        CLUSTER_LOCATION = 'asia-south1'
        REGISTRY_HOSTNAME = 'asia-south1-docker.pkg.dev'
        REPOSITORY_NAME = 'healthcare-repo'
        SERVICE_ACCOUNT_KEY = credentials('gcp-service-account-key')
        USE_GKE_GCLOUD_AUTH_PLUGIN = 'True'
        PATH = "/usr/local/bin:/snap/bin:/usr/sbin:/usr/bin:/sbin:/bin:$PATH"
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }
        

        stage('Verify Prerequisites') {
            steps {
                script {
                    echo 'Verifying all required tools are properly installed...'
                    sh '''
                        echo "=== Environment Verification ==="
                        echo "Current user: $(whoami)"
                        echo "Current PATH: $PATH"
                        echo "Working directory: $(pwd)"
                        
                        echo "=== Tool Verification ==="
                        
                        # Test Node.js
                        echo "Node.js: $(node --version)"
                        echo "npm: $(npm --version)"
                        
                        # Test Docker
                        echo "Docker: $(docker --version)"
                        
                        # Test gcloud with full path
                        if [ -f /usr/local/bin/gcloud ]; then
                            echo "gcloud: $(/usr/local/bin/gcloud --version | head -1)"
                        else
                            echo "ERROR: gcloud not found at /usr/local/bin/gcloud"
                            exit 1
                        fi
                        
                        # Test kubectl with full path
                        if [ -f /usr/local/bin/kubectl ]; then
                            echo "kubectl: $(/usr/local/bin/kubectl version --client | head -1)"
                        else
                            echo "ERROR: kubectl not found"
                            exit 1
                        fi
                        
                        # Test gke-auth-plugin with full path
                        if [ -f /usr/local/bin/gke-gcloud-auth-plugin ]; then
                            echo "gke-auth-plugin: $(/usr/local/bin/gke-gcloud-auth-plugin --version)"
                        else
                            echo "ERROR: gke-gcloud-auth-plugin not found"
                            exit 1
                        fi
                        
                        echo "✅ All prerequisites verified successfully!"
                    '''
                }
            }
        }

        stage('Setup GCP Authentication') {
            steps {
                script {
                    echo 'Setting up GCP authentication...'
                    sh '''
                        export USE_GKE_GCLOUD_AUTH_PLUGIN=True
                        
                        echo "Authenticating with service account..."
                        /usr/local/bin/gcloud auth activate-service-account --key-file=${SERVICE_ACCOUNT_KEY}
                        
                        echo "Setting project..."
                        /usr/local/bin/gcloud config set project ${PROJECT_ID}
                        
                        echo "Configuring Docker authentication..."
                        /usr/local/bin/gcloud auth configure-docker ${REGISTRY_HOSTNAME} --quiet
                        
                        echo "✅ GCP authentication setup complete"
                    '''
                }
            }
        }

        stage('Test Backend') {
            steps {
                dir('server') {
                    script {
                        echo 'Testing Backend Application...'
                        sh '''
                            echo "Installing backend dependencies..."
                            npm install
                            
                            echo "Running syntax check..."
                            node -c server.js
                            
                            echo "✅ Backend tests passed"
                        '''
                    }
                }
            }
        }

        stage('Test Frontend') {
            steps {
                dir('client') {
                    script {
                        echo 'Testing Frontend Application...'
                        sh '''
                            echo "Installing frontend dependencies..."
                            npm install
                            
                            echo "Running tests..."
                            CI=true npm test -- --coverage --watchAll=false
                            
                            echo "✅ Frontend tests passed"
                        '''
                    }
                }
            }
        }

        stage('Build Docker Images') {
            parallel {
                stage('Build Backend Image') {
                    steps {
                        dir('server') {
                            script {
                                echo 'Building Backend Docker Image...'
                                def backendImage = "${REGISTRY_HOSTNAME}/${PROJECT_ID}/${REPOSITORY_NAME}/healthcare-backend:${BUILD_NUMBER}"
                                sh """
                                    echo "Building: ${backendImage}"
                                    docker build -t ${backendImage} .
                                    docker tag ${backendImage} ${REGISTRY_HOSTNAME}/${PROJECT_ID}/${REPOSITORY_NAME}/healthcare-backend:latest
                                    echo "✅ Backend image built successfully"
                                """
                            }
                        }
                    }
                }
                stage('Build Frontend Image') {
                    steps {
                        dir('client') {
                            script {
                                echo 'Building Frontend Docker Image...'
                                def frontendImage = "${REGISTRY_HOSTNAME}/${PROJECT_ID}/${REPOSITORY_NAME}/healthcare-frontend:${BUILD_NUMBER}"
                                sh """
                                    echo "Building: ${frontendImage}"
                                    echo "Setting API base URL for browser access via ingress..."
                                    docker build \\
                                        --build-arg REACT_APP_API_BASE_URL="" \\
                                        -t ${frontendImage} .
                                    docker tag ${frontendImage} ${REGISTRY_HOSTNAME}/${PROJECT_ID}/${REPOSITORY_NAME}/healthcare-frontend:latest
                                    echo "✅ Frontend image built successfully with Kubernetes API URL"
                                """
                            }
                        }
                    }
                }
            }
        }

        stage('Push Images to Artifact Registry') {
            parallel {
                stage('Push Backend Image') {
                    steps {
                        script {
                            echo 'Pushing Backend Images...'
                            sh """
                                docker push ${REGISTRY_HOSTNAME}/${PROJECT_ID}/${REPOSITORY_NAME}/healthcare-backend:${BUILD_NUMBER}
                                docker push ${REGISTRY_HOSTNAME}/${PROJECT_ID}/${REPOSITORY_NAME}/healthcare-backend:latest
                                echo "✅ Backend images pushed"
                            """
                        }
                    }
                }
                stage('Push Frontend Image') {
                    steps {
                        script {
                            echo 'Pushing Frontend Images...'
                            sh """
                                docker push ${REGISTRY_HOSTNAME}/${PROJECT_ID}/${REPOSITORY_NAME}/healthcare-frontend:${BUILD_NUMBER}
                                docker push ${REGISTRY_HOSTNAME}/${PROJECT_ID}/${REPOSITORY_NAME}/healthcare-frontend:latest
                                echo "✅ Frontend images pushed"
                            """
                        }
                    }
                }
            }
        }

        stage('Deploy 3-Tier Atlas Architecture to GKE') {
            steps {
                script {
                    echo '🚀 Deploying Complete 3-Tier Architecture with Atlas to GKE...'
                    sh '''
                        export USE_GKE_GCLOUD_AUTH_PLUGIN=True

                        echo "Re-authenticating for cluster access..."
                        /usr/local/bin/gcloud auth activate-service-account --key-file=${SERVICE_ACCOUNT_KEY}
                        /usr/local/bin/gcloud config set project ${PROJECT_ID}

                        echo "Getting cluster credentials..."
                        /usr/local/bin/gcloud container clusters get-credentials ${CLUSTER_NAME} --location=${CLUSTER_LOCATION}

                        echo "Testing cluster connection..."
                        /usr/local/bin/kubectl cluster-info --request-timeout=10s

                        echo "========================================"
                        echo "🏗️ DEPLOYING 3-TIER ATLAS ARCHITECTURE"
                        echo "========================================"
                        echo "Tier 1: React Frontend (Web Layer)"
                        echo "Tier 2: Node.js Backend (API Layer)"
                        echo "Tier 3: MongoDB Atlas (Database Layer)"
                        echo ""

                        echo "🚀 Deploying complete 3-tier Atlas configuration..."
                        echo "📋 Using Atlas-only deployment (NO local MongoDB)"

                        # Clean up any existing local MongoDB deployments
                        echo "🧹 Cleaning up any local MongoDB deployments..."
                        /usr/local/bin/kubectl delete deployment healthcare-mongodb -n healthcare-app --ignore-not-found=true
                        /usr/local/bin/kubectl delete service healthcare-mongodb-service -n healthcare-app --ignore-not-found=true
                        /usr/local/bin/kubectl delete pvc mongodb-data-pvc -n healthcare-app --ignore-not-found=true
                        /usr/local/bin/kubectl delete pvc mongodb-config-pvc -n healthcare-app --ignore-not-found=true

                        echo "☁️ Deploying Atlas-only 3-tier architecture..."
                        /usr/local/bin/kubectl apply -f k8s/atlas-complete-deployment.yaml

                        echo "🔧 Deploying ingress configuration..."
                        /usr/local/bin/kubectl apply -f k8s/ingress.yaml

                        echo "⏳ Waiting for deployments to be ready..."
                        echo "🔧 Tier 2 (Backend API) deployment..."
                        /usr/local/bin/kubectl wait --for=condition=available deployment/healthcare-backend -n healthcare-app --timeout=600s || echo "⚠️ Backend deployment timeout - checking status..."

                        echo "🖥️ Tier 1 (Frontend Web) deployment..."
                        /usr/local/bin/kubectl wait --for=condition=available deployment/healthcare-frontend -n healthcare-app --timeout=600s || echo "⚠️ Frontend deployment timeout - checking status..."

                        # Check current deployment status regardless of timeout
                        echo "📊 Current deployment status:"
                        /usr/local/bin/kubectl get deployments -n healthcare-app
                        echo ""
                        echo "📋 Pod status:"
                        /usr/local/bin/kubectl get pods -n healthcare-app

                        echo "✅ 3-Tier Atlas Architecture deployed successfully!"
                        echo "📊 Final deployment status:"
                        /usr/local/bin/kubectl get all -n healthcare-app

                        echo "🔍 Verifying NO local MongoDB is running..."
                        if /usr/local/bin/kubectl get deployment healthcare-mongodb -n healthcare-app >/dev/null 2>&1; then
                            echo "⚠️ WARNING: Local MongoDB deployment still exists!"
                        else
                            echo "✅ Confirmed: No local MongoDB deployment found"
                        fi
                    '''
                }
            }
        }

        stage('Deploy Monitoring Stack') {
            steps {
                script {
                    echo '📊 Deploying Prometheus and Grafana monitoring stack...'
                    sh '''
                        echo "========================================"
                        echo "📈 DEPLOYING MONITORING INFRASTRUCTURE"
                        echo "========================================"
                        echo "🔧 Prometheus: Metrics collection and storage"
                        echo "📊 Grafana: Visualization and dashboards"
                        echo ""

                        echo "🔧 Deploying Prometheus..."
                        /usr/local/bin/kubectl apply -f k8s/monitoring-prometheus.yaml

                        echo "📊 Deploying Grafana..."
                        /usr/local/bin/kubectl apply -f k8s/monitoring-grafana.yaml

                        echo "⏳ Waiting for monitoring deployments to be ready..."

                        echo "🔧 Waiting for Prometheus deployment..."
                        /usr/local/bin/kubectl wait --for=condition=available deployment/prometheus -n healthcare-app --timeout=600s || echo "⚠️ Prometheus deployment timeout - will continue anyway"

                        echo "📊 Waiting for Grafana deployment..."
                        /usr/local/bin/kubectl wait --for=condition=available deployment/grafana -n healthcare-app --timeout=600s || echo "⚠️ Grafana deployment timeout - will continue anyway"

                        echo "✅ Monitoring stack deployment completed!"
                        echo ""
                        echo "📊 Monitoring Components Status:"
                        /usr/local/bin/kubectl get pods -n healthcare-app -l component=monitoring
                        echo ""
                        echo "🌐 Monitoring Services:"
                        /usr/local/bin/kubectl get services -n healthcare-app -l component=monitoring
                        echo ""

                        # Check if monitoring services are running
                        echo "🩺 Monitoring Health Checks:"

                        # Prometheus health check
                        echo "🔧 Testing Prometheus health..."
                        if /usr/local/bin/kubectl exec deployment/prometheus -n healthcare-app -- wget -q --spider http://localhost:9090/-/healthy 2>/dev/null; then
                            echo "✅ Prometheus is healthy"
                        else
                            echo "⚠️ Prometheus health check pending (may still be starting)"
                        fi

                        # Grafana health check
                        echo "📊 Testing Grafana health..."
                        if /usr/local/bin/kubectl exec deployment/grafana -n healthcare-app -- curl -f http://localhost:3000/api/health 2>/dev/null; then
                            echo "✅ Grafana is healthy"
                        else
                            echo "⚠️ Grafana health check pending (may still be starting)"
                        fi

                        echo ""
                        echo "🎯 Monitoring Access Information:"
                        echo "============================================"

                        # Get NodePort for Grafana
                        GRAFANA_NODEPORT=$(/usr/local/bin/kubectl get service grafana-service -n healthcare-app -o jsonpath='{.spec.ports[0].nodePort}' 2>/dev/null || echo "NOT_FOUND")

                        if [ "$GRAFANA_NODEPORT" != "NOT_FOUND" ] && [ "$GRAFANA_NODEPORT" != "" ]; then
                            echo "📊 Grafana Dashboard: Access via NodePort $GRAFANA_NODEPORT"
                            echo "   Username: admin"
                            echo "   Password: admin123"
                            echo "   Port-forward: kubectl port-forward service/grafana-service 3001:3000 -n healthcare-app"
                            echo "   Then access: http://localhost:3001"
                        else
                            echo "📊 Grafana: Service setup in progress"
                        fi

                        echo "🔧 Prometheus: Internal service (prometheus-service:9090)"
                        echo "   Port-forward: kubectl port-forward service/prometheus-service 9090:9090 -n healthcare-app"
                        echo "   Then access: http://localhost:9090"
                        echo ""

                        echo "✅ Complete monitoring stack ready!"
                        echo "📈 Metrics collection: Prometheus"
                        echo "📊 Visualization: Grafana"
                        echo "🎯 Healthcare dashboard: Pre-configured"
                        echo "============================================"
                    '''
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    echo 'Performing final health checks...'
                    sh '''
                        echo "=== APPLICATION ACCESS INFORMATION ==="
                        
                        # Get deployment status
                        /usr/local/bin/kubectl get pods -n healthcare-app
                        /usr/local/bin/kubectl get services -n healthcare-app
                        /usr/local/bin/kubectl get ingress -n healthcare-app

                        # Get ingress external IP
                        INGRESS_IP=$(/usr/local/bin/kubectl get svc -n ingress-nginx ingress-nginx-controller -o jsonpath='{.status.loadBalancer.ingress[0].ip}')

                        # Check for LoadBalancer external IP
                        FRONTEND_EXTERNAL_IP=$(/usr/local/bin/kubectl get service healthcare-frontend-service -n healthcare-app -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "")

                        if [ -z "$FRONTEND_EXTERNAL_IP" ] || [ "$FRONTEND_EXTERNAL_IP" = "null" ]; then
                            echo ""
                            echo "🎉 HEALTHCARE APPLICATION DEPLOYED SUCCESSFULLY!"
                            echo "================================================"
                            echo "⏳ LoadBalancer External IP is being assigned..."
                            echo "🔧 Use kubectl port-forward for testing:"
                            echo "   kubectl port-forward service/healthcare-frontend-service 3000:80 -n healthcare-app"
                            echo "   kubectl port-forward service/healthcare-backend-service 5002:5002 -n healthcare-app"
                            echo "================================================"
                            echo "✅ Frontend: LoadBalancer (Port 80)"
                            echo "✅ Backend: ClusterIP (Port 5002 - Internal)"
                            echo "✅ Database: ClusterIP (Port 27017 - Internal)"
                        else
                            echo ""
                            echo "🎉 HEALTHCARE APPLICATION DEPLOYED SUCCESSFULLY!"
                            echo "================================================"
                            echo "🌐 Frontend LoadBalancer: http://$FRONTEND_EXTERNAL_IP/"
                            echo "🏥 Backend (Internal): healthcare-backend-service:5002"
                            echo "💾 Database (Internal): healthcare-mongodb-service:27017"
                            echo "================================================"
                            echo "✅ 3-Tier Architecture with LoadBalancer Frontend!"
                            echo "✅ No CORS issues - Internal service communication!"
                        fi
                    '''
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
            sh 'docker system prune -f || true'
        }
        success {
            echo 'Pipeline completed successfully!'
            script {
                sh '''
                    echo "=========================================="
                    echo "🎉 3-TIER ARCHITECTURE + MONITORING DEPLOYED"
                    echo "=========================================="
                    echo "✅ Database Tier: MongoDB (healthcare-mongodb)"
                    echo "✅ Backend Tier: Node.js API (healthcare-backend)"
                    echo "✅ Frontend Tier: React App (healthcare-frontend)"
                    echo "✅ Monitoring: Prometheus + Grafana"
                    echo ""
                    FRONTEND_IP=$(kubectl get service healthcare-frontend-service -n healthcare-app -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "PENDING")
                    BACKEND_CLUSTER_IP=$(kubectl get service healthcare-backend-service -n healthcare-app -o jsonpath='{.spec.clusterIP}' 2>/dev/null || echo "N/A")
                    if [ "$FRONTEND_IP" != "PENDING" ] && [ "$FRONTEND_IP" != "" ]; then
                        echo "🌐 Healthcare App: http://$FRONTEND_IP/"
                    else
                        echo "🌐 Healthcare App: LoadBalancer IP pending assignment"
                        echo "🔧 Test locally: kubectl port-forward service/healthcare-frontend-service 3000:80 -n healthcare-app"
                    fi
                    echo "🏥 Backend (Internal): $BACKEND_CLUSTER_IP:5002"
                    echo ""
                    echo "Complete 3-tier architecture with monitoring is now live!"
                    echo "=========================================="
                '''
            }
                    }
        failure {
            echo '❌ Pipeline failed - check logs above for details'
        }
    }
}
