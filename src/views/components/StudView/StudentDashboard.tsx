import React, { useState } from "react";
import { BarChart,Bar,LineChart,Line,PieChart,Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {LayoutDashboard,Upload,BookOpen,Lightbulb,FileText,LogOut,TrendingUp,TrendingDown,Award,Calendar,Clock,Users,Target,AlertCircle,CheckCircle,Star,GraduationCap, Brain, BarChart3, Activity, BookmarkCheck,MessageSquare,Bell,Settings,Search,Filter,Download,ArrowUpRight,ChevronRight,PlusCircle,Eye,BookMarked} from "lucide-react";

const StudentDashboard: React.FC = () => {
  const [activePage, setActivePage] = useState<"dashboard" | "upload" | "interest" | "recommendation" | "view">("dashboard");
  const [selectedView, setSelectedView] = useState<"This Term" | "Last Term" | "Yearly">("This Term");
  const [activeKPIView, setActiveKPIView] = useState<"academic" | "behavioral" | "predictive">("academic");

  // Enhanced comprehensive datasets
  const datasets = {
    "This Term": {
      labels: ["Math", "Bio", "Comp.Sci", "Econs", "Chem", "Geography", "Physics", "H.Biology"],
      data: [
        { subject: "Math", performance: 85, engagement: 90, assessment: 88, participation: 85, benchmark: 80 },
        { subject: "Bio", performance: 78, engagement: 65, assessment: 74, participation: 80, benchmark: 75 },
        { subject: "Comp.Sci", performance: 92, engagement: 95, assessment: 94, participation: 98, benchmark: 85 },
        { subject: "Econs", performance: 73, engagement: 60, assessment: 70, participation: 65, benchmark: 70 },
        { subject: "Chem", performance: 81, engagement: 75, assessment: 83, participation: 78, benchmark: 78 },
        { subject: "Geography", performance: 76, engagement: 70, assessment: 78, participation: 72, benchmark: 75 },
        { subject: "Physics", performance: 88, engagement: 85, assessment: 90, participation: 87, benchmark: 85 },
        { subject: "H.Biology", performance: 89, engagement: 88, assessment: 91, participation: 92, benchmark: 85 }
      ]
    },
    "Last Term": {
      labels: ["Math", "Bio", "Comp.Sci", "Econs", "Chem", "Geography", "Physics", "H.Biology"],
      data: [
        { subject: "Math", performance: 82, engagement: 85, assessment: 85, participation: 80, benchmark: 80 },
        { subject: "Bio", performance: 74, engagement: 60, assessment: 72, participation: 75, benchmark: 75 },
        { subject: "Comp.Sci", performance: 88, engagement: 90, assessment: 90, participation: 92, benchmark: 85 },
        { subject: "Econs", performance: 68, engagement: 55, assessment: 65, participation: 60, benchmark: 70 },
        { subject: "Chem", performance: 76, engagement: 70, assessment: 78, participation: 72, benchmark: 78 },
        { subject: "Geography", performance: 73, engagement: 68, assessment: 75, participation: 68, benchmark: 75 },
        { subject: "Physics", performance: 84, engagement: 80, assessment: 86, participation: 82, benchmark: 85 },
        { subject: "H.Biology", performance: 86, engagement: 82, assessment: 88, participation: 85, benchmark: 85 }
      ]
    },
    "Yearly": {
      labels: ["Term 1", "Term 2", "Term 3", "Current"],
      data: [
        { subject: "Term 1", performance: 78, engagement: 70, assessment: 76, participation: 72, benchmark: 75 },
        { subject: "Term 2", performance: 82, engagement: 75, assessment: 80, participation: 78, benchmark: 78 },
        { subject: "Term 3", performance: 85, engagement: 82, assessment: 83, participation: 84, benchmark: 80 },
        { subject: "Current", performance: 87, engagement: 85, assessment: 86, participation: 87, benchmark: 82 }
      ]
    }
  };

  // Performance trend data
  const performanceTrendData = [
    { month: "Sep", academic: 82, engagement: 78 },
    { month: "Oct", academic: 85, engagement: 80 },
    { month: "Nov", academic: 87, engagement: 83 },
    { month: "Dec", academic: 89, engagement: 86 },
    { month: "Jan", academic: 91, engagement: 88 },
    { month: "Feb", academic: 93, engagement: 90 }
  ];

  // Subject distribution data
  const subjectDistributionData = [
    { name: "STEM", value: 35, color: "#3B82F6" },
    { name: "Humanities", value: 20, color: "#EF4444" },
    { name: "Social Sciences", value: 25, color: "#10B981" },
    { name: "Languages", value: 15, color: "#F59E0B" },
    { name: "Arts", value: 5, color: "#8B5CF6" }
  ];

  // Comprehensive KPI data
  const kpiData = {
    academic: {
      currentGPA: 3.78,
      previousGPA: 3.65,
      gpaChange: 0.13,
      classRank: 12,
      totalStudents: 248,
      percentile: 95.2,
      creditsCompleted: 124,
      totalCreditsRequired: 180,
      averageGrade: 87.4,
      gradeImprovement: 2.3
    },
    behavioral: {
      attendanceRate: 96.8,
      participationScore: 89.2,
      assignmentCompletionRate: 94.5,
      lateSubmissions: 3,
      counselingSessionsAttended: 8,
      extracurricularParticipation: 4,
      peerCollaborationScore: 92.1,
      digitalEngagement: 88.7
    },
    predictive: {
      graduationProbability: 97.8,
      careerReadinessScore: 84.2,
      recommendedGPA: 3.85,
      riskFactors: 1,
      strengthAreas: 6,
      improvementAreas: 2,
      predictedFinalGPA: 3.82,
      careerMatchScore: 91.5
    }
  };

  // Recent achievements
  const recentAchievements = [
    { title: "Dean's List", date: "This Term", type: "academic", icon: Award },
    { title: "Research Paper Published", date: "2 weeks ago", type: "research", icon: BookMarked },
    { title: "Leadership Certificate", date: "1 month ago", type: "leadership", icon: Users },
    { title: "Top 5% Performance", date: "Last Term", type: "academic", icon: TrendingUp }
  ];

  // Career recommendations
  const careerRecommendations = [
    {
      title: "Data Science",
      match: 94,
      growth: "+23%",
      salary: "$125k",
      demand: "High",
      color: "#3B82F6"
    },
    {
      title: "Software Engineering",
      match: 91,
      growth: "+18%",
      salary: "$118k",
      demand: "Very High",
      color: "#10B981"
    },
    {
      title: "Research Scientist",
      match: 87,
      growth: "+15%",
      salary: "$102k",
      demand: "High",
      color: "#F59E0B"
    }
  ];

  // Upcoming deadlines and events
  const upcomingEvents = [
    { title: "Final Project Submission", date: "Dec 15", priority: "high", type: "deadline" },
    { title: "Career Fair", date: "Dec 18", priority: "medium", type: "event" },
    { title: "Internship Application", date: "Dec 22", priority: "high", type: "application" },
    { title: "Thesis Proposal Review", date: "Jan 5", priority: "medium", type: "academic" }
  ];

  const renderUploadPage = () => (
    <div className="p-8">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <div className="text-center">
          <Upload className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Upload Academic Records</h2>
          <p className="text-slate-600 mb-8">Upload your transcripts, report cards, and certificates for comprehensive analysis</p>
          
          <div className="border-2 border-dashed border-blue-300 rounded-xl p-12 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
            <div className="flex flex-col items-center">
              <Upload className="h-12 w-12 text-blue-400 mb-4" />
              <p className="text-lg font-medium text-slate-700 mb-2">Drop your files here or click to browse</p>
              <p className="text-sm text-slate-500">Supports PDF, JPG, PNG files up to 10MB</p>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-500 mb-2" />
              <p className="font-medium text-green-800">Secure Upload</p>
              <p className="text-sm text-green-600">256-bit encryption</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <Brain className="h-6 w-6 text-blue-500 mb-2" />
              <p className="font-medium text-blue-800">AI Analysis</p>
              <p className="text-sm text-blue-600">Automated processing</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <Target className="h-6 w-6 text-purple-500 mb-2" />
              <p className="font-medium text-purple-800">Instant Insights</p>
              <p className="text-sm text-purple-600">Real-time recommendations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInterestPage = () => (
    <div className="p-8">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <div className="text-center mb-8">
          <BookOpen className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Career Interest Assessment</h2>
          <p className="text-slate-600">Discover your career interests and aptitudes through comprehensive assessments</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border border-slate-200 rounded-xl hover:shadow-md transition-all">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">Personality Assessment</h3>
            <p className="text-slate-600 mb-4">Understand your work style and preferences</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-600">15 minutes</span>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                Start Assessment
              </button>
            </div>
          </div>
          
          <div className="p-6 border border-slate-200 rounded-xl hover:shadow-md transition-all">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">Skills Evaluation</h3>
            <p className="text-slate-600 mb-4">Assess your technical and soft skills</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-600">20 minutes</span>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Start Assessment
              </button>
            </div>
          </div>
          
          <div className="p-6 border border-slate-200 rounded-xl hover:shadow-md transition-all">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">Career Values</h3>
            <p className="text-slate-600 mb-4">Identify what matters most in your career</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-purple-600">10 minutes</span>
              <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                Start Assessment
              </button>
            </div>
          </div>
          
          <div className="p-6 border border-slate-200 rounded-xl hover:shadow-md transition-all">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">Interest Profiler</h3>
            <p className="text-slate-600 mb-4">Explore career fields that match your interests</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-orange-600">25 minutes</span>
              <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                Start Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRecommendationPage = () => (
    <div className="p-8">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <div className="text-center mb-8">
          <Lightbulb className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">AI-Powered Recommendations</h2>
          <p className="text-slate-600">Personalized guidance for your academic and career journey</p>
        </div>
        
        <div className="space-y-6">
          {careerRecommendations.map((career, index) => (
            <div key={index} className="p-6 border border-slate-200 rounded-xl hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">{career.title}</h3>
                  <p className="text-slate-600">Career Recommendation</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold" style={{ color: career.color }}>
                    {career.match}% Match
                  </div>
                  <p className="text-sm text-slate-600">Compatibility Score</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="font-semibold text-green-600">{career.growth}</p>
                  <p className="text-xs text-slate-600">Job Growth</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="font-semibold text-blue-600">{career.salary}</p>
                  <p className="text-xs text-slate-600">Avg Salary</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="font-semibold text-purple-600">{career.demand}</p>
                  <p className="text-xs text-slate-600">Market Demand</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full">High Potential</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">Trending</span>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Learn More <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderViewPage = () => (
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
            <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Generate Report
            </button>
          </div>
          
          <div className="p-6 border border-slate-200 rounded-xl hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-6 w-6 text-green-500" />
              <h3 className="text-lg font-semibold text-slate-800">Progress Analysis</h3>
            </div>
            <p className="text-slate-600 mb-4">Track your improvement over time with trend analysis</p>
            <button className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
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

  return (
    <div className="flex min-h-screen bg-slate-50 font-['Inter',sans-serif]">
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
              <span className="text-white font-semibold text-lg">MO</span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Michelle Obama</h3>
              <p className="text-sm text-slate-600">U6 student at GBHS N'samba</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-3 w-3 text-yellow-500" />
                <span className="text-xs text-slate-600">GPA: 3.78</span>
              </div>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
            { id: "upload", label: "Upload Records", icon: Upload, badge: null },
            { id: "interest", label: "Career Assessment", icon: BookOpen, badge: "2" },
            { id: "recommendation", label: "AI Recommendations", icon: Lightbulb, badge: "5" },
            { id: "view", label: "Academic Reports", icon: FileText, badge: null }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id as any)}
              className={`flex items-center justify-between gap-3 p-3 rounded-xl w-full text-left transition-all duration-200 ${
                activePage === item.id 
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
          
          <div className="pt-4 mt-4 border-t border-slate-200 space-y-2">
            <button className="flex items-center justify-between gap-3 p-3 rounded-xl w-full text-left hover:bg-slate-100 text-slate-700 transition-all">
              <div className="flex items-center gap-3">
                <MessageSquare size={20} />
                <span className="font-medium">Messages</span>
              </div>
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">3</span>
            </button>
            <button className="flex items-center gap-3 p-3 rounded-xl w-full text-left hover:bg-slate-100 text-slate-700 transition-all">
              <Settings size={20} />
              <span className="font-medium">Settings</span>
            </button>
          </div>
        </nav>
        
        <div className="p-4 border-t border-slate-200">
          <button className="flex items-center gap-3 p-3 rounded-xl w-full text-left hover:bg-red-50 text-red-600 font-medium transition-all">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {activePage === "dashboard" && (
          <div className="p-8 space-y-8">
            {/* Header Section */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-slate-800 mb-2">
                  Good morning, Michelle! 👋
                </h1>
                <p className="text-slate-600 text-lg">
                  Here's your comprehensive academic performance overview
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input 
                    type="text" 
                    placeholder="Search analytics..." 
                    className="pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  />
                </div>
                <button className="p-3 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors">
                  <Bell className="h-5 w-5 text-slate-600" />
                </button>
                <button className="p-3 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors">
                  <Download className="h-5 w-5 text-slate-600" />
                </button>
              </div>
            </div>

            {/* KPI Selection Tabs */}
            <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
              {[
                { id: "academic", label: "Academic", icon: GraduationCap },
                { id: "behavioral", label: "Engagement", icon: Activity },
                { id: "predictive", label: "Predictive", icon: Brain }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveKPIView(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    activeKPIView === tab.id
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-800"
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Dynamic KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {activeKPIView === "academic" && (
                <>
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-white/20 rounded-xl">
                        <TrendingUp className="h-6 w-6" />
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-blue-100">
                          <TrendingUp className="h-3 w-3" />
                          <span className="text-sm">+3.6%</span>
                        </div>
                      </div>
                    </div>
                    <h4 className="text-blue-100 text-sm font-medium">Current GPA</h4>
                    <p className="text-3xl font-bold mb-2">{kpiData.academic.currentGPA}</p>
                    <p className="text-blue-100 text-sm">
                      Improved from {kpiData.academic.previousGPA}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-white/20 rounded-xl">
                        <Award className="h-6 w-6" />
                      </div>
                      <div className="text-right">
                        <span className="text-green-100 text-sm">Top {(100 - kpiData.academic.percentile).toFixed(0)}%</span>
                      </div>
                    </div>
                    <h4 className="text-green-100 text-sm font-medium">Class Rank</h4>
                    <p className="text-3xl font-bold mb-2">#{kpiData.academic.classRank}</p>
                    <p className="text-green-100 text-sm">
                      of {kpiData.academic.totalStudents} students
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-white/20 rounded-xl">
                        <BookmarkCheck className="h-6 w-6" />
                      </div>
                      <div className="text-right">
                        <span className="text-purple-100 text-sm">
                          {((kpiData.academic.creditsCompleted / kpiData.academic.totalCreditsRequired) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <h4 className="text-purple-100 text-sm font-medium">Credits Completed</h4>
                    <p className="text-3xl font-bold mb-2">{kpiData.academic.creditsCompleted}</p>
                    <p className="text-purple-100 text-sm">
                      of {kpiData.academic.totalCreditsRequired} required
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-white/20 rounded-xl">
                        <BarChart3 className="h-6 w-6" />
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-orange-100">
                          <TrendingUp className="h-3 w-3" />
                          <span className="text-sm">+{kpiData.academic.gradeImprovement}%</span>
                        </div>
                      </div>
                    </div>
                    <h4 className="text-orange-100 text-sm font-medium">Average Grade</h4>
                    <p className="text-3xl font-bold mb-2">{kpiData.academic.averageGrade}%</p>
                    <p className="text-orange-100 text-sm">This semester</p>
                  </div>
                </>
              )}

              {activeKPIView === "behavioral" && (
                <>
                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-white/20 rounded-xl">
                        <CheckCircle className="h-6 w-6" />
                      </div>
                    </div>
                    <h4 className="text-emerald-100 text-sm font-medium">Attendance Rate</h4>
                    <p className="text-3xl font-bold mb-2">{kpiData.behavioral.attendanceRate}%</p>
                    <p className="text-emerald-100 text-sm">Excellent attendance</p>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-white/20 rounded-xl">
                        <Users className="h-6 w-6" />
                      </div>
                    </div>
                    <h4 className="text-cyan-100 text-sm font-medium">Participation Score</h4>
                    <p className="text-3xl font-bold mb-2">{kpiData.behavioral.participationScore}%</p>
                    <p className="text-cyan-100 text-sm">High engagement</p>
                  </div>

                  <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-white/20 rounded-xl">
                        <Clock className="h-6 w-6" />
                      </div>
                    </div>
                    <h4 className="text-pink-100 text-sm font-medium">Assignment Completion</h4>
                    <p className="text-3xl font-bold mb-2">{kpiData.behavioral.assignmentCompletionRate}%</p>
                    <p className="text-pink-100 text-sm">On-time submissions</p>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-white/20 rounded-xl">
                        <MessageSquare className="h-6 w-6" />
                      </div>
                    </div>
                    <h4 className="text-indigo-100 text-sm font-medium">Counseling Sessions</h4>
                    <p className="text-3xl font-bold mb-2">{kpiData.behavioral.counselingSessionsAttended}</p>
                    <p className="text-indigo-100 text-sm">Sessions attended</p>
                  </div>
                </>
              )}

              {activeKPIView === "predictive" && (
                <>
                  <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-white/20 rounded-xl">
                        <Target className="h-6 w-6" />
                      </div>
                    </div>
                    <h4 className="text-violet-100 text-sm font-medium">Graduation Probability</h4>
                    <p className="text-3xl font-bold mb-2">{kpiData.predictive.graduationProbability}%</p>
                    <p className="text-violet-100 text-sm">Very high confidence</p>
                  </div>

                  <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-white/20 rounded-xl">
                        <Brain className="h-6 w-6" />
                      </div>
                    </div>
                    <h4 className="text-rose-100 text-sm font-medium">Career Readiness</h4>
                    <p className="text-3xl font-bold mb-2">{kpiData.predictive.careerReadinessScore}%</p>
                    <p className="text-rose-100 text-sm">Industry ready</p>
                  </div>

                  <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-white/20 rounded-xl">
                        <TrendingUp className="h-6 w-6" />
                      </div>
                    </div>
                    <h4 className="text-teal-100 text-sm font-medium">Predicted Final GPA</h4>
                    <p className="text-3xl font-bold mb-2">{kpiData.predictive.predictedFinalGPA}</p>
                    <p className="text-teal-100 text-sm">Based on current trend</p>
                  </div>

                  <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-white/20 rounded-xl">
                        <Star className="h-6 w-6" />
                      </div>
                    </div>
                    <h4 className="text-amber-100 text-sm font-medium">Career Match Score</h4>
                    <p className="text-3xl font-bold mb-2">{kpiData.predictive.careerMatchScore}%</p>
                    <p className="text-amber-100 text-sm">Excellent alignment</p>
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Analytics */}
              <div className="lg:col-span-2 space-y-8">
                {/* Performance Analytics Chart */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
                  <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-blue-600" />
                          Performance Analytics Dashboard
                        </h3>
                        <p className="text-slate-600 text-sm mt-1">
                          Comprehensive view of academic performance across subjects and metrics
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                          <Filter className="h-4 w-4" />
                          Filter
                        </button>
                        <select
                          value={selectedView}
                          onChange={(e) => setSelectedView(e.target.value as any)}
                          className="px-4 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="This Term">This Term</option>
                          <option value="Last Term">Last Term</option>
                          <option value="Yearly">Yearly Overview</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="h-96 mb-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={datasets[selectedView].data}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="subject" 
                            tick={{ fontSize: 12, fill: '#64748b' }}
                            tickLine={{ stroke: '#e2e8f0' }}
                          />
                          <YAxis 
                            tick={{ fontSize: 12, fill: '#64748b' }}
                            tickLine={{ stroke: '#e2e8f0' }}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'rgba(17, 24, 39, 0.95)',
                              border: 'none',
                              borderRadius: '8px',
                              color: '#f9fafb'
                            }}
                          />
                          <Legend 
                            wrapperStyle={{ fontSize: '12px' }}
                          />
                          <Bar dataKey="performance" fill="#3B82F6" name="Performance" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="engagement" fill="#10B981" name="Engagement" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="assessment" fill="#F59E0B" name="Assessment" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="benchmark" fill="#E5E7EB" name="Benchmark" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    {/* Performance Summary Cards */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-xl">
                        <p className="text-2xl font-bold text-blue-600">
                          {(datasets[selectedView].data.reduce((sum, item) => sum + item.performance, 0) / datasets[selectedView].data.length).toFixed(1)}%
                        </p>
                        <p className="text-sm text-slate-600 font-medium">Average Performance</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-xl">
                        <p className="text-2xl font-bold text-green-600">
                          {Math.max(...datasets[selectedView].data.map(item => item.performance))}%
                        </p>
                        <p className="text-sm text-slate-600 font-medium">Highest Score</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-xl">
                        <p className="text-2xl font-bold text-purple-600">
                          {datasets[selectedView].data.length}
                        </p>
                        <p className="text-sm text-slate-600 font-medium">Active Subjects</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Trend Analysis */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
                  <div className="p-6 border-b border-slate-200">
                    <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                      <Activity className="h-5 w-5 text-green-600" />
                      Performance Trend Analysis
                    </h3>
                    <p className="text-slate-600 text-sm mt-1">
                      Track your academic progress and engagement over time
                    </p>
                  </div>
                  
                  <div className="p-6">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={performanceTrendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="month" 
                            tick={{ fontSize: 12, fill: '#64748b' }}
                          />
                          <YAxis 
                            domain={[70, 100]}
                            tick={{ fontSize: 12, fill: '#64748b' }}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'rgba(17, 24, 39, 0.95)',
                              border: 'none',
                              borderRadius: '8px',
                              color: '#f9fafb'
                            }}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="academic" 
                            stroke="#0EA5E9" 
                            strokeWidth={3}
                            name="Academic Performance"
                            dot={{ fill: '#0EA5E9', strokeWidth: 2, r: 4 }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="engagement" 
                            stroke="#10B981" 
                            strokeWidth={3}
                            name="Engagement Score"
                            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* AI-Powered Career Recommendations */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
                  <div className="p-6 border-b border-slate-200">
                    <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      AI-Powered Career Recommendations
                    </h3>
                    <p className="text-slate-600 text-sm mt-1">
                      Personalized career paths based on your performance and market trends
                    </p>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-4">
                      {careerRecommendations.map((career, index) => (
                        <div key={index} className="p-4 border border-slate-200 rounded-xl hover:shadow-md transition-all duration-200">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-lg text-slate-800">{career.title}</h4>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-sm text-slate-600">Match: </span>
                                <div className="flex items-center gap-2">
                                  <div className="w-20 h-2 bg-slate-200 rounded-full">
                                    <div 
                                      className="h-full rounded-full"
                                      style={{ 
                                        width: `${career.match}%`, 
                                        backgroundColor: career.color 
                                      }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-medium" style={{ color: career.color }}>
                                    {career.match}%
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="flex items-center gap-4">
                                <div>
                                  <p className="text-sm text-slate-600">Growth</p>
                                  <p className="font-semibold text-green-600">{career.growth}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-slate-600">Avg Salary</p>
                                  <p className="font-semibold text-slate-800">{career.salary}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-slate-600">Demand</p>
                                  <p className="font-semibold text-blue-600">{career.demand}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                                High Potential
                              </span>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                              Learn More
                              <ArrowUpRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Analytics */}
              <div className="space-y-6">
                {/* Academic Distribution */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
                  <div className="p-6 border-b border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-800">Subject Distribution</h3>
                    <p className="text-slate-600 text-sm mt-1">Your academic focus areas</p>
                  </div>
                  <div className="p-6">
                    <div className="h-48 mb-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={subjectDistributionData}
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                          >
                            {subjectDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Recent Achievements */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
                  <div className="p-6 border-b border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-500" />
                      Recent Achievements
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      {recentAchievements.map((achievement, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
                          <div className="p-2 bg-yellow-100 rounded-lg">
                            <achievement.icon className="h-4 w-4 text-yellow-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-slate-800 text-sm">{achievement.title}</p>
                            <p className="text-xs text-slate-600">{achievement.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Upcoming Deadlines */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
                  <div className="p-6 border-b border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      Upcoming Deadlines
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      {upcomingEvents.map((event, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100">
                          <div className={`p-2 rounded-lg ${
                            event.priority === 'high' 
                              ? 'bg-red-100' 
                              : event.priority === 'medium' 
                                ? 'bg-yellow-100' 
                                : 'bg-green-100'
                          }`}>
                            <Calendar className={`h-4 w-4 ${
                              event.priority === 'high' 
                                ? 'text-red-600' 
                                : event.priority === 'medium' 
                                  ? 'text-yellow-600' 
                                  : 'text-green-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-slate-800 text-sm">{event.title}</p>
                            <p className="text-xs text-slate-600">{event.date}</p>
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                              event.priority === 'high' 
                                ? 'bg-red-100 text-red-700' 
                                : event.priority === 'medium' 
                                  ? 'bg-yellow-100 text-yellow-700' 
                                  : 'bg-green-100 text-green-700'
                            }`}>
                              {event.priority} priority
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl border border-blue-200">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button className="w-full flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all">
                        <PlusCircle className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-slate-800">Upload New Report</span>
                      </button>
                      <button className="w-full flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all">
                        <Eye className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-slate-800">View Full Report</span>
                      </button>
                      <button className="w-full flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all">
                        <Calendar className="h-5 w-5 text-purple-600" />
                        <span className="font-medium text-slate-800">Schedule Counseling</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activePage === "upload" && renderUploadPage()}
        {activePage === "interest" && renderInterestPage()}
        {activePage === "recommendation" && renderRecommendationPage()}
        {activePage === "view" && renderViewPage()}
      </main>
    </div>
  );
};

export default StudentDashboard;