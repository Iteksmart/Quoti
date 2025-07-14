
import React from 'react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  return (
    <div className="w-full max-w-sm mx-auto bg-gray-800 rounded-[2.5rem] p-2 shadow-2xl shadow-purple-300/50">
      <div className="w-full h-[44rem] bg-white rounded-[2rem] overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-lg flex justify-center items-center">
            <div className="w-12 h-1 bg-gray-600 rounded-full"></div>
        </div>
        {children}
      </div>
    </div>
  );
};
