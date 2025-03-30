
import { useState, useRef, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, MessageSquare, PieChart, Search, Scale, TrendingUp, BadgeDollarSign, Users, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getIdea, getChatHistory, saveChatMessage } from "@/lib/ideaService";

const agentConfig = {
  "assistant": {
    name: "Personal Assistant",
    icon: <MessageSquare size={18} />,
    color: "bg-purple-500",
    description: "Your go-to resource for summarizing insights and answering general questions about your idea."
  },
  "pitch": {
    name: "Pitch Expert",
    icon: <Users size={18} />,
    color: "bg-blue-500",
    description: "Perfect your pitch for investors, customers, and partners with expert guidance on messaging and structure."
  },
  "financial": {
    name: "Financial Analyst",
    icon: <PieChart size={18} />,
    color: "bg-emerald-500",
    description: "Get detailed advice on financial projections, pricing strategies, and business model optimization."
  },
  "market": {
    name: "Market Researcher",
    icon: <Search size={18} />,
    color: "bg-amber-500",
    description: "Dive deep into market trends, customer segments, and competitive landscape analysis."
  },
  "legal": {
    name: "Legal Consultant",
    icon: <Scale size={18} />,
    color: "bg-red-500",
    description: "Navigate legal considerations, regulatory requirements, and intellectual property protection."
  },
  "growth": {
    name: "Growth Strategist",
    icon: <TrendingUp size={18} />,
    color: "bg-teal-500",
    description: "Plan effective customer acquisition, retention strategies, and scaling approaches."
  },
  "fundraising": {
    name: "Fundraising Coach",
    icon: <BadgeDollarSign size={18} />,
    color: "bg-indigo-500",
    description: "Optimize your fundraising strategy with guidance on investor targeting and pitch preparation."
  }
};

const ChatPage = () => {
  const { ideaId, agentId } = useParams<{ ideaId: string; agentId: string }>();
  const [idea, setIdea] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load idea and chat history
  useEffect(() => {
    if (!ideaId || !agentId) return;
    
    const loadedIdea = getIdea(ideaId);
    if (loadedIdea) {
      setIdea(loadedIdea);
      const history = getChatHistory(ideaId, agentId);
      
      // If no history, add a welcome message
      if (history.length === 0) {
        const agent = agentConfig[agentId as keyof typeof agentConfig];
        if (agent) {
          const welcomeMessage = {
            id: Date.now().toString(),
            ideaId,
            agentId,
            content: `Hi there! I'm your ${agent.name}. ${agent.description} How can I help with your "${loadedIdea.title}" idea today?`,
            isUser: false,
            timestamp: new Date().toISOString()
          };
          saveChatMessage(welcomeMessage);
          setMessages([welcomeMessage]);
        }
      } else {
        setMessages(history);
      }
    }
  }, [ideaId, agentId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!ideaId || !agentId || !agentConfig[agentId as keyof typeof agentConfig]) {
    return <Navigate to="/" />;
  }

  const agent = agentConfig[agentId as keyof typeof agentConfig];

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      ideaId,
      agentId,
      content: input,
      isUser: true,
      timestamp: new Date().toISOString()
    };
    
    saveChatMessage(userMessage);
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    // Simulate AI response (in a real app, this would call an AI service)
    setTimeout(() => {
      const responses = [
        "That's a great question about your idea. Based on my analysis, I would recommend focusing on this area first.",
        "I've analyzed similar startups in this space, and I think your approach has several advantages.",
        "Let me break this down for you. There are three key factors to consider here...",
        "From my perspective as a specialized consultant, I'd suggest revisiting your assumptions about the market size.",
        "You're on the right track, but have you considered approaching this from a different angle?",
      ];
      
      const responseMessage = {
        id: Date.now().toString(),
        ideaId,
        agentId,
        content: responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
        timestamp: new Date().toISOString()
      };
      
      saveChatMessage(responseMessage);
      setMessages(prev => [...prev, responseMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-slate-900 text-white">
      <Sidebar ideaId={ideaId} />
      
      <div className="flex-1 flex flex-col">
        <div className="border-b border-slate-800 p-4">
          <div className="flex items-center">
            <Avatar className={cn("h-8 w-8 mr-3", agent.color)}>
              <AvatarFallback className="text-white">
                {agent.icon}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">{agent.name}</h2>
              <p className="text-sm text-slate-400">
                {idea?.title && `Consulting on: ${idea.title}`}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.isUser ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg p-4",
                    message.isUser
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-slate-200"
                  )}
                >
                  <p>{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 rounded-lg p-4 flex items-center">
                  <Loader2 className="h-5 w-5 text-blue-500 animate-spin mr-2" />
                  <p className="text-slate-300">Thinking...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        <div className="border-t border-slate-800 p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex space-x-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={`Ask the ${agent.name} about your idea...`}
                className="min-h-[60px] bg-slate-800 border-slate-700 text-white resize-none"
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className={cn(
                  "px-4",
                  isLoading ? "bg-slate-700" : "bg-blue-600 hover:bg-blue-700"
                )}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
