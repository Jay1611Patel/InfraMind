# AI Infrastructure Orchestrator

A comprehensive DevOps Copilot that provides AI-powered infrastructure management, predictive scaling, auto-healing, and conversational infrastructure control through ChatOps.

## 🎯 Overview

The AI Infrastructure Orchestrator is a central control plane that observes, predicts, and manages your entire infrastructure. It combines:

- **Real-time Observability**: Metrics from Kubernetes, AWS, Prometheus
- **AI Predictions**: Traffic forecasting, resource optimization
- **Auto-healing**: Automatic workload recovery
- **ChatOps**: Natural language infrastructure management
- **Cost Optimization**: AI-driven recommendations

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Overview │  │ Metrics  │  │ ChatOps  │  │ Settings │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API / WebSocket
┌────────────────────────▼────────────────────────────────────┐
│              Backend Orchestrator (Go)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ K8s Client   │  │ AWS SDK      │  │ Terraform    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│              AI Engine (FastAPI + Python)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ LSTM/Prophet │  │ LangChain    │  │ Ollama+LLaMA │    │
│  │ Predictions  │  │ Code Gen     │  │ Local LLM    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                Infrastructure Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ Minikube K8s │  │ LocalStack   │  │ Prometheus   │    │
│  │ (Free)       │  │ AWS Emulator │  │ + Grafana    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Features

### Dashboard Tabs

1. **🏠 Overview**
   - Real-time status cards (clusters, pods, costs, storage)
   - Recent AI actions timeline
   - Predictive insights with confidence scores
   - Quick action buttons

2. **📊 Metrics & Insights**
   - Interactive charts (CPU, Memory, Network)
   - Anomaly detection system
   - Historical trend analysis
   - Service-level filtering

3. **🧠 AI Recommendations**
   - Automated optimization suggestions
   - Confidence scoring for each recommendation
   - One-click apply/reject actions
   - AI reasoning explanations

4. **💬 ChatOps**
   - Conversational infrastructure management
   - Natural language resource creation
   - Live code generation (Terraform, YAML, kubectl)
   - Quick command templates

5. **⚙️ Infrastructure**
   - Browse all resources (K8s, AWS, Azure)
   - Start/stop/delete controls
   - Real-time status monitoring
   - Multi-cloud support

6. **🔐 Settings**
   - User profile management
   - API key integrations (AWS, GitHub, Prometheus)
   - AI behavior configuration
   - Auto-scaling/healing toggles

7. **🧾 Logs & Audit**
   - Complete activity history
   - Filter by type and status
   - Export to CSV/JSON
   - User attribution tracking

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** with custom design system
- **shadcn/ui** components
- **Recharts** for data visualization
- **Lucide React** for icons

### Backend (Example Code Provided)
- **Go** with Gin/Chi framework
- **Kubernetes Client-Go**
- **AWS SDK for Go**
- **Terraform Exec**
- **PostgreSQL** for state storage

### AI Engine (Example Code Provided)
- **FastAPI** (Python)
- **LangChain** for conversational AI
- **Ollama + LLaMA 3** for local LLM
- **Prophet/LSTM** for predictions
- **scikit-learn** for ML models

### Infrastructure (Free Setup)
- **Minikube** - Local Kubernetes cluster
- **LocalStack** - AWS emulator
- **Prometheus** + **Grafana** - Metrics
- **Docker Compose** - Orchestration

## 📦 Installation & Setup

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Go 1.21+ (for backend)
- Python 3.11+ (for AI engine)
- Minikube (optional, for K8s testing)

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The frontend will be available at `http://localhost:8080`

### Backend Setup (Go Orchestrator)

See `backend/go-orchestrator/README.md` for detailed instructions:

```bash
cd backend/go-orchestrator
go mod download
go run main.go
```

API will be available at `http://localhost:8000`

### AI Engine Setup (Python)

See `backend/ai-engine/README.md` for detailed instructions:

```bash
cd backend/ai-engine
pip install -r requirements.txt
python main.py
```

AI API will be available at `http://localhost:8001`

### Infrastructure Emulation

```bash
# Start LocalStack (AWS emulator)
docker-compose up -d localstack

# Start Minikube
minikube start

# Deploy Prometheus
kubectl apply -f infrastructure/prometheus/

# Access Grafana
kubectl port-forward svc/grafana 3000:3000
```

## 🏃 Running Everything

### Option 1: Docker Compose (Recommended)

```bash
docker-compose up -d
```

