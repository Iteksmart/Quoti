
import React from 'react';
import { SendIcon, SpinnerIcon } from './icons';

interface GenerateButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({ onClick, isLoading }) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="w-full flex items-center justify-center px-4 py-2.5 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 transition-all duration-200 disabled:bg-purple-400 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <SpinnerIcon className="w-5 h-5 mr-2" />
          Generating...
        </>
      ) : (
        <>
          Generate Quote
          <SendIcon className="w-5 h-5 ml-2" />
        </>
      )}
    </button>
  );
};
