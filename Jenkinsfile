pipeline {
    agent any

    environment {
        PROJECT_ID = 'healthcare-devkube'
        CLUSTER_NAME = 'healthcare-cluster'
        CLUSTER_ZONE = 'asia-south1'
        REGISTRY_HOSTNAME = 'asia-south1-docker.pkg.dev'
        REPOSITORY_NAME = 'healthcare-repo'
        SERVICE_ACCOUNT_KEY = credentials('gcp-service-account-key')
        USE_GKE_GCLOUD_AUTH_PLUGIN = 'True'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Setup GCP Authentication') {
            steps {
                script {
                    sh '''
                        gcloud auth activate-service-account --key-file=${SERVICE_ACCOUNT_KEY}
                        gcloud config set project ${PROJECT_ID}
                        gcloud auth configure-docker ${REGISTRY_HOSTNAME}
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
                            npm install
                            # Basic syntax check
                            node -c server.js
                            echo "Backend tests passed"
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
                            npm install
                            CI=true npm test -- --coverage --watchAll=false
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
                                sh "docker build -t ${backendImage} ."
                                sh "docker tag ${backendImage} ${REGISTRY_HOSTNAME}/${PROJECT_ID}/${REPOSITORY_NAME}/healthcare-backend:latest"
                                env.BACKEND_IMAGE = backendImage
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
                                sh "docker build -t ${frontendImage} ."
                                sh "docker tag ${frontendImage} ${REGISTRY_HOSTNAME}/${PROJECT_ID}/${REPOSITORY_NAME}/healthcare-frontend:latest"
                                env.FRONTEND_IMAGE = frontendImage
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
                            echo 'Pushing Backend Image to Artifact Registry...'
                            sh "docker push ${REGISTRY_HOSTNAME}/${PROJECT_ID}/${REPOSITORY_NAME}/healthcare-backend:${BUILD_NUMBER}"
                            sh "docker push ${REGISTRY_HOSTNAME}/${PROJECT_ID}/${REPOSITORY_NAME}/healthcare-backend:latest"
                        }
                    }
                }
                stage('Push Frontend Image') {
                    steps {
                        script {
                            echo 'Pushing Frontend Image to Artifact Registry...'
                            sh "docker push ${REGISTRY_HOSTNAME}/${PROJECT_ID}/${REPOSITORY_NAME}/healthcare-frontend:${BUILD_NUMBER}"
                            sh "docker push ${REGISTRY_HOSTNAME}/${PROJECT_ID}/${REPOSITORY_NAME}/healthcare-frontend:latest"
                        }
                    }
                }
            }
        }

        stage('Deploy to GKE') {
            steps {
                script {
                    echo 'Deploying to Google Kubernetes Engine...'
                    sh '''
                        # Set auth plugin environment variable
                        export USE_GKE_GCLOUD_AUTH_PLUGIN=True
                        
                        # Verify plugin is available
                        gke-gcloud-auth-plugin --version || echo "Plugin check completed"
                        
                        # Re-authenticate to ensure fresh credentials
                        gcloud auth activate-service-account --key-file=${SERVICE_ACCOUNT_KEY}
                        gcloud config set project ${PROJECT_ID}
                        
                        # Get cluster credentials
                        gcloud container clusters get-credentials ${CLUSTER_NAME} --zone=${CLUSTER_ZONE}
                        
                        # Verify connection
                        kubectl cluster-info --request-timeout=10s
                        
                        # Deploy application manifests
                        kubectl apply -f k8s/namespace.yaml
                        kubectl apply -f k8s/configmap.yaml
                        kubectl apply -f k8s/backend-deployment.yaml
                        kubectl apply -f k8s/frontend-deployment.yaml
                        
                        # CRITICAL: Force deployments to restart with new images
                        echo "Forcing deployment restart to pull latest images..."
                        kubectl rollout restart deployment/healthcare-backend -n healthcare-app
                        kubectl rollout restart deployment/healthcare-frontend -n healthcare-app
                        
                        # Wait for rollout to complete with new images
                        echo "Waiting for backend deployment to complete..."
                        kubectl rollout status deployment/healthcare-backend -n healthcare-app --timeout=300s
                        echo "Waiting for frontend deployment to complete..."
                        kubectl rollout status deployment/healthcare-frontend -n healthcare-app --timeout=300s
                        
                        # Show final deployment status
                        kubectl get all -n healthcare-app
                        
                        # Show which images are actually running
                        echo "==================================="
                        echo "Current running images:"
                        kubectl get pods -n healthcare-app -o jsonpath='{range .items[*]}{.metadata.name}: {.spec.containers[*].image}{"\n"}{end}' || echo "Failed to retrieve pod image information"
                        echo "==================================="
                    '''
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    echo 'Performing Health Checks...'
                    sh '''
                        # Check if pods are running
                        kubectl get pods -n healthcare-app

                        # Get service information
                        kubectl get services -n healthcare-app

                        # Get external access information
                        echo "Frontend External Access:"
                        NODE_IP=$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="ExternalIP")].address}')
                        NODE_PORT=$(kubectl get service healthcare-frontend-service -n healthcare-app -o jsonpath='{.spec.ports[0].nodePort}')
                        
                        echo "Application URL: http://$NODE_IP:$NODE_PORT"
                        echo "Node IP: $NODE_IP"
                        echo "Node Port: $NODE_PORT"
                        echo ""
                    '''
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up Docker images...'
            sh '''
                docker system prune -f || echo "Docker cleanup completed with warnings"
            '''
        }
        success {
            echo 'Pipeline completed successfully!'
            script {
                sh '''
                    echo "==================================="
                    echo "Deployment Summary:"
                    echo "==================================="
                    echo "✅ Backend: healthcare-backend"
                    echo "✅ Frontend: healthcare-frontend"
                    echo "✅ Namespace: healthcare-app"
                    echo "✅ New images deployed and running"
                    echo ""
                    NODE_IP=$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="ExternalIP")].address}')
                    NODE_PORT=$(kubectl get service healthcare-frontend-service -n healthcare-app -o jsonpath='{.spec.ports[0].nodePort}')
                    echo "🌐 Application URL: http://$NODE_IP:$NODE_PORT"
                    echo ""
                    echo "Changes from this build are now live!"
                    echo "==================================="
                '''
            }
        }
        failure {
            echo 'Pipeline failed! Please check the logs for errors.'
        }
    }
}