package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"orchestrator/internal/metrics"
)

type MetricsResponse struct {
	CPU     []MetricPoint `json:"cpu"`
	Memory  []MetricPoint `json:"memory"`
	Network []MetricPoint `json:"network"`
	Anomalies []Anomaly   `json:"anomalies"`
}

type MetricPoint struct {
	Timestamp time.Time `json:"timestamp"`
	Value     float64   `json:"value"`
	Service   string    `json:"service,omitempty"`
}

type Anomaly struct {
	ID        string    `json:"id"`
	Type      string    `json:"type"`
	Service   string    `json:"service"`
	Severity  string    `json:"severity"`
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timestamp"`
}

func GetMetrics(metricsCollector *metrics.Collector) gin.HandlerFunc {
	return func(c *gin.Context) {
		service := c.Query("service")
		
		// Generate sample time series data
		now := time.Now()
		var cpuData, memoryData, networkData []MetricPoint

		for i := 0; i < 20; i++ {
			timestamp := now.Add(-time.Duration(20-i) * time.Minute)
			
			cpuData = append(cpuData, MetricPoint{
				Timestamp: timestamp,
				Value:     45.0 + float64(i)*2.5,
				Service:   service,
			})
			
			memoryData = append(memoryData, MetricPoint{
				Timestamp: timestamp,
				Value:     60.0 + float64(i)*1.5,
				Service:   service,
			})
			
			networkData = append(networkData, MetricPoint{
				Timestamp: timestamp,
				Value:     100.0 + float64(i)*5.0,
				Service:   service,
			})
		}

		response := MetricsResponse{
			CPU:     cpuData,
			Memory:  memoryData,
			Network: networkData,
			Anomalies: []Anomaly{
				{
					ID:        "1",
					Type:      "spike",
					Service:   "backend-api",
					Severity:  "warning",
					Message:   "CPU spike detected: 95% for 3 minutes",
					Timestamp: now.Add(-15 * time.Minute),
				},
			},
		}

		c.JSON(http.StatusOK, response)
	}
}

func GetMetricsHistory(metricsCollector *metrics.Collector) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Return historical metrics
		c.JSON(http.StatusOK, gin.H{
			"history": metricsCollector.GetHistory(),
		})
	}
}
