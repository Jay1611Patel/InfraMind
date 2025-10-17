# Go Orchestrator - Backend Service

The Go Orchestrator is the central backend service that manages infrastructure, processes AI recommendations, and provides REST API endpoints for the frontend dashboard.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Service](#running-the-service)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)

## 🚀 Features

- **REST API**: Comprehensive endpoints for infrastructure management
- **Kubernetes Integration**: Query and manage K8s resources (pods, deployments, services)
- **WebSocket Support**: Real-time metric updates to frontend
- **Metrics Collection**: Periodic collection and storage of system metrics
- **AI Recommendations**: Process and apply AI-generated optimization suggestions
- **Infrastructure Control**: Start, stop, scale, and delete resources

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

### Required

- **Go 1.21 or higher**
  ```bash
  # Check your Go version
  go version
  
  # Install Go (macOS)
  brew install go
  
  # Install Go (Linux)
  wget https://go.dev/dl/go1.21.0.linux-amd64.tar.gz
  sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf go1.21.0.linux-amd64.tar.gz
  export PATH=$PATH:/usr/local/go/bin
  ```

### Optional (for full functionality)

- **kubectl** - Kubernetes command-line tool
  ```bash
  # Install kubectl (macOS)
  brew install kubectl
  
  # Install kubectl (Linux)
  curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
  sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
  ```

- **Minikube** - Local Kubernetes cluster
  ```bash
  # Install Minikube (macOS)
  brew install minikube
  
  # Install Minikube (Linux)
  curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
  sudo install minikube-linux-amd64 /usr/local/bin/minikube
  
  # Start Minikube
  minikube start
  ```

- **Docker** - For running LocalStack and containers
  ```bash
  # Install Docker (macOS)
  brew install --cask docker
  
  # Install Docker (Linux - Ubuntu/Debian)
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  ```

## 🔧 Installation

1. **Navigate to the orchestrator directory:**
   ```bash
   cd backend/go-orchestrator
   ```

2. **Download Go dependencies:**
   ```bash
   go mod download
   ```
   
   This command reads the `go.mod` file and downloads all required packages including:
   - Gin (web framework)
   - Kubernetes client-go
   - Gorilla WebSocket
   - godotenv (environment variable management)

3. **Verify installation:**
   ```bash
   go mod verify
   ```

## ⚙️ Configuration

1. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file with your configuration:**
   ```bash
   # Server Configuration
   PORT=8000

   # AI Engine URL
   AI_ENGINE_URL=http://localhost:8001

   # Prometheus URL (if using Prometheus for metrics)
   PROMETHEUS_URL=http://localhost:9090

   # Kubernetes Config
   KUBECONFIG=/Users/yourname/.kube/config

   # AWS Configuration (for LocalStack testing)
   AWS_ENDPOINT=http://localhost:4566
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=test
   AWS_SECRET_ACCESS_KEY=test
   ```

3. **Kubernetes Configuration:**
   
   The orchestrator automatically tries to connect to Kubernetes using:
   - In-cluster config (if running in K8s)
   - `~/.kube/config` file (local development)
   - `KUBECONFIG` environment variable

   To verify your kubeconfig:
   ```bash
   kubectl config view
   kubectl get pods --all-namespaces
   ```

## 🏃 Running the Service

### Development Mode

Run the server directly with Go:

```bash
go run main.go
```

The server will start on `http://localhost:8000` (or the port specified in `.env`)

### Production Build

1. **Build the binary:**
   ```bash
   go build -o orchestrator main.go
   ```

2. **Run the binary:**
   ```bash
   ./orchestrator
   ```

### With Live Reload (Air)

For development with automatic reloading:

1. **Install Air:**
   ```bash
   go install github.com/cosmtrek/air@latest
   ```

2. **Run with Air:**
   ```bash
   air
   ```

### Docker

1. **Build Docker image:**
   ```bash
   docker build -t orchestrator:latest .
   ```

2. **Run container:**
   ```bash
   docker run -p 8000:8000 --env-file .env orchestrator:latest
   ```

## 📡 API Endpoints

### Health Check
```
GET /health
Response: {"status": "healthy"}
```

### Overview
```
GET /api/v1/overview
Returns: System status, recent actions, predictions, current metrics
```

### Status
```
GET /api/v1/status
Returns: System health and connectivity status
```

### Metrics
```
GET /api/v1/metrics?service=frontend
Returns: Time series metrics (CPU, memory, network)

GET /api/v1/metrics/history
Returns: Historical metrics data
```

### Recommendations
```
GET /api/v1/recommendations
Returns: List of AI-generated recommendations

POST /api/v1/recommendations/:id/apply
Apply a specific recommendation

POST /api/v1/recommendations/:id/reject
Reject a specific recommendation
```

### Infrastructure
```
GET /api/v1/infrastructure
Returns: All infrastructure resources (K8s, AWS, etc.)

POST /api/v1/infrastructure/:type/:id/start
Start a resource

POST /api/v1/infrastructure/:type/:id/stop
Stop a resource

DELETE /api/v1/infrastructure/:type/:id
Delete a resource
```

### Logs
```
GET /api/v1/logs?type=scale&status=completed
Returns: Filtered audit logs
```

### ChatOps
```
POST /api/v1/chat
Body: {"message": "Create a Redis cluster", "context": ""}
Returns: AI response with optional code generation
```

### WebSocket
```
WS /ws
Real-time metrics and event updates
```

## 📁 Project Structure

```
backend/go-orchestrator/
├── main.go                 # Application entry point
├── go.mod                  # Go module dependencies
├── go.sum                  # Dependency checksums
├── .env.example            # Environment variables template
├── README.md               # This file
│
└── internal/               # Internal packages
    ├── handlers/           # HTTP request handlers
    │   ├── overview.go     # Overview endpoints
    │   ├── metrics.go      # Metrics endpoints
    │   ├── recommendations.go
    │   ├── infrastructure.go
    │   ├── chat.go
    │   └── logs.go
    │
    ├── k8s/                # Kubernetes client
    │   └── client.go       # K8s API wrapper
    │
    ├── metrics/            # Metrics collection
    │   └── collector.go    # Periodic metrics gathering
    │
    └── websocket/          # WebSocket handling
        └── hub.go          # WebSocket hub and clients
```

## 🛠️ Development

### Code Organization

- **main.go**: Sets up router, middleware, and starts server
- **internal/handlers**: Business logic for each API endpoint
- **internal/k8s**: Kubernetes client wrapper for managing resources
- **internal/metrics**: Periodic metrics collection from K8s and Prometheus
- **internal/websocket**: Real-time communication with frontend

### Adding New Endpoints

1. Create handler function in `internal/handlers/`:
   ```go
   func GetNewResource() gin.HandlerFunc {
       return func(c *gin.Context) {
           c.JSON(http.StatusOK, gin.H{"data": "response"})
       }
   }
   ```

2. Register route in `main.go`:
   ```go
   api.GET("/newresource", handlers.GetNewResource())
   ```

### Kubernetes Integration

The orchestrator uses `client-go` to interact with Kubernetes:

```go
// Get all pods in namespace
pods, err := k8sClient.GetPods("default")

// Scale a deployment
err := k8sClient.ScaleDeployment("default", "my-app", 5)

// Delete a pod
err := k8sClient.DeletePod("default", "pod-name")
```

## 🧪 Testing

### Unit Tests

Run all tests:
```bash
go test ./...
```

Run tests with coverage:
```bash
go test -cover ./...
```

Run tests for specific package:
```bash
go test ./internal/handlers
```

### Integration Tests

Test against real Kubernetes cluster:
```bash
# Start Minikube
minikube start

# Run integration tests
go test -tags=integration ./...
```

### Manual API Testing

Using curl:
```bash
# Health check
curl http://localhost:8000/health

# Get overview
curl http://localhost:8000/api/v1/overview

# Get metrics
curl http://localhost:8000/api/v1/metrics

# Apply recommendation
curl -X POST http://localhost:8000/api/v1/recommendations/1/apply
```

Using httpie:
```bash
http GET localhost:8000/api/v1/infrastructure
```

## 🚨 Troubleshooting

### Server won't start

1. Check if port 8000 is already in use:
   ```bash
   lsof -i :8000
   ```

2. Verify Go installation:
   ```bash
   go version
   go env
   ```

### Kubernetes connection errors

1. Verify kubeconfig:
   ```bash
   kubectl cluster-info
   kubectl get nodes
   ```

2. Check KUBECONFIG environment variable:
   ```bash
   echo $KUBECONFIG
   ```

3. Test K8s connectivity:
   ```bash
   kubectl get pods --all-namespaces
   ```

### WebSocket connection issues

1. Check CORS settings in `main.go`
2. Verify frontend WebSocket URL matches backend
3. Check browser console for connection errors

### Missing dependencies

```bash
# Clean and reinstall
go clean -modcache
go mod download
go mod tidy
```

## 📚 Additional Resources

- [Gin Web Framework Documentation](https://gin-gonic.com/docs/)
- [Kubernetes Client-Go](https://github.com/kubernetes/client-go)
- [Go Modules Reference](https://go.dev/ref/mod)
- [Gorilla WebSocket](https://github.com/gorilla/websocket)

## 🤝 Contributing

1. Follow Go best practices and conventions
2. Add tests for new functionality
3. Update documentation for API changes
4. Use `gofmt` to format code:
   ```bash
   gofmt -w .
   ```

## 📝 License

MIT License - See LICENSE file for details
