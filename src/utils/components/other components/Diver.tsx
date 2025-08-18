import { useState } from "react";
// import React{useState} from "react";
export interface SolutionItem {
  id: string |number;
  img: string;
  description: {
    title: string;
    subtitle: string;
    color: string;
  };
}

interface Description {
  color: string;
  title: string;
  subtitle: string;
}

// interface SolutionItem {
//   id: string | number;
//   img: string;
//   description: Description;
// }

interface DiverProps {
  text?: string;
  solution: SolutionItem[];
}

const Diver: React.FC<DiverProps> = ({ text, solution }) => {
  return (
    <div className="w-[70%] h-full flex flex-row">
      {/* Left side (first 2 items) */}
      <div className="mt-[40px] w-1/2">
        {solution.slice(0, 2).map((item) => (
          <section
            key={item.id}
            className="flex flex-col items-center justify-center w-[80%]"
          >
            <div className="flex items-center w-[90%] h-[40%]">
              <div
                className={`h-[310px] w-[100%] rounded-2xl mt-10 flex flex-col items-center shadow-2xl hover:bg-[#fefdfd] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 ${item.description.color}`}
              >
                <img
                  src={item.img}
                  className="rounded-full w-[100px] h-[90px] mt-7"
                  alt={item.description.title}
                />
                <p className="text-xl mt-6 text-center font-medium p-2">
                  {item.description.title}
                </p>
                <p className="text-sm mt-3 text-center p-2">
                  {item.description.subtitle}
                </p>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Right side (last 2 items) */}
      <div className="w-1/2">
        {solution.slice(2).map((item) => (
          <section
            key={item.id}
            className="flex flex-col items-center justify-center w-[80%]"
          >
            <div className="flex items-center w-[90%] h-[40%]">
              <div
                className={`h-[310px] w-[100%] rounded-2xl mt-10 flex flex-col items-center shadow-2xl hover:bg-[#fefdfd] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 ${item.description.color}`}
              >
                <img
                  src={item.img}
                  className="rounded-full w-[140px] h-[90px] mt-10"
                  alt={item.description.title}
                />
                <p className="text-xl mt-6 text-center font-medium p-2">
                  {item.description.title}
                </p>
                <p className="text-sm mt-3 text-center p-2">
                  {item.description.subtitle}
                </p>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Diver;
