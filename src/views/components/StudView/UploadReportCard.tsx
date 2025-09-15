import React, { useState, ChangeEvent } from "react";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom"; // For "Take Aptitude Test" button

// Import Services
import FileService from "../../../../services/file"; // Adjust path as needed
// import AssessmentService from "../../../../services/assessments"; // If directly starting aptitude test from here

interface UploadReportCardProps {
  userId: string; // The ID of the student uploading the report
  onUploadSuccess?: () => void; // Optional callback to notify parent
}

const UploadReportCard: React.FC<UploadReportCardProps> = ({ userId, onUploadSuccess }) => {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);

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
    if (!userId) {
        setUploadError("User ID not available. Cannot upload file.");
        return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccessMsg(null);

    try {
      // Use the student-specific report card upload endpoint
      await FileService.uploadReportCard(uploadedFile, userId);
      setUploadSuccessMsg("Report card uploaded successfully!");
      setUploadedFile(null); // Clear selected file after successful upload
      if (onUploadSuccess) {
        onUploadSuccess(); // Notify parent component (e.g., to re-fetch dashboard stats)
      }
    } catch (err: any) {
      console.error("Error uploading report card:", err);
      setUploadError("Failed to upload report card: " + (err.response?.data?.msg || err.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <div className="text-center">
          <Upload className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Upload Academic Records</h2>
          <p className="text-slate-600 mb-8">Upload your transcripts, report cards, and certificates for comprehensive analysis</p>

          <div className="relative border-2 border-dashed border-blue-300 rounded-xl p-12 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
            <input
              type="file"
              accept="application/pdf,image/*" // Accept PDF and images
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" // Make input cover the div
              disabled={uploading}
            />
            <div className="flex flex-col items-center pointer-events-none"> {/* Prevent clicks on children */}
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
            disabled={!uploadedFile || uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Report'}
          </button>
          
          <div className="mt-6">
            <button
                onClick={() => navigate('/assessments')} // Redirect to a general assessments page or directly to an aptitude test
                className="w-full rounded-md bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
                disabled={uploading}
            >
              Take Aptitude Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadReportCard;