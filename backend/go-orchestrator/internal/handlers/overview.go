package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"orchestrator/internal/k8s"
	"orchestrator/internal/metrics"
)

type OverviewResponse struct {
	Status         StatusCards         `json:"status"`
	RecentActions  []RecentAction      `json:"recentActions"`
	Predictions    []Prediction        `json:"predictions"`
	CurrentMetrics map[string]float64  `json:"currentMetrics"`
}

type StatusCards struct {
	Clusters  int     `json:"clusters"`
	Pods      int     `json:"pods"`
	MonthlyCost float64 `json:"monthlyCost"`
	Storage   string  `json:"storage"`
}

type RecentAction struct {
	ID        string    `json:"id"`
	Type      string    `json:"type"`
	Target    string    `json:"target"`
	Action    string    `json:"action"`
	Status    string    `json:"status"`
	Timestamp time.Time `json:"timestamp"`
}

type Prediction struct {
	ID         string  `json:"id"`
	Type       string  `json:"type"`
	Message    string  `json:"message"`
	Confidence float64 `json:"confidence"`
	TimeWindow string  `json:"timeWindow"`
}

func GetOverview(k8sClient *k8s.Client, metricsCollector *metrics.Collector) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get current pod count
		podCount := 0
		if k8sClient != nil {
			pods, err := k8sClient.GetPods("default")
			if err == nil {
				podCount = len(pods)
			}
		}

		// Get current metrics
		currentMetrics := metricsCollector.GetCurrentMetrics()

		response := OverviewResponse{
			Status: StatusCards{
				Clusters:    1,
				Pods:        podCount,
				MonthlyCost: 234.56,
				Storage:     "845 GB / 2 TB",
			},
			RecentActions: []RecentAction{
				{
					ID:        "1",
					Type:      "scale",
					Target:    "frontend-deployment",
					Action:    "Scaled replicas from 2 to 4",
					Status:    "completed",
					Timestamp: time.Now().Add(-10 * time.Minute),
				},
				{
					ID:        "2",
					Type:      "heal",
					Target:    "backend-pod-xyz",
					Action:    "Restarted unhealthy pod",
					Status:    "completed",
					Timestamp: time.Now().Add(-25 * time.Minute),
				},
			},
			Predictions: []Prediction{
				{
					ID:         "1",
					Type:       "traffic",
					Message:    "Traffic surge expected in 45 minutes",
					Confidence: 0.89,
					TimeWindow: "45m",
				},
				{
					ID:         "2",
					Type:       "cost",
					Message:    "Optimize GPU node usage to save $120/mo",
					Confidence: 0.95,
					TimeWindow: "monthly",
				},
			},
			CurrentMetrics: currentMetrics,
		}

		c.JSON(http.StatusOK, response)
	}
}

func GetStatus(k8sClient *k8s.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		status := gin.H{
			"healthy":     true,
			"k8sConnected": k8sClient != nil,
			"timestamp":   time.Now(),
		}

		c.JSON(http.StatusOK, status)
	}
}
