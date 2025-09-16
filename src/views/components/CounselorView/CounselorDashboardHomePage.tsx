import React, { useEffect } from "react";
import { BarChart, Bar, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Users, Calendar, MessageSquare, Lightbulb, FileText, TrendingUp, TrendingDown, Clock, CheckCircle, AlertCircle, Target, Brain, Search, Filter, Download, Bell, Settings, UserCheck, BookOpen, Award, Star, ArrowUpRight, PlusCircle, Eye, Edit, MoreVertical, CalendarPlus, MessageCircle, BarChart3, Activity, GraduationCap, HeartHandshake, Zap, ChevronRight, MapPin, Phone, Mail } from "lucide-react";
import { useCounselorDashboard } from './CounselorDashboardLayout'; // Import context hook
import { useNavigate } from "react-router-dom";


const CounselorDashboardHomePage: React.FC = () => {
  const navigate = useNavigate();
  // Consume data and functions from the layout context
  const { 
    counselorProfile, 
    kpiData, 
    fetchDashboardData, 
    selectedTimeframe, 
    setSelectedTimeframe 
  } = useCounselorDashboard();

  // --- Data from context's kpiData (or fetched directly if not part of layout summary) ---
  // These would ideally be part of the `kpiData` object fetched by the layout
  // For now, mapping from original component's hardcoded structure to context's kpiData
  const studentEngagementAnalytics = kpiData.studentEngagementAnalytics || [
    { month: "Jan", sessions: 45, satisfaction: 4.5, completion: 87 },
    { month: "Feb", sessions: 52, satisfaction: 4.6, completion: 89 },
    { month: "Mar", sessions: 48, satisfaction: 4.4, completion: 85 },
    { month: "Apr", sessions: 61, satisfaction: 4.7, completion: 92 },
    { month: "May", sessions: 58, satisfaction: 4.8, completion: 94 },
    { month: "Jun", sessions: 67, satisfaction: 4.9, completion: 96 }
  ];

  const careerInterestDistribution = kpiData.careerInterestDistribution || [
    { name: "STEM", value: 35, color: "#3B82F6" },
    { name: "Healthcare", value: 22, color: "#10B981" },
    { name: "Business", value: 18, color: "#F59E0B" },
    { name: "Arts & Design", value: 12, color: "#8B5CF6" },
    { name: "Education", value: 8, color: "#EF4444" },
    { name: "Other", value: 5, color: "#6B7280" }
  ];

  const sessionOutcomeData = kpiData.sessionOutcomeData || [
    { category: "Career Clarity", achieved: 78, target: 85 },
    { category: "Academic Planning", achieved: 92, target: 90 },
    { category: "Skill Development", achieved: 85, target: 88 },
    { category: "Goal Setting", achieved: 89, target: 85 },
    { category: "Decision Making", achieved: 76, target: 80 }
  ];

  const priorityStudents = kpiData.priorityStudents || [ // from context, or fetch here
    { id: "1", name: "Sarah Chen", grade: "12th Grade", riskLevel: "Medium", lastSession: "2 days ago", nextAppointment: "Dec 15, 2:00 PM", concerns: ["Academic Stress", "Career Uncertainty"], gpa: 3.2, attendance: 85, avatar: "SC" },
    { id: "2", name: "Marcus Johnson", grade: "11th Grade", riskLevel: "High", lastSession: "5 days ago", nextAppointment: "Dec 14, 10:00 AM", concerns: ["Family Issues", "College Prep"], gpa: 2.8, attendance: 78, avatar: "MJ" },
    { id: "3", name: "Emily Rodriguez", grade: "12th Grade", riskLevel: "Low", lastSession: "1 week ago", nextAppointment: "Dec 16, 3:30 PM", concerns: ["College Applications"], gpa: 3.8, attendance: 95, avatar: "ER" }
  ];

  const recentActivities = kpiData.recentActivities || [ // from context, or fetch here
    { id: "1", type: "session", student: "Alex Thompson", action: "Completed career assessment session", time: "2 hours ago", outcome: "Positive" },
    { id: "2", type: "recommendation", student: "Lisa Park", action: "Generated college recommendation list", time: "4 hours ago", outcome: "Delivered" }
  ];

  const upcomingAppointments = kpiData.upcomingAppointments || [ // from context, or fetch here
    { id: "1", student: "Hannah Wilson", time: "Today, 2:00 PM", type: "Career Planning", duration: "45 min", priority: "high", status: "confirmed" }
  ];

  const achievementMetrics = kpiData.achievementMetrics || [ // from context, or fetch here
    { title: "Students Graduated", count: 45, change: "+8 this month", icon: GraduationCap, color: "blue" },
    { title: "Career Matches Made", count: 127, change: "+15 this week", icon: Target, color: "green" }
  ];


  // Effect to re-fetch dashboard data when timeframe changes
  useEffect(() => {
    fetchDashboardData(selectedTimeframe); // Trigger data fetch in layout when local timeframe changes
  }, [selectedTimeframe, fetchDashboardData]);


  return (
    <div className="p-8 space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Welcome back, {counselorProfile.first_name} {counselorProfile.last_name}
          </h1>
          <p className="text-slate-600 text-lg">
            Managing student success and career development
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input 
              type="text" 
              placeholder="Search students..." 
              className="pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
          </div>
          <button className="p-3 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors relative">
            <Bell className="h-5 w-5 text-slate-600" />
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span> {/* Hardcoded badge, ideally dynamic */}
          </button>
          <button className="p-3 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors">
            <Download className="h-5 w-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Time Period Selector */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        {[
          { id: "week", label: "This Week" },
          { id: "month", label: "This Month" },
          { id: "quarter", label: "This Quarter" }
        ].map((period) => (
          <button
            key={period.id}
            onClick={() => setSelectedTimeframe(period.id as any)}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              selectedTimeframe === period.id
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-200 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Users className="h-6 w-6" />
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-blue-100">
                <TrendingUp className="h-3 w-3" />
                <span className="text-sm">+{kpiData.monthlyGrowth || 0}%</span>
              </div>
            </div>
          </div>
          <h4 className="text-blue-100 text-sm font-medium">Active Students</h4>
          <p className="text-3xl font-bold mb-2">{kpiData.activeStudents || 0}</p>
          <p className="text-blue-100 text-sm">Across all programs</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-200 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div className="text-right">
              <span className="text-green-100 text-sm">Above target</span>
            </div>
          </div>
          <h4 className="text-green-100 text-sm font-medium">Completion Rate</h4>
          <p className="text-3xl font-bold mb-2">{kpiData.completionRate || 0}%</p>
          <p className="text-green-100 text-sm">Goal achievement rate</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-200 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Star className="h-6 w-6" />
            </div>
            <div className="text-right">
              <span className="text-purple-100 text-sm">Excellent</span>
            </div>
          </div>
          <h4 className="text-purple-100 text-sm font-medium">Satisfaction Score</h4>
          <p className="text-3xl font-bold mb-2">{kpiData.satisfactionScore?.toFixed(1) || 0}/5.0</p>
          <p className="text-purple-100 text-sm">Student feedback</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-200 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Calendar className="h-6 w-6" />
            </div>
            <div className="text-right">
              <span className="text-orange-100 text-sm">This {selectedTimeframe}</span>
            </div>
          </div>
          <h4 className="text-orange-100 text-sm font-medium">Pending Appointments</h4>
          <p className="text-3xl font-bold mb-2">{kpiData.pendingAppointments || 0}</p>
          <p className="text-orange-100 text-sm">Scheduled sessions</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Analytics Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Student Engagement Analytics */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    Student Engagement Analytics
                  </h3>
                  <p className="text-slate-600 text-sm mt-1">
                    Track session effectiveness and student satisfaction
                  </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <Filter className="h-4 w-4" />
                  Filter
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={studentEngagementAnalytics}>
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
                        borderRadius: '8px',
                        color: '#f9fafb'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="sessions" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      name="Sessions Conducted"
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="satisfaction" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      name="Satisfaction Score"
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 5 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="completion" 
                      stroke="#F59E0B" 
                      strokeWidth={3}
                      name="Completion Rate %"
                      dot={{ fill: '#F59E0B', strokeWidth: 2, r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Session Effectiveness */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Session Effectiveness by Category
              </h3>
              <p className="text-slate-600 text-sm mt-1">
                Performance vs targets across counseling focus areas
              </p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {sessionOutcomeData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-700">{item.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">{item.achieved}%</span>
                        <span className="text-xs text-slate-500">/ {item.target}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div 
                        className="relative h-3 rounded-full overflow-hidden"
                        style={{ width: `${(item.achieved / 100) * 100}%` }}
                      >
                         <div
                          className={`h-full rounded-full ${
                            item.achieved >= item.target 
                              ? 'bg-gradient-to-r from-green-400 to-green-600' 
                              : 'bg-gradient-to-r from-blue-400 to-blue-600'
                          }`}
                        />
                        <div 
                          className="absolute top-0 w-1 h-full bg-slate-400"
                          style={{ left: `${item.target}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievement Metrics */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                Student Success Metrics
              </h3>
              <p className="text-slate-600 text-sm mt-1">
                Key achievements and milestones
              </p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                {achievementMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className={`p-3 rounded-full ${
                      metric.color === 'blue' ? 'bg-blue-100' :
                      metric.color === 'green' ? 'bg-green-100' :
                      metric.color === 'purple' ? 'bg-purple-100' :
                      'bg-yellow-100'
                    }`}>
                      {/* You'd need a map for icons if they're dynamic */}
                      <Award className={`h-6 w-6 ${
                        metric.color === 'blue' ? 'text-blue-600' :
                        metric.color === 'green' ? 'text-green-600' :
                        metric.color === 'purple' ? 'text-purple-600' :
                        'text-yellow-600'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">{metric.count}</h4>
                      <p className="text-sm text-slate-600">{metric.title}</p>
                      <p className="text-xs text-green-600">{metric.change}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Career Interest Distribution */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800">Career Interest Distribution</h3>
              <p className="text-slate-600 text-sm mt-1">Student preferences overview</p>
            </div>
            <div className="p-6">
              <div className="h-48 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={careerInterestDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {careerInterestDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Priority Students */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  Priority Students
                </h3>
                <button 
                  onClick={() => navigate('/CounselorDashboard/Student-Management?filter=priority')}
                  className="text-blue-600 text-sm hover:underline">
                    View All
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {priorityStudents.length > 0 ? (
                  priorityStudents.map((student) => (
                    <div key={student.id} className="p-4 border border-slate-200 rounded-xl hover:shadow-md transition-all">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">{student.avatar}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-800">{student.name}</h4>
                          <p className="text-sm text-slate-600">{student.grade}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          student.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                          student.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {student.riskLevel} Risk
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                        <div>
                          <span className="text-slate-500">GPA:</span>
                          <span className="font-medium text-slate-700 ml-1">{student.gpa}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Attendance:</span>
                          <span className="font-medium text-slate-700 ml-1">{student.attendance}%</span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-xs text-slate-500 mb-1">Concerns:</p>
                        <div className="flex flex-wrap gap-1">
                          {student.concerns.map((concern, idx) => (
                            <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">
                              {concern}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-500">Next: {student.nextAppointment}</p>
                        <button 
                            onClick={() => navigate(`/CounselorDashboard/Student-Management/${student.id}`)}
                            className="text-blue-600 text-xs hover:underline">
                            View Profile
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-500 text-sm">No priority students at this time.</p>
                )}
              </div>
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  Today's Schedule
                </h3>
                <button 
                  onClick={() => navigate('/CounselorDashboard/appointment?filter=today')}
                  className="text-blue-600 text-sm hover:underline">
                    View Calendar
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className={`p-2 rounded-lg ${
                        appointment.priority === 'high' ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        <Clock className={`h-4 w-4 ${
                          appointment.priority === 'high' ? 'text-red-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800 text-sm">{appointment.student}</p>
                        <p className="text-xs text-slate-600">{appointment.time} • {appointment.type}</p>
                        <p className="text-xs text-slate-500">{appointment.duration}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        appointment.status === 'confirmed' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-500 text-sm">No upcoming appointments today.</p>
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
                  onClick={() => navigate('/CounselorDashboard/appointment?action=schedule')}
                  className="w-full flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all">
                  <PlusCircle className="h-5 w-5 text-blue-800" />
                  <span className="font-medium text-slate-800">Schedule Appointment</span>
                </button>
                <button 
                  onClick={() => navigate('/CounselorDashboard/recommendations?action=create')}
                  className="w-full flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all">
                  <Lightbulb className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-slate-800">Create Recommendation</span>
                </button>
                <button 
                  onClick={() => navigate('/CounselorDashboard/reports')}
                  className="w-full flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-slate-800">Generate Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">Recent Activities</h3>
          <p className="text-slate-600 text-sm mt-1">Latest interactions and updates</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'session' ? 'bg-blue-100' :
                    activity.type === 'recommendation' ? 'bg-green-100' :
                    activity.type === 'appointment' ? 'bg-purple-100' :
                    'bg-red-100'
                  }`}>
                    {activity.type === 'session' && <UserCheck className="h-4 w-4 text-blue-600" />}
                    {activity.type === 'recommendation' && <Lightbulb className="h-4 w-4 text-green-600" />}
                    {activity.type === 'appointment' && <Calendar className="h-4 w-4 text-purple-600" />}
                    {activity.type === 'alert' && <AlertCircle className="h-4 w-4 text-red-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{activity.student}</p>
                    <p className="text-sm text-slate-600">{activity.action}</p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    activity.outcome === 'Positive' ? 'bg-green-100 text-green-700' :
                    activity.outcome === 'Delivered' ? 'bg-blue-100 text-blue-700' :
                    activity.outcome === 'Confirmed' ? 'bg-purple-100 text-purple-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {activity.outcome}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-500 text-sm">No recent activities.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselorDashboardHomePage;