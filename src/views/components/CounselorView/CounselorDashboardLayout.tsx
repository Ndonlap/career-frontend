import React, { useState, useEffect, useCallback, createContext, useContext } from "react";
import { LayoutDashboard, Users, Calendar, MessageSquare, LogOut, Lightbulb, FileText, Settings, HeartHandshake, Star, Loader2, AlertCircle, BarChart3, Icon } from "lucide-react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

import AuthService from "../../../services/auth";
import CounselorService from "../../../services/counselor"; // To fetch counselor data

// Define a context to pass down shared data/functions to nested routes
interface CounselorDashboardContextType {
    counselorProfile: any;
    kpiData: any; // Comprehensive KPIs, filtered by timeframe, for homepage
    fetchDashboardData: (timeframe?: "week" | "month" | "quarter") => void; // To allow children to trigger a full dashboard refresh
    selectedTimeframe: "week" | "month" | "quarter";
    setSelectedTimeframe: React.Dispatch<React.SetStateAction<"week" | "month" | "quarter">>;
    assignedStudentsCount: number; // For sidebar badge
    recommendationsBadge: number; // For sidebar badge
    appointmentsBadge: number; // For sidebar badge
    messagesBadge: number; // For sidebar badge
    // Add other shared data/functions here
}

const CounselorDashboardContext = createContext<CounselorDashboardContextType | undefined>(undefined);

// Custom hook to consume the context
export const useCounselorDashboard = () => {
    const context = useContext(CounselorDashboardContext);
    if (context === undefined) {
        throw new Error('useCounselorDashboard must be used within a CounselorDashboardProvider');
    }
    return context;
};

const CounselorDashboardLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // States for shared data needed across the layout (e.g., sidebar, main dashboard)
    const [counselorProfile, setCounselorProfile] = useState<any>(null);
    const [kpiData, setKpiData] = useState<any>({ activeStudents: 0, totalSessions: 0, completionRate: 0, satisfactionScore: 0, pendingAppointments: 0, recommendationsMade: 0 }); // Initial empty state
    const [selectedTimeframe, setSelectedTimeframe] = useState<"week" | "month" | "quarter">("month");

    // Badge data (derived from KPI data or separate fetches)
    const [assignedStudentsCount, setAssignedStudentsCount] = useState(0);
    const [recommendationsBadge, setRecommendationsBadge] = useState(0);
    const [appointmentsBadge, setAppointmentsBadge] = useState(0);
    const [messagesBadge, setMessagesBadge] = useState(3); // Hardcoded for now


    // Determine active page ID for sidebar highlighting
    const [activePageId, setActivePageId] = useState<string>('');

    useEffect(() => {
        const path = location.pathname;
        if (path === '/CounselorDashboard') setActivePageId('dashboard');
        else if (path.startsWith('/CounselorDashboard/Student-Management')) setActivePageId('students');
        else if (path.startsWith('/CounselorDashboard/appointment')) setActivePageId('appointments');
        else if (path.startsWith('/CounselorDashboard/conversation')) setActivePageId('conversation');
        else if (path.startsWith('/CounselorDashboard/settings')) setActivePageId('settings');
        else if (path.startsWith('/CounselorDashboard/recommendations')) setActivePageId('recommendations');
        else if (path.startsWith('/CounselorDashboard/analytics')) setActivePageId('analytics');
        else setActivePageId('dashboard'); // Fallback
    }, [location.pathname]);


    // --- Callback to re-fetch all necessary dashboard layout data ---
    const fetchDashboardData = useCallback(async (timeframeParam: "week" | "month" | "quarter" = selectedTimeframe) => {
        setLoading(true);
        setError(null);
        try {
            const profileResponse = await AuthService.getProfile();
            const profileData = profileResponse.data;
            setCounselorProfile(profileData);

            //   const dashboardSummaryResponse = await CounselorService.getDashboardSummary(timeframeParam);
            //   const dashboardData = dashboardSummaryResponse.data;
            setKpiData([])
            setAssignedStudentsCount([])
            setRecommendationsBadge([])
            setAppointmentsBadge([])
            //   setKpiData(dashboardData.kpi_data);
            //   setAssignedStudentsCount(dashboardData.kpi_data.activeStudents);
            //   setRecommendationsBadge(dashboardData.kpi_data.recommendationsMade);
            //   setAppointmentsBadge(dashboardData.kpi_data.pendingAppointments);
            // messagesBadge remains static for now, or fetch from a messaging service

        } catch (err: any) {
            console.error("Error fetching counselor dashboard layout data:", err);
            setError(err.response?.data?.msg || "Failed to load dashboard data.");
            if (err.response?.status === 401 || err.response?.status === 403) {
                AuthService.clearTokens();
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    }, [navigate, selectedTimeframe]); // Include selectedTimeframe in deps so callback changes when timeframe changes

    // --- Initial Data Fetch ---
    useEffect(() => {
        if (AuthService.getAccessToken()) {
            fetchDashboardData();
        } else {
            navigate('/login');
        }
    }, [navigate, fetchDashboardData]); // fetchDashboardData is a dep, will rerun if timeframe changes.

    // --- Logout Handler ---
    const handleLogout = () => {
        AuthService.clearTokens();
        navigate('/login');
    };

    // --- Loading and Error UI ---
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <Loader2 className="animate-spin mr-2 h-6 w-6 text-indigo-500" />
                <p className="text-lg text-slate-700">Loading counselor dashboard layout...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <p className="text-lg text-red-600">Error: {error}</p>
                <button onClick={() => navigate('/login')} className="ml-4 px-4 py-2 bg-indigo-500 text-white rounded-md">Login</button>
            </div>
        );
    }

    if (!counselorProfile) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <p className="text-lg text-slate-700">No counselor profile found. Please log in again.</p>
            </div>
        );
    }

    const sidebarNavItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/CounselorDashboard" },
        { id: "students", label: "Student Management", icon: Users, path: "/CounselorDashboard/Student-Management", badge: assignedStudentsCount > 0 ? String(assignedStudentsCount) : null },
        { id: "recommendations", label: "AI Recommendations", icon: Lightbulb, path: "/CounselorDashboard/recommendations", badge: recommendationsBadge > 0 ? String(recommendationsBadge) : null },
        { id: "appointments", label: "Appointments", icon: Calendar, path: "/CounselorDashboard/appointment", badge: appointmentsBadge > 0 ? String(appointmentsBadge) : null },
        { id: "conversation", label: "Messages", icon: MessageSquare, path: "/CounselorDashboard/conversation", badge: messagesBadge > 0 ? String(messagesBadge) : null },
        // { id: "analytics", label: "Analytics", icon: BarChart3, path: "/CounselorDashboard/analytics", badge: null }, // Assuming analytics data would be part of homepage or a dedicated view
        { id: "settings", label: "Settings", icon: Settings, path: "/CounselorDashboard/settings" }
    ];


    return (
        <div className="flex min-h-screen bg-slate-50 font-['Inter',sans-serif']">
            {/* Enhanced Sidebar */}
            <aside className="w-72 bg-white border-r border-slate-200 shadow-lg flex flex-col">
                <div className="h-20 flex items-center justify-center border-b border-slate-200 bg-gradient-to-r from-indigo-600 to-purple-600">
                    <div className="flex items-center gap-3">
                        <HeartHandshake className="h-8 w-8 text-white" />
                        <div>
                            <h1 className="text-xl font-bold text-white">MyCareerCoach</h1>
                            <p className="text-xs text-indigo-100">Student Success Platform</p>
                        </div>
                    </div>
                </div>

                {/* Counselor Profile */}
                <div className="p-6 border-b border-slate-200 bg-slate-50">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">{counselorProfile.avatar_initials}</span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800">{counselorProfile.first_name} {counselorProfile.last_name}</h3>
                            <p className="text-sm text-slate-600">Senior Academic Counselor</p>
                            <div className="flex items-center gap-1 mt-1">
                                <Star className="h-3 w-3 text-yellow-500" />
                                <span className="text-xs text-slate-600">{counselorProfile.rating?.toFixed(1) || 'N/A'} Rating</span>
                            </div>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {sidebarNavItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => navigate(item.path)}
                            className={`flex items-center justify-between gap-3 p-3 rounded-xl w-full text-left transition-all duration-200 ${activePageId === item.id
                                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105"
                                    : "hover:bg-slate-100 text-slate-700 hover:transform hover:scale-102"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                {/* <Icon size={20} /> */}
                                <span className="font-medium">{item.label}</span>
                            </div>
                            {item.badge && (
                                <span className={`text-xs px-2 py-1 rounded-full ${activePageId === item.id
                                        ? "bg-white/20 text-white"
                                        : "bg-slate-200 text-slate-600"
                                    }`}>
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    ))}

                    <div className="pt-4 mt-4 border-t border-slate-200 space-y-2">
                        <button className="flex items-center justify-between gap-3 p-3 rounded-xl w-full text-left hover:bg-slate-100 text-slate-700 transition-all">
                            <div className="flex items-center gap-3">
                                <Settings size={20} />
                                <span className="font-medium">Settings</span>
                            </div>
                        </button>
                    </div>
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
                <CounselorDashboardContext.Provider value={{ counselorProfile, kpiData, fetchDashboardData, selectedTimeframe, setSelectedTimeframe, assignedStudentsCount, recommendationsBadge, appointmentsBadge, messagesBadge }}>
                    <Outlet /> {/* This renders the matched child route component */}
                </CounselorDashboardContext.Provider>
            </main>
        </div>
    );
};

export default CounselorDashboardLayout;