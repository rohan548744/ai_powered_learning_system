import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AskDoubt from './components/AskDoubt';
import Summarizer from './components/Summarizer';
import QuizGenerator from './components/QuizGenerator';
import LearningRoadmap from './components/LearningRoadmap';
import Footer from './components/Footer';

function App() {
  const [currentSection, setCurrentSection] = useState('dashboard');

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'doubt':
        return <AskDoubt />;
      case 'summarizer':
        return <Summarizer />;
      case 'quiz':
        return <QuizGenerator />;
      case 'roadmap':
        return <LearningRoadmap />;
      default:
        return <Dashboard setCurrentSection={setCurrentSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header 
        currentSection={currentSection} 
        setCurrentSection={setCurrentSection} 
      />
      
      <main className="min-h-[calc(100vh-200px)]">
        {renderCurrentSection()}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;