This starts:
- Frontend (React) on port 8080
- Backend (Go) on port 8000
- AI Engine (Python) on port 8001
- Prometheus on port 9090
- Grafana on port 3000
- LocalStack on port 4566

### Option 2: Individual Services

Start each component separately in different terminals:

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd backend/go-orchestrator && go run main.go

# Terminal 3: AI Engine
cd backend/ai-engine && python main.py

# Terminal 4: Infrastructure
docker-compose up prometheus grafana localstack
```

## 🧪 Development

### Frontend Development

```bash
# Run with hot reload
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint
```

### Backend Development

```bash
# Watch mode
cd backend/go-orchestrator
air  # requires github.com/cosmtrek/air

# Run tests
go test ./...
```

### AI Engine Development

```bash
cd backend/ai-engine
python -m pytest tests/
```

## 🔧 Configuration

### Environment Variables

Create `.env` files in each component:

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
```

**Backend (backend/go-orchestrator/.env)**
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/orchestrator
PROMETHEUS_URL=http://localhost:9090
AWS_ENDPOINT=http://localhost:4566  # LocalStack
AI_ENGINE_URL=http://localhost:8001
```

**AI Engine (backend/ai-engine/.env)**
```env
OLLAMA_URL=http://localhost:11434
MODEL_NAME=llama3
DATABASE_URL=postgresql://user:pass@localhost:5432/orchestrator
```

## 📊 Key Components

### 1. Design System

All colors, gradients, and styles are defined in:
- `src/index.css` - CSS variables and base styles
- `tailwind.config.ts` - Tailwind theme configuration

Never use inline colors! Use semantic tokens:
- `bg-primary` - Main accent color
- `bg-card` - Card backgrounds
- `text-muted-foreground` - Secondary text

### 2. API Integration Points

Frontend communicates with backend via:
- REST API (`/api/v1/*` endpoints)
- WebSocket (`/ws` for real-time updates)

Example API calls in components:
```typescript
// Fetch metrics
const response = await fetch(`${API_URL}/api/v1/metrics`);

// Apply recommendation
await fetch(`${API_URL}/api/v1/recommendations/${id}/apply`, {
  method: 'POST'
});
```

### 3. Real-time Updates

WebSocket connection for live data:
```typescript
const ws = new WebSocket('ws://localhost:8000/ws');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Update UI with new metrics
};
```

## 🔐 Security Notes

⚠️ **This is a development setup!** For production:

1. Enable authentication (JWT, OAuth)
2. Use HTTPS/WSS
3. Secure all API keys in environment variables
4. Implement RBAC (Role-Based Access Control)
5. Use real AWS/GCP instead of LocalStack
6. Enable audit logging
7. Set up monitoring alerts

## 🎨 Customization

### Change Color Scheme

Edit `src/index.css`:
```css
:root {
  --primary: 200 100% 50%;  /* Change primary color (HSL) */
  --chart-1: 200 100% 50%;  /* Chart color 1 */
  /* ... more colors */
}
```

### Add New Dashboard Tab

1. Create component in `src/components/dashboard/`
2. Import in `src/pages/Index.tsx`
3. Add to TabsList and TabsContent

### Extend AI Capabilities

Edit `backend/ai-engine/services/ai_service.py`:
```python
def new_prediction_model(data):
    # Your custom ML model
    pass
```

## 🐛 Troubleshooting

**Frontend won't start:**
```bash
rm -rf node_modules
npm install
npm run dev
```

**Backend connection error:**
- Check if Go server is running on port 8000
- Verify `VITE_API_URL` in frontend `.env`

**Metrics not showing:**
- Ensure Prometheus is running
- Check `backend/go-orchestrator/config/prometheus.yml`
- Verify scrape targets are accessible

**ChatOps not responding:**
- Check AI Engine is running on port 8001
- Verify Ollama is installed: `ollama serve`
- Pull LLaMA model: `ollama pull llama3`

## 📚 Additional Resources

- [Go Backend README](backend/go-orchestrator/README.md)
- [AI Engine README](backend/ai-engine/README.md)
- [Infrastructure Setup](infrastructure/README.md)
- [API Documentation](docs/API.md)

## 🤝 Contributing

This is a reference implementation. To extend:

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Submit pull request

## 📝 License

MIT License - feel free to use for personal or commercial projects.

## 🙏 Acknowledgments

- Built with React, Go, and Python
- Uses shadcn/ui design system
- Inspired by Datadog, Grafana, and Kubernetes

---

**🚀 Ready to orchestrate!** Start the dev server and visit `http://localhost:8080`

For questions or issues, check the component-specific READMEs or create an issue.
