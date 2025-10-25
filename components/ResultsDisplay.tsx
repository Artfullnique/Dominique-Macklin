
import React from 'react';
import type { GeneratedContent } from '../types';
import { CopyButton } from './CopyButton';
import { Icon } from './Icon';

interface ResultsDisplayProps {
  content: GeneratedContent;
  imagePreviewUrl: string;
  onReset: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ content, imagePreviewUrl, onReset }) => {
  const allHashtags = content.hashtags.map(h => `#${h}`).join(' ');

  return (
    <div className="bg-slate-800/50 p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-slate-700 animate-fade-in">
        <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Your Results</h2>
            <button
                onClick={onReset}
                className="inline-flex items-center justify-center px-4 py-2 border border-slate-600 text-sm font-medium rounded-md shadow-sm text-slate-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:ring-offset-slate-900 transition-colors"
            >
                <Icon name="new" className="mr-2"/>
                Start New
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-3">Your Image</h3>
                    <img src={imagePreviewUrl} alt="Uploaded content" className="rounded-lg shadow-md w-full object-cover" />
                </div>
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-slate-300">Generated Hashtags</h3>
                        <CopyButton textToCopy={allHashtags} />
                    </div>
                    <div className="p-4 bg-slate-900/50 rounded-lg">
                        <p className="text-slate-400 text-sm leading-relaxed break-words">{allHashtags}</p>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-slate-300 mb-3">Generated Captions</h3>
                <div className="space-y-4">
                    {content.captions.map((caption, index) => (
                        <div key={index} className="bg-slate-900/50 p-4 rounded-lg flex justify-between items-start gap-4">
                            <p className="text-slate-300 flex-grow">{caption}</p>
                            <CopyButton textToCopy={caption} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

// Add a simple fade-in animation in a style tag for broader compatibility.
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);
