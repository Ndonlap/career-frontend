import React, { useState, useEffect, useCallback, createContext, useContext } from "react";
import { LayoutDashboard, Upload, BookOpen, Lightbulb, FileText, LogOut, GraduationCap, MessageSquare, Settings, Star } from "lucide-react";
import { useNavigate, Outlet, useLocation } from "react-router-dom"; // Import useLocation

import AuthService from "../../../services/auth";
import StudentService from "../../../services/student";
import AssessmentService from "../../../services/assessments"; // To fetch available assessments for sidebar badge

// Define a context to pass down shared data/functions to nested routes
interface StudentDashboardContextType {
  userProfile: any;
  kpiData: any; // Potentially needed by dashboard home or other widgets
  fetchDashboardData: () => void; // To allow children to trigger a full dashboard refresh
  availableAssessments: any[]; // List of assessments, fetched here to populate sidebar badge
  careerRecommendationsData: any[]; // For sidebar badge
  subjectDistributionData?:any[];
  // Add other shared data/functions here
}

const StudentDashboardContext = createContext<StudentDashboardContextType | undefined>(undefined);

// Custom hook to consume the context
export const useStudentDashboard = () => {
  const context = useContext(StudentDashboardContext);
  if (context === undefined) {
    throw new Error('useStudentDashboard must be used within a StudentDashboardProvider');
  }
  return context;
};

const StudentDashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // To get current path for sidebar highlighting

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States for shared data needed across the layout (e.g., sidebar, main dashboard)
  const [userProfile, setUserProfile] = useState<any>(null);
  // const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [kpiData, setKpiData] = useState<any>({ academic: {}, behavioral: {}, predictive: {} }); // Needed for sidebar GPA
  const [availableAssessments, setAvailableAssessments] = useState<any[]>([]); // For sidebar badge
  const [careerRecommendationsData, setCareerRecommendationsData] = useState<any[]>([]); // For sidebar badge
  const [subjectDistributionData,setSubjectDistributionData] =  useState<any[]>([]); 
  // Determine active page based on current URL path for sidebar highlighting
  const [activePageId, setActivePageId] = useState<string>('');

  useEffect(() => {
    // This effect updates `activePageId` based on the current URL
    const path = location.pathname;
    // More robust mapping for nested routes
    if (path === '/StudentDashboard') setActivePageId('dashboard');
    else if (path.startsWith('/StudentDashboard/upload-records')) setActivePageId('upload');
    else if (path.startsWith('/StudentDashboard/assessments')) setActivePageId('assessments');
    else if (path.startsWith('/StudentDashboard/recommendations')) setActivePageId('recommendation');
    else if (path.startsWith('/StudentDashboard/Bookcounselor')) setActivePageId('book-counselor'); // This is a top-level route in App.tsx
    else if (path.startsWith('/StudentDashboard/conversation')) setActivePageId('conversation');
    else if (path.startsWith('/StudentDashboard/settings')) setActivePageId('settings');
    else if (path.startsWith('/StudentDashboard/reports')) setActivePageId('reports'); // If you add a "View Reports" main item
    else setActivePageId('dashboard'); // Fallback for any other /StudentDashboard/* path
  }, [location.pathname]);


  // --- Callback to re-fetch all necessary dashboard layout data ---
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await StudentService.getDashboardSummary();
      const data = response.data;

      setUserProfile(data.user_profile);
      setKpiData(data.kpi_data);
      setCareerRecommendationsData(data.career_recommendations);
      
      // Fetch available assessments directly for the badge count
      // const assessmentsResponse = await AssessmentService.getAvailableAssessments();
      // setAvailableAssessments(assessmentsResponse.data);
      setAvailableAssessments([]);

    } catch (err: any) {
      console.error("Error fetching dashboard layout data:", err);
      setError(err.response?.data?.msg || "Failed to load dashboard data.");
      // The Axios interceptor in api.js should handle 401 redirects to login
      if (err.response?.status === 401 || err.response?.status === 403) {
          AuthService.clearTokens();
          navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]); // navigate is stable, so okay for dep array

  // --- Initial Data Fetch ---
  useEffect(() => {
    if (AuthService.getAccessToken()) {
      fetchDashboardData();
    } else {
      navigate('/login');
    }
  }, [navigate, fetchDashboardData]);

  // --- Logout Handler ---
  const handleLogout = () => {
    AuthService.clearTokens();
    navigate('/login');
  };

  // --- Loading and Error UI ---
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-lg text-slate-700">Loading student dashboard layout...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-lg text-red-600">Error: {error}</p>
        <button onClick={() => navigate('/login')} className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md">Login</button>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-lg text-slate-700">No user profile found. Please log in again.</p>
      </div>
    );
  }

  const sidebarNavItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/StudentDashboard" },
    { id: "book-counselor", label: "Book Counselor", icon: MessageSquare, path: "/StudentDashboard/Bookcounselor" }, // This is still a top-level route based on your App.tsx
    { id: "upload", label: "Upload Records", icon: Upload, path: "/StudentDashboard/upload-records" },
    { id: "assessments", label: "Career Assessment", icon: BookOpen, path: "/StudentDashboard/assessments", badge: availableAssessments.length > 0 ? String(availableAssessments.length) : null },
    { id: "recommendation", label: "AI Recommendations", icon: Lightbulb, path: "/StudentDashboard/recommendations", badge: careerRecommendationsData.length > 0 ? String(careerRecommendationsData.length) : null },
    { id: "conversation", label: "Messages", icon: MessageSquare, path: "/StudentDashboard/conversation", badge: "3" }, // Placeholder badge
    { id: "settings", label: "Settings", icon: Settings, path: "/StudentDashboard/settings" }
  ];


  return (
    <div className="flex min-h-screen bg-slate-50 font-['Inter',sans-serif']">
      {/* Enhanced Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 shadow-lg flex flex-col">
        <div className="h-20 flex items-center justify-center border-b border-slate-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-white" />
            <div>
              <h1 className="text-xl font-bold text-white">MyCareerCoach</h1>
              <p className="text-xs text-blue-100">Right Choice, Right Future</p>
            </div>
          </div>
        </div>
        
        {/* User Profile Section */}
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">{userProfile.avatar_initials}</span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">{userProfile.first_name} {userProfile.last_name}</h3>
              <p className="text-sm text-slate-600">{userProfile.school || 'N/A'}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-3 w-3 text-yellow-500" />
                <span className="text-xs text-slate-600">GPA: {kpiData.academic.currentGPA?.toFixed(2) || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {sidebarNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex items-center justify-between gap-3 p-3 rounded-xl w-full text-left transition-all duration-200 ${
                activePageId === item.id 
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105" 
                  : "hover:bg-slate-100 text-slate-700 hover:transform hover:scale-102"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-200">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 rounded-xl w-full text-left hover:bg-red-50 text-red-600 font-medium transition-all">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area (renders nested routes) */}
      <main className="flex-1 overflow-auto">
        {/* Provide context to children */}
        <StudentDashboardContext.Provider value={{ userProfile, kpiData, fetchDashboardData, availableAssessments, careerRecommendationsData,subjectDistributionData}}>
          <Outlet /> {/* This renders the matched child route component */}
        </StudentDashboardContext.Provider>
      </main>
    </div>
  );
};

export default StudentDashboardLayout;