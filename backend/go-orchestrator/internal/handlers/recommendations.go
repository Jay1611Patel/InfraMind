package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"orchestrator/internal/k8s"
)

type Recommendation struct {
	ID          string    `json:"id"`
	Type        string    `json:"type"`
	Target      string    `json:"target"`
	Action      string    `json:"action"`
	Confidence  float64   `json:"confidence"`
	Reasoning   string    `json:"reasoning"`
	Impact      string    `json:"impact"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"createdAt"`
}

var recommendations = []Recommendation{
	{
		ID:         "1",
		Type:       "scale",
		Target:     "frontend-deployment",
		Action:     "Scale replicas from 2 to 4",
		Confidence: 0.93,
		Reasoning:  "Traffic pattern indicates 70% increase in next 30 minutes",
		Impact:     "Improved response times, $12/day cost increase",
		Status:     "pending",
		CreatedAt:  time.Now().Add(-5 * time.Minute),
	},
	{
		ID:         "2",
		Type:       "optimize",
		Target:     "gpu-node-pool",
		Action:     "Switch to spot instances",
		Confidence: 0.87,
		Reasoning:  "Workload is fault-tolerant, can save 60% on compute",
		Impact:     "Save $120/month, possible interruptions",
		Status:     "pending",
		CreatedAt:  time.Now().Add(-15 * time.Minute),
	},
	{
		ID:         "3",
		Type:       "security",
		Target:     "api-gateway",
		Action:     "Enable rate limiting",
		Confidence: 0.95,
		Reasoning:  "Detected unusual traffic patterns from 3 IPs",
		Impact:     "Prevent potential DDoS, no cost impact",
		Status:     "pending",
		CreatedAt:  time.Now().Add(-30 * time.Minute),
	},
}

func GetRecommendations() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"recommendations": recommendations,
		})
	}
}

func ApplyRecommendation(k8sClient *k8s.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		// Find and apply recommendation
		for i, rec := range recommendations {
			if rec.ID == id {
				// Simulate applying the recommendation
				if k8sClient != nil && rec.Type == "scale" {
					// In a real implementation, this would scale the deployment
					// err := k8sClient.ScaleDeployment(rec.Target, newReplicas)
				}

				recommendations[i].Status = "applied"
				c.JSON(http.StatusOK, gin.H{
					"success": true,
					"message": "Recommendation applied successfully",
				})
				return
			}
		}

		c.JSON(http.StatusNotFound, gin.H{
			"error": "Recommendation not found",
		})
	}
}

func RejectRecommendation() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		for i, rec := range recommendations {
			if rec.ID == id {
				recommendations[i].Status = "rejected"
				c.JSON(http.StatusOK, gin.H{
					"success": true,
					"message": "Recommendation rejected",
				})
				return
			}
		}

		c.JSON(http.StatusNotFound, gin.H{
			"error": "Recommendation not found",
		})
	}
}
