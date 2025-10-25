
import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultsDisplay } from './components/ResultsDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { generateCaptionsAndHashtags } from './services/geminiService';
import type { GeneratedContent } from './types';
import { fileToBase64 } from './utils/fileUtils';
import { Icon } from './components/Icon';

const PREDEFINED_TONES = [
  'Casual', 'Funny', 'Professional', 'Inspirational', 'Enthusiastic', 'Sarcastic', 'Informative', 'Friendly', 'Luxury', 'Minimalist', 'Playful', 'Motivational', 'Whimsical', 'Serious', 'Empathetic', 'Authoritative'
];
const CUSTOM_TONE_OPTION_VALUE = 'custom-tone-option';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [keywords, setKeywords] = useState<string>('');
  const [selectedToneOption, setSelectedToneOption] = useState<string>(PREDEFINED_TONES[0]); // Tracks dropdown selection
  const [customToneInput, setCustomToneInput] = useState<string>(''); // Tracks text in custom input field
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Derive the actual tone string to send to the API based on user selection
  const toneToSend = selectedToneOption === CUSTOM_TONE_OPTION_VALUE ? customToneInput : selectedToneOption;

  const handleGenerate = async () => {
    if (!imageFile) {
      setError('Please upload an image first.');
      return;
    }
    // Validate custom tone input if 'Custom...' is selected
    if (selectedToneOption === CUSTOM_TONE_OPTION_VALUE && !customToneInput.trim()) {
        setError('Please enter a custom tone.');
        return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);

    try {
      const { base64, mimeType } = await fileToBase64(imageFile);
      const content = await generateCaptionsAndHashtags(base64, mimeType, keywords, toneToSend);
      setGeneratedContent(content);
    } catch (err) {
      setError(err instanceof Error ? `Failed to generate content: ${err.message}` : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
      setImageFile(null);
      setImagePreviewUrl(null);
      setKeywords('');
      setSelectedToneOption(PREDEFINED_TONES[0]); // Reset to the first predefined tone
      setCustomToneInput(''); // Clear custom tone input
      setGeneratedContent(null);
      setError(null);
      setIsLoading(false);
  };

  const handleSelectedToneOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedToneOption(e.target.value);
    // If switching away from 'Custom...', clear the custom input field
    if (e.target.value !== CUSTOM_TONE_OPTION_VALUE) {
        setCustomToneInput('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <header className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-sky-400">
          AI Caption & Hashtag Generator
        </h1>
        <p className="text-slate-400 mt-2 text-lg">
          Upload an image, add some context, and let Gemini craft the perfect social media post.
        </p>
      </header>

      <main className="w-full max-w-2xl">
        {!generatedContent && !isLoading && (
             <div className="bg-slate-800/50 p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-slate-700">
                <ImageUploader 
                    imagePreviewUrl={imagePreviewUrl} 
                    setImageFile={setImageFile} 
                    setImagePreviewUrl={setImagePreviewUrl} 
                />
                
                {imageFile && (
                    <>
                        <div className="mt-6">
                            <label htmlFor="keywords" className="block text-sm font-medium text-slate-300 mb-2">
                                Add Keywords (optional, but helps!)
                            </label>
                            <textarea
                                id="keywords"
                                value={keywords}
                                onChange={(e) => setKeywords(e.target.value)}
                                placeholder="e.g., 'Summer vacation in Italy', 'My new puppy, Sparky'"
                                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition duration-200"
                                rows={2}
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="tone" className="block text-sm font-medium text-slate-300 mb-2">
                                Select a Tone
                            </label>
                            <select
                                id="tone"
                                value={selectedToneOption}
                                onChange={handleSelectedToneOptionChange}
                                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition duration-200 appearance-none bg-no-repeat bg-right-in-select"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                    backgroundPosition: 'right 0.5rem center',
                                    backgroundSize: '1.5em 1.5em'
                                }}
                            >
                                {PREDEFINED_TONES.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                                <option key={CUSTOM_TONE_OPTION_VALUE} value={CUSTOM_TONE_OPTION_VALUE}>Custom...</option>
                            </select>
                        </div>

                        {selectedToneOption === CUSTOM_TONE_OPTION_VALUE && (
                            <div className="mt-4">
                                <label htmlFor="custom-tone-input" className="block text-sm font-medium text-slate-300 mb-2">
                                    Enter Custom Tone
                                </label>
                                <textarea
                                    id="custom-tone-input"
                                    value={customToneInput}
                                    onChange={(e) => setCustomToneInput(e.target.value)}
                                    placeholder="e.g., 'Sarcastic', 'Enthusiastic', 'Whimsical'"
                                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition duration-200"
                                    rows={1}
                                />
                            </div>
                        )}
                        
                        <div className="mt-4 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                            <p className="text-xs font-semibold text-slate-400 mb-2">
                                <Icon name="sparkles" className="w-4 h-4 inline-block mr-1" />
                                Pro Tip: Describe the image for better results!
                            </p>
                            <ul className="list-disc list-inside text-xs text-slate-500 space-y-1">
                                <li>"My golden retriever puppy playing in a field of flowers."</li>
                                <li>"Celebrating a promotion with friends at a rooftop bar."</li>
                                <li>"Enjoying a quiet morning coffee with a view of the mountains."</li>
                            </ul>
                        </div>
                        
                        <div className="mt-6 flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleGenerate}
                                disabled={isLoading || !imageFile || (selectedToneOption === CUSTOM_TONE_OPTION_VALUE && !customToneInput.trim())}
                                className="w-full flex-1 group relative inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-white font-semibold shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors duration-300 transform hover:scale-105"
                            >
                                <span>Generate</span>
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 bg-blue-500 rounded-full group-hover:bg-blue-400 transition-colors">
                                    <Icon name="arrow-right" className="w-5 h-5" />
                                </span>
                            </button>
                            <button
                                onClick={handleReset}
                                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-slate-600 text-sm font-medium rounded-full shadow-sm text-slate-300 bg-transparent hover:bg-slate-800 hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:ring-offset-slate-900 transition-colors"
                            >
                                Reset
                            </button>
                        </div>
                    </>
                )}
            </div>
        )}

        <div className="mt-8 w-full">
          {isLoading && <LoadingSpinner />}
          {error && <div className="text-red-400 bg-red-900/50 p-4 rounded-lg text-center">{error}</div>}
          {generatedContent && imagePreviewUrl && (
            <ResultsDisplay 
                content={generatedContent} 
                imagePreviewUrl={imagePreviewUrl}
                onReset={handleReset}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;