# AI Engine - Python Backend Service

The AI Engine powers intelligent infrastructure management through natural language processing, predictive analytics, and automated recommendations.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Service](#running-the-service)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Ollama Setup](#ollama-setup)
- [Development](#development)
- [Testing](#testing)

## 🚀 Features

- **ChatOps**: Natural language infrastructure management using LLMs
- **Code Generation**: Automatic Terraform, Kubernetes YAML, and kubectl commands
- **Predictive Analytics**: Forecast resource usage and scaling needs
- **AI Recommendations**: Intelligent optimization suggestions
- **Anomaly Detection**: Identify unusual patterns in metrics
- **Multi-Model Support**: Ollama, OpenAI, or local models

## 📦 Prerequisites

### Required

- **Python 3.11 or higher**
  ```bash
  # Check Python version
  python --version
  
  # Install Python (macOS)
  brew install python@3.11
  
  # Install Python (Linux - Ubuntu/Debian)
  sudo apt update
  sudo apt install python3.11 python3.11-venv python3-pip
  ```

### Optional (for LLM functionality)

- **Ollama** - Local LLM runtime
  ```bash
  # Install Ollama (macOS/Linux)
  curl -fsSL https://ollama.com/install.sh | sh
  
  # Verify installation
  ollama --version
  ```

## 🔧 Installation

1. **Navigate to the AI engine directory:**
   ```bash
   cd backend/ai-engine
   ```

2. **Create a virtual environment:**
   ```bash
   # Create virtual environment
   python3 -m venv venv
   
   # Activate virtual environment (macOS/Linux)
   source venv/bin/activate
   
   # Activate virtual environment (Windows)
   venv\Scripts\activate
   ```
   
   **Important**: Always activate the virtual environment before installing packages or running the service!

3. **Install Python dependencies:**
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```
   
   This installs:
   - FastAPI (web framework)
   - Uvicorn (ASGI server)
   - Pydantic (data validation)
   - NumPy (numerical computing)
   - Requests (HTTP client)

4. **Verify installation:**
   ```bash
   pip list
   python -c "import fastapi; print(fastapi.__version__)"
   ```

## ⚙️ Configuration

1. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file:**
   ```bash
   # Server Configuration
   PORT=8001

   # Ollama Configuration
   OLLAMA_URL=http://localhost:11434
   MODEL_NAME=llama3

   # Optional: Database
   # DATABASE_URL=postgresql://user:pass@localhost:5432/ai_engine
   ```

3. **Configure Ollama (if using):**
   ```bash
   # Start Ollama service
   ollama serve
   
   # In a new terminal, pull a model
   ollama pull llama3
   
   # Or use a smaller, faster model
   ollama pull mistral
   
   # List available models
   ollama list
   ```

## 🏃 Running the Service

### Development Mode

With virtual environment activated:

```bash
python main.py
```

The service will start on `http://localhost:8001`

### Using Uvicorn directly

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

The `--reload` flag enables auto-reload on code changes.

### Production Mode

```bash
uvicorn main:app --host 0.0.0.0 --port 8001 --workers 4
```

### Docker

1. **Build Docker image:**
   ```bash
   docker build -t ai-engine:latest .
   ```

2. **Run container:**
   ```bash
   docker run -p 8001:8001 --env-file .env ai-engine:latest
   ```

## 📡 API Endpoints

### Health Check
```
GET /health
Response: {
  "status": "healthy",
  "chat_service": true,
  "prediction_service": true
}
```

### Chat (Natural Language)
```
POST /api/chat
Body: {
  "message": "Create a Redis cluster with 2 nodes",
  "context": ""
}
Response: {
  "response": "I'll help you create a Redis cluster...",
  "code": "resource \"aws_elasticache_cluster\" ...",
  "language": "hcl"
}
```

### Predictions
```
POST /api/predict
Body: {
  "metrics": [...],
  "target": "cpu",
  "horizon": 30
}
Response: {
  "predictions": [...],
  "confidence": 0.89,
  "recommendations": [...]
}
```

### Recommendations
```
POST /api/recommendations
Body: {
  "cpu_usage": 85,
  "memory_usage": 70,
  "pod_count": 3
}
Response: {
  "recommendations": [
    {
      "type": "scale",
      "target": "compute-nodes",
      "action": "Add 2 more nodes",
      "confidence": 0.92,
      "reasoning": "CPU usage at 85%...",
      "impact": "Improved performance..."
    }
  ]
}
```

### Anomaly Detection
```
POST /api/anomalies
Body: {
  "cpu_usage": 95,
  "memory_usage": 88
}
Response: {
  "anomalies": [...]
}
```

## 📁 Project Structure

```
backend/ai-engine/
├── main.py                     # FastAPI application entry point
├── requirements.txt            # Python dependencies
├── .env.example               # Environment variables template
├── README.md                  # This file
│
└── services/                  # Core services
    ├── chat_service.py        # NLP and code generation
    └── prediction_service.py  # ML predictions and recommendations
```

## 🤖 Ollama Setup

Ollama provides local LLM inference without requiring API keys or cloud services.

### Installation

```bash
# macOS/Linux
curl -fsSL https://ollama.com/install.sh | sh

# Or via Homebrew (macOS)
brew install ollama
```

### Starting Ollama

```bash
# Start as background service
ollama serve

# Or run in foreground (to see logs)
OLLAMA_HOST=0.0.0.0:11434 ollama serve
```

### Downloading Models

```bash
# Recommended: LLaMA 3 (7B parameters, good balance)
ollama pull llama3

# Alternative: Mistral (7B, faster)
ollama pull mistral

# Larger model: LLaMA 3 70B (requires powerful hardware)
ollama pull llama3:70b

# Smaller model: Phi-2 (2.7B, very fast)
ollama pull phi
```

### Testing Ollama

```bash
# Interactive chat
ollama run llama3

# API test
curl http://localhost:11434/api/generate -d '{
  "model": "llama3",
  "prompt": "Why is the sky blue?",
  "stream": false
}'
```

### Model Recommendations

| Model | Size | Speed | Quality | Use Case |
|-------|------|-------|---------|----------|
| phi | 2.7B | ⚡⚡⚡ | ⭐⭐ | Quick responses |
| mistral | 7B | ⚡⚡ | ⭐⭐⭐ | Balanced |
| llama3 | 8B | ⚡⚡ | ⭐⭐⭐⭐ | **Recommended** |
| llama3:70b | 70B | ⚡ | ⭐⭐⭐⭐⭐ | Production |

### Troubleshooting Ollama

**Service not starting:**
```bash
# Check if already running
ps aux | grep ollama

# Kill existing process
pkill ollama

# Restart
ollama serve
```

**Model not found:**
```bash
# List installed models
ollama list

# Pull the model
ollama pull llama3
```

**Connection refused:**
```bash
# Check Ollama is running
curl http://localhost:11434/api/tags

# Update .env with correct URL
OLLAMA_URL=http://localhost:11434
```

## 🛠️ Development

### Adding New Chat Patterns

Edit `services/chat_service.py`:

```python
def _handle_new_pattern(self, message: str) -> Dict[str, Any]:
    code = '''# Your generated code here'''
    return {
        "response": "Description of what I'm doing",
        "code": code,
        "language": "python"
    }
```

### Adding ML Models

Install additional dependencies:
```bash
pip install scikit-learn prophet tensorflow
```

Update `services/prediction_service.py` with your model.

### Code Formatting

```bash
# Install formatters
pip install black isort flake8

# Format code
black .
isort .

# Check style
flake8 .
```

## 🧪 Testing

### Manual API Testing

Using curl:
```bash
# Health check
curl http://localhost:8001/health

# Chat test
curl -X POST http://localhost:8001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Create a Redis cluster"}'

# Prediction test
curl -X POST http://localhost:8001/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "metrics": [{"value": 45}, {"value": 50}],
    "target": "cpu",
    "horizon": 10
  }'
```

Using httpie:
```bash
http POST localhost:8001/api/chat message="Scale frontend to 5 replicas"
```

### Unit Tests

```bash
# Install pytest
pip install pytest pytest-asyncio httpx

# Run tests
pytest

# Run with coverage
pytest --cov=services
```

### Load Testing

```bash
# Install locust
pip install locust

# Run load test
locust -f tests/load_test.py --host http://localhost:8001
```

## 🚨 Troubleshooting

### Virtual environment not activated

**Symptom**: `ModuleNotFoundError` when running
**Solution**:
```bash
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows
```

### Ollama connection error

**Symptom**: "Chat service available: False"
**Solution**:
```bash
# Start Ollama
ollama serve

# Verify it's running
curl http://localhost:11434/api/tags

# Check .env has correct URL
echo $OLLAMA_URL
```

### Port already in use

```bash
# Find process using port 8001
lsof -i :8001

# Kill the process
kill -9 <PID>
```

### Dependency conflicts

```bash
# Create fresh virtual environment
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### NumPy or ML library errors

```bash
# Install with specific versions
pip install --upgrade numpy==1.26.3

# Or reinstall all dependencies
pip install --force-reinstall -r requirements.txt
```

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Ollama Documentation](https://github.com/ollama/ollama)
- [Uvicorn Documentation](https://www.uvicorn.org/)
- [Pydantic Documentation](https://docs.pydantic.dev/)

## 🔒 Security Notes

- Never commit `.env` files with secrets
- Use environment variables for sensitive data
- Validate all input data with Pydantic
- Implement rate limiting in production
- Use HTTPS in production deployments

## 🤝 Contributing

1. Follow PEP 8 style guide
2. Add type hints to all functions
3. Write docstrings for public APIs
4. Add tests for new functionality
5. Update this README for new features

## 📝 License

MIT License - See LICENSE file for details
