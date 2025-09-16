import React, { useState, useEffect, ChangeEvent, useCallback } from "react";
import { Upload, FileText, CheckCircle, Clock, XCircle, Loader2 } from "lucide-react"; // Added Loader2 for loading spinner
import { useNavigate } from "react-router-dom";

// Import Services
import FileService from "../../../services/file";
import StudentService from "../../../services/student"; // To fetch academic records
import AuthService from "../../../services/auth"; // To get userId internally

// Removed UploadReportCardProps interface as userId and onUploadSuccess are no longer props
// interface UploadReportCardProps {
//   userId: string;
//   onUploadSuccess?: () => void;
// }

// Changed to a simple functional component without props
const UploadReportCard: React.FC = () => {
  const navigate = useNavigate();

  // Internal states for this component
  const [currentUserId, setCurrentUserId] = useState<string | null>(null); // Fetched internally
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);

  const [academicRecords, setAcademicRecords] = useState<any[]>([]);
  const [fetchingRecords, setFetchingRecords] = useState(true);
  const [recordsError, setRecordsError] = useState<string | null>(null);

  // --- Internal function to fetch academic records ---
  const fetchAcademicRecords = useCallback(async (userId: string) => {
    setFetchingRecords(true);
    setRecordsError(null);
    try {
      const response = await StudentService.getAcademicRecords();
      setAcademicRecords(response.data);
    } catch (err: any) {
      console.error("Error fetching academic records:", err);
      setRecordsError(err.response?.data?.msg || "Failed to fetch academic records.");
    } finally {
      setFetchingRecords(false);
    }
  }, []); // useCallback memoizes this function, good for useEffect dependencies

  // --- Effect to get userId and then fetch records ---
  useEffect(() => {
    const initializeComponent = async () => {
      try {
        const profileResponse = await AuthService.getProfile(); // Get current user's profile
        const userIdFromProfile = profileResponse.data.id;
        setCurrentUserId(userIdFromProfile);
        
        // Now fetch academic records using the obtained userId
        if (userIdFromProfile) {
          fetchAcademicRecords(userIdFromProfile);
        } else {
          setRecordsError("User ID could not be retrieved. Please log in.");
          setFetchingRecords(false);
        }
      } catch (err: any) {
        console.error("Error getting user profile in UploadReportCard:", err);
        setRecordsError(err.response?.data?.msg || "Failed to get user profile. Please log in.");
        setFetchingRecords(false);
        // If authentication fails here, the api.js interceptor should redirect
        // to login, so explicit navigate here might be redundant but safe as a fallback.
        if (err.response?.status === 401 || err.response?.status === 403) {
            navigate('/login');
        }
      }
    };

    initializeComponent();
  }, [navigate, fetchAcademicRecords]); // Dependencies: navigate and the memoized fetchAcademicRecords


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    setUploadSuccessMsg(null);
    setUploadedFile(e.target.files?.[0] || null);
  };

  const handleFileUpload = async () => {
    if (!uploadedFile) {
      setUploadError("Please select a file first.");
      return;
    }
    if (!currentUserId) { // Use the internally managed userId
        setUploadError("User ID not available. Cannot upload file.");
        return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccessMsg(null);

    try {
      await FileService.uploadReportCard(uploadedFile, currentUserId);
      setUploadSuccessMsg("Report card uploaded successfully!");
      setUploadedFile(null); // Clear selected file after successful upload
      
      // Re-fetch academic records directly from within this component
      fetchAcademicRecords(currentUserId);

    } catch (err: any) {
      console.error("Error uploading report card:", err);
      setUploadError("Failed to upload report card: " + (err.response?.data?.msg || err.message));
    } finally {
      setUploading(false);
    }
  };

  // --- Loading states for initial data fetch ---
  if (!currentUserId && fetchingRecords) { // Show initial loading until userId is confirmed
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="animate-spin mr-2 h-6 w-6 text-blue-500" />
        <p className="text-lg text-slate-700">Loading user data...</p>
      </div>
    );
  }
  // If currentUserId is null AFTER loading, it means there was an error or no user.
  if (!currentUserId && !fetchingRecords && recordsError) {
      return (
          <div className="flex items-center justify-center min-h-screen bg-slate-50">
              <p className="text-lg text-red-600">Error: {recordsError}</p>
              <button onClick={() => navigate('/login')} className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md">Log In</button>
          </div>
      );
  }


  return (
    <div className="p-8">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
        <div className="text-center">
          <Upload className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Upload Academic Records</h2>
          <p className="text-slate-600 mb-8">Upload your transcripts, report cards, and certificates for comprehensive analysis</p>

          <div className="relative border-2 border-dashed border-blue-300 rounded-xl p-12 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
            <input
              type="file"
              accept="application/pdf,image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />
            <div className="flex flex-col items-center pointer-events-none">
              <Upload className="h-12 w-12 text-blue-400 mb-4" />
              <p className="text-lg font-medium text-slate-700 mb-2">Drop your files here or click to browse</p>
              <p className="text-sm text-slate-500">Supports PDF, JPG, PNG files up to 10MB</p>
              {uploadedFile && (
                <p className="text-sm text-green-600 mt-2">✅ Selected: {uploadedFile.name}</p>
              )}
            </div>
          </div>

          {uploadError && <p className="text-red-600 mt-4 text-sm">{uploadError}</p>}
          {uploadSuccessMsg && <p className="text-green-600 mt-4 text-sm">{uploadSuccessMsg}</p>}
          
          <button
            onClick={handleFileUpload}
            className="mt-8 inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
            disabled={!uploadedFile || uploading || !currentUserId}
          >
            {uploading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" /> Uploading...
              </>
            ) : 'Upload Report'}
          </button>
        </div>
      </div>

      {/* --- Previously Uploaded Records Section --- */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mt-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <FileText className="h-7 w-7 text-gray-600" /> Previous Uploads
        </h2>
        {fetchingRecords ? (
          <p className="text-center text-slate-500 flex items-center justify-center">
            <Loader2 className="animate-spin mr-2 h-5 w-5 text-blue-500" /> Loading records...
          </p>
        ) : recordsError ? (
          <p className="text-center text-red-600">{recordsError}</p>
        ) : academicRecords.length > 0 ? (
          <div className="space-y-4">
            {academicRecords.map((record, index) => (
              <div key={record.id || index} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg shadow-sm">
                <div className="flex items-center gap-3">
                  {record.uploaded_report_card?.processed_status === 'processed' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : record.uploaded_report_card?.processed_status === 'pending' ? (
                    <Clock className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <FileText className="h-5 w-5 text-gray-500" />
                  )}
                  <div>
                    <p className="font-medium text-slate-800">{record.uploaded_report_card?.filename || `Record for ${record.term} ${record.year}`}</p>
                    <p className="text-xs text-slate-600">
                      Uploaded on: {new Date(record?.uploaded_report_card?.upload_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        record.uploaded_report_card?.processed_status === 'processed' ? 'bg-green-100 text-green-700' :
                        record.uploaded_report_card?.processed_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                    }`}>
                        {record.uploaded_report_card?.processed_status || 'Unknown Status'}
                    </span>
                    {record.uploaded_report_card?.processed_status === 'processed' && (
                        <button 
                            // onClick={() => window.open(record.uploaded_report_card.file_path, '_blank')} // Directly open the file
                            onClick={() => navigate(`/student/reports/detail/${record.id}`)} // Or navigate to a report detail page
                            className="text-blue-600 hover:text-blue-800 text-sm">
                            View
                        </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-500">No academic records uploaded yet.</p>
        )}
      </div>

      {/* --- Take Aptitude Test Button (moved outside Previous Uploads section for clarity) --- */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mt-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Take an Aptitude Test
        </h2>
        <p className="text-slate-600 mb-6">
            Explore your strengths and align them with potential career paths.
        </p>
        <button
            onClick={() => navigate('/StudentDashboard/assessments')} // Redirect to a general assessments page where available tests are listed
            className="w-full rounded-md bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
            disabled={uploading || !currentUserId}
        >
          Take Aptitude Test
        </button>
      </div>
    </div>
  );
};

export default UploadReportCard;