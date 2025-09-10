import React, { useState } from 'react';
import applogo from '../../../assets/images/applogo.png';
{/* <div className="flex items-center gap-2 text-2xl font-bold">
          <span className="text-[#c92a2a]">set</span>
            <img
            src={applogo}
            alt="Students Logo"
            className="w-10 rounded-full "
          />
          mycareer
        </div> */}
        interface LogoProps {
  textColor?: string; // e.g. "#c92a2a"
  appName?: string;
}

const Logo: React.FC<LogoProps> = ({
  textColor = "#c92a2a",
  appName = "mycareer",
}) => {
  return (
    <div className="flex items-center gap-2 text-2xl font-bold">
      <span className="text-[#c92a2a]" style={{ color: textColor }}>
        set
      </span>
     <a href="/StudentDashboard">
      <img
        src={applogo}
        alt="Students Logo"
        className="w-10 rounded-full"
      />
     </a>
     <span className='text-[#002B5B]' >
         mycareer
     </span>
    </div>
  );
};

export default Logo;