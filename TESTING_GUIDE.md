# Local Testing Guide

## Prerequisites

- Go 1.21+
- Python 3.11+
- Node.js 18+
- Docker & Docker Compose (optional)

## Quick Start with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Access services:
# - Frontend: http://localhost:8080
# - Go Orchestrator API: http://localhost:8000
# - AI Engine: http://localhost:8001
# - Prometheus: http://localhost:9090
# - Grafana: http://localhost:3000
```

## Manual Local Setup

### 1. Start Backend Services

#### Go Orchestrator
```bash
cd backend/go-orchestrator
cp .env.example .env

# Install dependencies
go mod download

# Run the server
go run main.go
```

The orchestrator will start on `http://localhost:8000`

#### AI Engine
```bash
cd backend/ai-engine
cp .env.example .env

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
```

The AI engine will start on `http://localhost:8001`

### 2. Start Frontend

```bash
# From project root
npm install
npm run dev
```

Frontend will start on `http://localhost:5173`

## Testing Real-Time UI Updates

### Test WebSocket Connection

1. Open browser console on the frontend
2. You should see WebSocket connection messages
3. The WebSocket sends metrics updates every 10 seconds automatically

### Test Metrics Updates

The Go orchestrator automatically sends mock metrics through WebSocket:
- CPU: 45-65% (fluctuates)
- Memory: 60-75% (fluctuates)
- Network: 100-150 Mbps (fluctuates)

**To verify:**
1. Open the Dashboard
2. Go to "Metrics" tab
3. Watch the real-time charts update every 10 seconds

### Simulate Infrastructure Changes

#### Option 1: Using the Go Orchestrator API

```bash
# Trigger a metrics update
curl http://localhost:8000/api/v1/metrics

# Get infrastructure status
curl http://localhost:8000/api/v1/infrastructure

# Start a resource
curl -X POST http://localhost:8000/api/v1/infrastructure/pod/my-pod-123/start

# Stop a resource
curl -X POST http://localhost:8000/api/v1/infrastructure/pod/my-pod-123/stop

# Delete a resource
curl -X DELETE http://localhost:8000/api/v1/infrastructure/pod/my-pod-123
```

#### Option 2: Modify Mock Metrics (For Testing)

Edit `backend/go-orchestrator/internal/websocket/hub.go` line 74-76:

```go
Data: map[string]interface{}{
    "cpu":    90.0,  // Change to simulate high CPU
    "memory": 95.0,  // Change to simulate high memory
},
```

Restart the Go orchestrator and watch the UI update.

#### Option 3: Connect Real Kubernetes Cluster

If you have a local Kubernetes cluster (minikube, kind, k3s):

```bash
# Make sure your kubeconfig is set
export KUBECONFIG=~/.kube/config

# The orchestrator will automatically detect and use it
# Deploy some test pods
kubectl run test-pod-1 --image=nginx
kubectl run test-pod-2 --image=redis

# Check in UI - Infrastructure tab should show real pods
```

## Testing ChatOps Functionality

### Test Chat Responses

1. Open the Dashboard
2. Go to "ChatOps" tab
3. Try these commands:

**Create Resources:**
```
Create a Redis cluster with 2 nodes
Deploy a Kubernetes deployment with 3 replicas
```

**Scale Resources:**
```
Scale the frontend deployment to 5 replicas
```

**Query Information:**
```
What are the current costs?
Show me the system status
```

### Test AI Engine Integration

#### Check AI Engine Health
```bash
curl http://localhost:8001/health
```

#### Test Chat API Directly
```bash
curl -X POST http://localhost:8001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Create a Redis cluster",
    "context": "production environment"
  }'
```

### Test with Ollama (Optional - Advanced)

If you want to use real LLM instead of mock responses:

```bash
# Install Ollama
# Visit https://ollama.ai

# Pull a model
ollama pull llama3

# Update AI Engine .env
echo "OLLAMA_URL=http://localhost:11434" >> backend/ai-engine/.env
echo "MODEL_NAME=llama3" >> backend/ai-engine/.env

# Restart AI Engine
```

