import React from 'react';
import { Heart, Code, Sparkles } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/10 backdrop-blur-md border-t border-white/20 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span className="text-gray-600 font-medium">AI Learning System</span>
            <Sparkles className="w-5 h-5 text-purple-500" />
          </div>
          
          <p className="text-gray-600 mb-4">
            Empowering learners with AI-driven educational tools for doubt resolution,
            content summarization, quiz generation, and personalized learning paths.
          </p>
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <span>Built with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>and</span>
            <Code className="w-4 h-4 text-blue-500" />
            <span>using React, TypeScript, and Tailwind CSS</span>
          </div>
          
          <div className="mt-4 text-xs text-gray-400">
            © 2025 AI Learning System. Designed for educational excellence.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;