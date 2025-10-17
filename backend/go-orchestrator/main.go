package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"orchestrator/internal/handlers"
	"orchestrator/internal/k8s"
	"orchestrator/internal/metrics"
	"orchestrator/internal/websocket"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Initialize Kubernetes client
	k8sClient, err := k8s.NewClient()
	if err != nil {
		log.Printf("Warning: Failed to initialize K8s client: %v", err)
	}

	// Initialize metrics collector
	metricsCollector := metrics.NewCollector()
	if k8sClient != nil {
		go metricsCollector.StartCollection(k8sClient)
	}

	// Initialize WebSocket hub
	hub := websocket.NewHub()
	go hub.Run()

	// Setup Gin router
	router := gin.Default()

	// CORS configuration
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:8080", "http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// API routes
	api := router.Group("/api/v1")
	{
		// Overview endpoints
		api.GET("/overview", handlers.GetOverview(k8sClient, metricsCollector))
		api.GET("/status", handlers.GetStatus(k8sClient))

		// Metrics endpoints
		api.GET("/metrics", handlers.GetMetrics(metricsCollector))
		api.GET("/metrics/history", handlers.GetMetricsHistory(metricsCollector))

		// Recommendations endpoints
		api.GET("/recommendations", handlers.GetRecommendations())
		api.POST("/recommendations/:id/apply", handlers.ApplyRecommendation(k8sClient))
		api.POST("/recommendations/:id/reject", handlers.RejectRecommendation())

		// Infrastructure endpoints
		api.GET("/infrastructure", handlers.GetInfrastructure(k8sClient))
		api.POST("/infrastructure/:type/:id/start", handlers.StartResource(k8sClient))
		api.POST("/infrastructure/:type/:id/stop", handlers.StopResource(k8sClient))
		api.DELETE("/infrastructure/:type/:id", handlers.DeleteResource(k8sClient))

		// Logs endpoints
		api.GET("/logs", handlers.GetLogs())

		// ChatOps endpoints
		api.POST("/chat", handlers.HandleChat())
	}

	// WebSocket endpoint
	router.GET("/ws", func(c *gin.Context) {
		websocket.ServeWs(hub, c.Writer, c.Request)
	})

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "healthy"})
	})

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	srv := &http.Server{
		Addr:    ":" + port,
		Handler: router,
	}

	// Graceful shutdown
	go func() {
		log.Printf("Starting server on port %s", port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	// Wait for interrupt signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server...")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}

	log.Println("Server exited")
}
