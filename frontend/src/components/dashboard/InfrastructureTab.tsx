import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Cloud, Database, PlayCircle, Square, Trash2, Search, Server, HardDrive } from "lucide-react";
import { toast } from "sonner";

const InfrastructureTab = () => {
  const infrastructure = {
    kubernetes: [
      { name: "frontend-deployment", type: "Deployment", status: "running", replicas: "4/4", namespace: "production" },
      { name: "backend-deployment", type: "Deployment", status: "running", replicas: "3/3", namespace: "production" },
      { name: "worker-deployment", type: "Deployment", status: "running", replicas: "2/2", namespace: "production" },
      { name: "redis-cache", type: "Service", status: "running", replicas: "1/1", namespace: "production" },
    ],
    aws: [
      { name: "web-tier-asg", type: "Auto Scaling Group", status: "healthy", instances: "3", region: "us-east-1" },
      { name: "postgres-prod", type: "RDS Instance", status: "available", size: "db.t3.large", region: "us-east-1" },
      { name: "app-cache", type: "ElastiCache", status: "available", nodes: "2", region: "us-east-1" },
      { name: "uploads-bucket", type: "S3 Bucket", status: "active", size: "847 GB", region: "us-east-1" },
    ],
  };

  const handleStart = (name: string) => {
    toast.success(`Starting ${name}...`);
  };

  const handleStop = (name: string) => {
    toast.info(`Stopping ${name}...`);
  };

  const handleDelete = (name: string) => {
    toast.error(`Delete ${name}? This action cannot be undone.`);
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search infrastructure by name, type, or status..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Kubernetes Resources */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5 text-chart-2" />
            Kubernetes Cluster
          </CardTitle>
          <CardDescription>Resources in production namespace</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {infrastructure.kubernetes.map((resource, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{resource.name}</h4>
                      <Badge variant="outline" className="text-xs">{resource.type}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Replicas: {resource.replicas}</span>
                      <span>Namespace: {resource.namespace}</span>
                    </div>
                  </div>
                  <Badge className="bg-success/10 text-success border-success/20">{resource.status}</Badge>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button size="sm" variant="ghost" onClick={() => handleStop(resource.name)}>
                    <Square className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(resource.name)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AWS Resources */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-chart-4" />
            AWS Resources
          </CardTitle>
          <CardDescription>Infrastructure in us-east-1 region</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {infrastructure.aws.map((resource, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{resource.name}</h4>
                      <Badge variant="outline" className="text-xs">{resource.type}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {resource.instances && <span>Instances: {resource.instances}</span>}
                      {resource.size && <span>Size: {resource.size}</span>}
                      {resource.nodes && <span>Nodes: {resource.nodes}</span>}
                      <span>Region: {resource.region}</span>
                    </div>
                  </div>
                  <Badge className="bg-success/10 text-success border-success/20">{resource.status}</Badge>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button size="sm" variant="ghost" onClick={() => handleStart(resource.name)}>
                    <PlayCircle className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleStop(resource.name)}>
                    <Square className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(resource.name)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-chart-1">12</div>
              <div className="text-sm text-muted-foreground mt-1">Total Resources</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-success">11</div>
              <div className="text-sm text-muted-foreground mt-1">Healthy</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-warning">1</div>
              <div className="text-sm text-muted-foreground mt-1">Warning</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-chart-4">2</div>
              <div className="text-sm text-muted-foreground mt-1">Regions</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfrastructureTab;
