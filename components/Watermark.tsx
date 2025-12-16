import React from 'react';

const Watermark: React.FC = () => {
  const text = "lzsrmyyek";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
      <text 
        x="150" 
        y="150" 
        fill="rgba(0, 0, 0, 0.06)" 
        font-size="24" 
        font-weight="bold" 
        font-family="ui-sans-serif, system-ui, sans-serif" 
        text-anchor="middle" 
        dominant-baseline="middle" 
        transform="rotate(-45 150 150)"
      >
        ${text}
      </text>
    </svg>
  `;

  const bgImage = `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`;

  return (
    <div 
      className="fixed inset-0 z-40 pointer-events-none select-none overflow-hidden"
      style={{
        backgroundImage: bgImage,
        backgroundRepeat: 'repeat',
        backgroundPosition: 'center',
      }}
      aria-hidden="true"
    />
  );
};

export default Watermark;