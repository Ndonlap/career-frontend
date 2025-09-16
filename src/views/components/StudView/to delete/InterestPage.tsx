// src/views/components/StudView/InterestPage.tsx
import React from "react";
import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate if needed by sub-components

// This component will receive availableAssessments as a prop
interface InterestPageProps {
  availableAssessments: any[];
  // If `submitInterests` were directly on this page, you'd pass it too:
  // onSubmitInterests: (interests: any) => Promise<void>;
}

const InterestPage: React.FC<InterestPageProps> = ({ availableAssessments }) => {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <div className="text-center mb-8">
          <BookOpen className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Career Interest Assessment</h2>
          <p className="text-slate-600">Discover your career interests and aptitudes through comprehensive assessments</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableAssessments.length > 0 ? (
            availableAssessments.map((assessment: any) => (
              <div key={assessment.id} className="p-6 border border-slate-200 rounded-xl hover:shadow-md transition-all">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">{assessment.name}</h3>
                <p className="text-slate-600 mb-4">{assessment.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600">{assessment.duration_minutes} minutes</span>
                  <button 
                    onClick={() => navigate(`/assessments/${assessment.id}/start`)} // Link to a route to start the assessment
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                    Start Assessment
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="md:col-span-2 text-center text-slate-500">No assessments currently available. Please check back later.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterestPage;