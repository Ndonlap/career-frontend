import React from "react";

type BookingForm = {
  fullName: string;
  email: string;
  date: string;
  time: string;
  notes: string;
};

interface BookCounselorProps {
  form: BookingForm;
  handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
}

const BookCounselor: React.FC<BookCounselorProps> = ({
  form,
  handleChange,
  handleSubmit,
}) => {
  return (
    <section
      id="booking"
      aria-label="Book a counselor"
      className="py-16 bg-sky-50"
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-bold text-blue-800">
              Book a Counseling Session
            </h2>
            <p className="mt-2 text-slate-600">
              Pick a date and time, add a short note, and we’ll match you with
              the right counselor.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 grid gap-4 rounded-lg border bg-white p-6 shadow-sm"
              aria-describedby="booking-help"
            >
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium">
                  Full name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={form.fullName}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Jane Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="jane@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium">
                    Date
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    required
                    value={form.date}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-medium">
                    Time
                  </label>
                  <input
                    id="time"
                    name="time"
                    type="time"
                    required
                    value={form.time}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium">
                  Notes (optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Areas you want to discuss (e.g., STEM vs. Business, scholarship options)…"
                />
              </div>

              <button
                type="submit"
                className="mt-2 inline-flex items-center justify-center rounded-md bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
              >
                Confirm Booking
              </button>

              <p id="booking-help" className="text-xs text-slate-500">
                Your information is private and used only to schedule your
                session.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookCounselor;
