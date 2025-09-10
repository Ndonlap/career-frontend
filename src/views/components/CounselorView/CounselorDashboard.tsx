import React, { useState } from "react";
import {LayoutDashboard,Users,Calendar,MessageSquare,LogOut,Lightbulb,FileText,TrendingUp,TrendingDown,Clock,CheckCircle,AlertCircle,Target,Brain,Search,Filter,Download,Bell,Settings,UserCheck,BookOpen,Award,Star,ArrowUpRight,PlusCircle,Eye,Edit,MoreVertical,CalendarPlus,MessageCircle,BarChart3,PieChart,Activity,GraduationCap,HeartHandshake,Zap,ChevronRight,MapPin,Phone,Mail} from "lucide-react";
import {BarChart,Bar,LineChart,Line,PieChart as RechartsPieChart,Pie, Cell,XAxis,YAxis,CartesianGrid,Tooltip,Legend,ResponsiveContainer,Area,AreaChart
} from "recharts";

const CounselorDashboard: React.FC = () => {
  const [activePage, setActivePage] = useState<
    "dashboard" | "students" | "recommendations" | "appointments" | "messages" | "analytics"
  >("dashboard");
  const [selectedTimeframe, setSelectedTimeframe] = useState<"week" | "month" | "quarter">("month");

  // Comprehensive KPI Data
  const kpiData = {
    activeStudents: 156,
    totalSessions: 342,
    completionRate: 89.2,
    satisfactionScore: 4.7,
    pendingAppointments: 18,
    recommendationsMade: 284,
    averageSessionDuration: 45,
    careerPathsExplored: 67,
    monthlyGrowth: 12.5,
    riskStudents: 8,
    successStories: 34,
    resourcesShared: 189
  };

  // Student Performance Analytics
  const studentPerformanceData = [
    { month: "Jan", sessions: 45, satisfaction: 4.5, completion: 87 },
    { month: "Feb", sessions: 52, satisfaction: 4.6, completion: 89 },
    { month: "Mar", sessions: 48, satisfaction: 4.4, completion: 85 },
    { month: "Apr", sessions: 61, satisfaction: 4.7, completion: 92 },
    { month: "May", sessions: 58, satisfaction: 4.8, completion: 94 },
    { month: "Jun", sessions: 67, satisfaction: 4.9, completion: 96 }
  ];

  // Career Interest Distribution
  const careerInterestData = [
    { name: "STEM", value: 35, color: "#3B82F6" },
    { name: "Healthcare", value: 22, color: "#10B981" },
    { name: "Business", value: 18, color: "#F59E0B" },
    { name: "Arts & Design", value: 12, color: "#8B5CF6" },
    { name: "Education", value: 8, color: "#EF4444" },
    { name: "Other", value: 5, color: "#6B7280" }
  ];

  // Session Outcome Data
  const sessionOutcomeData = [
    { category: "Career Clarity", achieved: 78, target: 85 },
    { category: "Academic Planning", achieved: 92, target: 90 },
    { category: "Skill Development", achieved: 85, target: 88 },
    { category: "Goal Setting", achieved: 89, target: 85 },
    { category: "Decision Making", achieved: 76, target: 80 }
  ];

  // Priority Students Data
  const priorityStudents = [
    {
      id: 1,
      name: "Sarah Chen",
      grade: "12th Grade",
      riskLevel: "Medium",
      lastSession: "2 days ago",
      nextAppointment: "Dec 15, 2:00 PM",
      concerns: ["Academic Stress", "Career Uncertainty"],
      gpa: 3.2,
      attendance: 85,
      avatar: "SC"
    },
    {
      id: 2,
      name: "Marcus Johnson",
      grade: "11th Grade",
      riskLevel: "High",
      lastSession: "5 days ago",
      nextAppointment: "Dec 14, 10:00 AM",
      concerns: ["Family Issues", "College Prep"],
      gpa: 2.8,
      attendance: 78,
      avatar: "MJ"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      grade: "12th Grade",
      riskLevel: "Low",
      lastSession: "1 week ago",
      nextAppointment: "Dec 16, 3:30 PM",
      concerns: ["College Applications"],
      gpa: 3.8,
      attendance: 95,
      avatar: "ER"
    }
  ];

  // Recent Activities
  const recentActivities = [
    {
      id: 1,
      type: "session",
      student: "Alex Thompson",
      action: "Completed career assessment session",
      time: "2 hours ago",
      outcome: "Positive"
    },
    {
      id: 2,
      type: "recommendation",
      student: "Lisa Park",
      action: "Generated college recommendation list",
      time: "4 hours ago",
      outcome: "Delivered"
    },
    {
      id: 3,
      type: "appointment",
      student: "David Kim",
      action: "Scheduled follow-up appointment",
      time: "1 day ago",
      outcome: "Confirmed"
    },
    {
      id: 4,
      type: "alert",
      student: "Jordan Miller",
      action: "Flagged for academic support",
      time: "2 days ago",
      outcome: "Action Needed"
    }
  ];

  // Upcoming Appointments
  const upcomingAppointments = [
    {
      id: 1,
      student: "Hannah Wilson",
      time: "Today, 2:00 PM",
      type: "Career Planning",
      duration: "45 min",
      priority: "high",
      status: "confirmed"
    },
    {
      id: 2,
      student: "James Anderson",
      time: "Today, 4:00 PM",
      type: "Academic Review",
      duration: "30 min",
      priority: "medium",
      status: "confirmed"
    },
    {
      id: 3,
      student: "Sofia Martinez",
      time: "Tomorrow, 10:00 AM",
      type: "College Application",
      duration: "60 min",
      priority: "high",
      status: "pending"
    }
  ];

  // Achievement Metrics
  const achievementMetrics = [
    { title: "Students Graduated", count: 45, change: "+8 this month", icon: GraduationCap, color: "blue" },
    { title: "Career Matches Made", count: 127, change: "+15 this week", icon: Target, color: "green" },
    { title: "College Admissions", count: 89, change: "+12 this month", icon: Award, color: "purple" },
    { title: "Scholarships Secured", count: 34, change: "+5 this week", icon: Star, color: "yellow" }
  ];

  const renderDashboardContent = () => (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Welcome back, Dr. Sarah Mitchell
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
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
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
                <span className="text-sm">+{kpiData.monthlyGrowth}%</span>
              </div>
            </div>
          </div>
          <h4 className="text-blue-100 text-sm font-medium">Active Students</h4>
          <p className="text-3xl font-bold mb-2">{kpiData.activeStudents}</p>
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
          <p className="text-3xl font-bold mb-2">{kpiData.completionRate}%</p>
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
          <p className="text-3xl font-bold mb-2">{kpiData.satisfactionScore}/5.0</p>
          <p className="text-purple-100 text-sm">Student feedback</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-200 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Calendar className="h-6 w-6" />
            </div>
            <div className="text-right">
              <span className="text-orange-100 text-sm">This week</span>
            </div>
          </div>
          <h4 className="text-orange-100 text-sm font-medium">Pending Appointments</h4>
          <p className="text-3xl font-bold mb-2">{kpiData.pendingAppointments}</p>
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
                  <LineChart data={studentPerformanceData}>
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
                      <div className="relative h-3 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            item.achieved >= item.target 
                              ? 'bg-gradient-to-r from-green-400 to-green-600' 
                              : 'bg-gradient-to-r from-blue-400 to-blue-600'
                          }`}
                          style={{ width: `${(item.achieved / 100) * 100}%` }}
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
                      <metric.icon className={`h-6 w-6 ${
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
                      data={careerInterestData}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {careerInterestData.map((entry, index) => (
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
                <button className="text-blue-600 text-sm hover:underline">View All</button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {priorityStudents.map((student) => (
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
                      <button className="text-blue-600 text-xs hover:underline">View Profile</button>
                    </div>
                  </div>
                ))}
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
                <button className="text-blue-600 text-sm hover:underline">View Calendar</button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {upcomingAppointments.map((appointment) => (
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
                  <PlusCircle className="h-5 w-5 text-blue-800" />
                  <span className="font-medium text-slate-800">Schedule Appointment</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all">
                  <Lightbulb className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-slate-800">Create Recommendation</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all">
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
            {recentActivities.map((activity) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudentsContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Student Management</h2>
          <p className="text-slate-600 mt-1">Comprehensive student profiles and tracking</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Filter className="h-4 w-4" />
            Filter Students
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <PlusCircle className="h-4 w-4" />
            Add Student
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-4 px-2 font-semibold text-slate-700">Student</th>
                  <th className="text-left py-4 px-2 font-semibold text-slate-700">Grade</th>
                  <th className="text-left py-4 px-2 font-semibold text-slate-700">GPA</th>
                  <th className="text-left py-4 px-2 font-semibold text-slate-700">Risk Level</th>
                  <th className="text-left py-4 px-2 font-semibold text-slate-700">Last Session</th>
                  <th className="text-left py-4 px-2 font-semibold text-slate-700">Status</th>
                  <th className="text-left py-4 px-2 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {priorityStudents.map((student, index) => (
                  <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">{student.avatar}</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{student.name}</p>
                          <p className="text-sm text-slate-600">ID: {1000 + student.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <span className="font-medium text-slate-700">{student.grade}</span>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-700">{student.gpa}</span>
                        {student.gpa >= 3.5 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : student.gpa >= 3.0 ? (
                          <TrendingUp className="h-4 w-4 text-yellow-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        student.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                        student.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {student.riskLevel}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <span className="text-sm text-slate-600">{student.lastSession}</span>
                    </td>
                    <td className="py-4 px-2">
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        Active
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <MessageCircle className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                          <CalendarPlus className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRecommendationsContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">AI-Powered Recommendations</h2>
          <p className="text-slate-600 mt-1">Generate and manage personalized student guidance</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Brain className="h-4 w-4" />
          Generate New Recommendation
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { type: "Career Path", student: "Sarah Chen", status: "Generated", match: "94%" },
          { type: "College Selection", student: "Marcus Johnson", status: "In Review", match: "87%" },
          { type: "Skill Development", student: "Emily Rodriguez", status: "Approved", match: "91%" },
          { type: "Academic Planning", student: "David Kim", status: "Generated", match: "89%" },
          { type: "Internship Match", student: "Lisa Park", status: "Delivered", match: "96%" },
          { type: "Career Transition", student: "Alex Thompson", status: "In Progress", match: "85%" }
        ].map((rec, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${
                rec.type.includes('Career') ? 'bg-blue-100' :
                rec.type.includes('College') ? 'bg-green-100' :
                rec.type.includes('Skill') ? 'bg-purple-100' :
                rec.type.includes('Academic') ? 'bg-yellow-100' :
                rec.type.includes('Internship') ? 'bg-pink-100' :
                'bg-indigo-100'
              }`}>
                <Lightbulb className={`h-5 w-5 ${
                  rec.type.includes('Career') ? 'text-blue-600' :
                  rec.type.includes('College') ? 'text-green-600' :
                  rec.type.includes('Skill') ? 'text-purple-600' :
                  rec.type.includes('Academic') ? 'text-yellow-600' :
                  rec.type.includes('Internship') ? 'text-pink-600' :
                  'text-indigo-600'
                }`} />
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                rec.status === 'Generated' ? 'bg-blue-100 text-blue-700' :
                rec.status === 'In Review' ? 'bg-yellow-100 text-yellow-700' :
                rec.status === 'Approved' ? 'bg-green-100 text-green-700' :
                rec.status === 'Delivered' ? 'bg-purple-100 text-purple-700' :
                'bg-orange-100 text-orange-700'
              }`}>
                {rec.status}
              </span>
            </div>
            
            <h3 className="font-semibold text-slate-800 mb-2">{rec.type}</h3>
            <p className="text-slate-600 text-sm mb-3">For: {rec.student}</p>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-600">AI Match Score</span>
              <span className="font-bold text-green-600">{rec.match}</span>
            </div>
            
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
              <Eye className="h-4 w-4" />
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAppointmentsContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Appointment Management</h2>
          <p className="text-slate-600 mt-1">Schedule and track counseling sessions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <CalendarPlus className="h-4 w-4" />
          Schedule New Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800">Today's Schedule</h3>
              <p className="text-slate-600 text-sm mt-1">Upcoming appointments and sessions</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold text-blue-600">{appointment.time.split(',')[1]?.trim().split(' ')[0] || '2:00'}</span>
                      <span className="text-xs text-slate-500">{appointment.time.split(',')[1]?.trim().split(' ')[1] || 'PM'}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800">{appointment.student}</h4>
                      <p className="text-sm text-slate-600">{appointment.type}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-500">Duration: {appointment.duration}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          appointment.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {appointment.priority} priority
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <MessageCircle className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800">Quick Stats</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Today's Sessions</span>
                  <span className="font-bold text-blue-600">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">This Week</span>
                  <span className="font-bold text-green-600">32</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Completion Rate</span>
                  <span className="font-bold text-purple-600">94%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Avg Duration</span>
                  <span className="font-bold text-orange-600">42 min</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Calendar View</h3>
            <p className="text-slate-600 text-sm mb-4">Switch to calendar view for better scheduling</p>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
              <Calendar className="h-4 w-4" />
              Open Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMessagesContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Messages & Communication</h2>
          <p className="text-slate-600 mt-1">Stay connected with students and parents</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <MessageSquare className="h-4 w-4" />
          New Message
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="text-center py-12">
          <MessageSquare className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">Message Center</h3>
          <p className="text-slate-500 mb-6">Communication hub for students, parents, and staff</p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Start Conversation
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-['Inter',sans-serif]">
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
              <span className="text-white font-semibold text-lg">SM</span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Dr. Sarah Mitchell</h3>
              <p className="text-sm text-slate-600">Senior Academic Counselor</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-3 w-3 text-yellow-500" />
                <span className="text-xs text-slate-600">4.9 Rating</span>
              </div>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {[
            { name: "Dashboard", icon: LayoutDashboard, page: "dashboard", badge: null },
            { name: "Student Management", icon: Users, page: "students", badge: "156" },
            { name: "AI Recommendations", icon: Lightbulb, page: "recommendations", badge: "12" },
            { name: "Appointments", icon: Calendar, page: "appointments", badge: "8" },
            { name: "Messages", icon: MessageSquare, page: "messages", badge: "3" },
            { name: "Analytics", icon: BarChart3, page: "analytics", badge: null }
          ].map(({ name, icon: Icon, page, badge }) => (
            <button
              key={name}
              onClick={() => setActivePage(page as any)}
              className={`flex items-center justify-between gap-3 p-3 rounded-xl w-full text-left transition-all duration-200 ${
                activePage === page
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105"
                  : "hover:bg-slate-100 text-slate-700 hover:transform hover:scale-102"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} />
                <span className="font-medium">{name}</span>
              </div>
              {badge && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  activePage === page 
                    ? "bg-white/20 text-white"
                    : "bg-slate-200 text-slate-600"
                }`}>
                  {badge}
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
          <button className="flex items-center gap-3 p-3 rounded-xl w-full text-left hover:bg-red-50 text-red-600 font-medium transition-all">
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {activePage === "dashboard" && renderDashboardContent()}
          {activePage === "students" && renderStudentsContent()}
          {activePage === "recommendations" && renderRecommendationsContent()}
          {activePage === "appointments" && renderAppointmentsContent()}
          {activePage === "messages" && renderMessagesContent()}
          {activePage === "analytics" && renderDashboardContent()}
        </div>
      </main>
    </div>
  );
};

export default CounselorDashboard;