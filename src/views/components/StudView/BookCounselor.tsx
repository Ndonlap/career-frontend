import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

// Import Services
import StudentService from "../../../services/student";
import AuthService from "../../../services/auth";
import CounselorService from "../../../services/counselor"; // Using the updated service

interface FormData {
  counselor_id: string;
  fullName: string;
  email: string;
  date: string;
  time: string;
  notes: string;
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
    fullName: "",
    email: "",
    date: "",
    time: "",
    notes: "",
  });

  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [loadingCounselors, setLoadingCounselors] = useState(true);
  const [counselorsError, setCounselorsError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // --- Effect 1: Fetch Current User Profile and Pre-fill Form ---
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await AuthService.getProfile();
        const userProfile = response.data;
        setForm((prev) => ({
          ...prev,
          fullName: `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim(),
          email: userProfile.email || '',
        }));
      } catch (err: any) {
        console.error("Error fetching user profile for booking:", err);
        Swal.fire({
          icon: "error",
          title: "Profile Load Failed",
          text: err.response?.data?.msg || "Could not load your profile details automatically.",
        });
        // Redirect to login if token is expired or invalid
        if (err.response?.status === 401 || err.response?.status === 403) {
            AuthService.clearTokens();
            navigate('/login');
        }
      }
    };

    if (AuthService.getAccessToken()) {
      fetchUserProfile();
    } else {
      Swal.fire({
        icon: "info",
        title: "Login Required",
        text: "Please log in to book a counseling session.",
      }).then(() => navigate('/login'));
    }
  }, [navigate]);

  // --- Effect 2: Fetch Available Counselors (USING NEW SERVICE) ---
  useEffect(() => {
    const fetchCounselors = async () => {
      setLoadingCounselors(true);
      setCounselorsError(null);
      try {
        // Use the new dedicated endpoint
        const response = await CounselorService.getAvailableCounselors();
        const availableCounselors = response.data;
        
        setCounselors(availableCounselors);
        if (availableCounselors.length > 0) {
            setForm(prev => ({ ...prev, counselor_id: availableCounselors[0].id })); // Auto-select first counselor
        }
      } catch (err: any) {
        console.error("Error fetching counselors:", err);
        setCounselorsError(err.response?.data?.msg || "Failed to load counselors.");
        Swal.fire({
            icon: "error",
            title: "Counselors Load Failed",
            text: "Could not load available counselors.",
          });
          // Also redirect if access token is invalid for fetching counselors
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
    }
  }, [navigate]); // Run once on mount

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBookingError(null);
    setBookingLoading(true);

    const { counselor_id, date, time, notes } = form;

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
      const response = await StudentService.bookCounselingSession({
        counselor_id: counselor_id,
        date: date,
        time: time,
        notes: notes,
      });

      Swal.fire({
        icon: "success",
        title: "Booking Successful",
        text: response.data.msg || "Your session has been requested!",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        navigate('/StudentDashboard'); // Redirect to dashboard or a booking confirmation page
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
          {/* Full Name (pre-filled, read-only) */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={form.fullName}
              readOnly
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-sm shadow-sm focus:outline-none"
            />
          </div>

          {/* Email (pre-filled, read-only) */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              readOnly
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-sm shadow-sm focus:outline-none"
            />
          </div>

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
              min={new Date().toISOString().split('T')[0]} // Prevent selecting past dates
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