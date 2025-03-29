import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center space-x-2 my-8">
      <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      <span className="text-gray-600">Processing video... this may take a moment.</span>
    </div>
  );
};

export default LoadingSpinner;