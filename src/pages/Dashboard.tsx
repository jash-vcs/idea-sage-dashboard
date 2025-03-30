
import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { getIdea, getAnalysisForIdea, Idea, Analysis } from "@/lib/ideaService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sidebar } from "@/components/Sidebar";
import { AnalysisSection } from "@/components/AnalysisSection";
import { BarChart4, Target, Users, DollarSign, Scale, TrendingUp, PieChart, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const { ideaId } = useParams<{ ideaId: string }>();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [activeSection, setActiveSection] = useState("problem");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!ideaId) return;
    
    const loadedIdea = getIdea(ideaId);
    if (loadedIdea) {
      setIdea(loadedIdea);
      const loadedAnalysis = getAnalysisForIdea(ideaId);
      setAnalysis(loadedAnalysis || null);
    }
    
    setIsLoading(false);
  }, [ideaId]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center">
          <RefreshCw className="h-12 w-12 text-blue-500 animate-spin" />
          <p className="mt-4 text-lg text-slate-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!idea || !ideaId) {
    return <Navigate to="/" />;
  }

  const analysisItems = [
    { id: "problem", label: "Problem Analysis", icon: <BarChart4 className="h-5 w-5" />, content: analysis?.problemAnalysis },
    { id: "market", label: "Target Market", icon: <Target className="h-5 w-5" />, content: analysis?.targetMarket },
    { id: "business", label: "Business Model", icon: <DollarSign className="h-5 w-5" />, content: analysis?.businessModel },
    { id: "legal", label: "Legal Considerations", icon: <Scale className="h-5 w-5" />, content: analysis?.legalConsiderations },
    { id: "growth", label: "Growth Strategy", icon: <TrendingUp className="h-5 w-5" />, content: analysis?.growthStrategy },
    { id: "competitors", label: "Competitor Analysis", icon: <Users className="h-5 w-5" />, content: analysis?.competitorAnalysis },
    { id: "funding", label: "Funding Requirements", icon: <PieChart className="h-5 w-5" />, content: analysis?.fundingRequirements },
  ];

  // Handle if analysis isn't ready yet
  if (!analysis) {
    return (
      <div className="flex h-screen bg-slate-900 text-white">
        <Sidebar ideaId={ideaId} />
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">{idea.title}</h1>
            <p className="text-slate-400 mb-6">{new Date(idea.createdAt).toLocaleDateString()}</p>
            
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-8 text-center border border-slate-700">
              <RefreshCw className="h-16 w-16 text-blue-500 animate-spin mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-3">Generating Your Analysis</h2>
              <p className="text-slate-300 mb-6">
                Our AI is analyzing your idea and preparing comprehensive insights. This may take a moment.
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-900 text-white">
      <Sidebar ideaId={ideaId} />
      
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{idea.title}</h1>
          <p className="text-slate-400 mb-6">{new Date(idea.createdAt).toLocaleDateString()}</p>
          
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700 mb-8">
            <Tabs defaultValue="problem" value={activeSection} onValueChange={setActiveSection}>
              <div className="overflow-x-auto">
                <TabsList className="bg-slate-800/80 p-1 border-b border-slate-700">
                  {analysisItems.map(item => (
                    <TabsTrigger 
                      key={item.id} 
                      value={item.id}
                      className="flex items-center data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      {item.icon}
                      <span className="ml-2 hidden sm:inline">{item.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              {analysisItems.map(item => (
                <TabsContent key={item.id} value={item.id} className="p-6">
                  <AnalysisSection
                    title={item.label}
                    content={item.content || "Analysis not available"}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </div>
          
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h2 className="text-xl font-semibold mb-4">Original Idea</h2>
            <p className="text-slate-300 whitespace-pre-line">{idea.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
