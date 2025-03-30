
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Users, MessageSquare, PieChart, Search, Scale, TrendingUp, BadgeDollarSign, ChevronLeft, Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { getAllIdeas } from "@/lib/ideaService";

interface SidebarProps {
  ideaId: string;
}

const agents = [
  { id: "assistant", name: "Personal Assistant", icon: <MessageSquare size={18} />, color: "bg-purple-500" },
  { id: "pitch", name: "Pitch Expert", icon: <Users size={18} />, color: "bg-blue-500" },
  { id: "financial", name: "Financial Analyst", icon: <PieChart size={18} />, color: "bg-emerald-500" },
  { id: "market", name: "Market Researcher", icon: <Search size={18} />, color: "bg-amber-500" },
  { id: "legal", name: "Legal Consultant", icon: <Scale size={18} />, color: "bg-red-500" },
  { id: "growth", name: "Growth Strategist", icon: <TrendingUp size={18} />, color: "bg-teal-500" },
  { id: "fundraising", name: "Fundraising Coach", icon: <BadgeDollarSign size={18} />, color: "bg-indigo-500" },
];

export const Sidebar = ({ ideaId }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeAgent, setActiveAgent] = useState("assistant");
  const [ideas, setIdeas] = useState(getAllIdeas());
  const isMobile = useIsMobile();

  // Auto-collapse on mobile
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);

  // On smaller screens, clicking an agent should auto-collapse the sidebar
  const handleAgentClick = (agentId: string) => {
    setActiveAgent(agentId);
    if (isMobile) {
      setCollapsed(true);
    }
  };

  return (
    <div className={cn(
      "h-screen bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex justify-between items-center p-4 border-b border-slate-800">
        {!collapsed && (
          <Link to="/" className="text-xl font-bold text-blue-500">
            IdeaSage
          </Link>
        )}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-white hover:bg-slate-800"
        >
          {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        {!collapsed && (
          <div className="px-4 mb-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              My Ideas
            </h3>
            <div className="space-y-1">
              {ideas.slice(0, 3).map((idea) => (
                <Link
                  key={idea.id}
                  to={`/dashboard/${idea.id}`}
                  className={cn(
                    "block px-3 py-2 rounded-md text-sm",
                    idea.id === ideaId
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  {idea.title.length > 20
                    ? idea.title.substring(0, 20) + "..."
                    : idea.title}
                </Link>
              ))}
            </div>
          </div>
        )}
        
        <div className={cn("px-4", collapsed && "px-2")}>
          <h3 className={cn(
            "text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2",
            collapsed && "sr-only"
          )}>
            AI Consultants
          </h3>
          <div className="space-y-1">
            {agents.map((agent) => (
              <Link
                key={agent.id}
                to={`/chat/${ideaId}/${agent.id}`}
                onClick={() => handleAgentClick(agent.id)}
                className={cn(
                  "flex items-center rounded-md",
                  collapsed ? "justify-center p-2" : "px-3 py-2",
                  agent.id === activeAgent
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                )}
              >
                <Avatar className={cn("h-6 w-6", agent.color)}>
                  <AvatarFallback className="text-white">
                    {agent.icon}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && <span className="ml-3 text-sm">{agent.name}</span>}
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-800">
        <Link to="/">
          <Button 
            variant="outline" 
            className={cn(
              "border-slate-700 hover:bg-slate-800 hover:text-white",
              collapsed ? "w-8 h-8 p-0" : "w-full"
            )}
          >
            {collapsed ? "+" : "New Idea"}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
