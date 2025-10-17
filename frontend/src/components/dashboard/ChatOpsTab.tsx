import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, User, Code, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  code?: string;
  timestamp: Date;
}

const ChatOpsTab = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI Infrastructure Assistant. I can help you create, modify, and manage your infrastructure using natural language. Try asking me to create a resource or scale a service!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);

    // Simulate AI response
    setTimeout(() => {
      let aiResponse: Message;

      if (input.toLowerCase().includes("redis") || input.toLowerCase().includes("cache")) {
        aiResponse = {
          role: "assistant",
          content: "I'll create a Redis cache cluster for you. Here's the Terraform configuration. Would you like to edit it before deployment?",
          code: `resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "redis-cache"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 2
  parameter_group_name = "default.redis6.x"
  port                 = 6379
  
  tags = {
    Name        = "Redis Cache"
    Environment = "production"
  }
}`,
          timestamp: new Date(),
        };
      } else if (input.toLowerCase().includes("scale") || input.toLowerCase().includes("replicas")) {
        aiResponse = {
          role: "assistant",
          content: "I'll scale your deployment. Here's the Kubernetes command I'll execute:",
          code: `kubectl scale deployment frontend --replicas=4
kubectl get deployment frontend -o wide`,
          timestamp: new Date(),
        };
      } else {
        aiResponse = {
          role: "assistant",
          content: "I can help you with that! Could you provide more details about what you'd like to do? I can:\n\n• Create new resources (EC2, RDS, Redis, etc.)\n• Scale existing deployments\n• Modify configurations\n• View resource status\n• Optimize costs",
          timestamp: new Date(),
        };
      }

      setMessages((prev) => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 1500);
  };

  const handleDeploy = (code: string) => {
    toast.success("Deployment initiated", {
      description: "The orchestrator is applying your changes...",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-16rem)]">
      {/* Chat Panel */}
      <Card className="lg:col-span-2 bg-gradient-card border-border shadow-card flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            ChatOps Interface
          </CardTitle>
          <CardDescription>Conversational infrastructure management</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                )}
                <div className={`flex flex-col gap-2 max-w-[80%] ${msg.role === "user" ? "items-end" : ""}`}>
                  <div
                    className={`p-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  {msg.code && (
                    <div className="w-full bg-muted rounded-lg p-3 border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          <Code className="w-3 h-3 mr-1" />
                          Generated Code
                        </Badge>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleDeploy(msg.code!)}
                          className="bg-success hover:bg-success/90 h-7"
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Deploy
                        </Button>
                      </div>
                      <pre className="text-xs overflow-x-auto">
                        <code>{msg.code}</code>
                      </pre>
                    </div>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {msg.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isProcessing && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-primary animate-pulse" />
                </div>
                <div className="bg-secondary p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask me to create, scale, or modify infrastructure..."
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={!input.trim() || isProcessing} className="bg-primary hover:bg-primary/90">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Commands */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle>Quick Commands</CardTitle>
          <CardDescription>Common operations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            "Create a Redis cache with 2 nodes",
            "Scale frontend to 5 replicas",
            "Show me total AWS costs",
            "Add a GPU node pool",
            "Create RDS PostgreSQL instance",
            "List all running services",
          ].map((cmd, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              className="w-full justify-start text-left h-auto py-2"
              onClick={() => setInput(cmd)}
            >
              <Code className="w-4 h-4 mr-2 shrink-0" />
              <span className="text-xs">{cmd}</span>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatOpsTab;
