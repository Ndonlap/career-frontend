import React, { useState, useEffect } from "react";
import { FileText, CheckCircle, XCircle, Clock, Eye, Download, Loader2, Filter, BarChart3 } from "lucide-react";
import { useAdminDashboard } from './AdminDashboardLayout';
import AdminService from "../../../services/admin";
import Swal from "sweetalert2";

interface AcademicRecord {
  _id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  term: string;
  year: number;
  average_score: number;
  subjects: any[];
  uploaded_report_card: {
    filename: string;
    path: string;
  };
  validation_status: "pending" | "validated" | "rejected";
  validation_notes: string;
  validated_by: string;
  validated_at: string;
  created_at: string;
  updated_at: string;
}

const AcademicRecordManagement: React.FC = () => {
  const { fetchDashboardData } = useAdminDashboard();
  const [records, setRecords] = useState<AcademicRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('pending');
  const [stats, setStats] = useState<any>(null);
  const [showStats, setShowStats] = useState(false);

  const fetchAcademicRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await AdminService.getAllAcademicRecords({ status: filterStatus });
      const fetchedRecords: AcademicRecord[] = response.data;
      setRecords(fetchedRecords);
    } catch (err: any) {
      console.error("Error fetching academic records:", err);
      setError(err.response?.data?.msg || "Failed to load academic records.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await AdminService.getAcademicRecordsStats();
      setStats(response.data);
    } catch (err: any) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    fetchAcademicRecords();
    fetchStats();
  }, [filterStatus]);

  const handleValidateRecord = async (recordId: string) => {
    Swal.fire({
      title: "Validate Record",
      text: "Are you sure you want to validate this academic record?",
      icon: "question",
      input: 'textarea',
      inputPlaceholder: 'Add validation notes (optional)',
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, validate!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await AdminService.validateRecord(recordId, result.value || '');
          Swal.fire("Success!", "Record validated successfully.", "success");
          fetchAcademicRecords();
          fetchStats();
          fetchDashboardData();
        } catch (err: any) {
          Swal.fire("Error!", err.response?.data?.msg || "Failed to validate record.", "error");
        }
      }
    });
  };

  const handleRejectRecord = async (recordId: string) => {
    Swal.fire({
      title: "Reject Record",
      text: "Are you sure you want to reject this academic record?",
      icon: "warning",
      input: 'textarea',
      inputPlaceholder: 'Enter rejection reason (required)',
      inputValidator: (value) => {
        if (!value) {
          return 'Rejection reason is required!';
        }
        return null;
      },
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, reject!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await AdminService.rejectRecord(recordId, result.value);
          Swal.fire("Success!", "Record rejected successfully.", "success");
          fetchAcademicRecords();
          fetchStats();
          fetchDashboardData();
        } catch (err: any) {
          Swal.fire("Error!", err.response?.data?.msg || "Failed to reject record.", "error");
        }
      }
    });
  };

  const handleDownloadReport = async (recordId: string) => {
    try {
      const response = await AdminService.downloadReportCard(recordId);
      
      // Create a blob from the response
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      
      // Find the filename from content-disposition header or use record ID
      const contentDisposition = response.headers['content-disposition'];
      let filename = `report_${recordId}.pdf`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      
      // Create download link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (err: any) {
      Swal.fire("Error!", err.response?.data?.msg || "Failed to download report.", "error");
    }
  };

  const handleDeleteRecord = async (recordId: string, studentName: string) => {
    Swal.fire({
      title: `Delete Record for ${studentName}?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await AdminService.deleteAcademicRecord(recordId);
          Swal.fire("Deleted!", "Academic record has been deleted.", "success");
          fetchAcademicRecords();
          fetchStats();
          fetchDashboardData();
        } catch (err: any) {
          Swal.fire("Error!", err.response?.data?.msg || "Failed to delete record.", "error");
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4" />
        <p className="text-lg text-slate-700">Loading academic records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-red-600">Error: {error}</p>
        <button onClick={fetchAcademicRecords} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Academic Record Management</h2>
          <p className="text-slate-600 mt-1">Review and validate uploaded student academic records</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Records</option>
              <option value="pending">Pending Review</option>
              <option value="validated">Validated</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <button
            onClick={() => setShowStats(!showStats)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <BarChart3 className="h-4 w-4" />
            {showStats ? 'Hide Stats' : 'Show Stats'}
          </button>
        </div>
      </div>

      {/* Statistics Panel */}
      {showStats && stats && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100">
          <h3 className="text-xl font-semibold mb-4">Academic Records Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.total_records}</div>
              <div className="text-sm text-blue-800">Total Records</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{stats.by_status?.pending || 0}</div>
              <div className="text-sm text-yellow-800">Pending Review</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.by_status?.validated || 0}</div>
              <div className="text-sm text-green-800">Validated</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.by_status?.rejected || 0}</div>
              <div className="text-sm text-red-800">Rejected</div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-4 px-4 font-semibold text-slate-700">Student</th>
                  <th className="text-left py-4 px-4 font-semibold text-slate-700">Term/Year</th>
                  <th className="text-left py-4 px-4 font-semibold text-slate-700">Average Score</th>
                  <th className="text-left py-4 px-4 font-semibold text-slate-700">Status</th>
                  <th className="text-left py-4 px-4 font-semibold text-slate-700">Uploaded</th>
                  <th className="text-left py-4 px-4 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.length > 0 ? (
                  records.map((record) => (
                    <tr key={record._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4">
                        <span className="font-medium text-slate-800 block">{record.student_name}</span>
                        <span className="text-sm text-slate-600">{record.student_email}</span>
                      </td>
                      <td className="py-4 px-4 text-slate-700">
                        {record.term} {record.year}
                      </td>
                      <td className="py-4 px-4 text-slate-700 font-medium">
                        {record.average_score?.toFixed(2) || 'N/A'}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          record.validation_status === 'validated' ? 'bg-green-100 text-green-700' :
                          record.validation_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {record.validation_status}
                        </span>
                        {record.validation_notes && (
                          <p className="text-xs text-slate-500 mt-1">{record.validation_notes}</p>
                        )}
                      </td>
                      <td className="py-4 px-4 text-slate-600">
                        {new Date(record.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDownloadReport(record._id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Download Report"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          
                          {record.validation_status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleValidateRecord(record._id)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Validate Record"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleRejectRecord(record._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Reject Record"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          
                          <button
                            onClick={() => handleDeleteRecord(record._id, record.student_name)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Record"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500">
                      No academic records found with current filters.
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

export default AcademicRecordManagement;