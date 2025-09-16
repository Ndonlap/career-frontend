import React, { useState, useEffect, useCallback, createContext, useContext } from "react";
import { LayoutDashboard, Users, BookOpen, Brain, Settings, HeartHandshake, Shield, Database, Plus, Loader2, Briefcase, MessageSquare, FileText, LogOut } from "lucide-react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

import AuthService from "../../../services/auth";
import AdminService from "../../../services/admin"; // To fetch admin data and KPIs

// Define a context to pass down shared data/functions to nested routes
interface AdminDashboardContextType {
  adminProfile: any;
  kpiData: any; // Comprehensive KPIs for the dashboard homepage
  fetchDashboardData: () => void; // To allow children to trigger a full dashboard refresh
  usersCount: number; // For sidebar badge
  coursesCount: number; // For sidebar badge
  careersCount: number; // For sidebar badge
  assessmentsCount: number; // For sidebar badge
  // Add other shared data/functions here
}

const AdminDashboardContext = createContext<AdminDashboardContextType | undefined>(undefined);

// Custom hook to consume the context
export const useAdminDashboard = () => {
  const context = useContext(AdminDashboardContext);
  if (context === undefined) {
    throw new Error('useAdminDashboard must be used within an AdminDashboardProvider');
  }
  return context;
};

const AdminDashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States for shared data needed across the layout
  const [adminProfile, setAdminProfile] = useState<any>(null);
  const [kpiData, setKpiData] = useState<any>({}); // Will hold all dashboard overview KPIs

  // Badge data for sidebar (derived from kpiData or separate fetches)
  const [usersCount, setUsersCount] = useState(0);
  const [coursesCount, setCoursesCount] = useState(0);
  const [careersCount, setCareersCount] = useState(0);
  const [assessmentsCount, setAssessmentsCount] = useState(0);

  // Determine active page ID for sidebar highlighting
  const [activePageId, setActivePageId] = useState<string>('');

  useEffect(() => {
    const path = location.pathname;
    if (path === '/AdminDashboard') setActivePageId('dashboard');
    else if (path.startsWith('/AdminDashboard/account')) setActivePageId('account');
    else if (path.startsWith('/AdminDashboard/academic-record')) setActivePageId('academic-record');
    else if (path.startsWith('/AdminDashboard/assessments')) setActivePageId('assessments');
    else if (path.startsWith('/AdminDashboard/content')) setActivePageId('skill');
    // else if (path.startsWith('/AdminDashboard/course')) setActivePageId('course');
    else if (path.startsWith('/AdminDashboard/conversation')) setActivePageId('conversation');
    else if (path.startsWith('/AdminDashboard/settings')) setActivePageId('settings');
    else setActivePageId('dashboard'); // Fallback
  }, [location.pathname]);


  // --- Callback to re-fetch all necessary dashboard layout data ---
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const profileResponse = await AuthService.getProfile();
      const profileData = profileResponse.data;
      setAdminProfile(profileData);

      const dashboardOverviewResponse = await AdminService.getDashboardOverview();
      const dashboardData = dashboardOverviewResponse.data;
      
      setKpiData(dashboardData.kpis); // Set overall KPIs
      setUsersCount(dashboardData.kpis.totalUsers); // Use a specific KPI for badge
      setCoursesCount(dashboardData.kpis.coursesOffered);
      setCareersCount(dashboardData.kpis.careerPaths);
      // For assessments, you might need a separate fetch if not in dashboardOverview.kpis
      const allAssessmentsResponse = await AdminService.getAllAssessments();
      setAssessmentsCount(allAssessmentsResponse.data.length);


    } catch (err: any) {
      console.error("Error fetching admin dashboard layout data:", err);
      setError(err.response?.data?.msg || "Failed to load dashboard data.");
      if (err.response?.status === 401 || err.response?.status === 403) {
          AuthService.clearTokens();
          navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

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
        <Loader2 className="animate-spin mr-2 h-6 w-6 text-blue-500" />
        <p className="text-lg text-slate-700">Loading admin dashboard layout...</p>
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

  if (!adminProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-lg text-slate-700">No admin profile found. Please log in again.</p>
      </div>
    );
  }

  const sidebarNavItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/AdminDashboard" },
    { id: "account", label: "Account Management", icon: Users, path: "/AdminDashboard/account", badge: usersCount > 0 ? String(usersCount) : null },
    { id: "academic-record", label: "Academic Records", icon: FileText, path: "/AdminDashboard/academic-record", badge: null }, // Badge for pending validations
    { id: "assessments", label: "Assessments", icon: Brain, path: "/AdminDashboard/assessments", badge: assessmentsCount > 0 ? String(assessmentsCount) : null },
    { id: "content", label: "Content Management", icon: Database, path: "/AdminDashboard/content", badge: null }, // Badge for pending skill requests
    // { id: "course", label: "Course Management", icon: BookOpen, path: "/AdminDashboard/course", badge: coursesCount > 0 ? String(coursesCount) : null },
    // { id: "career", label: "Career Management", icon: Briefcase, path: "/AdminDashboard/career", badge: careersCount > 0 ? String(careersCount) : null }, // Added career management to sidebar
    { id: "conversation", label: "Messages", icon: MessageSquare, path: "/AdminDashboard/conversation", badge: "3" }, // Placeholder badge
    { id: "settings", label: "Settings", icon: Settings, path: "/AdminDashboard/settings" }
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-['Inter',sans-serif']">
      {/* Enhanced Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 shadow-lg flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-slate-200 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">A</span>
            </div>
            <h1 className="text-xl font-bold text-white">Admin Portal</h1>
          </div>
        </div>
        
        {/* Admin Profile */}
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">{adminProfile.avatar_initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-800 truncate">{adminProfile.first_name}</div>
              <div className="text-xs text-slate-600">Admin</div>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {sidebarNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 p-3 rounded-lg w-full text-left transition-all ${
                activePageId === item.id 
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600 font-medium"
                  : "hover:bg-slate-50 text-slate-700"
              }`}
            >
              <item.icon size={18} />
              <span className="font-medium">{item.label}</span>
              {item.badge && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  activePageId === item.id
                    ? "bg-white/20 text-white"
                    : "bg-red-500 text-white" // Red badge for alerts/counts
                }`}>
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
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area (renders nested routes) */}
      <main className="flex-1 overflow-auto">
        <AdminDashboardContext.Provider value={{ adminProfile, kpiData, fetchDashboardData, usersCount, coursesCount, careersCount, assessmentsCount }}>
          <Outlet /> {/* This renders the matched child route component */}
        </AdminDashboardContext.Provider>
      </main>
    </div>
  );
};

export default AdminDashboardLayout;