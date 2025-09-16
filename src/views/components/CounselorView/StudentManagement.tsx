import React, { useState, useEffect } from "react";
import { Users, Filter, PlusCircle, Eye, MessageCircle, CalendarPlus, MoreVertical, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCounselorDashboard } from './CounselorDashboardLayout'; // To access counselorProfile

import CounselorService from "../../../services/counselor";

interface Student {
  id: string;
  name: string;
  email: string;
  grade: string;
  gpa: number;
  riskLevel: "Low" | "Medium" | "High";
  lastSession: string;
  status: string; // e.g., "Active"
  avatar: string;
  // Add other fields as needed from backend
}

const StudentManagement: React.FC = () => {
  const navigate = useNavigate();
  const { counselorProfile } = useCounselorDashboard(); // Get counselorProfile for fetching students

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>(''); // For filtering students

  const fetchStudents = async () => {
    if (!counselorProfile || !counselorProfile.id) {
        setError("Counselor profile not loaded. Cannot fetch students.");
        setLoading(false);
        return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await CounselorService.getAssignedStudents({ filter: filter }); // Pass filter to backend
      // Map backend data to frontend Student interface
      const fetchedStudents: Student[] = response.data.map((s: any) => ({
        id: s.id,
        name: `${s.first_name} ${s.last_name}`,
        email: s.email,
        grade: s.grade || 'N/A',
        gpa: s.gpa || 0.0,
        riskLevel: s.risk_level || 'Low',
        lastSession: s.last_session || 'N/A', // from backend
        status: s.status || 'Active',
        avatar: s.avatar_initials || (s.first_name?.[0] + s.last_name?.[0]).toUpperCase() || 'ST'
        // Add other fields as needed
      }));
      setStudents(fetchedStudents);
    } catch (err: any) {
      console.error("Error fetching students:", err);
      setError(err.response?.data?.msg || "Failed to load students.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [counselorProfile?.id, filter]); // Re-fetch when counselor profile or filter changes

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
        <button onClick={fetchStudents} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Student Management</h2>
          <p className="text-slate-600 mt-1">Comprehensive student profiles and tracking</p>
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
              {/* Add more filters like grade level etc. */}
            </select>
          </div>
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
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">{student.avatar}</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{student.name}</p>
                            <p className="text-sm text-slate-600">ID: {student.id.substring(0, 8)}...</p> {/* Truncate ID */}
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
                          {student.status}
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/CounselorDashboard/Student-Management/${student.id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/CounselorDashboard/conversation?studentId=${student.id}`)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <MessageCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/CounselorDashboard/appointment?action=schedule&studentId=${student.id}`)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                            <CalendarPlus className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-500">No students assigned to you yet.</td>
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

export default StudentManagement;