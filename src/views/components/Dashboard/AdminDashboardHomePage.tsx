import React, { useState, useEffect } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Search, Download, Users, GraduationCap, DollarSign, Activity, TrendingUp, TrendingDown, CheckCircle, Brain, FileText, Briefcase, MoreVertical, Eye, Plus, BookOpen, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAdminDashboard } from './AdminDashboardLayout'; // Import context hook

import AdminService from "../../../services/admin"; // For specific data fetches if not covered by layout's dashboard summary

const AdminDashboardHomePage: React.FC = () => {
  const navigate = useNavigate();
  // Consume data from the layout context
  const { adminProfile, kpiData, fetchDashboardData } = useAdminDashboard();

  // Local state for dashboard-specific UI elements or derived data
  const [popularCoursesData, setPopularCoursesData] = useState<any[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
  const [reportsSummaryData, setReportsSummaryData] = useState<any>(null);
  const [lastStudentsActivityData, setLastStudentsActivityData] = useState<any[]>([]);
  const [systemUsageDistributionData, setSystemUsageDistributionData] = useState<any[]>([]);

  // Effect to populate initial chart/list data from context's kpiData
  useEffect(() => {
    if (kpiData) {
        // Assume these are part of the initial kpiData fetched by the layout
        setPopularCoursesData(kpiData.popular_courses || []);
        setUserGrowthData(kpiData.user_growth_analytics || []);
        setReportsSummaryData(kpiData.reports_summary || null);
        setLastStudentsActivityData(kpiData.last_students_activity || []);
        setSystemUsageDistributionData(kpiData.system_usage_distribution || []);
    }
  }, [kpiData]);


  // Placeholder colors for PieChart (ensure consistency with backend if possible)
  const pieChartColors = ["#4285F4", "#34A853", "#FBBC05", "#EA4335"];


  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            System Overview
          </h1>
          <p className="text-slate-600 text-lg">
            Comprehensive platform management and analytics
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input 
              type="text" 
              placeholder="Search platform data..." 
              className="pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm w-80"
            />
          </div>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg">
            Search
          </button>
        </div>
      </div>

      {/* KPI Cards - Matching Screenshot Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-4 right-4 opacity-20">
            <Users className="h-12 w-12" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 p-1.5 bg-white/20 rounded-lg" />
              <div className="flex items-center gap-1 text-blue-100">
                <TrendingDown className="h-4 w-4" />
                <span className="text-sm">{kpiData.userChangePercent || '-0.0'}%</span>
              </div>
            </div>
            <div className="text-4xl font-bold mb-1">
              {kpiData.totalUsers?.toLocaleString() || 0}
            </div>
            <div className="text-blue-100 text-sm font-medium">
              Total Users
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-xl">
              <GraduationCap className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">1.3%</span> {/* Mock growth */}
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800 mb-1">
            {kpiData.totalStudents?.toLocaleString() || 0}
          </div>
          <div className="text-slate-600 text-sm">
            Total Students
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 rounded-xl">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">0.4%</span> {/* Mock growth */}
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800 mb-1">
            ${kpiData.totalRevenue?.toLocaleString() || 0}
          </div>
          <div className="text-slate-600 text-sm">
            Total Revenue
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-xl">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Healthy</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800 mb-1">
            {kpiData.systemUptime || 0}%
          </div>
          <div className="text-slate-600 text-sm">
            System Uptime
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Popular Courses */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-800">Popular Courses</h3>
                <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {popularCoursesData.length > 0 ? (
                  popularCoursesData.map((course, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: course.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-slate-800 truncate">
                            {course.name}
                          </span>
                          <span className="text-sm font-medium text-slate-600">
                            {course.students?.toLocaleString() || 0}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-300"
                            style={{ 
                              backgroundColor: course.color,
                              width: `${course.progress || 0}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-500">No popular courses available.</p>
                )}
              </div>
            </div>
          </div>

          {/* User Growth Analytics */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 mt-8">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-semibold text-slate-800">User Growth Analytics</h3>
              <p className="text-slate-600 text-sm mt-1">Platform user acquisition trends</p>
            </div>
            <div className="p-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12, fill: '#64748b' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#64748b' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(17, 24, 39, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#f9fafb'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="students" 
                      stroke="#4285F4" 
                      strokeWidth={3}
                      name="Students"
                      dot={{ fill: '#4285F4', strokeWidth: 2, r: 5 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="counselors" 
                      stroke="#34A853" 
                      strokeWidth={3}
                      name="Counselors"
                      dot={{ fill: '#34A853', strokeWidth: 2, r: 5 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="admins" 
                      stroke="#EA4335" 
                      strokeWidth={3}
                      name="Admins"
                      dot={{ fill: '#EA4335', strokeWidth: 2, r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Reports Style */}
        <div className="space-y-6">
          {/* Reports Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-800">Reports</h3>
                <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              {/* Circular Progress */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#4285F4"
                      strokeWidth="2"
                      strokeDasharray={`${(reportsSummaryData?.total_generated / reportsSummaryData?.total_reports) * 100 || 0}, 100`} // Dynamic percentage
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{reportsSummaryData?.total_generated || 0}</div>
                      <div className="text-xs text-slate-500">from {reportsSummaryData?.total_reports || 0}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Items */}
              <div className="space-y-4">
                {reportsSummaryData && (
                  <>
                    <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                        <div>
                          <div className="font-medium text-slate-800">{reportsSummaryData.analytical || 0}</div>
                          <div className="text-sm text-slate-600">Analytical reports</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 text-sm font-medium">+{reportsSummaryData.new_analytical_count || 0}</span>
                        <button className="p-1 hover:bg-slate-200 rounded transition-colors">
                          <Eye className="h-4 w-4 text-slate-400" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-cyan-500 rounded-full"></div>
                        <div>
                          <div className="font-medium text-slate-800">{reportsSummaryData.proposal || 0}</div>
                          <div className="text-sm text-slate-600">Proposal reports</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 text-sm font-medium">+{reportsSummaryData.new_proposal_count || 0}</span>
                        <button className="p-1 hover:bg-slate-200 rounded transition-colors">
                          <Eye className="h-4 w-4 text-slate-400" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-slate-400 rounded-full"></div>
                        <div>
                          <div className="font-medium text-slate-800">{reportsSummaryData.undefined || 0}</div>
                          <div className="text-sm text-slate-600">Undefined report</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 text-sm font-medium">+{reportsSummaryData.new_undefined_count || 0}</span>
                        <button className="p-1 hover:bg-slate-200 rounded transition-colors">
                          <Eye className="h-4 w-4 text-slate-400" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Last Students Activity */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-800">Last Students Activity</h3>
                <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-sm font-medium text-slate-600 pb-2 border-b border-slate-100">
                  <div>Student</div>
                  <div>Subject</div>
                  <div>Date</div>
                </div>
                
                {lastStudentsActivityData.length > 0 ? (
                  lastStudentsActivityData.map((activity, index) => (
                    <div key={index} className="grid grid-cols-3 gap-4 py-3 text-sm hover:bg-slate-50 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">{activity.avatar}</span>
                        </div>
                        <span className="font-medium text-slate-800">{activity.name}</span>
                      </div>
                      <div className="text-slate-600 flex items-center">{activity.subject}</div>
                      <div className="text-slate-500 flex items-center">{activity.date}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-500">No recent student activity.</p>
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
                  onClick={() => navigate('/AdminDashboard/account?action=add-user')}
                  className="w-full flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all">
                  <Plus className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-slate-800">Add New User</span>
                </button>
                <button 
                  onClick={() => navigate('/AdminDashboard/course?action=add-course')}
                  className="w-full flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-slate-800">Create Course</span>
                </button>
                <button 
                  onClick={() => navigate('/AdminDashboard/academic-record?action=generate-report')}
                  className="w-full flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-slate-800">Generate Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHomePage;