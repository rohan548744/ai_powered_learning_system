import React, { useState } from 'react';
import { Brain, CheckCircle, XCircle, RotateCcw, Trophy } from 'lucide-react';
import { apiService } from '../services/api';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface UserAnswer {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
}

const QuizGenerator: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const generateQuiz = async () => {
    if (!inputText.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await apiService.generateQuiz(inputText);
      
      if (response.error) {
        console.error('Quiz generation error:', response.error);
        // You could show an error message to the user here
      } else if (response.data) {
        setQuestions(response.data.questions);
        setUserAnswers([]);
        setShowResults(false);
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleAnswerSelect = (questionId: string, selectedOption: number) => {
    if (showResults) return;

    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    const isCorrect = selectedOption === question.correctAnswer;
    const newAnswer: UserAnswer = {
      questionId,
      selectedOption,
      isCorrect
    };

    setUserAnswers(prev => {
      const filtered = prev.filter(a => a.questionId !== questionId);
      return [...filtered, newAnswer];
    });
  };

  const submitQuiz = () => {
    if (userAnswers.length === questions.length) {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setUserAnswers([]);
    setShowResults(false);
  };

  const getScore = () => {
    const correctAnswers = userAnswers.filter(a => a.isCorrect).length;
    return {
      correct: correctAnswers,
      total: questions.length,
      percentage: Math.round((correctAnswers / questions.length) * 100)
    };
  };

  const getUserAnswer = (questionId: string) => {
    return userAnswers.find(a => a.questionId === questionId);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6">
          <h2 className="text-2xl font-bold text-white mb-2">Interactive Quiz Generator</h2>
          <p className="text-purple-100">Create and take quizzes to test your understanding</p>
        </div>

        {questions.length === 0 ? (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Generate Quiz Content</h3>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter the content you want to create a quiz from. This could be a lesson, article, or any educational material..."
                className="w-full h-40 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex justify-center">
              <button
                onClick={generateQuiz}
                disabled={!inputText.trim() || isLoading}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating Quiz...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5" />
                    Generate Quiz
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            {showResults && (
              <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-800">Quiz Results</h3>
                </div>
                <div className="text-green-700">
                  <p className="text-2xl font-bold mb-1">
                    {getScore().percentage}% Score
                  </p>
                  <p>
                    You got {getScore().correct} out of {getScore().total} questions correct!
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {questions.map((question, index) => {
                const userAnswer = getUserAnswer(question.id);
                
                return (
                  <div key={question.id} className="bg-gray-50 rounded-xl p-6">
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">
                        Question {index + 1}
                      </h4>
                      <p className="text-gray-700">{question.question}</p>
                    </div>

                    <div className="space-y-2 mb-4">
                      {question.options.map((option, optionIndex) => {
                        const isSelected = userAnswer?.selectedOption === optionIndex;
                        const isCorrect = optionIndex === question.correctAnswer;
                        const showCorrectAnswer = showResults && isCorrect;
                        const showIncorrectAnswer = showResults && isSelected && !isCorrect;

                        return (
                          <button
                            key={optionIndex}
                            onClick={() => handleAnswerSelect(question.id, optionIndex)}
                            disabled={showResults}
                            className={`w-full text-left p-3 rounded-lg transition-all duration-200 border-2 ${
                              showCorrectAnswer
                                ? 'border-green-500 bg-green-50 text-green-800'
                                : showIncorrectAnswer
                                ? 'border-red-500 bg-red-50 text-red-800'
                                : isSelected
                                ? 'border-purple-500 bg-purple-50 text-purple-800'
                                : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50'
                            } ${showResults ? 'cursor-default' : 'cursor-pointer'}`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option}</span>
                              {showResults && (
                                <>
                                  {showCorrectAnswer && <CheckCircle className="w-5 h-5 text-green-600" />}
                                  {showIncorrectAnswer && <XCircle className="w-5 h-5 text-red-600" />}
                                </>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {showResults && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Explanation:</strong> {question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center gap-4 mt-8">
              {!showResults ? (
                <button
                  onClick={submitQuiz}
                  disabled={userAnswers.length !== questions.length}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Quiz
                </button>
              ) : (
                <div className="flex gap-4">
                  <button
                    onClick={resetQuiz}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Retake Quiz
                  </button>
                  <button
                    onClick={() => {
                      setQuestions([]);
                      setUserAnswers([]);
                      setShowResults(false);
                      setInputText('');
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                  >
                    New Quiz
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizGenerator;