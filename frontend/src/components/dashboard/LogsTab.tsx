import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Filter, Search, FileText } from "lucide-react";
import { toast } from "sonner";

const LogsTab = () => {
  const logs = [
    {
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      type: "scale",
      action: "Scaled frontend deployment",
      details: "Increased replicas from 2 to 4 based on CPU threshold",
      user: "AI Orchestrator",
      status: "success",
    },
    {
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: "predict",
      action: "Traffic prediction generated",
      details: "70% increase expected in next 30 minutes",
      user: "AI Engine",
      status: "info",
    },
    {
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      type: "heal",
      action: "Auto-healed backend pod",
      details: "Restarted failed pod backend-7c8f9d-x5k2p",
      user: "AI Orchestrator",
      status: "success",
    },
    {
      timestamp: new Date(Date.now() - 18 * 60 * 1000),
      type: "alert",
      action: "Memory threshold exceeded",
      details: "Worker node 3 reached 94% memory usage",
      user: "Monitoring System",
      status: "warning",
    },
    {
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      type: "create",
      action: "Created Redis cache cluster",
      details: "User requested via ChatOps interface",
      user: "DevOps Engineer",
      status: "success",
    },
    {
      timestamp: new Date(Date.now() - 42 * 60 * 1000),
      type: "optimize",
      action: "Applied cost optimization",
      details: "Switched worker nodes to spot instances",
      user: "AI Orchestrator",
      status: "success",
    },
    {
      timestamp: new Date(Date.now() - 58 * 60 * 1000),
      type: "scale",
      action: "Scaled database service",
      details: "Enabled HPA with target CPU 70%",
      user: "AI Orchestrator",
      status: "success",
    },
    {
      timestamp: new Date(Date.now() - 72 * 60 * 1000),
      type: "delete",
      action: "Removed unused resources",
      details: "Deleted old staging deployment",
      user: "DevOps Engineer",
      status: "info",
    },
  ];

  const handleExport = () => {
    toast.success("Exporting logs to CSV...");
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return date.toLocaleDateString();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "scale":
        return "bg-chart-1/10 text-chart-1 border-chart-1/20";
      case "predict":
        return "bg-chart-2/10 text-chart-2 border-chart-2/20";
      case "heal":
        return "bg-success/10 text-success border-success/20";
      case "alert":
        return "bg-warning/10 text-warning border-warning/20";
      case "create":
        return "bg-chart-3/10 text-chart-3 border-chart-3/20";
      case "optimize":
        return "bg-chart-4/10 text-chart-4 border-chart-4/20";
      default:
        return "bg-secondary";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-success/10 text-success border-success/20";
      case "warning":
        return "bg-warning/10 text-warning border-warning/20";
      case "error":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search logs..." className="pl-10" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="scale">Scale</SelectItem>
                <SelectItem value="predict">Predict</SelectItem>
                <SelectItem value="heal">Heal</SelectItem>
                <SelectItem value="alert">Alert</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExport} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs List */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Activity Logs
          </CardTitle>
          <CardDescription>Complete history of system actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {logs.map((log, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors border border-border"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getTypeColor(log.type)}>{log.type}</Badge>
                    <h4 className="font-semibold">{log.action}</h4>
                  </div>
                  <Badge className={getStatusColor(log.status)}>{log.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{log.details}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>By: {log.user}</span>
                  <span>•</span>
                  <span>{formatTime(log.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">{logs.length}</div>
              <div className="text-sm text-muted-foreground mt-1">Total Events</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-success">
                {logs.filter((l) => l.status === "success").length}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Successful</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-warning">
                {logs.filter((l) => l.status === "warning").length}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Warnings</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-chart-1">
                {logs.filter((l) => l.user === "AI Orchestrator").length}
              </div>
              <div className="text-sm text-muted-foreground mt-1">AI Actions</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogsTab;