## Stress Testing Infrastructure

### Simulate High CPU Usage

Create a test script `stress-test.sh`:

```bash
#!/bin/bash

# Send multiple concurrent requests
for i in {1..100}; do
  curl http://localhost:8000/api/v1/metrics &
done
wait

echo "Stress test complete"
```

Run: `bash stress-test.sh`

### Monitor Real-Time Updates

1. Open UI in browser
2. Run stress test
3. Watch Metrics tab update in real-time
4. Check Logs tab for activity

### Test WebSocket Under Load

```bash
# Install wscat
npm install -g wscat

# Connect to WebSocket
wscat -c ws://localhost:8000/ws

# You should see periodic metrics updates
```

## Testing Infrastructure Connection

### Test Kubernetes Connection

```bash
# Check if K8s is accessible
curl http://localhost:8000/api/v1/infrastructure

# Should return pods and deployments if K8s is connected
```

### Test Without Kubernetes

The system works without Kubernetes and returns mock data:
- 2 sample pods
- 1 sample deployment
- 2 mock AWS EC2 instances

## Debugging Tips

### Check Backend Logs

```bash
# Go Orchestrator
cd backend/go-orchestrator
go run main.go

# Watch for:
# - "Starting server on port 8000"
# - WebSocket connections
# - API requests
```

### Check AI Engine Logs

```bash
# AI Engine
cd backend/ai-engine
python main.py

# Watch for:
# - "Server starting on port 8001"
# - Ollama availability
# - Chat requests
```

### Check Frontend Console

Open browser DevTools (F12):
- Network tab: Check WebSocket connection
- Console tab: Check for errors
- Application tab: Check localStorage/sessionStorage

### Common Issues

**WebSocket not connecting:**
- Check CORS settings in `backend/go-orchestrator/main.go`
- Verify backend is running on correct port
- Check browser console for errors

**UI not updating:**
- Verify WebSocket connection is established
- Check Network tab for `/ws` endpoint
- Restart backend services

**Chat not responding:**
- Check AI Engine is running
- Verify AI_ENGINE_URL in orchestrator .env
- Check AI Engine logs for errors

## Performance Testing

### Load Test the API

```bash
# Install hey
go install github.com/rakyll/hey@latest

# Test metrics endpoint
hey -n 1000 -c 10 http://localhost:8000/api/v1/metrics

# Test chat endpoint
hey -n 100 -c 5 -m POST \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}' \
  http://localhost:8000/api/v1/chat
```

### Monitor System Resources

```bash
# Watch Go orchestrator memory/CPU
top -p $(pgrep -f "go run main.go")

# Watch Python AI engine
top -p $(pgrep -f "python main.py")
```

## End-to-End Testing Scenarios

### Scenario 1: New User Workflow
1. Open frontend
2. See Overview dashboard with real-time metrics
3. Check Infrastructure tab - see resources
4. Use ChatOps to create a resource
5. Verify resource appears in Infrastructure tab

### Scenario 2: Monitoring Workflow
1. Start with normal metrics
2. Simulate high CPU (modify mock data)
3. Watch UI update in real-time
4. Check if recommendations appear
5. Apply a recommendation

### Scenario 3: ChatOps Deployment
1. Use chat: "Create a Redis cluster with 2 nodes"
2. Receive Terraform/K8s code
3. Copy code to deploy (manual step)
4. Check Infrastructure tab for new resources

## Automated Testing (Future)

### Frontend Tests
```bash
# Unit tests
npm run test

# E2E tests (when implemented)
npm run test:e2e
```

### Backend Tests
```bash
# Go tests
cd backend/go-orchestrator
go test ./...

# Python tests
cd backend/ai-engine
pytest
```

## Production-Like Testing

### Use Docker Compose Full Stack

```bash
# Start everything including Prometheus, Grafana, LocalStack
docker-compose up -d

# Access Grafana for dashboards
# http://localhost:3000
# Login: admin/admin

# Access Prometheus for metrics
# http://localhost:9090

# Test AWS emulation with LocalStack
# http://localhost:4566
```

This gives you a production-like environment locally.
