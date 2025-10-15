import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader } from 'lucide-react';
import { apiService } from '../services/api';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AskDoubt: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await apiService.askQuestion(inputText);
      
      if (response.error) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `Sorry, I encountered an error: ${response.error}. Please try again.`,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      } else if (response.data) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.data.answer,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error while processing your question. Please try again.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <h2 className="text-2xl font-bold text-white mb-2">AI Doubt Resolver</h2>
          <p className="text-blue-100">Ask any question and get instant, detailed explanations</p>
        </div>

        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <Bot className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg mb-2">No conversations yet</p>
              <p>Ask your first question to get started!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                {!message.isUser && (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.isUser
                      ? 'bg-blue-500 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.isUser ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>

                {message.isUser && (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex items-start gap-3 justify-start">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-bl-sm">
                <div className="flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin text-gray-500" />
                  <span className="text-gray-500">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-6 border-t border-gray-200">
          <div className="flex gap-4">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask any question about programming, math, science, or any topic..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AskDoubt;