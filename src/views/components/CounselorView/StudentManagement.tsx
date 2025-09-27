import React, { useState, useEffect } from "react";
import {
  Users, Filter, PlusCircle, Eye, MessageCircle, CalendarPlus,
  MoreVertical, TrendingUp, TrendingDown, Loader2, Star, BookOpen,
  Target, Zap, Clock, CheckCircle, Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCounselorDashboard } from './CounselorDashboardLayout';
import CounselorService from "../../../services/counselor";
import Swal from "sweetalert2"; // For user feedback
import StudentService from "../../../services/student";

interface Student {
  id: string;
  name: string;
  email: string;
  grade: string;
  gpa: number;
  riskLevel: "Low" | "Medium" | "High";
  lastSession: string;
  status: string;
  avatar: string;
  student_id: string;
  total_confirmed_appointments: number;
  latest_appointment_date?: string;
  latest_appointment_type?: string;
  all_appointments?: Array<{
    appointment_id: string;
    date: string;
    time: string;
    type: string;
    duration_minutes: number;
  }>;
}

interface Recommendation {
  id: string;
  type: string;
  match_score: number;
  summary: string;
  status: string;
  generated_by: string;
  recommended_courses: Array<{
    _id?: string;
    name: string;
    description?: string;
    category?: string;
  }>;
  suggested_skills: Array<{
    _id?: string;
    name: string;
    level?: string;
    category?: string;
  }>;
  created_at: string;
}

