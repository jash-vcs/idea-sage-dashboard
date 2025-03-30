
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { saveIdea, generateAnalysis } from "@/lib/ideaService";

interface IdeaFormProps {
  onClose?: () => void;
}

const IdeaForm = ({ onClose }: IdeaFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and description for your idea.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Save the idea and generate a basic analysis
      const ideaId = await saveIdea({
        id: Date.now().toString(),
        title,
        description,
        createdAt: new Date().toISOString()
      });
      
      // Generate the analysis in the background
      await generateAnalysis(ideaId);
      
      toast({
        title: "Idea submitted!",
        description: "Redirecting you to your dashboard...",
      });
      
      // Redirect to the dashboard
      setTimeout(() => {
        navigate(`/dashboard/${ideaId}`);
      }, 1500);
      
    } catch (error) {
      console.error("Error saving idea:", error);
      toast({
        title: "Something went wrong",
        description: "Unable to save your idea. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Idea Title
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-slate-800/70 border-slate-700 text-white"
          placeholder="Enter a concise title for your startup idea"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Describe Your Idea
        </label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-slate-800/70 border-slate-700 text-white min-h-[150px]"
          placeholder="Describe your startup idea in detail. What problem does it solve? Who is your target customer? What makes it unique?"
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-2">
        {onClose && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze My Idea"
          )}
        </Button>
      </div>
    </form>
  );
};

export default IdeaForm;
