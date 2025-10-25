
import React, { useState } from 'react';
import { Icon } from './Icon';

interface CopyButtonProps {
  textToCopy: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
        console.error("Failed to copy text: ", err);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${
        copied
          ? 'bg-green-600 text-white focus:ring-green-500'
          : 'bg-slate-600 text-slate-300 hover:bg-slate-500 focus:ring-pink-500'
      }`}
      aria-label={copied ? 'Copied' : 'Copy'}
    >
      {copied ? <Icon name="check" /> : <Icon name="copy" />}
    </button>
  );
};
