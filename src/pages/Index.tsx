
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import IdeaForm from "@/components/IdeaForm";

const Index = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-950 text-white">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-500">
            IdeaSage
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl">
            Transform your startup ideas into comprehensive business strategies with AI-powered analysis
          </p>
          
          {!showForm ? (
            <Button 
              size="lg" 
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-8 py-3 flex items-center"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <div className="w-full max-w-3xl bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <IdeaForm onClose={() => setShowForm(false)} />
            </div>
          )}
        </div>
        
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
            <h3 className="text-xl font-semibold mb-3 text-blue-400">Comprehensive Analysis</h3>
            <p className="text-slate-300">Get detailed insights on target market, business model, legal considerations, and more.</p>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
            <h3 className="text-xl font-semibold mb-3 text-blue-400">Expert AI Consultants</h3>
            <p className="text-slate-300">Access specialized AI agents for finance, marketing, legal, and growth strategy guidance.</p>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
            <h3 className="text-xl font-semibold mb-3 text-blue-400">Track Your Progress</h3>
            <p className="text-slate-300">Store and revisit all your ideas and analyses in one organized dashboard.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
