import React from 'react';
import { GraduationCap } from 'lucide-react';

interface HeaderProps {
  currentSection: string;
  setCurrentSection: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentSection, setCurrentSection }) => {
  const sections = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'doubt', label: 'Ask Doubt' },
    { id: 'summarizer', label: 'Summarizer' },
    { id: 'quiz', label: 'Quiz Generator' },
    { id: 'roadmap', label: 'Roadmap' }
  ];

  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Learning System
            </h1>
          </div>
          
          <nav className="hidden md:flex gap-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setCurrentSection(section.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentSection === section.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-white/50'
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>

          <select
            className="md:hidden bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-2 text-gray-700"
            value={currentSection}
            onChange={(e) => setCurrentSection(e.target.value)}
          >
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};

export default Header;