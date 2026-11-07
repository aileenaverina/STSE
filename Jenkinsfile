pipeline {
    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
        timeout(time: 20, unit: 'MINUTES')
    }

    environment {
        CART_API_DIR     = 'cart-api/cart-api'
        BACKEND_COMPOSE  = 'backend/docker-compose.yml'
        FRONTEND_COMPOSE = 'frontend/docker-compose.yml'
        BACKEND_URL      = 'http://localhost:50555'
        FRONTEND_URL     = 'http://localhost:50755'
    }

    stages {

        stage('Info Build') {
            steps {
                echo "Branch   : ${env.BRANCH_NAME}"
                echo "Build no : ${env.BUILD_NUMBER}"
                sh 'docker --version'
                sh 'docker compose version'
            }
        }

        stage('Test') {
            parallel {

                stage('Unit Test cart-api') {
                    agent {
                        docker {
                            image 'node:22-alpine'
                            reuseNode true
                        }
                    }
                    steps {
                        dir(env.CART_API_DIR) {
                            sh 'npm ci --cache .npm'
                            sh 'npm run test:ci'
                        }
                    }
                    post {
                        always {
                            junit testResults: "${env.CART_API_DIR}/reports/junit.xml",
                                  allowEmptyResults: true
                        }
                    }
                }

                stage('Cek Syntax Backend') {
                    agent {
                        docker {
                            image 'python:3.11-slim'
                            reuseNode true
                        }
                    }
                    steps {
                        sh 'python -c "import ast; ast.parse(open(\'backend/app.py\').read()); print(\'Syntax app.py OK\')"'
                    }
                }
            }
        }

        stage('Build Image') {
            steps {
                sh 'docker compose -f $BACKEND_COMPOSE build'
                sh 'docker compose -f $FRONTEND_COMPOSE build'
            }
        }

        stage('Deploy') {
            when { branch 'main' }
            steps {
                sh 'docker compose -f $BACKEND_COMPOSE up -d --wait'
                sh 'docker compose -f $FRONTEND_COMPOSE up -d --wait'
            }
        }

        stage('Smoke Test') {
            when { branch 'main' }
            steps {
                retry(5) {
                    sleep time: 3, unit: 'SECONDS'
                    sh 'curl -fsS $BACKEND_URL/'
                    sh 'curl -fsS -o /dev/null $FRONTEND_URL/'
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline BERHASIL untuk branch ${env.BRANCH_NAME}"
        }
        failure {
            echo "Pipeline GAGAL untuk branch ${env.BRANCH_NAME}. Versi yang sedang berjalan tidak diubah."
        }
        always {
            sh 'docker image prune -f || true'
        }
    }
}
