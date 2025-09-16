import React, { useState, useEffect, useCallback } from "react";
import { Calendar, Clock, MessageCircle, CheckCircle, MoreVertical, Loader2, CalendarPlus, Bell, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCounselorDashboard } from './CounselorDashboardLayout'; // To access counselorProfile

import CounselorService from "../../../services/counselor";
import Swal from "sweetalert2"; // For user feedback

interface Appointment {
  id: string;
  student: Object | any; // Student's name (derived on backend or fetched here)
  time: string; // "Today, 2:00 PM"
  type: string; // "Career Planning"
  duration: string; // "45 min"
  priority: "high" | "medium" | "low";
  status: "pending" | "confirmed" | "completed" | "cancelled";
  // Add backend `date` field for sorting/filtering
  date: string; // ISO date string from backend
  student_id: string; // Original student ID from backend
  duration_minutes: any;
}

const CounselorAppointmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { counselorProfile } = useCounselorDashboard();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>(''); // Filter by status
  const [quickStats, setQuickStats] = useState<any>(null);


  const fetchAppointments = useCallback(async () => {
    if (!counselorProfile || !counselorProfile.id) {
      setError("Counselor profile not loaded. Cannot fetch appointments.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await CounselorService.getAppointments({ status: filterStatus });
      // Map backend data to frontend Appointment interface
      console.log(response.data)
      const fetchedAppointments: Appointment[] = response.data.map((app: any) => ({
        id: app.id,
        student: app?.student || 'Unknown Student', // Backend should ideally provide student name or fetch in loop
        time: `${new Date(app.date).toLocaleDateString()} ${app.time}`, // Combine date and time
        type: app.type,
        duration_minutes: app.duration_minutes,
        priority: app.priority,
        status: app.status,
        date: app.date, // Keep original date for sorting
        student_id: app?.student?.student_id,
      }));
      setAppointments(fetchedAppointments);
    } catch (err: any) {
      console.error("Error fetching appointments:", err);
      setError(err.response?.data?.msg || "Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  }, [counselorProfile?.id, filterStatus]); // Re-fetch on profile or filter changes

  const fetchQuickStats = async () => {
    if (!counselorProfile || !counselorProfile.id) return;
    try {
      const response = await CounselorService.getQuickStats();
      setQuickStats(response.data);
    } catch (err) {
      console.error("Error fetching quick stats:", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchQuickStats();
  }, [fetchAppointments, counselorProfile?.id]); // Add fetchAppointments to deps as it's useCallback

  const handleUpdateStatus = async (appointmentId: string, newStatus: string) => {
    try {
      // Show confirmation for cancellation
      if (newStatus === 'cancelled') {
        const result = await Swal.fire({
          title: 'Are you sure?',
          text: "This appointment will be cancelled.",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, cancel it!'
        });

        if (!result.isConfirmed) {
          return;
        }
      }

      const response = await CounselorService.updateAppointmentStatus(appointmentId, newStatus);

      Swal.fire({
        icon: 'success',
        title: 'Status Updated',
        text: `Appointment has been ${newStatus}`,
        timer: 2000,
        showConfirmButton: false
      });

      // Refresh appointments list
      fetchAppointments();

    } catch (error) {
      console.error('Error updating appointment status:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error?.response?.data?.msg || 'Failed to update appointment status'
      });
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4" />
        <p className="text-lg text-slate-700">Loading appointments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-red-600">Error: {error}</p>
        <button onClick={fetchAppointments} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Appointment Management</h2>
          <p className="text-slate-600 mt-1">Schedule and track counseling sessions</p>
        </div>
        <button
          onClick={() => navigate('/CounselorDashboard/appointment/schedule')} // Hypothetical route for a dedicated schedule form
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <CalendarPlus className="h-4 w-4" />
          Schedule New Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-1">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">Your Appointments</h3>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <p className="text-slate-600 text-sm mt-1">Upcoming and past appointments</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg">
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-bold text-blue-600">
                          {new Date(appointment.date).toLocaleDateString('en-US', { day: 'numeric' })}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-800">{appointment.student?.student_name || 'Unknown Student'}</h4>
                        <p className="text-sm text-slate-600">{appointment.type} at {appointment.time.split(' ')[0]}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-slate-500">Duration: {appointment.duration_minutes} min</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              appointment.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                'bg-blue-100 text-blue-700'
                            }`}>
                            {appointment.status}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${appointment.priority === 'high' ? 'bg-red-100 text-red-700' :
                            appointment.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                            {appointment.priority}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/CounselorDashboard/conversation?studentId=${appointment.student?.student_id || ''}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Message Student"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </button>

                        {appointment.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(appointment.id, 'confirmed')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Confirm Appointment"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(appointment.id, 'cancelled')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Cancel Appointment"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}

                        {appointment.status === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(appointment.id, 'cancelled')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Cancel Appointment"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}

                        <button className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-500">No appointments found with current filters.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800">Quick Stats</h3>
            </div>
            <div className="p-6">
              {quickStats ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Today's Sessions</span>
                    <span className="font-bold text-blue-600">{quickStats.today_sessions || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">This Week</span>
                    <span className="font-bold text-green-600">{quickStats.this_week_sessions || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Completion Rate</span>
                    <span className="font-bold text-purple-600">{quickStats.completion_rate || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Avg Duration</span>
                    <span className="font-bold text-orange-600">{quickStats.avg_duration || 0} min</span>
                  </div>
                </div>
              ) : (
                <p className="text-center text-slate-500 text-sm">Loading quick stats...</p>
              )}
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
        </div> */}
      </div>
    </div>
  );
};

export default CounselorAppointmentsPage;