# AI Infrastructure Orchestrator - Backend Guide

Complete guide to setting up, running, and deploying the backend services for the AI Infrastructure Orchestrator.

## 📑 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Quick Start](#quick-start)
- [Component Guides](#component-guides)
- [Running Everything](#running-everything)
- [CI/CD Pipeline](#cicd-pipeline)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                  │
│                     Port 8080 / Port 80                     │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/WebSocket
┌────────────────────────▼────────────────────────────────────┐
│              Go Orchestrator (Port 8000)                    │
│  • REST API endpoints                                       │
│  • Kubernetes client                                        │
│  • WebSocket hub                                            │
│  • Metrics collection                                       │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP
┌────────────────────────▼────────────────────────────────────┐
│              AI Engine (Python - Port 8001)                 │
│  • ChatOps with Ollama/LLaMA                                │
│  • Code generation                                          │
│  • Predictive analytics                                     │
│  • Recommendations                                          │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   Infrastructure Layer                      │
│  • Ollama (Port 11434) - Local LLM                          │
│  • Prometheus (Port 9090) - Metrics                         │
│  • Grafana (Port 3000) - Visualization                      │
│  • LocalStack (Port 4566) - AWS Emulator                    │
│  • Kubernetes (Minikube) - Container orchestration          │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites Checklist

Install all required tools:

```bash
# 1. Go (1.21+)
go version || echo "Install Go from https://go.dev/dl/"

# 2. Python (3.11+)
python --version || echo "Install Python from https://python.org"

# 3. Node.js (18+)
node --version || echo "Install Node from https://nodejs.org"

# 4. Docker
docker --version || echo "Install Docker from https://docker.com"

# 5. kubectl (optional)
kubectl version --client || echo "Install kubectl"

# 6. Minikube (optional)
minikube version || echo "Install Minikube"
```

### One-Command Setup (Docker Compose)

The easiest way to run everything:

```bash
# Clone repository
git clone <your-repo-url>
cd ai-infrastructure-orchestrator

# Start all services
docker-compose up -d

# Pull LLM model for Ollama
docker exec -it <container-name> ollama pull llama3

# Check status
docker-compose ps
```

Services will be available at:
- Frontend: http://localhost:8080
- Go Orchestrator: http://localhost:8000
- AI Engine: http://localhost:8001
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000 (admin/admin)
- LocalStack: http://localhost:4566

### Manual Setup (Development)

Run each component in separate terminals:

```bash
# Terminal 1: Frontend
npm install
npm run dev
# Available at http://localhost:5173

# Terminal 2: Go Orchestrator
cd backend/go-orchestrator
cp .env.example .env
go mod download
go run main.go
# Available at http://localhost:8000

# Terminal 3: AI Engine
cd backend/ai-engine
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python main.py
# Available at http://localhost:8001

# Terminal 4: Ollama (optional)
ollama serve
ollama pull llama3

# Terminal 5: Prometheus (optional)
docker run -p 9090:9090 \
  -v ./infrastructure/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml \
  prom/prometheus

# Terminal 6: Minikube (optional)
minikube start
```

## 📚 Component Guides

### Go Orchestrator

See [backend/go-orchestrator/README.md](backend/go-orchestrator/README.md) for:
- Detailed installation instructions
- API endpoint documentation
- Kubernetes integration guide
- WebSocket implementation
- Testing and debugging

**Key Features:**
- REST API with Gin framework
- Kubernetes resource management
- Real-time WebSocket updates
- Metrics collection from Prometheus
- Infrastructure control (scale, start, stop, delete)

### AI Engine

See [backend/ai-engine/README.md](backend/ai-engine/README.md) for:
- Python virtual environment setup
- Ollama LLM installation and configuration
- API documentation
- Prediction model details
- Chat service implementation

**Key Features:**
- Natural language infrastructure management
- Terraform and YAML code generation
- Time-series prediction (CPU, memory, traffic)
- Automated optimization recommendations
- Anomaly detection

## 🏃 Running Everything

### Option 1: Docker Compose (Recommended)

**Advantages:**
- Single command to start all services
- Automatic networking between containers
- Persistent data volumes
- Production-like environment

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build

# Stop and remove volumes
docker-compose down -v
```

### Option 2: Individual Services

**Advantages:**
- See logs in real-time
- Easier debugging
- Fast code reload during development

```bash
# Start each service in order:
# 1. Infrastructure (Prometheus, Ollama)
# 2. AI Engine
# 3. Go Orchestrator
# 4. Frontend
```

### Option 3: Hybrid Approach

Run infrastructure in Docker, services locally:

```bash
# Start infrastructure only
docker-compose up -d ollama prometheus grafana localstack

# Run services locally
cd backend/go-orchestrator && go run main.go &
cd backend/ai-engine && python main.py &
npm run dev
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflows

The project includes 2 CI/CD workflows:

#### 1. Backend Pipeline (`.github/workflows/backend-ci.yml`)

Triggers on:
- Push to `main` or `develop` branches
- Pull requests to `main`
- Changes in `backend/**` directory

**Jobs:**
- `test-go-orchestrator`: Go tests, coverage, build
- `test-ai-engine`: Python tests, linting, coverage
- `build-go-docker`: Build and push Go Docker image
- `build-python-docker`: Build and push Python Docker image
- `deploy-staging`: Deploy to staging environment
- `security-scan`: Trivy vulnerability scanning

#### 2. Frontend Pipeline (`.github/workflows/frontend-ci.yml`)

Triggers on:
- Push to `main` or `develop`
- Pull requests to `main`
- Changes in `src/**` directory

**Jobs:**
- `test-frontend`: Lint, type-check, build
- `build-docker`: Build and push Docker image
- `deploy-staging`: Deploy frontend to staging

### Required GitHub Secrets

Configure these in your repository settings:

```
DOCKER_USERNAME=your-dockerhub-username
DOCKER_PASSWORD=your-dockerhub-password
```

### Setting Up CI/CD

1. **Enable GitHub Actions:**
   - Go to repository Settings → Actions → General
   - Enable "Allow all actions and reusable workflows"

2. **Add Docker Hub secrets:**
   ```bash
   # In GitHub: Settings → Secrets → Actions → New repository secret
   # Name: DOCKER_USERNAME, Value: <your-username>
   # Name: DOCKER_PASSWORD, Value: <your-token>
   ```

3. **Push code to trigger pipeline:**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin main
   ```

4. **Monitor workflow:**
   - Go to Actions tab in GitHub
   - Click on the running workflow
   - View logs and results

### Local Pipeline Testing

Test the pipeline locally using `act`:

```bash
# Install act
brew install act  # macOS
# or download from https://github.com/nektos/act

# Run backend workflow
act -W .github/workflows/backend-ci.yml

# Run specific job
act -j test-go-orchestrator
```

## 🚢 Production Deployment

### Option 1: Docker Swarm

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml orchestrator

# Check services
docker service ls

# View logs
docker service logs orchestrator_frontend

# Scale services
docker service scale orchestrator_orchestrator=3

# Remove stack
docker stack rm orchestrator
```

### Option 2: Kubernetes

Create Kubernetes manifests:

```yaml
# k8s/orchestrator-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: orchestrator
spec:
  replicas: 3
  selector:
    matchLabels:
      app: orchestrator
  template:
    metadata:
      labels:
        app: orchestrator
    spec:
      containers:
      - name: orchestrator
        image: yourusername/orchestrator:latest
        ports:
        - containerPort: 8000
        env:
        - name: AI_ENGINE_URL
          value: "http://ai-engine:8001"
```

Deploy:

```bash
# Apply manifests
kubectl apply -f k8s/

# Check status
kubectl get pods
kubectl get services

# View logs
kubectl logs -f deployment/orchestrator

# Scale
kubectl scale deployment orchestrator --replicas=5
```

### Option 3: Cloud Platforms

#### AWS ECS

```bash
# Create ECR repositories
aws ecr create-repository --repository-name orchestrator
aws ecr create-repository --repository-name ai-engine

# Build and push images
docker build -t orchestrator:latest backend/go-orchestrator
docker tag orchestrator:latest <account>.dkr.ecr.<region>.amazonaws.com/orchestrator:latest
docker push <account>.dkr.ecr.<region>.amazonaws.com/orchestrator:latest

# Create ECS task definition and service
aws ecs create-service --cluster my-cluster --service-name orchestrator ...
```

#### Google Cloud Run

```bash
# Build and push to GCR
gcloud builds submit --tag gcr.io/PROJECT-ID/orchestrator backend/go-orchestrator
gcloud builds submit --tag gcr.io/PROJECT-ID/ai-engine backend/ai-engine

# Deploy
gcloud run deploy orchestrator \
  --image gcr.io/PROJECT-ID/orchestrator \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### Fly.io

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Launch app
cd backend/go-orchestrator
flyctl launch

# Deploy
flyctl deploy
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Port Already in Use

```bash
# Find process using port
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

#### 2. Docker Compose Fails

```bash
# View logs
docker-compose logs

# Rebuild images
docker-compose build --no-cache

# Remove old containers and volumes
docker-compose down -v
docker system prune -a
```

#### 3. Kubernetes Connection Error

```bash
# Check kubeconfig
kubectl config view
kubectl config current-context

# Test connection
kubectl get nodes
kubectl cluster-info

# Use Minikube
minikube start
eval $(minikube docker-env)
```

#### 4. Ollama Not Available

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Start Ollama service
ollama serve

# Pull model
ollama pull llama3

# Check model
ollama list
```

#### 5. Python Virtual Environment Issues

```bash
# Recreate venv
cd backend/ai-engine
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### 6. Go Module Issues

```bash
cd backend/go-orchestrator
go clean -modcache
go mod download
go mod tidy
go mod verify
```

### Getting Help

1. Check component-specific READMEs
2. Review GitHub Actions logs
3. Check Docker logs: `docker-compose logs <service>`
4. Enable debug logging in `.env` files
5. Open an issue on GitHub

## 📊 Monitoring and Observability

### Prometheus Metrics

Access Prometheus UI: http://localhost:9090

**Key Queries:**
```promql
# CPU usage
rate(container_cpu_usage_seconds_total[5m])

# Memory usage
container_memory_usage_bytes

# Request rate
rate(http_requests_total[5m])

# Error rate
rate(http_requests_total{status=~"5.."}[5m])
```

### Grafana Dashboards

Access Grafana: http://localhost:3000 (admin/admin)

**Pre-built dashboards:**
- Kubernetes cluster overview
- Go application metrics
- Python application metrics
- Infrastructure health

### Logging

**View logs:**
```bash
# Docker Compose
docker-compose logs -f orchestrator
docker-compose logs -f ai-engine

# Kubernetes
kubectl logs -f deployment/orchestrator

# Local development
# Logs are output to stdout
```

## 🔒 Security Best Practices

1. **Never commit secrets:**
   - Use `.env` files (gitignored)
   - Use environment variables
   - Use secrets management (Vault, AWS Secrets Manager)

2. **Use HTTPS in production:**
   - Configure TLS certificates
   - Use Let's Encrypt for free certificates

3. **Implement authentication:**
   - Add JWT authentication
   - Use OAuth2 for user login

4. **Enable RBAC:**
   - Configure Kubernetes RBAC
   - Limit API access

5. **Regular security updates:**
   - Update dependencies
   - Scan images with Trivy
   - Monitor CVEs

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `go test ./...` and `pytest`
5. Submit a pull request

## 📚 Additional Resources

- [Go Orchestrator README](backend/go-orchestrator/README.md)
- [AI Engine README](backend/ai-engine/README.md)
- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
