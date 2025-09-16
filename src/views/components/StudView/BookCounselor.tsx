import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

// Import Services
import StudentService from "../../../services/student";
import AuthService from "../../../services/auth";
import CounselorService from "../../../services/counselor";

interface FormData {
  counselor_id: string;
  date: string;
  time: string;
  notes: string;
  duration_minutes?: number;
  type?: string;
}

interface Counselor {
  id: string;
  first_name: string;
  last_name: string;
  specialization?: string[];
}

const BookCounselor: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>({
    counselor_id: "",
    date: "",
    time: "",
    notes: "",
    duration_minutes: 45, // Default value matching backend
    type: "General Counseling", // Default value matching backend
  });

  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [loadingCounselors, setLoadingCounselors] = useState(true);
  const [counselorsError, setCounselorsError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // --- Effect: Fetch Available Counselors ---
  useEffect(() => {
    const fetchCounselors = async () => {
      setLoadingCounselors(true);
      setCounselorsError(null);
      try {
        const response = await CounselorService.getAvailableCounselors();
        const availableCounselors = response.data;
        
        setCounselors(availableCounselors);
        if (availableCounselors.length > 0) {
            setForm(prev => ({ ...prev, counselor_id: availableCounselors[0].id }));
        }
      } catch (err: any) {
        console.error("Error fetching counselors:", err);
        setCounselorsError(err.response?.data?.msg || "Failed to load counselors.");
        Swal.fire({
            icon: "error",
            title: "Counselors Load Failed",
            text: "Could not load available counselors.",
          });
        if (err.response?.status === 401 || err.response?.status === 403) {
            AuthService.clearTokens();
            navigate('/login');
        }
      } finally {
        setLoadingCounselors(false);
      }
    };

    if (AuthService.getAccessToken()) {
        fetchCounselors();
    } else {
      Swal.fire({
        icon: "info",
        title: "Login Required",
        text: "Please log in to book a counseling session.",
      }).then(() => navigate('/login'));
    }
  }, [navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ 
      ...prev, 
      [name]: name === 'duration_minutes' ? parseInt(value) : value 
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBookingError(null);
    setBookingLoading(true);

    const { counselor_id, date, time } = form;

    if (!counselor_id || !date || !time) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please select a counselor, date, and time.",
      });
      setBookingLoading(false);
      return;
    }

    try {
      // Send only the fields that the backend expects
      const bookingData = {
        counselor_id: counselor_id,
        date: date,
        time: time,
        notes: form.notes,
        duration_minutes: form.duration_minutes,
        type: form.type
      };

      const response = await StudentService.bookCounselingSession(bookingData);

      Swal.fire({
        icon: "success",
        title: "Booking Successful",
        text: response.data.msg || "Your session has been requested!",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        navigate('/StudentDashboard');
      });

    } catch (error: any) {
      console.error("Booking error:", error);
      const errorMessage = error.response?.data?.msg || error.message || "Failed to book session. Please try again.";
      setBookingError(errorMessage);
      Swal.fire({
        icon: "error",
        title: "Booking Failed",
        text: errorMessage,
      });
    } finally {
      setBookingLoading(false);
    }
  };

  // Duration options
  const durationOptions = [30, 45, 60, 90];
  // Appointment type options
  const typeOptions = [
    "General Counseling",
    "Academic Guidance",
    "Career Counseling",
    "Personal Issues",
    "Crisis Intervention",
    "Other"
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-yellow-300 p-8">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Book a Counseling Session
        </h2>
        <p className="text-center text-gray-500 mt-1 text-sm">
          Discover the right guidance tailored for you.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Counselor Selection */}
          <div>
            <label htmlFor="counselor_id" className="block text-sm font-medium text-gray-700">Select Counselor</label>
            {loadingCounselors ? (
              <p className="text-sm text-gray-500">Loading counselors...</p>
            ) : counselorsError ? (
              <p className="text-sm text-red-600">{counselorsError}</p>
            ) : counselors.length > 0 ? (
              <select
                id="counselor_id"
                name="counselor_id"
                value={form.counselor_id}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              >
                {counselors.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.first_name} {c.last_name} {c.specialization && c.specialization.length > 0 && `(${c.specialization.join(', ')})`}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-gray-500">No counselors available for booking.</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <input
              id="date"
              name="date"
              type="date"
              required
              value={form.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Time */}
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
            <input
              id="time"
              name="time"
              type="time"
              required
              value={form.time}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Duration Selection */}
          <div>
            <label htmlFor="duration_minutes" className="block text-sm font-medium text-gray-700">Session Duration (minutes)</label>
            <select
              id="duration_minutes"
              name="duration_minutes"
              value={form.duration_minutes}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {durationOptions.map((duration) => (
                <option key={duration} value={duration}>
                  {duration} minutes
                </option>
              ))}
            </select>
          </div>

          {/* Appointment Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Appointment Type</label>
            <select
              id="type"
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {typeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              placeholder="What do you wish to discuss?"
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {bookingError && <p className="text-red-600 text-center text-sm">{bookingError}</p>}

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-md bg-gradient-to-r from-yellow-400 to-orange-500 py-3 text-white font-semibold shadow hover:opacity-90 transition"
            disabled={bookingLoading || loadingCounselors || counselors.length === 0}
          >
            {bookingLoading ? 'Confirming...' : 'Confirm Booking →'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookCounselor;