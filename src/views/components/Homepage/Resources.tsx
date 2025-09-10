import React from "react";
import resources1 from "../../../assets/images/resources1.jpg";
import resources2 from "../../../assets/images/resources2.jpg";
import resources3 from "../../../assets/images/resources3.jpg";

const resources = [
  {
    id: 1,
    type: "NEWS",
    title: "New Features Added to Our Counseling Platform",
    description:
      "We’ve rolled out new tools to help students better plan their academic and career paths.",
    image: resources1,
    link: "#",
  },
  {
    id: 2,
    type: "PRESS RELEASE",
    title: "Partnership with Local Universities",
    description:
      "Our platform is now officially partnered with 5 universities to enhance career guidance.",
    image: resources3,
    link: "#",
  },
  {
    id: 3,
    type: "NEWS",
    title: "Survey Results on Student Counseling Needs",
    description:
      "A recent survey highlights the urgent need for personalized academic counseling services.",
    image: resources2,
    link: "#",
  },
  {
    id: 4,
    type: "NEWS",
    title: "Career Database Expanded with 50+ New Fields",
    description:
      "Students can now explore more career options with our updated job outlook database.",
    image: "/images/resource4.jpg",
    link: "#",
  },
];

const ResourcesPage: React.FC = () => {
  return (
    <section className="px-6 lg:px-24 py-16 bg-slate-50">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-blue-900">
          Latest News & Resources
        </h2>
        <p className="text-gray-600 mt-2">
          Stay updated with the latest developments, research, and updates from
          our platform
        </p>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Featured (left) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
          <img
            src={resources[0].image}
            alt={resources[0].title}
            className="w-full h-[450px] object-cover"
          />
          <div className="p-6">
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {resources[0].type}
            </span>
            <h3 className="text-xl font-bold text-blue-800 mb-3">
              {resources[0].title}
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              {resources[0].description}
            </p>
            <a
              href={resources[0].link}
              className="text-blue-600 font-semibold hover:underline"
            >
              Read more →
            </a>
          </div>
        </div>

        {/* Right-side smaller items */}
        <div className="space-y-6">
          {resources.slice(1).map((res) => (
            <div
              key={res.id}
              className="flex gap-4 items-start bg-white rounded-lg shadow p-4 hover:shadow-md transition"
            >
              <img
                src={res.image}
                alt={res.title}
                className="w-24 h-24 object-cover rounded-md"
              />
              <div>
                <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-1 rounded mb-2">
                  {res.type}
                </span>
                <h4 className="font-bold ">{res.title}</h4>
                <p className="text-sm text-gray-600">{res.description}</p>
                <a
                  href={res.link}
                  className="block mt-1 text-blue-600 text-sm hover:underline"
                >
                  Read more →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResourcesPage;
