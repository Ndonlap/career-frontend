import React, { useState, useEffect } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { LayoutDashboard, Upload, BookOpen, Lightbulb, FileText, LogOut, TrendingUp, TrendingDown, Award, Calendar, Clock, Users, Target, AlertCircle, CheckCircle, Star, GraduationCap, Brain, BarChart3, Activity, BookmarkCheck, MessageSquare, Bell, Settings, Search, Filter, Download, ArrowUpRight, PlusCircle, Eye, BookMarked } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStudentDashboard } from './StudentDashboardLayout'; // Import the context hook

// Import StudentService for specific data fetches if not covered by layout's dashboard summary
import StudentService from "../../../services/student";

const StudentDashboardHomePage: React.FC = () => {
  const navigate = useNavigate();
  // Consume data from the layout context
  const { userProfile, kpiData, fetchDashboardData, careerRecommendationsData, subjectDistributionData, availableAssessments } = useStudentDashboard();

  // Local state for dashboard-specific UI elements
  const [selectedView, setSelectedView] = useState<"This Term" | "Last Term" | "Yearly">("This Term");
  const [activeKPIView, setActiveKPIView] = useState<"academic" | "behavioral" | "predictive">("academic");
  
  // These states will now hold data specifically for this page, some potentially fetched dynamically
  const [performanceAnalyticsChartData, setPerformanceAnalyticsChartData] = useState<any>({ labels: [], data: [] });
  const [performanceTrendData, setPerformanceTrendData] = useState<any>([]);
  const [recentAchievementsData, setRecentAchievementsData] = useState<any>([]);
  const [upcomingEventsData, setUpcomingEventsData] = useState<any>([]);

  // Effect to populate initial chart/list data from context
  useEffect(() => {
    // Since fetchDashboardData in layout already gets most of this, we just set it here.
    // Ensure `kpiData` and other arrays from context are correctly initialized.
    if (kpiData) {
        // Assume layout's fetchDashboardData populates these into kpiData,
        // and we derive these or have separate states in layout as needed.
        // For now, let's use the ones already in context.
        setPerformanceAnalyticsChartData([]); // Initial load
        setPerformanceTrendData(kpiData.performance_trend_data || []); // Assuming this is part of KPI or comes from summary
        setRecentAchievementsData(kpiData.recent_achievements || []);
        setUpcomingEventsData(kpiData.upcoming_events || []);
    }
  }, [kpiData]);


  // Fetch performance analytics data whenever selectedView changes
  useEffect(() => {
    const fetchPerformanceChartData = async () => {
      if (userProfile?.id) { // Ensure userProfile is loaded
        try {
          const response = await StudentService.getPerformanceAnalytics(selectedView);
          setPerformanceAnalyticsChartData(response.data);
        } catch (err) {
          console.error("Error fetching performance analytics:", err);
        }
      }
    };
    fetchPerformanceChartData();
  }, [selectedView, userProfile]); // Dependency on userProfile to ensure ID is available

  // Use the data from the context. No direct loading/error states needed here
  // as the layout handles the overall loading/error.

  return (
    <div className="p-8 space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Good morning, {userProfile.first_name}! 👋
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
                    <span className="text-sm">+{kpiData.academic.gpaChange > 0 ? kpiData.academic.gpaChange : 0}%</span>
                  </div>
                </div>
              </div>
              <h4 className="text-blue-100 text-sm font-medium">Current GPA</h4>
              <p className="text-3xl font-bold mb-2">{kpiData.academic.currentGPA?.toFixed(2)}</p>
              <p className="text-blue-100 text-sm">
                Improved from {kpiData.academic.previousGPA?.toFixed(2)}
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
              <p className="text-3xl font-bold mb-2">{kpiData.academic.averageGrade?.toFixed(1)}%</p>
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
              <p className="text-3xl font-bold mb-2">{kpiData.behavioral.attendanceRate?.toFixed(1)}%</p>
              <p className="text-emerald-100 text-sm">Excellent attendance</p>
            </div>

            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Users className="h-6 w-6" />
                </div>
              </div>
              <h4 className="text-cyan-100 text-sm font-medium">Participation Score</h4>
              <p className="text-3xl font-bold mb-2">{kpiData.behavioral.participationScore?.toFixed(1)}%</p>
              <p className="text-cyan-100 text-sm">High engagement</p>
            </div>

            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
              <h4 className="text-pink-100 text-sm font-medium">Assignment Completion</h4>
              <p className="text-3xl font-bold mb-2">{kpiData.behavioral.assignmentCompletionRate?.toFixed(1)}%</p>
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
              <p className="text-3xl font-bold mb-2">{kpiData.predictive.graduationProbability?.toFixed(1)}%</p>
              <p className="text-violet-100 text-sm">Very high confidence</p>
            </div>

            <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Brain className="h-6 w-6" />
                </div>
              </div>
              <h4 className="text-rose-100 text-sm font-medium">Career Readiness</h4>
              <p className="text-3xl font-bold mb-2">{kpiData.predictive.careerReadinessScore?.toFixed(1)}%</p>
              <p className="text-rose-100 text-sm">Industry ready</p>
            </div>

            <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
              <h4 className="text-teal-100 text-sm font-medium">Predicted Final GPA</h4>
              <p className="text-3xl font-bold mb-2">{kpiData.predictive.predictedFinalGPA?.toFixed(2)}</p>
              <p className="text-teal-100 text-sm">Based on current trend</p>
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Star className="h-6 w-6" />
                </div>
              </div>
              <h4 className="text-amber-100 text-sm font-medium">Career Match Score</h4>
              <p className="text-3xl font-bold mb-2">{kpiData.predictive.careerMatchScore?.toFixed(1)}%</p>
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
                  <BarChart data={performanceAnalyticsChartData.data}>
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
              
              {/* Performance Summary Cards (use fetched data for calculation) */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <p className="text-2xl font-bold text-blue-600">
                    {performanceAnalyticsChartData.data.length > 0
                      ? (performanceAnalyticsChartData?.data?.reduce((sum: number, item: any) => sum + item.performance, 0) / performanceAnalyticsChartData.data.length).toFixed(1)
                      : 'N/A'}%
                  </p>
                  <p className="text-sm text-slate-600 font-medium">Average Performance</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <p className="text-2xl font-bold text-green-600">
                    {performanceAnalyticsChartData.data.length > 0
                      ? Math.max(...performanceAnalyticsChartData.data.map((item: any) => item.performance))
                      : 'N/A'}%
                  </p>
                  <p className="text-sm text-slate-600 font-medium">Highest Score</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <p className="text-2xl font-bold text-purple-600">
                    {performanceAnalyticsChartData?.data?.length}
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
                {careerRecommendationsData.length > 0 ? (
                  careerRecommendationsData.map((career: any, index: number) => (
                    <div key={index} className="p-4 border border-slate-200 rounded-xl hover:shadow-md transition-all duration-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg text-slate-800">{career.title}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-slate-600">Match: </span>
                            <div className="w-20 h-2 bg-slate-200 rounded-full">
                              <div 
                                className="h-full rounded-full"
                                style={{ 
                                  width: `${career.match}%`, 
                                  backgroundColor: career.color || "#3B82F6"
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium" style={{ color: career.color || "#3B82F6" }}>
                              {career.match}%
                            </span>
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
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                          Learn More
                          <ArrowUpRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-500">No career recommendations available yet. Complete your profile and assessments!</p>
                )}
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
                      {subjectDistributionData?.map((entry: any, index: number) => (
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
                {recentAchievementsData.length > 0 ? (
                  recentAchievementsData.map((achievement: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Award className="h-4 w-4 text-yellow-600" /> {/* Using generic Award icon for now */}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800 text-sm">{achievement.title}</p>
                        <p className="text-xs text-slate-600">{achievement.date}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-500 text-sm">No recent achievements.</p>
                )}
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
                {upcomingEventsData.length > 0 ? (
                  upcomingEventsData.map((event: any, index: number) => (
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
                  ))
                ) : (
                  <p className="text-center text-slate-500 text-sm">No upcoming events or deadlines.</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl border border-blue-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/StudentDashboard/upload-records')}
                  className="w-full flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all">
                  <PlusCircle className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-slate-800">Upload New Report</span>
                </button>
                <button 
                   onClick={() => navigate('/StudentDashboard/reports')}
                  className="w-full flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all">
                  <Eye className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-slate-800">View Full Report</span>
                </button>
                <button 
                  onClick={() => navigate('/Bookcounselor')}
                  className="w-full flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-slate-800">Schedule Counseling</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardHomePage;