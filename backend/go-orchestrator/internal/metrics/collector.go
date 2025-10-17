package metrics

import (
	"sync"
	"time"

	"orchestrator/internal/k8s"
)

type Collector struct {
	mu             sync.RWMutex
	currentMetrics map[string]float64
	history        []MetricSnapshot
}

type MetricSnapshot struct {
	Timestamp time.Time              `json:"timestamp"`
	Metrics   map[string]float64     `json:"metrics"`
}

func NewCollector() *Collector {
	return &Collector{
		currentMetrics: make(map[string]float64),
		history:        make([]MetricSnapshot, 0),
	}
}

func (c *Collector) StartCollection(k8sClient *k8s.Client) {
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		c.collectMetrics(k8sClient)
	}
}

func (c *Collector) collectMetrics(k8sClient *k8s.Client) {
	c.mu.Lock()
	defer c.mu.Unlock()

	// Collect metrics from Kubernetes
	metrics := make(map[string]float64)
	
	// Mock metrics (in production, query from Prometheus)
	metrics["cpu_usage"] = 45.0 + float64(time.Now().Unix()%20)
	metrics["memory_usage"] = 60.0 + float64(time.Now().Unix()%15)
	metrics["network_throughput"] = 100.0 + float64(time.Now().Unix()%50)
	
	if k8sClient != nil {
		pods, err := k8sClient.GetPods("default")
		if err == nil {
			metrics["pod_count"] = float64(len(pods))
		}
	}

	c.currentMetrics = metrics

	// Store in history
	snapshot := MetricSnapshot{
		Timestamp: time.Now(),
		Metrics:   metrics,
	}
	c.history = append(c.history, snapshot)

	// Keep only last 100 snapshots
	if len(c.history) > 100 {
		c.history = c.history[1:]
	}
}

func (c *Collector) GetCurrentMetrics() map[string]float64 {
	c.mu.RLock()
	defer c.mu.RUnlock()

	metrics := make(map[string]float64)
	for k, v := range c.currentMetrics {
		metrics[k] = v
	}
	return metrics
}

func (c *Collector) GetHistory() []MetricSnapshot {
	c.mu.RLock()
	defer c.mu.RUnlock()

	history := make([]MetricSnapshot, len(c.history))
	copy(history, c.history)
	return history
}
