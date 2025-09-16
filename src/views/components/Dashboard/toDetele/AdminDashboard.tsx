import React, { useState } from "react";
import {LayoutDashboard,Users,BookOpen,Calendar,BarChart3,Settings,Search,Filter,Download,Plus,Edit,Trash2,Eye,MoreVertical,TrendingUp,TrendingDown,UserCheck,UserX,Shield,Database,Target,Briefcase,GraduationCap,MapPin,DollarSign,Activity,CheckCircle,AlertCircle,Clock,Zap,Globe,Building,Award} from "lucide-react";
import {BarChart,Bar,LineChart,Line,PieChart,Pie,Cell,XAxis,YAxis,CartesianGrid,Tooltip,Legend,ResponsiveContainer,Area,AreaChart} from "recharts";

const AdminDashboard: React.FC = () => {
  const [activePage, setActivePage] = useState<
    "dashboard" | "users" | "courses" | "careers" | "analytics" | "settings"
  >("dashboard");

  // Dashboard KPI Data
  const dashboardKPIs = {
    totalUsers: 31258,
    totalStudents: 739217,
    totalRevenue: 1004971,
    activeUsers: 28945,
    coursesOffered: 1847,
    careerPaths: 324,
    placementRate: 89.2,
    systemUptime: 99.8
  };

  // Popular Courses Data (matching the screenshot style)
  const popularCoursesData = [
    { name: "UX/UI Design", students: 4226, color: "#FF6B6B", progress: 95 },
    { name: "Android Development", students: 3845, color: "#4ECDC4", progress: 87 },
    { name: "iOS Development", students: 3501, color: "#45B7D1", progress: 82 },
    { name: "Graphic Design", students: 2431, color: "#96CEB4", progress: 68 },
    { name: "Data Science", students: 3892, color: "#FECA57", progress: 91 },
    { name: "Cybersecurity", students: 2156, color: "#FF9FF3", progress: 72 }
  ];

  // User Analytics Data
  const userGrowthData = [
    { month: "Jan", students: 25430, counselors: 245, admins: 12 },
    { month: "Feb", students: 27891, counselors: 267, admins: 13 },
    { month: "Mar", students: 30245, counselors: 289, admins: 14 },
    { month: "Apr", students: 32678, counselors: 312, admins: 15 },
    { month: "May", students: 35124, counselors: 334, admins: 16 },
    { month: "Jun", students: 37589, counselors: 356, admins: 17 }
  ];

  // System Usage Analytics
  const systemUsageData = [
    { name: "Active Sessions", value: 1784, color: "#4285F4" },
    { name: "Completed Assessments", value: 1033, color: "#34A853" },
    { name: "Generated Reports", value: 751, color: "#FBBC05" },
    { name: "Pending Reviews", value: 423, color: "#EA4335" }
  ];

  // Career Market Trends
  const careerTrendsData = [
    { field: "Technology", demand: 94, growth: 23, avgSalary: 125000 },
    { field: "Healthcare", demand: 89, growth: 18, avgSalary: 98000 },
    { field: "Finance", demand: 76, growth: 12, avgSalary: 115000 },
    { field: "Education", demand: 68, growth: 8, avgSalary: 67000 },
    { field: "Marketing", demand: 72, growth: 15, avgSalary: 78000 }
  ];

  // User Management Data
  const usersData = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      role: "Student",
      status: "Active",
      lastLogin: "2 hours ago",
      joinDate: "Jan 2024",
      avatar: "SJ"
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      email: "m.chen@example.com",
      role: "Counselor",
      status: "Active",
      lastLogin: "1 day ago",
      joinDate: "Mar 2023",
      avatar: "MC"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "e.rodriguez@example.com",
      role: "Admin",
      status: "Active",
      lastLogin: "30 min ago",
      joinDate: "Jun 2022",
      avatar: "ER"
    }
  ];

  // Course Management Data
  const coursesData = [
    {
      id: 1,
      title: "Advanced UX/UI Design",
      instructor: "Prof. Lisa Wang",
      students: 4226,
      rating: 4.8,
      status: "Active",
      category: "Design",
      duration: "12 weeks"
    },
    {
      id: 2,
      title: "Mobile App Development",
      instructor: "Dr. James Miller",
      students: 3845,
      rating: 4.6,
      status: "Active",
      category: "Development",
      duration: "16 weeks"
    }
  ];

  const renderDashboard = () => (
    <div className="space-y-8">
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
        {/* Total Teachers/Admins Card - Blue Gradient like screenshot */}
        <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-4 right-4 opacity-20">
            <Users className="h-12 w-12" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 p-1.5 bg-white/20 rounded-lg" />
              <div className="flex items-center gap-1 text-blue-100">
                <TrendingDown className="h-4 w-4" />
                <span className="text-sm">-0.4%</span>
              </div>
            </div>
            <div className="text-4xl font-bold mb-1">
              {dashboardKPIs.totalUsers.toLocaleString()}
            </div>
            <div className="text-blue-100 text-sm font-medium">
              Total Users
            </div>
          </div>
        </div>

        {/* Total Students Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-xl">
              <GraduationCap className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">1.3%</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800 mb-1">
            {dashboardKPIs.totalStudents.toLocaleString()}
          </div>
          <div className="text-slate-600 text-sm">
            Total Students
          </div>
        </div>

        {/* Total Revenue Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 rounded-xl">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">0.4%</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800 mb-1">
            ${dashboardKPIs.totalRevenue.toLocaleString()}
          </div>
          <div className="text-slate-600 text-sm">
            Total Revenue
          </div>
        </div>

        {/* System Health Card */}
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
            {dashboardKPIs.systemUptime}%
          </div>
          <div className="text-slate-600 text-sm">
            System Uptime
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Popular Courses - Matching Screenshot Style */}
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
                {popularCoursesData.map((course, index) => (
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
                          {course.students.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            backgroundColor: course.color,
                            width: `${course.progress}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
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
          {/* Reports Card - Matching Screenshot */}
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
              {/* Circular Progress - Matching Screenshot */}
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
                      strokeDasharray="75, 100"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">1784</div>
                      <div className="text-xs text-slate-500">from 1934</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Items - Matching Screenshot Style */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                    <div>
                      <div className="font-medium text-slate-800">1033</div>
                      <div className="text-sm text-slate-600">Analytical reports</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 text-sm font-medium">+115</span>
                    <button className="p-1 hover:bg-slate-200 rounded transition-colors">
                      <Eye className="h-4 w-4 text-slate-400" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-cyan-500 rounded-full"></div>
                    <div>
                      <div className="font-medium text-slate-800">751</div>
                      <div className="text-sm text-slate-600">Proposal reports</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 text-sm font-medium">+247</span>
                    <button className="p-1 hover:bg-slate-200 rounded transition-colors">
                      <Eye className="h-4 w-4 text-slate-400" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-slate-400 rounded-full"></div>
                    <div>
                      <div className="font-medium text-slate-800">1934</div>
                      <div className="text-sm text-slate-600">Undefined report</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 text-sm font-medium">+362</span>
                    <button className="p-1 hover:bg-slate-200 rounded transition-colors">
                      <Eye className="h-4 w-4 text-slate-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Last Students Activity - Matching Screenshot */}
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
                
                {[
                  { name: "Kristin Watson", subject: "UX/UI Design", date: "Jul 28, 2021", avatar: "KW" },
                  { name: "Devon Lane", subject: "iOS development", date: "Jul 22, 2021", avatar: "DL" },
                  { name: "Albert Flores", subject: "Graphic design", date: "Jul 21, 2021", avatar: "AF" }
                ].map((activity, index) => (
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
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all">
                <Plus className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-slate-800">Add New User</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all">
                <BookOpen className="h-5 w-5 text-green-600" />
                <span className="font-medium text-slate-800">Create Course</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-slate-800">Generate Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">User Management</h2>
          <p className="text-slate-600 mt-1">Manage students, counselors.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <Filter className="h-4 w-4" />
            Filter Users
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4" />
            Add User
          </button>
        </div>
      </div>

      {/* User Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">28,945</div>
          <div className="text-sm text-slate-600">Active Students</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">356</div>
          <div className="text-sm text-slate-600">Active Counselors</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">17</div>
          <div className="text-sm text-slate-600">System Admins</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <UserX className="h-5 w-5 text-red-600" />
            </div>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">142</div>
          <div className="text-sm text-slate-600">Inactive Users</div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-800">User Directory</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input 
                type="text" 
                placeholder="Search users..." 
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">User</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Role</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Last Login</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Join Date</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersData.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">{user.avatar}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{user.name}</div>
                        <div className="text-sm text-slate-600">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      user.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'Counselor' ? 'bg-green-100 text-green-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-600">{user.lastLogin}</td>
                  <td className="py-4 px-6 text-slate-600">{user.joinDate}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
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
  );

  const renderCourses = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Course Management</h2>
          <p className="text-slate-600 mt-1">Manage course catalog and educational content</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <Filter className="h-4 w-4" />
            Filter Courses
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4" />
            Add Course
          </button>
        </div>
      </div>

      {/* Course Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">1,847</div>
          <div className="text-sm text-slate-600">Total Courses</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <Users className="h-8 w-8 text-green-600" />
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">156,423</div>
          <div className="text-sm text-slate-600">Enrolled Students</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle className="h-8 w-8 text-purple-600" />
            <Clock className="h-4 w-4 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">87.3%</div>
          <div className="text-sm text-slate-600">Completion Rate</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <Award className="h-8 w-8 text-yellow-600" />
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">4.6</div>
          <div className="text-sm text-slate-600">Average Rating</div>
        </div>
      </div>

      {/* Course Categories */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-xl font-semibold text-slate-800">Course Categories Performance</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {popularCoursesData.slice(0, 3).map((course, index) => (
                <div key={index} className="p-4 border border-slate-200 rounded-xl hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-800">{course.name}</h4>
                    <span className="text-sm font-medium text-green-600">
                      {course.students.toLocaleString()} students
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
                    <div 
                      className="h-2 rounded-full"
                      style={{ 
                        backgroundColor: course.color,
                        width: `${course.progress}%`
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Progress: {course.progress}%</span>
                    <span>Rating: 4.{Math.floor(Math.random() * 3) + 5}/5</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
              {popularCoursesData.slice(3).map((course, index) => (
                <div key={index} className="p-4 border border-slate-200 rounded-xl hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-800">{course.name}</h4>
                    <span className="text-sm font-medium text-green-600">
                      {course.students.toLocaleString()} students
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
                    <div 
                      className="h-2 rounded-full"
                      style={{ 
                        backgroundColor: course.color,
                        width: `${course.progress}%`
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Progress: {course.progress}%</span>
                    <span>Rating: 4.{Math.floor(Math.random() * 3) + 5}/5</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCareers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Career Path Management</h2>
          <p className="text-slate-600 mt-1">Manage career databases and market trends</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <Download className="h-4 w-4" />
            Export Data
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4" />
            Add Career Path
          </button>
        </div>
      </div>

      {/* Career Market Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <Briefcase className="h-8 w-8 text-blue-600" />
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">324</div>
          <div className="text-sm text-slate-600">Career Paths</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <Target className="h-8 w-8 text-green-600" />
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">89.2%</div>
          <div className="text-sm text-slate-600">Placement Rate</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <DollarSign className="h-8 w-8 text-purple-600" />
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">$98k</div>
          <div className="text-sm text-slate-600">Avg Starting Salary</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <Globe className="h-8 w-8 text-yellow-600" />
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">156</div>
          <div className="text-sm text-slate-600">Industry Partners</div>
        </div>
      </div>

      {/* Career Trends Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-xl font-semibold text-slate-800">Career Market Trends</h3>
          <p className="text-slate-600 text-sm mt-1">Industry demand and growth projections</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Field</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Market Demand</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Growth Rate</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Avg Salary</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Job Openings</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {careerTrendsData.map((trend, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        trend.field === 'Technology' ? 'bg-blue-100' :
                        trend.field === 'Healthcare' ? 'bg-green-100' :
                        trend.field === 'Finance' ? 'bg-purple-100' :
                        trend.field === 'Education' ? 'bg-yellow-100' :
                        'bg-pink-100'
                      }`}>
                        {trend.field === 'Technology' && <Database className="h-5 w-5 text-blue-600" />}
                        {trend.field === 'Healthcare' && <Activity className="h-5 w-5 text-green-600" />}
                        {trend.field === 'Finance' && <DollarSign className="h-5 w-5 text-purple-600" />}
                        {trend.field === 'Education' && <GraduationCap className="h-5 w-5 text-yellow-600" />}
                        {trend.field === 'Marketing' && <Target className="h-5 w-5 text-pink-600" />}
                      </div>
                      <span className="font-semibold text-slate-800">{trend.field}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-20 bg-slate-200 rounded-full h-2">
                        <div 
                          className="h-2 bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                          style={{ width: `${trend.demand}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{trend.demand}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-green-600 font-medium">+{trend.growth}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-slate-800">
                      ${trend.avgSalary.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-slate-600">
                      {(Math.random() * 5000 + 1000).toFixed(0)} positions
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Edit className="h-4 w-4" />
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
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">System Analytics</h2>
          <p className="text-slate-600 mt-1">Platform performance and usage metrics</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <Filter className="h-4 w-4" />
            Time Period
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* System Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <Activity className="h-8 w-8 text-green-600" />
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">99.8%</div>
          <div className="text-sm text-slate-600">System Uptime</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <Zap className="h-8 w-8 text-yellow-600" />
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">1.2s</div>
          <div className="text-sm text-slate-600">Avg Response Time</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <Database className="h-8 w-8 text-blue-600" />
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">73.2%</div>
          <div className="text-sm text-slate-600">Database Usage</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <Globe className="h-8 w-8 text-purple-600" />
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">45.6k</div>
          <div className="text-sm text-slate-600">Daily Active Users</div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-xl font-semibold text-slate-800">System Usage Distribution</h3>
          </div>
          <div className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={systemUsageData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {systemUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-100">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-xl font-semibold text-slate-800">User Engagement Trends</h3>
          </div>
          <div className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="students" 
                    stackId="1" 
                    stroke="#4285F4" 
                    fill="#4285F4" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="counselors" 
                    stackId="1" 
                    stroke="#34A853" 
                    fill="#34A853" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">System Configuration</h2>
          <p className="text-slate-600 mt-1">Manage system settings and parameters</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">General Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Platform Name</label>
              <input 
                type="text" 
                value="EduAnalytics Pro" 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Max Users per Session</label>
              <input 
                type="number" 
                value="50000" 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Session Timeout (minutes)</label>
              <input 
                type="number" 
                value="30" 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Security Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Two-Factor Authentication</span>
              <button className="bg-blue-600 text-white px-4 py-1 rounded-lg text-sm">Enabled</button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Password Complexity</span>
              <button className="bg-green-600 text-white px-4 py-1 rounded-lg text-sm">High</button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Data Encryption</span>
              <button className="bg-blue-600 text-white px-4 py-1 rounded-lg text-sm">AES-256</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-['Inter',sans-serif]">
      {/* Sidebar - Matching Screenshot Style */}
      <aside className="w-64 bg-white border-r border-slate-200 shadow-lg flex flex-col">
        {/* Logo Header - Blue Gradient like screenshot */}
        <div className="h-16 flex items-center justify-center border-b border-slate-200 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">A</span>
            </div>
            <h1 className="text-xl font-bold text-white">Admin Portal</h1>
          </div>
        </div>
        
        {/* Navigation - Matching Screenshot Style */}
        <nav className="flex-1 p-4 space-y-1">
          {[
            { name: "Dashboard", icon: LayoutDashboard, page: "dashboard", active: true },
            { name: "User Management", icon: Users, page: "users" },
            { name: "Course Catalog", icon: BookOpen, page: "courses" },
            { name: "Career Database", icon: Briefcase, page: "careers" },
            { name: "System Analytics", icon: BarChart3, page: "analytics" },
            { name: "Configuration", icon: Settings, page: "settings" }
          ].map(({ name, icon: Icon, page, active }) => (
            <button
              key={name}
              onClick={() => setActivePage(page as any)}
              className={`flex items-center gap-3 p-3 rounded-lg w-full text-left transition-all ${
                activePage === page || active
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600 font-medium"
                  : "hover:bg-slate-50 text-slate-700"
              }`}
            >
              <Icon size={18} /> {name}
            </button>
          ))}
        </nav>

        {/* Admin Profile - Matching Screenshot Style */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">JA</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-800 truncate">John</div>
              <div className="text-xs text-slate-600">Admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {activePage === "dashboard" && renderDashboard()}
          {activePage === "users" && renderUsers()}
          {activePage === "courses" && renderCourses()}
          {activePage === "careers" && renderCareers()}
          {activePage === "analytics" && renderAnalytics()}
          {activePage === "settings" && renderSettings()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;