const CounselorStudentManagement: React.FC = () => {
  const navigate = useNavigate();
  const { counselorProfile } = useCounselorDashboard();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  const fetchConfirmedStudents = async () => {
    if (!counselorProfile?.id) {
      setError("Counselor profile not loaded. Cannot fetch students.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await CounselorService.getConfirmedStudents();
      console.log("response", response.data)
      const fetchedStudents: Student[] = response.data.students.map((s: any) => ({
        id: s.student_id,
        student_id: s.student_id,
        name: s.student_info?.first_name || 'Unknown Student',
        email: s.student_info?.email || 'No email',
        grade: s.student_info?.grade_level || 'N/A',
        gpa: s.student_info?.gpa || 0.0,
        riskLevel: calculateRiskLevel(s.student_info),
        lastSession: s.latest_appointment_date ?
          new Date(s.latest_appointment_date).toLocaleDateString() : 'No sessions',
        status: 'Confirmed',
        avatar: generateAvatar(s.student_info?.name || 'Unknown'),
        total_confirmed_appointments: s.total_confirmed_appointments || 0,
        latest_appointment_date: s.latest_appointment_date,
        latest_appointment_type: s.latest_appointment_type,
        all_appointments: s.all_appointments || []
      }));

      setStudents(fetchedStudents);
    } catch (err: any) {
      console.error("Error fetching confirmed students:", err);
      setError(err.response?.data?.msg || "Failed to load students.");
    } finally {
      setLoading(false);
    }
  };

  const calculateRiskLevel = (studentInfo: any): "Low" | "Medium" | "High" => {
    if (!studentInfo) return 'Low';

    // Simple risk calculation based on GPA and other factors
    const gpa = studentInfo.gpa || 0;
    if (gpa < 2.0) return 'High';
    if (gpa < 3.0) return 'Medium';
    return 'Low';
  };

  const generateAvatar = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const fetchStudentRecommendations = async (studentId: string) => {
    if (!studentId) return;

    setLoadingRecommendations(true);
    try {
      // Assuming you have a service method to get recommendations
      const response = await StudentService.getStudentRecommendations(studentId);
      setRecommendations(response.data.recommendations || []);
      setShowRecommendations(true);
    } catch (err: any) {
      console.error("Error fetching recommendations:", err);
      setRecommendations([]);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const handleViewRecommendations = (student: Student) => {
    setSelectedStudent(student);
    fetchStudentRecommendations(student.student_id);
  };

  const handleScheduleAppointment = (student: Student) => {
    navigate(`/CounselorDashboard/appointment?studentId=${student.student_id}`);
  };

  const handleViewProfile = (student: Student) => {
    Swal.fire({
      icon: 'success',
      title: 'Not Implemented',
      text: `This Function is not yet Implemented`,
      timer: 2000,
      showConfirmButton: false
    });
    // navigate(`/CounselorDashboard/student/${student.student_id}`);
  };

  const handleMessageStudent = (student: Student) => {
    navigate(`/CounselorDashboard/conversation?studentId=${student.student_id}`);
  };

  useEffect(() => {
    fetchConfirmedStudents();
  }, [counselorProfile?.id, filter]);

  // Filter students based on risk level filter
  const filteredStudents = students.filter(student =>
    filter ? student.riskLevel === filter : true
  );

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4" />
        <p className="text-lg text-slate-700">Loading students...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-red-600">Error: {error}</p>
        <button onClick={fetchConfirmedStudents} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      {/* Recommendations Modal */}
      {showRecommendations && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    AI Recommendations for {selectedStudent?.name}
                  </h3>
                  <p className="text-slate-600">Personalized suggestions based on student profile</p>
                </div>
                <button
                  onClick={() => setShowRecommendations(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {loadingRecommendations ? (
                <div className="text-center py-8">
                  <Loader2 className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4" />
                  <p>Loading recommendations...</p>
                </div>
              ) : recommendations.length > 0 ? (
                <div className="space-y-6">
                  {recommendations.map((rec) => (
                    <div key={rec.id} className="border border-slate-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Zap className="h-5 w-5 text-yellow-500" />
                          <span className="font-semibold text-slate-800 capitalize">{rec.type} Recommendations</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${rec.status === 'Applied' ? 'bg-green-100 text-green-700' :
                              rec.status === 'Reviewed' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                            {rec.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium">{rec.match_score}% Match</span>
                        </div>
                      </div>

                      <p className="text-slate-700 mb-4">{rec.summary}</p>

                      {rec.recommended_courses.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Recommended Courses
                          </h4>
                          <div className="grid gap-2">
                            {rec.recommended_courses.map((course, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                                <span className="font-medium">{course.name}</span>
                                {course.category && (
                                  <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded">
                                    {course.category}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {rec.suggested_skills.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Suggested Skills
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {rec.suggested_skills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full flex items-center gap-1"
                              >
                                {skill.name}
                                {skill.level && (
                                  <span className="text-xs opacity-75">({skill.level})</span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-500">
                        Generated by {rec.generated_by} • {new Date(rec.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Zap className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No recommendations available for this student.</p>
                  <p className="text-slate-400 text-sm mt-1">
                    AI recommendations will be generated based on student progress and sessions.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Student Management</h2>
          <p className="text-slate-600 mt-1">
            {filteredStudents.length} students with confirmed appointments
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Students</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>
          </div>
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
                  <th className="text-left py-4 px-2 font-semibold text-slate-700">Sessions</th>
                  <th className="text-left py-4 px-2 font-semibold text-slate-700">Last Session</th>
                  <th className="text-left py-4 px-2 font-semibold text-slate-700">Status</th>
                  <th className="text-left py-4 px-2 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">{student.avatar}</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{student.name}</p>
                            <p className="text-sm text-slate-600">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <span className="font-medium text-slate-700">{student.grade}</span>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-700">{student.gpa.toFixed(2)}</span>
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
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${student.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                            student.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                          }`}>
                          {student.riskLevel}
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="font-medium text-slate-700">
                            {student.total_confirmed_appointments}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-600">{student.lastSession}</span>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${student.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewRecommendations(student)}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                            title="View AI Recommendations"
                          >
                            <Zap className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleViewProfile(student)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Profile"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleMessageStudent(student)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Message Student"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleScheduleAppointment(student)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Schedule Appointment"
                          >
                            <CalendarPlus className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-slate-500">
                      {filter ? `No ${filter.toLowerCase()} risk students found` : 'No students with confirmed appointments'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselorStudentManagement;