import React, { useState } from 'react';
import { FileText, Upload, Loader, Copy, Check } from 'lucide-react';
import { apiService } from '../services/api';

const Summarizer: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    if (!inputText.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await apiService.summarizeText(inputText);
      
      if (response.error) {
        setSummary(`Error: ${response.error}`);
      } else if (response.data) {
        setSummary(response.data.summary);
      }
    } catch (error) {
      setSummary('Error generating summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setInputText(text);
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a text file (.txt)');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg">
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6">
          <h2 className="text-2xl font-bold text-white mb-2">Content Summarizer</h2>
          <p className="text-teal-100">Transform lengthy texts into concise, actionable summaries</p>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Input Content</h3>
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <Upload className="w-4 h-4" />
                <span className="text-sm">Upload File</span>
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your text here or upload a file to get started. You can summarize articles, research papers, documents, or any lengthy content..."
              className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            />

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {inputText.length} characters
              </span>
              <button
                onClick={handleSummarize}
                disabled={!inputText.trim() || isLoading}
                className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Summarizing...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Generate Summary
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Summary</h3>
              {summary && (
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="text-sm">Copy</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="h-64 p-4 bg-gray-50 border border-gray-200 rounded-xl overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-teal-500" />
                    <p className="text-gray-500">Generating your summary...</p>
                  </div>
                </div>
              ) : summary ? (
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                    {summary}
                  </pre>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <FileText className="w-12 h-12 mx-auto mb-4" />
                    <p>Your summary will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summarizer;