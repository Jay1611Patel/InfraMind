package handlers

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

type ChatRequest struct {
	Message string `json:"message"`
	Context string `json:"context"`
}

type ChatResponse struct {
	Response string `json:"response"`
	Code     string `json:"code,omitempty"`
	Language string `json:"language,omitempty"`
}

func HandleChat() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req ChatRequest
		if err := c.BindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Call AI Engine
		aiEngineURL := os.Getenv("AI_ENGINE_URL")
		if aiEngineURL == "" {
			aiEngineURL = "http://localhost:8001"
		}

		payload := map[string]interface{}{
			"message": req.Message,
			"context": req.Context,
		}

		jsonData, err := json.Marshal(payload)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create request"})
			return
		}

		resp, err := http.Post(aiEngineURL+"/api/chat", "application/json", bytes.NewBuffer(jsonData))
		if err != nil {
			// Return mock response if AI engine is not available
			c.JSON(http.StatusOK, ChatResponse{
				Response: "I can help you manage your infrastructure. Try asking:\n- 'Create a Redis cluster with 2 nodes'\n- 'Scale the frontend deployment to 5 replicas'\n- 'Show me current costs'",
			})
			return
		}
		defer resp.Body.Close()

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read response"})
			return
		}

		var chatResp ChatResponse
		if err := json.Unmarshal(body, &chatResp); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse response"})
			return
		}

		c.JSON(http.StatusOK, chatResp)
	}
}
