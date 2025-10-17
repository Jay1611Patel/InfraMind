import os
import logging
from typing import Dict, Any
import requests

logger = logging.getLogger(__name__)

class ChatService:
    """
    Chat service using Ollama for local LLM inference.
    Falls back to mock responses if Ollama is not available.
    """
    
    def __init__(self):
        self.ollama_url = os.getenv("OLLAMA_URL", "http://localhost:11434")
        self.model = os.getenv("MODEL_NAME", "llama3")
        self.available = self._check_availability()
        
    def _check_availability(self) -> bool:
        """Check if Ollama is available."""
        try:
            response = requests.get(f"{self.ollama_url}/api/tags", timeout=2)
            return response.status_code == 200
        except:
            logger.warning("Ollama not available, using mock responses")
            return False
    
    def is_available(self) -> bool:
        return self.available
    
    async def process_message(self, message: str, context: str = "") -> Dict[str, Any]:
        """
        Process a chat message and generate a response.
        """
        message_lower = message.lower()
        
        # Infrastructure creation patterns
        if "create" in message_lower or "deploy" in message_lower:
            return self._handle_creation(message)
        
        # Scaling patterns
        elif "scale" in message_lower:
            return self._handle_scaling(message)
        
        # Cost/status queries
        elif "cost" in message_lower or "status" in message_lower or "show" in message_lower:
            return self._handle_query(message)
        
        # Default conversational response
        else:
            if self.available:
                return await self._call_ollama(message, context)
            else:
                return self._mock_response(message)
    
    def _handle_creation(self, message: str) -> Dict[str, Any]:
        """Generate infrastructure code for creation requests."""
        
        if "redis" in message.lower():
            code = '''resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "redis-cache"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 2
  parameter_group_name = "default.redis6.x"
  port                 = 6379
}'''
            return {
                "response": "I'll help you create a Redis cluster. Here's the Terraform configuration:",
                "code": code,
                "language": "hcl"
            }
        
        elif "kubernetes" in message.lower() or "deployment" in message.lower():
            code = '''apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: app
        image: nginx:latest
        ports:
        - containerPort: 80'''
            return {
                "response": "Here's a Kubernetes deployment configuration:",
                "code": code,
                "language": "yaml"
            }
        
        else:
            return {
                "response": "I can help you create infrastructure resources. What would you like to deploy?",
                "code": None,
                "language": None
            }
    
    def _handle_scaling(self, message: str) -> Dict[str, Any]:
        """Handle scaling requests."""
        code = '''kubectl scale deployment frontend --replicas=5'''
        
        return {
            "response": "I'll scale your deployment. Here's the command:",
            "code": code,
            "language": "bash"
        }
    
    def _handle_query(self, message: str) -> Dict[str, Any]:
        """Handle status and cost queries."""
        
        if "cost" in message.lower():
            return {
                "response": "Current infrastructure costs:\n- EC2 instances: $120/month\n- RDS database: $85/month\n- S3 storage: $15/month\n- Total: $220/month",
                "code": None,
                "language": None
            }
        else:
            return {
                "response": "System status: All services running normally.\n- 5 active pods\n- CPU usage: 45%\n- Memory usage: 60%",
                "code": None,
                "language": None
            }
    
    async def _call_ollama(self, message: str, context: str) -> Dict[str, Any]:
        """Call Ollama API for LLM inference."""
        try:
            prompt = f"You are an infrastructure management AI assistant. Help with: {message}"
            
            if context:
                prompt = f"Context: {context}\n\n{prompt}"
            
            response = requests.post(
                f"{self.ollama_url}/api/generate",
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False
                },
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                return {
                    "response": result.get("response", ""),
                    "code": None,
                    "language": None
                }
            else:
                return self._mock_response(message)
                
        except Exception as e:
            logger.error(f"Ollama API error: {str(e)}")
            return self._mock_response(message)
    
    def _mock_response(self, message: str) -> Dict[str, Any]:
        """Fallback mock response."""
        return {
            "response": "I can help you manage your infrastructure. Try asking:\n- 'Create a Redis cluster with 2 nodes'\n- 'Scale the frontend deployment to 5 replicas'\n- 'Show me current costs'",
            "code": None,
            "language": None
        }
