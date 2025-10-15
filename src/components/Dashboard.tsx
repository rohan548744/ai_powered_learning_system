import React from 'react';
import { MessageCircleQuestion, FileText, Brain, Map } from 'lucide-react';

interface DashboardProps {
  setCurrentSection: (section: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setCurrentSection }) => {
  const features = [
    {
      id: 'doubt',
      title: 'Ask Doubt',
      description: 'Get instant answers to your questions with AI-powered chat assistance',
      icon: MessageCircleQuestion,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'summarizer',
      title: 'Content Summarizer',
      description: 'Transform long texts into concise, easy-to-understand summaries',
      icon: FileText,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      id: 'quiz',
      title: 'Quiz Generator',
      description: 'Create interactive quizzes from any text to test your knowledge',
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'roadmap',
      title: 'Learning Roadmap',
      description: 'Get personalized learning paths tailored to your goals and interests',
      icon: Map,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Your AI Learning Hub
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Unlock your learning potential with our comprehensive AI-powered educational tools
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {features.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <div
              key={feature.id}
              onClick={() => setCurrentSection(feature.id)}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
            >
              <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className={`w-16 h-16 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <div className={`w-8 h-8 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                
                <div className="mt-4 flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                  <span>Get Started</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;