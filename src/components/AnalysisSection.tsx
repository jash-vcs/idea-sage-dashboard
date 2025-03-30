
import { ArrowDownToLine } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface AnalysisSectionProps {
  title: string;
  content: string;
}

export const AnalysisSection = ({ title, content }: AnalysisSectionProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
          <ArrowDownToLine className="h-4 w-4 mr-1" />
          <span className="text-sm">Export</span>
        </Button>
      </div>
      <div className="bg-slate-900/60 rounded-lg p-5 border border-slate-700/70">
        <p className="text-slate-200 leading-relaxed">{content}</p>
      </div>
    </div>
  );
};
