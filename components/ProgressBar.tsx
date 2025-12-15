import React from 'react';

interface ProgressBarProps {
  step: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ step }) => (
  <div className="w-full bg-slate-200 h-1.5 mt-0 fixed top-0 left-0 z-50 no-print">
      <div className="bg-blue-600 h-1.5 transition-all duration-500 ease-out" style={{ width: `${(step / 3) * 100}%` }}></div>
  </div>
);

export default ProgressBar;