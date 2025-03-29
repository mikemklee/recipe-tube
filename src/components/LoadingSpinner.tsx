import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center space-x-2 my-8">
      <div className="w-6 h-6 border-4 border-solid rounded-full animate-spin"
        style={{ borderColor: '#C5705D', borderTopColor: 'transparent' }}></div>
      <span className="text-black">Processing video... this may take a moment.</span>
    </div>
  );
};

export default LoadingSpinner;