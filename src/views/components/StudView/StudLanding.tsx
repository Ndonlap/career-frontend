import React, { useState } from "react";
import { Pie, Bar, Doughnut } from "react-chartjs-2";
// import { Line, Pie, Bar } from "react-chartjs-2";
import { FileText, Lightbulb, Users, BookOpen } from "lucide-react";
import Logo from "../../../utils/components/other components/Logo";
import Explore from "../../../utils/components/other components/Explore";
import Dropdown from "../../../utils/components/other components/Dropdown";
import Studs from "../../../assets/images/studs.png";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  ChartData,
  ChartOptions,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

// BookingForm type
type BookingForm = {
  fullName: string;
  email: string;
  date: string;
  time: string;
  notes: string;
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext: string;
  color: string;
}> = ({ icon, label, value, subtext, color }) => (
  <div className="flex items-center gap-4 bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition">
    <div
      className={`w-12 h-12 flex items-center justify-center rounded-full text-white ${color}`}
    >
      {icon}
    </div>
    <div>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      <p className="text-sm text-slate-500">{label}</p>
      <span className="text-xs text-slate-400">{subtext}</span>
    </div>
  </div>
);

const StudLanding: React.FC = () => {

  const charData: ChartData<"bar"> = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    datasets: [
      {
        label: "Completed",
        data: [1200, 2000, 2200, 2800, 2500, 1800, 1600, 2000, 3000, 3500, 2700, 3200],
        backgroundColor: "rgba(255, 124, 91)", // green
        borderRadius: 6,
      },
      {
        label: "Ongoing",
        data: [800, 1200, 1100, 1000, 1500, 900, 700, 1000, 1200, 1300, 1000, 1100],
        backgroundColor: "rgba(59, 130, 246, 0.8)", // blue
        borderRadius: 6,
      },
      {
        label: "Rescheduled",
        data: [500, 700, 600, 900, 1200, 500, 400, 800, 1000, 900, 700, 800],
        backgroundColor: "rgba(168, 85, 247, 0.8)", // purple
        borderRadius: 6,
      },
    ],
  };

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false as const,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#374151",
          font: { size: 12, weight: "bold" },
          padding: 20,
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "#111827",
        titleColor: "#fff",
        bodyColor: "#e5e7eb",
        cornerRadius: 6,
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    scales: {
      x: {
        stacked: true,
        ticks: { color: "#6b7280" },
        grid: { display: false },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: { color: "#6b7280" },
        grid: { color: "rgba(209,213,219,0.3)" },
      },
    },
  };

 
 const pieData: ChartData<"doughnut"> = {
  labels: ["Correct Choice", "Misaligned Choice", "Undecided Students", "More Guidance"],
  datasets: [
    {
      data: [24, 18, 32, 22],
      backgroundColor: ["#ff6384", "#36a2eb", "#9966ff", "#ffce56"],
      borderColor: "#fff",
      borderWidth: 2,
     
    },
  ],
};

const pieOptions: ChartOptions<"doughnut"> & { cutout?: string | number } = {
  responsive: true,
   cutout: "70%", // donut hole size
  plugins: {
    legend: { display: false }, // we'll build custom legend
    tooltip: {
      backgroundColor: "#1f2937",
      titleColor: "#fff",
      bodyColor: "#e5e7eb",
      padding: 10,
      cornerRadius: 6,
    },
  },
  animation: {
    animateRotate: true,
    animateScale: true,
  },
};


  return (
    <div className="h-screen bg-gray-100 text-slate-900">
      {/* NAVBAR */}
      <header>
        <div className="w-full flex items-center justify-between mx-auto max-w-7xl px-4 py-3">
          <Logo />
          <nav className=" md:flex items-center gap-8">
            <a className="hover:underline" href="/StudentDashboard">Dashboard</a>
            <a className="hover:underline" href="#features"><Explore /></a>
            <a className="hover:underline" href="/BookCounselor">Book a Counselor</a>
            <Dropdown />
          </nav>
        </div>
      </header>

      {/* STAT CARDS */}
      <section className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<FileText size={22} />} label="Uploaded Report Cards" value="12" subtext="last 20 days" color="bg-blue-600" />
        <StatCard icon={<Lightbulb size={22} />} label="Recommendation Generated" value="8" subtext="this month" color="bg-orange-500" />
        <StatCard icon={<Users size={22} />} label="Counseling Sessions" value="5" subtext="Scheduled" color="bg-green-500" />
        <StatCard icon={<BookOpen size={22} />} label="Course Explored" value="20" subtext="Via Dashboard" color="bg-red-600" />
      </section>

    {/* BAR + PIE CHARTS SIDE BY SIDE */}
<section className=" px-4 py-5 max-w-7xl mx-auto">
  <div className="grid md:grid-cols-2 gap-[610px] items-start">
    
    {/* BAR CHART */}
    <div
      id="insights"
      className="w-[800px] rounded-lg border bg-white p-6 border-blue-100 shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
    >
      <h3 className="text-xl font-semibold text-[#002B5B]">Student Impact Snapshot</h3>
      <p className="mt-1 text-slate-600">
        Survey insights that show how guidance drives better choices.
      </p>
      <div className="mt-6 h-72">
        <Bar data={charData} options={chartOptions} />
      </div>
    </div>

    {/* PIE (DOUGHNUT) CHART */}
    <div className="mb-4 w-[320px] rounded-lg border bg-white p-6 border-blue-100 shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
      <h3 className="text-xl font-semibold text-[#002B5B]">Resource Distribution</h3>
      <p className="mt-1 text-slate-600">
        Breakdown of student academic resources and activities.
      </p>
      <div className="relative h-42 flex items-center justify-center">
        <Doughnut data={pieData} options={pieOptions} />
        {/* Center Value */}
        <div className="absolute flex flex-col items-center">
         {(() => {
       const dataset = pieData.datasets[0].data as number[];
       const total = dataset.reduce((a, b) => a + b, 0);
    return (
    <>
      <span className="text-2xl font-extrabold text-slate-800">{total}</span>
      <span className="text-sm text-slate-500">Total</span>
    </>
    );
    })()}
        </div>
      </div>

      {/* Custom Legend */}
      <div className="grid grid-cols-2 gap-y-3 gap-x-4 mt-6">
     {(pieData.labels ?? []).map((label, i) => {
    const dataset = pieData.datasets[0].data as number[];
    const total = dataset.reduce((a, b) => a + b, 0);
    const percent = ((dataset[i] / total) * 100).toFixed(0);

    const bgColors = pieData.datasets[0].backgroundColor as string[] | undefined;
    const color = bgColors?.[i] ?? "#d1d5db"; // fallback color if missing

  return (
    <div key={`${String(label)}`} className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-slate-600 text-sm">{`${String(label)}`}</span>
      </div>
      <span className="text-slate-800 font-semibold text-sm">{percent}%</span>
    </div>
  );
})}


      </div>
    </div>
  </div>
</section>


      {/* FOOTER */}
      <footer className=" border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">© {new Date().getFullYear()} MyCareerCoach — All rights reserved.</p>
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
