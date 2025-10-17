package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"orchestrator/internal/k8s"
)

type InfrastructureResource struct {
	ID       string                 `json:"id"`
	Name     string                 `json:"name"`
	Type     string                 `json:"type"`
	Provider string                 `json:"provider"`
	Status   string                 `json:"status"`
	Metadata map[string]interface{} `json:"metadata"`
}

func GetInfrastructure(k8sClient *k8s.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		resources := []InfrastructureResource{}

		// Get Kubernetes resources
		if k8sClient != nil {
			pods, err := k8sClient.GetPods("default")
			if err == nil {
				for _, pod := range pods {
					resources = append(resources, InfrastructureResource{
						ID:       string(pod.UID),
						Name:     pod.Name,
						Type:     "pod",
						Provider: "kubernetes",
						Status:   string(pod.Status.Phase),
						Metadata: map[string]interface{}{
							"namespace": pod.Namespace,
							"created":   pod.CreationTimestamp,
						},
					})
				}
			}

			deployments, err := k8sClient.GetDeployments("default")
			if err == nil {
				for _, dep := range deployments {
					resources = append(resources, InfrastructureResource{
						ID:       string(dep.UID),
						Name:     dep.Name,
						Type:     "deployment",
						Provider: "kubernetes",
						Status:   "running",
						Metadata: map[string]interface{}{
							"namespace": dep.Namespace,
							"replicas":  *dep.Spec.Replicas,
							"created":   dep.CreationTimestamp,
						},
					})
				}
			}
		}

		// Add mock AWS resources
		resources = append(resources, InfrastructureResource{
			ID:       "i-1234567890abcdef0",
			Name:     "worker-node-1",
			Type:     "ec2-instance",
			Provider: "aws",
			Status:   "running",
			Metadata: map[string]interface{}{
				"instanceType": "t3.medium",
				"region":       "us-east-1",
			},
		})

		c.JSON(http.StatusOK, gin.H{
			"resources": resources,
		})
	}
}

func StartResource(k8sClient *k8s.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		resourceType := c.Param("type")
		resourceID := c.Param("id")

		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": "Resource started",
			"type":    resourceType,
			"id":      resourceID,
		})
	}
}

func StopResource(k8sClient *k8s.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		resourceType := c.Param("type")
		resourceID := c.Param("id")

		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": "Resource stopped",
			"type":    resourceType,
			"id":      resourceID,
		})
	}
}

func DeleteResource(k8sClient *k8s.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		resourceType := c.Param("type")
		resourceID := c.Param("id")

		// In real implementation, delete the resource
		// if k8sClient != nil && resourceType == "pod" {
		//     err := k8sClient.DeletePod(resourceID, namespace)
		// }

		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": "Resource deleted",
			"type":    resourceType,
			"id":      resourceID,
		})
	}
}
