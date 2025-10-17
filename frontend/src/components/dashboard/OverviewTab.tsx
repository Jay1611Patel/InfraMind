import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, AlertTriangle, CheckCircle2, Cpu, DollarSign, HardDrive, Lightbulb, TrendingUp, Zap } from "lucide-react";

const OverviewTab = () => {
  const statusCards = [
    {
      title: "Active Clusters",
      value: "3",
      change: "+1 this week",
      icon: Activity,
      color: "text-chart-1",
    },
    {
      title: "Running Pods",
      value: "47",
      change: "5 scaled up",
      icon: Cpu,
      color: "text-chart-2",
    },
    {
      title: "Monthly Cost",
      value: "$2,847",
      change: "-12% vs last month",
      icon: DollarSign,
      color: "text-chart-3",
    },
    {
      title: "Storage Used",
      value: "847 GB",
      change: "78% capacity",
      icon: HardDrive,
      color: "text-chart-4",
    },
  ];

  const recentActions = [
    {
      type: "scale",
      message: "Scaled frontend deployment from 2 to 4 replicas",
      time: "2 minutes ago",
      status: "success",
    },
    {
      type: "predict",
      message: "Predicted 70% traffic increase in next 30 minutes",
      time: "5 minutes ago",
      status: "info",
    },
    {
      type: "heal",
      message: "Auto-healed failed backend pod (backend-7c8f9d-x5k2p)",
      time: "12 minutes ago",
      status: "success",
    },
    {
      type: "alert",
      message: "High memory usage detected on worker-node-3",
      time: "18 minutes ago",
      status: "warning",
    },
  ];

  const upcomingInsights = [
    {
      title: "Expected Traffic Surge",
      description: "AI predicts 85% increase in requests at 2:00 PM EST",
      confidence: 94,
      icon: TrendingUp,
    },
    {
      title: "Cost Optimization",
      description: "Switch to spot instances could save $450/month",
      confidence: 87,
      icon: DollarSign,
    },
    {
      title: "Auto-scaling Recommendation",
      description: "Configure HPA for database service",
      confidence: 92,
      icon: Zap,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statusCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="bg-gradient-card border-border shadow-card hover:shadow-glow transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{card.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent AI Actions */}
        <Card className="lg:col-span-2 bg-gradient-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Recent AI Actions
            </CardTitle>
            <CardDescription>Real-time orchestration events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActions.map((action, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                <div className="mt-0.5">
                  {action.status === "success" && <CheckCircle2 className="w-5 h-5 text-success" />}
                  {action.status === "warning" && <AlertTriangle className="w-5 h-5 text-warning" />}
                  {action.status === "info" && <Activity className="w-5 h-5 text-primary" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{action.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{action.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start bg-primary hover:bg-primary/90" size="sm">
              <Zap className="w-4 h-4 mr-2" />
              Manual Scale
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Activity className="w-4 h-4 mr-2" />
              View All Metrics
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Pause AI Actions
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Cost Analysis
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Predictive Insights */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            Predictive Insights
          </CardTitle>
          <CardDescription>AI-powered recommendations based on pattern analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingInsights.map((insight, idx) => {
              const Icon = insight.icon;
              return (
                <div key={idx} className="p-4 rounded-lg bg-secondary/50 border border-border hover:border-primary/50 transition-colors">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <Badge variant="outline" className="ml-auto text-xs">
                      {insight.confidence}% confidence
                    </Badge>
                  </div>
                  <h4 className="font-semibold mb-2">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;
