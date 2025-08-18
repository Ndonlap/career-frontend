import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import Logo from "../../../utils/components/other components/Logo";
import  Explore  from "../../../utils/components/other components/Explore"; // Assuming you have an Explore icon in lucide-react
import Dropdown from "../../../utils/components/other components/Dropdown";
import Studs from "../../../assets/images/studs.png"; // Assuming you have a Studs image in your assets
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js parts once (needed by react-chartjs-2)
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// TypeScript: define the shape for our booking form state
type BookingForm = {
  fullName: string;
  email: string;
  date: string;    // ISO string (yyyy-mm-dd) from <input type="date" />
  time: string;    // "HH:mm" from <input type="time" />
  notes: string;
};

const StudLanding: React.FC = () => {
  // TypeScript infers `useState<BookingForm>` from the initializer
  const [form, setForm] = useState<BookingForm>({
    fullName: "",
    email: "",
    date: "",
    time: "",
    notes: "",
  });

  // TS-safe change handler: uses `name` attribute to update corresponding field
  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Simple submit handler (replace with API call)
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    // In a real app, POST to your backend here
    alert(
      `Session requested:\nName: ${form.fullName}\nEmail: ${form.email}\nDate: ${form.date}\nTime: ${form.time}\nNotes: ${form.notes}`
    );
  };

  // Colors (white, red, blue palette)
  const brand = {
    blue: "rgb(10, 83, 173)",
    red: "rgb(220, 38, 38)",
    lightBlue: "rgb(239, 246, 255)",
  };

  // Example bar chart data: credibility section
  // (Feel free to replace with your survey/analytics)
    // Example bar chart data: colorful credibility section
  const chartData = {
    labels: [
      "Benefited from counseling",
      "Prefer AI course suggestions",
      "Prefer aptitude tests",
      "Prefer virtual sessions",
    ],
    datasets: [
      {
        label: "Student responses (%)",
        data: [68, 40, 30, 20],
        backgroundColor: [
          "rgba(138, 237, 237)",   // blue-green
          "rgba(165, 201, 242)",   // blue
          "rgba(242, 179, 179)",   // red
          "rgba(168, 217, 240)",  // purple
        ],
        borderRadius: 8, // rounded bars
      },
    ],
  };


    const chartOptions = {
    responsive: true,
    maintainAspectRatio: false as const,
    plugins: {
      legend: {
        display: false, // hide legend for a cleaner look
      },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 10, color: "#555" },
        grid: { color: "rgba(200,200,200,0.2)" },
      },
      x: {
        ticks: { color: "#555" },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* NAVBAR */}
      <header
        // className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b"
        // role="navigation"
        // aria-label="Main menu"
      >
        <div className="w-full flex items-center justify-between mx-auto max-w-7xl px-4 py-3">
          <Logo/>
          <nav className=" md:flex items-center gap-8">
            <a className="hover:underline" href="#features">
              Dashboard
            </a>
            <a className="hover:underline" href="#features">
              <Explore/>
            </a>
            <a className="hover:underline" href="#booking">
              Book a Counselor
            </a>
            <Dropdown/>
          </nav>
        </div>
      </header>
      {/* <section>
        <div className="w-[1250px] h-[100px] bg-[#F2B091] border text-[#002B5B] border-[#002B5B] rounded-md shadow-sm  ml-[140px] mr-2">
          <div className="font-semibold font-serif text-5xl px-10 py-5">Let's GO</div>
         
        </div>
      </section> */}
      {/* HERO */}
      <section
        aria-label="Hero section"
        className="relative bg-gradient-to-b from-white to-sky-50"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div>
            <img src={Studs} alt="studs"
            className="h-[250px]" />
          </div>
            <p className="mt-4 text-slate-600 text-lg">
              Personalized guidance powered by data-driven recommendations,
              interest assessments, and expert counseling.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <a
                href="#booking"
                className="rounded-md bg-blue-800 px-5 py-3 text-white font-semibold hover:bg-[#c92a2a focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 transition"
              >
                Book a Counselor
              </a>
              <a
                href="#features"
                className="rounded-md border border-blue-200 px-5 py-3 text-[#002B5B] font-semibold hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 transition"
              >
                Explore Features
              </a>
            </div>

            {/* Trust badges */}
            <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-600" /> Secure &
                Private
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-600" /> Expert
                Counselors
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-sky-400" /> Data-Driven
                Insights
              </span>
            </div>
          </div>

          {/* Hero illustration placeholder */}
          <div id="insights" className="rounded-lg border bg-white p-6 border-blue-100 shadow-inner ">
              <h3 className="text-xl font-semibold text-[#002B5B]">
                Student Impact Snapshot
              </h3>
              <p className="mt-1 text-slate-600">
                Survey insights that show how guidance drives better choices.
              </p>
              <div className="mt-6 h-72">
                <Bar data={chartData} options={chartOptions} />
              </div>
              <ul className="mt-4 text-sm text-slate-600 list-disc pl-5">
                <li>Data-driven recommendations boost confidence.</li>
                <li>Clearer paths reduce course-switching and delays.</li>
                <li>Virtual sessions increase access and equity.</li>
              </ul>
            </div>
          </div>
         {/* Bar chart (credibility / stats) */}
            
      </section>
      {/* <div
            role="img"
            aria-label="Students exploring courses and careers"
            className="h-72 md:h-96 rounded-xl bg-[conic-gradient(at_top_left,_#ffffff,_#dbeafe)] "
            
          /> */}

      {/* FEATURES */}
      {/* <section id="features" aria-label="Features" className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-bold text-blue-800">Why Students Love It</h2>
          <p className="mt-2 text-slate-600">
            A single hub for exploration, assessment, and one-click bookings.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border p-6 hover:shadow transition">
              <h3 className="text-xl font-semibold text-blue-700">
                Course Recommendations
              </h3>
              <p className="mt-2 text-slate-600">
                Get tailored programs based on your strengths, interests, and
                academic profile.
              </p>
            </div>

            <div className="rounded-lg border p-6 hover:shadow transition">
              <h3 className="text-xl font-semibold text-blue-700">
                Career Guidance
              </h3>
              <p className="mt-2 text-slate-600">
                Explore roles, skills required, salary ranges, and job outlooks—
                all in one place.
              </p>
            </div>

            <div className="rounded-lg border p-6 hover:shadow transition">
              <h3 className="text-xl font-semibold text-blue-700">
                Expert Counselors
              </h3>
              <p className="mt-2 text-slate-600">
                Book sessions with experienced advisors for personalized
                support.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* BOOKING */}
    

      {/* FOOTER */}
      <footer className="mt-16 border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} MyCareerCoach — All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <a className="hover:underline" href="#features">Features</a>
            <a className="hover:underline" href="#booking">Book</a>
            <a className="hover:underline" href="#insights">Insights</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StudLanding;
