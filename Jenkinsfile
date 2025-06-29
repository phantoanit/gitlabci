pipeline {
    agent any

    environment {
        // Định nghĩa các biến môi trường
        CI_PROJECT_NAME = ""
        CI_COMMIT_SHORT_SHA = ""
        CI_COMMIT_TAG = ""
        IMAGE_VERSION = ""
        TRIVY_IMAGE_REPORT = ""
        CURRENT_DIR = ""
    }

    stages {
        stage('Get information project') {
            agent {
                label "172.16.0.106"
            }
            steps {
                script {
                    CI_PROJECT_NAME = sh(script: "git remote show origin -n | grep Fetch | cut -d'/' -f5 | cut -d'.' -f1", returnStdout: true).trim()
                    def CI_COMMIT_HASH = sh(script: "git rev-parse HEAD", returnStdout: true).trim()
                    CI_COMMIT_SHORT_SHA = CI_COMMIT_HASH.take(8)
                    CI_COMMIT_TAG = sh(script: "git describe --tags --exact-match ${CI_COMMIT_HASH}", returnStdout: true).trim()
                    IMAGE_VERSION = "${CI_PROJECT_NAME}:${CI_COMMIT_SHORT_SHA}_${CI_COMMIT_TAG}"
                    TRIVY_IMAGE_REPORT = "security_scan_image_${CI_PROJECT_NAME}_${CI_COMMIT_TAG}_${CI_COMMIT_SHORT_SHA}_report"
                    CURRENT_DIR = sh(script: 'pwd', returnStdout: true).trim()
                }
            }
        }
        stage('build') {
            agent {
                label "172.16.0.106"
            }
            steps {
                script {
                    sh(script: "docker build -t $IMAGE_VERSION .", label: "")
                }
            }
        }
        stage('security scan image') {
            agent {
                label "172.16.0.106"
            }
            steps {
                script {
                    sh(script: "docker run --rm -v $CURRENT_DIR:/${CI_PROJECT_NAME} -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image --format template --template '@contrib/html.tpl' --output /${CI_PROJECT_NAME}/${TRIVY_IMAGE_REPORT}.html $IMAGE_VERSION", label: "")
                }
            }
        }
        stage('deploy') {
            agent {
                label "172.16.0.106"
            }
            steps {
                script {
                    sh(script: "sudo su phantoanit -c 'docker rm -f $CI_PROJECT_NAME; docker run --name $CI_PROJECT_NAME -dp 8000:8000 $IMAGE_VERSION'", label: "")
                }
            }
        }
        stage('send report') {
            agent {
                label "172.16.0.106"
            }
            steps {
                script {
                    sh(script: "curl -X POST 'https://api.telegram.org/bot7186108928:AAF92Lj4hCnNHGk-BTyv5wWwqo6DRIr3mE8/sendDocument' -F chat_id=-4290059524 -F document=@${CURRENT_DIR}/${TRIVY_IMAGE_REPORT}.html ", label: "")
                }
            }
        }
    }

}
