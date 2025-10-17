import logging
import numpy as np
from typing import List, Dict, Any
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class PredictionService:
    """
    Prediction service for infrastructure metrics.
    Uses simple statistical models (can be extended with LSTM/Prophet).
    """
    
    def __init__(self):
        self.models = {}
    
    async def predict(self, metrics: List[Dict[str, Any]], target: str, horizon: int) -> Dict[str, Any]:
        """
        Generate predictions for a specific metric.
        
        Args:
            metrics: Historical metric data
            target: Metric to predict (cpu, memory, traffic)
            horizon: Prediction window in minutes
        """
        
        if not metrics:
            return self._generate_sample_predictions(target, horizon)
        
        # Extract values
        values = [m.get('value', 0) for m in metrics]
        
        # Simple moving average prediction
        window_size = min(5, len(values))
        recent_avg = np.mean(values[-window_size:]) if len(values) >= window_size else np.mean(values)
        trend = self._calculate_trend(values)
        
        # Generate future predictions
        predictions = []
        current_time = datetime.now()
        
        for i in range(horizon):
            predicted_value = recent_avg + (trend * i)
            predicted_value = max(0, min(100, predicted_value))  # Clamp between 0-100
            
            predictions.append({
                "timestamp": (current_time + timedelta(minutes=i)).isoformat(),
                "value": round(predicted_value, 2),
                "confidence": self._calculate_confidence(i, horizon)
            })
        
        # Generate recommendations
        recommendations = self._generate_recommendations_from_predictions(
            predictions, target, trend
        )
        
        # Calculate overall confidence
        avg_confidence = np.mean([p['confidence'] for p in predictions])
        
        return {
            "predictions": predictions,
            "confidence": round(avg_confidence, 2),
            "recommendations": recommendations
        }
    
    def _calculate_trend(self, values: List[float]) -> float:
        """Calculate simple linear trend."""
        if len(values) < 2:
            return 0
        
        x = np.arange(len(values))
        y = np.array(values)
        
        # Simple linear regression
        slope = np.polyfit(x, y, 1)[0] if len(values) > 1 else 0
        return slope
    
    def _calculate_confidence(self, step: int, horizon: int) -> float:
        """Calculate prediction confidence (decreases with distance)."""
        return max(0.5, 1.0 - (step / horizon) * 0.5)
    
    def _generate_sample_predictions(self, target: str, horizon: int) -> Dict[str, Any]:
        """Generate sample predictions when no historical data is available."""
        base_values = {
            "cpu": 45.0,
            "memory": 60.0,
            "traffic": 1000.0
        }
        
        base_value = base_values.get(target, 50.0)
        predictions = []
        current_time = datetime.now()
        
        for i in range(horizon):
            # Add some randomness
            value = base_value + np.random.uniform(-5, 10)
            value = max(0, min(100, value))
            
            predictions.append({
                "timestamp": (current_time + timedelta(minutes=i)).isoformat(),
                "value": round(value, 2),
                "confidence": self._calculate_confidence(i, horizon)
            })
        
        return {
            "predictions": predictions,
            "confidence": 0.85,
            "recommendations": ["Monitor resource usage", "Consider scaling if trend continues"]
        }
    
    def _generate_recommendations_from_predictions(
        self, predictions: List[Dict], target: str, trend: float
    ) -> List[str]:
        """Generate recommendations based on predictions."""
        recommendations = []
        
        max_value = max([p['value'] for p in predictions])
        
        if max_value > 80:
            recommendations.append(f"⚠️ {target.upper()} expected to reach {max_value:.0f}% - consider scaling up")
        
        if trend > 2:
            recommendations.append(f"📈 Rising {target} trend detected - proactive scaling recommended")
        elif trend < -2:
            recommendations.append(f"📉 Declining {target} trend - consider scaling down to save costs")
        
        if not recommendations:
            recommendations.append(f"✅ {target.upper()} levels stable - no action needed")
        
        return recommendations
    
    async def generate_recommendations(self, metrics: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Generate infrastructure optimization recommendations.
        """
        recommendations = []
        
        cpu = metrics.get('cpu_usage', 0)
        memory = metrics.get('memory_usage', 0)
        pod_count = metrics.get('pod_count', 0)
        
        # CPU-based recommendations
        if cpu > 80:
            recommendations.append({
                "type": "scale",
                "target": "compute-nodes",
                "action": "Add 2 more nodes",
                "confidence": 0.92,
                "reasoning": f"CPU usage at {cpu}% - approaching capacity",
                "impact": "Improved performance, $50/month cost increase"
            })
        elif cpu < 20:
            recommendations.append({
                "type": "optimize",
                "target": "compute-nodes",
                "action": "Reduce node count by 1",
                "confidence": 0.85,
                "reasoning": f"CPU usage at {cpu}% - underutilized resources",
                "impact": "Save $25/month"
            })
        
        # Memory-based recommendations
        if memory > 85:
            recommendations.append({
                "type": "scale",
                "target": "memory",
                "action": "Upgrade instance types",
                "confidence": 0.88,
                "reasoning": f"Memory usage at {memory}% - risk of OOM",
                "impact": "Prevent crashes, $30/month cost increase"
            })
        
        # Pod optimization
        if pod_count > 0 and pod_count < 3:
            recommendations.append({
                "type": "availability",
                "target": "deployments",
                "action": "Increase replica count to 3",
                "confidence": 0.90,
                "reasoning": "Low pod count - improve high availability",
                "impact": "Better fault tolerance"
            })
        
        return recommendations
    
    async def detect_anomalies(self, metrics: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Detect anomalies in infrastructure metrics.
        """
        anomalies = []
        
        cpu = metrics.get('cpu_usage', 0)
        memory = metrics.get('memory_usage', 0)
        
        # Simple threshold-based anomaly detection
        if cpu > 95:
            anomalies.append({
                "type": "cpu_spike",
                "severity": "high",
                "message": f"CPU usage critically high: {cpu}%",
                "timestamp": datetime.now().isoformat()
            })
        
        if memory > 90:
            anomalies.append({
                "type": "memory_pressure",
                "severity": "high",
                "message": f"Memory usage critically high: {memory}%",
                "timestamp": datetime.now().isoformat()
            })
        
        return anomalies
