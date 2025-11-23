import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-4">
      <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-500/10 mb-4 shadow-lg shadow-indigo-500/20">
        <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent tracking-tight">
        Font Detective
      </h1>
      <p className="text-slate-400 max-w-2xl text-lg">
        Upload an image or describe a style. AI will <span className="text-indigo-400 font-semibold">identify</span> the font and find where to <span className="text-indigo-400 font-semibold">download</span> it.
      </p>
    </header>
  );
};
