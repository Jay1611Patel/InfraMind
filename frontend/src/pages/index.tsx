import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, LineChart, Lightbulb, MessageSquare, Server, Settings, FileText } from "lucide-react";
import OverviewTab from "@/components/dashboard/OverviewTab";
import MetricsTab from "@/components/dashboard/MetricsTab";
import RecommendationsTab from "@/components/dashboard/RecommendationsTab";
import ChatOpsTab from "@/components/dashboard/ChatOpsTab";
import InfrastructureTab from "@/components/dashboard/InfrastructureTab";
import SettingsTab from "@/components/dashboard/SettingsTab";
import LogsTab from "@/components/dashboard/LogsTab";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background mesh */}
      <div className="fixed inset-0 bg-gradient-mesh opacity-50 pointer-events-none" />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <Server className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    AI Infrastructure Orchestrator
                  </h1>
                  <p className="text-xs text-muted-foreground">DevOps Copilot • Auto-healing • Predictive Scaling</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-full bg-success/10 border border-success/20 text-success text-sm font-medium">
                  ● All Systems Operational
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-card border border-border p-1 h-auto">
              <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <LayoutDashboard className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="metrics" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <LineChart className="w-4 h-4" />
                Metrics
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Lightbulb className="w-4 h-4" />
                AI Recommendations
              </TabsTrigger>
              <TabsTrigger value="chatops" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <MessageSquare className="w-4 h-4" />
                ChatOps
              </TabsTrigger>
              <TabsTrigger value="infrastructure" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Server className="w-4 h-4" />
                Infrastructure
              </TabsTrigger>
              <TabsTrigger value="logs" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <FileText className="w-4 h-4" />
                Logs
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <OverviewTab />
            </TabsContent>

            <TabsContent value="metrics" className="space-y-6">
              <MetricsTab />
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-6">
              <RecommendationsTab />
            </TabsContent>

            <TabsContent value="chatops" className="space-y-6">
              <ChatOpsTab />
            </TabsContent>

            <TabsContent value="infrastructure" className="space-y-6">
              <InfrastructureTab />
            </TabsContent>

            <TabsContent value="logs" className="space-y-6">
              <LogsTab />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <SettingsTab />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Index;
