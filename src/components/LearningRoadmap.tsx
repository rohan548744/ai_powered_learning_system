import React, { useState } from 'react';
import { Map, Target, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { apiService } from '../services/api';

interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  topics: string[];
  resources: string[];
  skills: string[];
}

interface Roadmap {
  topic: string;
  level: string;
  totalDuration: string;
  description: string;
  steps: RoadmapStep[];
}

const LearningRoadmap: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const generateRoadmap = async () => {
    if (!topic.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await apiService.generateRoadmap(topic, 'beginner');
      
      if (response.error) {
        console.error('Roadmap generation error:', response.error);
        // You could show an error message to the user here
      } else if (response.data) {
        setRoadmap(response.data);
        setCompletedSteps([]);
      }
    } catch (error) {
      console.error('Error generating roadmap:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const toggleStepCompletion = (stepId: string) => {
    setCompletedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const getCompletionPercentage = () => {
    if (!roadmap) return 0;
    return Math.round((completedSteps.length / roadmap.steps.length) * 100);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
          <h2 className="text-2xl font-bold text-white mb-2">Personalized Learning Roadmap</h2>
          <p className="text-green-100">Create a structured learning path tailored to your goals</p>
        </div>

        {!roadmap ? (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">What would you like to learn?</h3>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter a topic (e.g., Python Programming, Machine Learning, Web Development, Data Science...)"
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="flex justify-center">
              <button
                onClick={generateRoadmap}
                disabled={!topic.trim() || isLoading}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating Roadmap...
                  </>
                ) : (
                  <>
                    <Map className="w-5 h-5" />
                    Create Learning Path
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-green-800">
                  {roadmap.topic}
                </h3>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="text-green-700 font-medium">{roadmap.totalDuration}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-1 bg-green-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getCompletionPercentage()}%` }}
                  />
                </div>
                <span className="text-green-700 font-medium">
                  {getCompletionPercentage()}% Complete
                </span>
              </div>
              
              <p className="text-green-600 text-sm">
                {completedSteps.length} of {roadmap.steps.length} steps completed
              </p>
              
              {roadmap.description && (
                <p className="text-green-700 mt-2 text-sm">
                  {roadmap.description}
                </p>
              )}
            </div>

            <div className="space-y-4">
              {roadmap.steps.map((step, index) => {
                const isCompleted = completedSteps.includes(step.id);
                const isNext = !isCompleted && index === completedSteps.length;
                
                return (
                  <div
                    key={step.id}
                    className={`border-2 rounded-xl p-6 transition-all duration-200 ${
                      isCompleted
                        ? 'border-green-500 bg-green-50'
                        : isNext
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => toggleStepCompletion(step.id)}
                        className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          isCompleted
                            ? 'border-green-500 bg-green-500'
                            : 'border-gray-300 hover:border-green-400'
                        }`}
                      >
                        {isCompleted && <CheckCircle className="w-4 h-4 text-white" />}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className={`text-lg font-semibold ${
                            isCompleted ? 'text-green-800' : 'text-gray-800'
                          }`}>
                            Step {index + 1}: {step.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(step.difficulty)}`}>
                              {step.difficulty}
                            </span>
                            <span className="text-gray-500 text-sm">{step.duration}</span>
                          </div>
                        </div>

                        <p className={`mb-4 ${isCompleted ? 'text-green-700' : 'text-gray-600'}`}>
                          {step.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-gray-800 mb-2">Key Topics:</h5>
                            <ul className="space-y-1">
                              {step.topics.map((topic, topicIndex) => (
                                <li key={topicIndex} className="flex items-center gap-2 text-sm text-gray-600">
                                  <ArrowRight className="w-3 h-3" />
                                  {topic}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h5 className="font-medium text-gray-800 mb-2">Recommended Resources:</h5>
                            <ul className="space-y-1">
                              {step.resources.map((resource, resourceIndex) => (
                                <li key={resourceIndex} className="flex items-center gap-2 text-sm text-gray-600">
                                  <Target className="w-3 h-3" />
                                  {resource}
                                </li>
                              ))}
                            </ul>
                            
                            {step.skills && step.skills.length > 0 && (
                              <div className="mt-3">
                                <h5 className="font-medium text-gray-800 mb-2">Skills You'll Gain:</h5>
                                <ul className="space-y-1">
                                  {step.skills.map((skill, skillIndex) => (
                                    <li key={skillIndex} className="flex items-center gap-2 text-sm text-gray-600">
                                      <CheckCircle className="w-3 h-3" />
                                      {skill}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={() => {
                  setRoadmap(null);
                  setTopic('');
                  setCompletedSteps([]);
                }}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              >
                Create New Roadmap
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningRoadmap;