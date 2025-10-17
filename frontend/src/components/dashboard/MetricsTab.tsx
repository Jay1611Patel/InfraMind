import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Cpu, HardDrive, Network, TrendingUp } from "lucide-react";

const MetricsTab = () => {
  const cpuData = [
    { time: "00:00", frontend: 45, backend: 62, database: 28 },
    { time: "04:00", frontend: 38, backend: 55, database: 25 },
    { time: "08:00", frontend: 72, backend: 78, database: 42 },
    { time: "12:00", frontend: 85, backend: 88, database: 58 },
    { time: "16:00", frontend: 68, backend: 72, database: 45 },
    { time: "20:00", frontend: 52, backend: 58, database: 32 },
  ];

  const memoryData = [
    { time: "00:00", used: 2.4, available: 5.6 },
    { time: "04:00", used: 2.1, available: 5.9 },
    { time: "08:00", used: 4.2, available: 3.8 },
    { time: "12:00", used: 5.8, available: 2.2 },
    { time: "16:00", used: 4.5, available: 3.5 },
    { time: "20:00", used: 3.2, available: 4.8 },
  ];

  const networkData = [
    { time: "00:00", ingress: 120, egress: 85 },
    { time: "04:00", ingress: 95, egress: 72 },
    { time: "08:00", ingress: 245, egress: 198 },
    { time: "12:00", ingress: 380, egress: 312 },
    { time: "16:00", ingress: 285, egress: 228 },
    { time: "20:00", ingress: 165, egress: 142 },
  ];

  const anomalies = [
    { service: "Backend API", metric: "Response Time", value: "2.4s", threshold: "1.0s", severity: "high" },
    { service: "Worker Node 3", metric: "Memory Usage", value: "94%", threshold: "85%", severity: "medium" },
    { service: "Redis Cache", metric: "Connection Pool", value: "487/500", threshold: "400/500", severity: "low" },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPU Usage */}
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-chart-1" />
              CPU Usage by Service
            </CardTitle>
            <CardDescription>Real-time processor utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={cpuData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="frontend" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                <Line type="monotone" dataKey="backend" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                <Line type="monotone" dataKey="database" stroke="hsl(var(--chart-3))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Memory Usage */}
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-chart-3" />
              Memory Usage
            </CardTitle>
            <CardDescription>RAM allocation across cluster</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={memoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="used" stackId="1" stroke="hsl(var(--chart-4))" fill="hsl(var(--chart-4))" fillOpacity={0.6} />
                <Area type="monotone" dataKey="available" stackId="1" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3))" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Network Traffic */}
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="w-5 h-5 text-chart-2" />
              Network Traffic
            </CardTitle>
            <CardDescription>Ingress and egress bandwidth (MB/s)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={networkData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Legend />
                <Bar dataKey="ingress" fill="hsl(var(--chart-1))" />
                <Bar dataKey="egress" fill="hsl(var(--chart-2))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Anomaly Detection */}
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-warning" />
              Anomaly Detection
            </CardTitle>
            <CardDescription>Automatically flagged unusual patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {anomalies.map((anomaly, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{anomaly.service}</h4>
                      <p className="text-sm text-muted-foreground">{anomaly.metric}</p>
                    </div>
                    <Badge
                      variant={anomaly.severity === "high" ? "destructive" : anomaly.severity === "medium" ? "default" : "outline"}
                    >
                      {anomaly.severity}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Current: <span className="text-foreground font-medium">{anomaly.value}</span></span>
                    <span className="text-muted-foreground">Threshold: <span className="text-foreground font-medium">{anomaly.threshold}</span></span>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <Activity className="w-4 h-4 mr-2" />
                View All Anomalies
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MetricsTab;
