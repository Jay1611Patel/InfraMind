package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type LogEntry struct {
	ID        string                 `json:"id"`
	Type      string                 `json:"type"`
	Action    string                 `json:"action"`
	Target    string                 `json:"target"`
	Status    string                 `json:"status"`
	User      string                 `json:"user"`
	Timestamp time.Time              `json:"timestamp"`
	Details   map[string]interface{} `json:"details"`
}

var logs = []LogEntry{
	{
		ID:        "1",
		Type:      "scale",
		Action:    "Scale deployment",
		Target:    "frontend-deployment",
		Status:    "completed",
		User:      "AI System",
		Timestamp: time.Now().Add(-10 * time.Minute),
		Details: map[string]interface{}{
			"from":     2,
			"to":       4,
			"reason":   "Predicted traffic increase",
			"duration": "2.3s",
		},
	},
	{
		ID:        "2",
		Type:      "heal",
		Action:    "Restart pod",
		Target:    "backend-pod-xyz",
		Status:    "completed",
		User:      "AI System",
		Timestamp: time.Now().Add(-25 * time.Minute),
		Details: map[string]interface{}{
			"reason":   "Health check failed",
			"duration": "8.1s",
		},
	},
	{
		ID:        "3",
		Type:      "create",
		Action:    "Create Redis cluster",
		Target:    "redis-cache",
		Status:    "completed",
		User:      "admin@example.com",
		Timestamp: time.Now().Add(-1 * time.Hour),
		Details: map[string]interface{}{
			"nodes":    2,
			"region":   "us-east-1",
			"type":     "cache.t3.micro",
			"duration": "45.2s",
		},
	},
	{
		ID:        "4",
		Type:      "optimize",
		Action:    "Enable caching",
		Target:    "api-gateway",
		Status:    "completed",
		User:      "AI System",
		Timestamp: time.Now().Add(-2 * time.Hour),
		Details: map[string]interface{}{
			"cacheSize": "1GB",
			"ttl":       "5m",
			"hitRate":   "0%",
		},
	},
}

func GetLogs() gin.HandlerFunc {
	return func(c *gin.Context) {
		logType := c.Query("type")
		status := c.Query("status")

		filteredLogs := logs

		if logType != "" {
			var filtered []LogEntry
			for _, log := range filteredLogs {
				if log.Type == logType {
					filtered = append(filtered, log)
				}
			}
			filteredLogs = filtered
		}

		if status != "" {
			var filtered []LogEntry
			for _, log := range filteredLogs {
				if log.Status == status {
					filtered = append(filtered, log)
				}
			}
			filteredLogs = filtered
		}

		c.JSON(http.StatusOK, gin.H{
			"logs":  filteredLogs,
			"total": len(filteredLogs),
		})
	}
}
