import React from "react";
import { BookOpen, Lightbulb, Target, Calendar } from "lucide-react";

const Services: React.FC = () => {
  const services = [
    {
      icon: <BookOpen size={28} className="text-blue-600" />,
      title: "Course & Career Recommendations",
      description:
        "Personalized course and career paths based on student strengths, interests, and academic performance.",
    },
    {
      icon: <Target size={28} className="text-red-600" />,
      title: "Aptitude Tests with Insights",
      description:
        "Interactive aptitude tests with instant analysis to guide students toward their best-fit fields of study.",
    },
    {
      icon: <Lightbulb size={28} className="text-green-600" />,
      title: "Virtual Counseling Sessions",
      description:
        "One-on-one counseling sessions with experts, accessible anytime for tailored advice and guidance.",
    },
    {
      icon: <Calendar size={28} className="text-yellow-600" />,
      title: "Appointment Scheduling",
      description:
        "Easily book, manage, and track counseling sessions with automated reminders.",
    },
  ];

  return (
    <section id="Services" className="px-6 lg:px-24 py-16 bg-slate-50 text-center">
      {/* Section Title */}
      <h2 className="text-3xl font-extrabold text-blue-900 mb-4">
       <a href="#Services">Our Core Services</a> 
      </h2>
      <p className="text-slate-600 mb-12 max-w-2xl mx-auto">
        MyCareerCoach brings together the essential tools to support students in
        making the right academic and career choices.
      </p>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 mb-4">
              {service.icon}
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              {service.title}
            </h3>
            <p className="text-sm text-slate-600">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
