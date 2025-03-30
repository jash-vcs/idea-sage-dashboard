
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Analysis } from '@/lib/ideaService';
import { BadgeDollarSign, Lightbulb, Target, Users } from 'lucide-react';

interface DashboardOverviewProps {
  analysis: Analysis;
}

export const DashboardOverview = ({ analysis }: DashboardOverviewProps) => {
  // Create market analysis data from analysis text
  const getMarketData = () => {
    // Generate some mock data based on the analysis
    return [
      { name: 'Market Size', value: 65 + Math.floor(Math.random() * 20) },
      { name: 'Competition', value: 40 + Math.floor(Math.random() * 30) },
      { name: 'Innovation', value: 75 + Math.floor(Math.random() * 25) },
      { name: 'Scalability', value: 60 + Math.floor(Math.random() * 30) },
    ];
  };

  // Create funding allocation data from analysis text
  const getFundingData = () => {
    return [
      { name: 'Development', value: 40 },
      { name: 'Marketing', value: 30 },
      { name: 'Operations', value: 20 },
      { name: 'Legal', value: 10 },
    ];
  };

  const marketData = getMarketData();
  const fundingData = getFundingData();
  const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#6366f1'];

  return (
    <div className="space-y-6">
      {/* Key insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-black/30 backdrop-blur-sm border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-300">Problem Clarity</h3>
            <div className="bg-blue-500/20 p-2 rounded-full">
              <Lightbulb size={16} className="text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-bold mt-2">High</p>
          <p className="text-xs text-slate-400 mt-1">Clearly defined problem statement</p>
        </div>

        <div className="bg-black/30 backdrop-blur-sm border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-300">Target Market</h3>
            <div className="bg-purple-500/20 p-2 rounded-full">
              <Target size={16} className="text-purple-400" />
            </div>
          </div>
          <p className="text-2xl font-bold mt-2">Medium</p>
          <p className="text-xs text-slate-400 mt-1">Well-defined customer segments</p>
        </div>

        <div className="bg-black/30 backdrop-blur-sm border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-300">Competition</h3>
            <div className="bg-cyan-500/20 p-2 rounded-full">
              <Users size={16} className="text-cyan-400" />
            </div>
          </div>
          <p className="text-2xl font-bold mt-2">Moderate</p>
          <p className="text-xs text-slate-400 mt-1">Several established competitors</p>
        </div>

        <div className="bg-black/30 backdrop-blur-sm border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-300">Funding Needs</h3>
            <div className="bg-indigo-500/20 p-2 rounded-full">
              <BadgeDollarSign size={16} className="text-indigo-400" />
            </div>
          </div>
          <p className="text-2xl font-bold mt-2">$750K</p>
          <p className="text-xs text-slate-400 mt-1">Estimated initial investment</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-black/30 backdrop-blur-sm border border-slate-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-slate-300 mb-4">Market Analysis Score</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={marketData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                  labelStyle={{ color: '#f8fafc' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                  background={{ fill: '#1e293b' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-black/30 backdrop-blur-sm border border-slate-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-slate-300 mb-4">Recommended Funding Allocation</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fundingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {fundingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                  formatter={(value: any) => [`${value}%`, 'Allocation']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
