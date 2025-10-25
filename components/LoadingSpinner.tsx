
import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-12 h-12 border-4 border-slate-500 border-t-pink-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-400">AI is thinking...</p>
    </div>
  );
};
