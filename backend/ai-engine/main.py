import os
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uvicorn
from dotenv import load_dotenv

from services.chat_service import ChatService
from services.prediction_service import PredictionService

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(
    title="AI Infrastructure Engine",
    description="AI-powered infrastructure management and prediction engine",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:5173", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
chat_service = ChatService()
prediction_service = PredictionService()

# Request/Response models
class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = ""

class ChatResponse(BaseModel):
    response: str
    code: Optional[str] = None
    language: Optional[str] = None

class PredictionRequest(BaseModel):
    metrics: List[Dict[str, Any]]
    target: str  # 'cpu', 'memory', 'traffic'
    horizon: int = 30  # minutes ahead

class PredictionResponse(BaseModel):
    predictions: List[Dict[str, Any]]
    confidence: float
    recommendations: List[str]

class RecommendationResponse(BaseModel):
    recommendations: List[Dict[str, Any]]

# Health check
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "chat_service": chat_service.is_available(),
        "prediction_service": True
    }

# Chat endpoint
@app.post("/api/chat", response_model=ChatResponse)
async def handle_chat(request: ChatRequest):
    """
    Process chat messages and generate infrastructure code or responses.
    """
    try:
        logger.info(f"Processing chat message: {request.message[:50]}...")
        
        response = await chat_service.process_message(
            message=request.message,
            context=request.context
        )
        
        return ChatResponse(**response)
    
    except Exception as e:
        logger.error(f"Chat processing error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Prediction endpoint
@app.post("/api/predict", response_model=PredictionResponse)
async def generate_predictions(request: PredictionRequest):
    """
    Generate predictions for infrastructure metrics.
    """
    try:
        logger.info(f"Generating {request.target} predictions...")
        
        predictions = await prediction_service.predict(
            metrics=request.metrics,
            target=request.target,
            horizon=request.horizon
        )
        
        return PredictionResponse(**predictions)
    
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Recommendations endpoint
@app.post("/api/recommendations", response_model=RecommendationResponse)
async def generate_recommendations(metrics: Dict[str, Any]):
    """
    Generate AI-powered infrastructure recommendations.
    """
    try:
        logger.info("Generating recommendations...")
        
        recommendations = await prediction_service.generate_recommendations(metrics)
        
        return RecommendationResponse(recommendations=recommendations)
    
    except Exception as e:
        logger.error(f"Recommendation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Anomaly detection endpoint
@app.post("/api/anomalies")
async def detect_anomalies(metrics: Dict[str, Any]):
    """
    Detect anomalies in infrastructure metrics.
    """
    try:
        logger.info("Detecting anomalies...")
        
        anomalies = await prediction_service.detect_anomalies(metrics)
        
        return {"anomalies": anomalies}
    
    except Exception as e:
        logger.error(f"Anomaly detection error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.getenv("PORT", "8001"))
    
    logger.info(f"Starting AI Engine on port {port}")
    logger.info(f"Chat service available: {chat_service.is_available()}")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="info"
    )
