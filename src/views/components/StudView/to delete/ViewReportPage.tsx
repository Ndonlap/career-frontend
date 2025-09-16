// src/views/components/StudView/ViewReportPage.tsx
import React from "react";
import { FileText, BarChart3, TrendingUp, Target, Award } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

interface ViewReportPageProps {
  // Any specific report summaries or data could be passed here if needed
  // For now, it mostly navigates to other report-specific routes.
}

const ViewReportPage: React.FC<ViewReportPageProps> = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <div className="text-center mb-8">
          <FileText className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Academic Performance Reports</h2>
          <p className="text-slate-600">Comprehensive analysis of your academic journey</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border border-slate-200 rounded-xl hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="h-6 w-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-slate-800">Performance Summary</h3>
            </div>
            <p className="text-slate-600 mb-4">Detailed breakdown of your academic performance across all subjects</p>
            <button 
                onClick={() => navigate('/student/reports/summary')} // Link to a dedicated report summary page
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Generate Report
            </button>
          </div>
          
          <div className="p-6 border border-slate-200 rounded-xl hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-6 w-6 text-green-500" />
              <h3 className="text-lg font-semibold text-slate-800">Progress Analysis</h3>
            </div>
            <p className="text-slate-600 mb-4">Track your improvement over time with trend analysis</p>
            <button 
                onClick={() => navigate('/student/reports/progress')} // Link to a dedicated progress report page
                className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              View Trends
            </button>
          </div>
          
          <div className="p-6 border border-slate-200 rounded-xl hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <Target className="h-6 w-6 text-purple-500" />
              <h3 className="text-lg font-semibold text-slate-800">Goal Tracking</h3>
            </div>
            <p className="text-slate-600 mb-4">Monitor progress towards your academic and career goals</p>
            <button className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
              Track Goals
            </button>
          </div>
          
          <div className="p-6 border border-slate-200 rounded-xl hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <Award className="h-6 w-6 text-yellow-500" />
              <h3 className="text-lg font-semibold text-slate-800">Achievement Report</h3>
            </div>
            <p className="text-slate-600 mb-4">Comprehensive overview of your accomplishments and milestones</p>
            <button className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
              View Achievements
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewReportPage;