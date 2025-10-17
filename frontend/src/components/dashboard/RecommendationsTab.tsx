import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Info, Lightbulb, TrendingUp, X } from "lucide-react";
import { toast } from "sonner";

const RecommendationsTab = () => {
  const recommendations = [
    {
      id: 1,
      type: "Scale",
      target: "frontend-deployment",
      action: "Increase replicas from 2 to 4",
      reason: "Based on 15-minute moving average of CPU load (>75%) and predicted traffic surge",
      confidence: 93,
      impact: "high",
      status: "pending",
    },
    {
      id: 2,
      type: "Optimize",
      target: "worker-node-pool",
      action: "Switch to spot instances for batch jobs",
      reason: "Could save $450/month with <5% interruption rate based on historical patterns",
      confidence: 87,
      impact: "medium",
      status: "pending",
    },
    {
      id: 3,
      type: "Configure",
      target: "database-service",
      action: "Enable Horizontal Pod Autoscaler (HPA)",
      reason: "Database CPU spikes detected during peak hours (12PM-2PM EST)",
      confidence: 92,
      impact: "high",
      status: "pending",
    },
    {
      id: 4,
      type: "Upgrade",
      target: "redis-cache",
      action: "Increase memory limit to 4GB",
      reason: "Cache eviction rate increased 40% in last 24h, affecting response times",
      confidence: 89,
      impact: "medium",
      status: "pending",
    },
  ];

  const handleApply = (id: number, action: string) => {
    toast.success(`Applied recommendation: ${action}`, {
      description: "Orchestrator is executing the change...",
    });
  };

  const handleReject = (id: number) => {
    toast.info("Recommendation dismissed");
  };

  const handleExplain = (reason: string) => {
    toast.info("AI Reasoning", {
      description: reason,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                AI-Generated Recommendations
              </CardTitle>
              <CardDescription className="mt-2">
                Review and apply infrastructure optimization suggestions from the AI engine
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Clock className="w-4 h-4 mr-2" />
                View History
              </Button>
              <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90">
                <TrendingUp className="w-4 h-4 mr-2" />
                Enable Auto-Apply
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <Card key={rec.id} className="bg-gradient-card border-border shadow-card hover:shadow-glow transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-3">
                  {/* Header Row */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={rec.impact === "high" ? "default" : "outline"}
                        className={rec.impact === "high" ? "bg-primary" : ""}
                      >
                        {rec.type}
                      </Badge>
                      <h3 className="font-semibold text-lg">{rec.target}</h3>
                      <Badge variant="outline" className="text-xs">
                        {rec.confidence}% confidence
                      </Badge>
                    </div>
                    <Badge
                      variant={rec.impact === "high" ? "destructive" : "default"}
                      className={rec.impact === "high" ? "" : "bg-warning text-warning-foreground"}
                    >
                      {rec.impact} impact
                    </Badge>
                  </div>

                  {/* Action */}
                  <div className="pl-3 border-l-2 border-primary">
                    <p className="font-medium text-foreground">{rec.action}</p>
                  </div>

                  {/* Reason */}
                  <div className="flex items-start gap-2 p-3 bg-secondary/50 rounded-lg">
                    <Info className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <p className="text-sm text-muted-foreground">{rec.reason}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      onClick={() => handleApply(rec.id, rec.action)}
                      className="bg-primary hover:bg-primary/90"
                      size="sm"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Apply
                    </Button>
                    <Button
                      onClick={() => handleExplain(rec.reason)}
                      variant="outline"
                      size="sm"
                    >
                      <Info className="w-4 h-4 mr-2" />
                      Explain Decision
                    </Button>
                    <Button
                      onClick={() => handleReject(rec.id)}
                      variant="ghost"
                      size="sm"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats Footer */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">24</div>
              <div className="text-sm text-muted-foreground mt-1">Recommendations This Week</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-success">18</div>
              <div className="text-sm text-muted-foreground mt-1">Successfully Applied</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-chart-4">$1,240</div>
              <div className="text-sm text-muted-foreground mt-1">Estimated Savings</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-chart-2">91%</div>
              <div className="text-sm text-muted-foreground mt-1">Average Confidence</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecommendationsTab;
