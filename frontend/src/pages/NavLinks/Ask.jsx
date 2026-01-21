import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../../utils/axiosClient";
import { Send, Copy, ThumbsUp, ThumbsDown, RefreshCw, Zap, Brain, Cpu, MessageSquare, Sparkles, User, Bot } from "lucide-react";
import Animate from "../../animate";
import AppLayout from "../../Components/AppLayout";

function Ask() {
  const [messages, setMessages] = useState([
    {
      role: "model",
      parts: [
        {
          text:
            "Hi 👋 I'm your AI Software Engineering mentor.\n\n" +
            "You can ask me about:\n" +
            "• Data Structures & Algorithms\n" +
            "• Web Development (Frontend / Backend)\n" +
            "• System Design & Architecture\n\n" +
            "Ask for hints, explanations, code reviews, or design guidance 🚀",
        },
      ],
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [prompts, setPrompts] = useState([
    "Explain binary search",
    "React useEffect vs useMemo",
    "Design a URL shortener",
    "Optimize SQL query",
    "Explain Redux middleware",
    "System design for WhatsApp"
  ]);
  const messagesEndRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const onSubmit = async (data) => {
    const userMsg = {
      role: "user",
      parts: [{ text: data.message }],
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    reset();
    setIsTyping(true);

    try {
      const response = await axiosClient.post("/ai/ask", {
        messages: updatedMessages,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [{ text: response.data.message }],
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [
            {
              text: "⚠️ Something went wrong. Please try again.",
            },
          ],
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickPrompt = (prompt) => {
    const userMsg = {
      role: "user",
      parts: [{ text: prompt }],
    };

    setMessages([...messages, userMsg]);
    reset({ message: "" });
    setIsTyping(true);

    // Simulate API call
    setTimeout(() => {
      const responses = [
        "Binary search is an efficient algorithm for finding an item from a sorted list of items. It works by repeatedly dividing the search interval in half...",
        "useEffect is for side effects after render, while useMemo memoizes computed values to prevent expensive recalculations...",
        "A URL shortener system involves a database to store mappings, a unique ID generator, and redirection logic...",
        "To optimize SQL queries, use indexes, avoid SELECT *, use JOINs properly, and analyze query execution plans...",
        "Redux middleware provides a third-party extension point between dispatching an action and the moment it reaches the reducer...",
        "WhatsApp's system design involves end-to-end encryption, message queues, WebSocket connections, and distributed databases..."
      ];
      
      setMessages(prev => [...prev, {
        role: "model",
        parts: [{ text: responses[prompts.indexOf(prompt)] }],
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const regenerateResponse = () => {
    if (messages.length > 1 && messages[messages.length - 1].role === "model") {
      const lastUserMessage = messages[messages.length - 2];
      setMessages(messages.slice(0, -2));
      setIsTyping(true);
      
      // Simulate regeneration
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: "model",
          parts: [{ text: "Let me provide an alternative explanation for that...\n\n" + lastUserMessage.parts[0].text }],
        }]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "model",
        parts: [
          {
            text:
              "Hi 👋 I'm your AI Software Engineering mentor.\n\n" +
              "You can ask me about:\n" +
              "• Data Structures & Algorithms\n" +
              "• Web Development (Frontend / Backend)\n" +
              "• System Design & Architecture\n\n" +
              "Ask for hints, explanations, code reviews, or design guidance 🚀",
          },
        ],
      },
    ]);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="relative min-h-screen overflow-hidden bg-white text-black dark:bg-black dark:text-white">
          {/* 🌌 Animated Background */}
          <div className="hidden dark:block">
            <Animate />
          </div>
          
          {/* Neural Network Animation */}
          <div className="absolute inset-0 hidden dark:block">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-600 rounded-full animate-ping"></div>
            <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-emerald-500 rounded-full animate-ping delay-300"></div>
            <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-emerald-400 rounded-full animate-ping delay-700"></div>
          </div>
          
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
            <div className="flex flex-col items-center max-w-md text-center">
              {/* AI Icon with Animated Rings */}
              <div className="relative mb-8">
                {/* Outer Ring */}
                <div className="w-24 h-24 border-4 border-emerald-900/20 rounded-full dark:border-emerald-600/20"></div>
                
                {/* Middle Ring */}
                <div className="absolute inset-4 w-16 h-16 border-4 border-emerald-900/30 rounded-full animate-spin dark:border-emerald-600/30">
                  <div className="absolute -top-2 left-1/2 w-3 h-3 bg-emerald-900 rounded-full transform -translate-x-1/2 dark:bg-emerald-600"></div>
                </div>
                
                {/* Inner Core */}
                <div className="absolute inset-8 flex items-center justify-center">
                  <div className="relative">
                    <Brain className="w-10 h-10 text-emerald-900 dark:text-emerald-600 animate-pulse" />
                    <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-600 animate-bounce dark:text-yellow-500" />
                  </div>
                </div>
              </div>
              
              {/* Title */}
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-900 to-teal-900 bg-clip-text text-transparent dark:from-emerald-600 dark:to-teal-600">
                Neural AI Mentor
              </h1>
              
              {/* Subtitle */}
              <p className="mt-4 text-lg font-medium text-emerald-900 dark:text-emerald-600">
                Loading Intelligent Assistant
              </p>
              
              {/* Progress Indicators */}
              <div className="mt-8 w-full space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-900 dark:text-emerald-600">Initializing Neural Network</span>
                    <span className="font-medium text-emerald-900 dark:text-emerald-600">85%</span>
                  </div>
                  <div className="w-full h-2 bg-emerald-100 dark:bg-emerald-700/30 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-900 to-teal-900 rounded-full animate-progress dark:from-emerald-600 dark:to-teal-600" style={{width: '85%'}}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-900 dark:text-emerald-600">Loading Knowledge Base</span>
                    <span className="font-medium text-emerald-900 dark:text-emerald-600">72%</span>
                  </div>
                  <div className="w-full h-2 bg-emerald-100 dark:bg-emerald-700/30 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-900 to-teal-900 rounded-full animate-progress delay-200 dark:from-emerald-600 dark:to-teal-600" style={{width: '72%'}}></div>
                  </div>
                </div>
              </div>
              
              {/* AI Status Message */}
              <div className="mt-8 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-700/10 dark:to-teal-700/10 rounded-lg border border-emerald-200 dark:border-emerald-600/30">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-900 to-teal-900 flex items-center justify-center dark:from-emerald-600 dark:to-teal-600">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-emerald-900 dark:text-emerald-600">AI System</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-emerald-900 rounded-full animate-bounce dark:bg-emerald-600"></div>
                        <div className="w-2 h-2 bg-emerald-900 rounded-full animate-bounce delay-150 dark:bg-emerald-600"></div>
                        <div className="w-2 h-2 bg-emerald-900 rounded-full animate-bounce delay-300 dark:bg-emerald-600"></div>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-emerald-900 dark:text-emerald-600">
                      Preparing your personalized learning environment...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <style jsx>{`
            @keyframes progress {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .animate-progress {
              background-size: 200% 200%;
              animation: progress 2s ease infinite;
            }
          `}</style>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="relative min-h-screen overflow-hidden bg-white text-black dark:bg-black dark:text-white">
        {/* 🌌 Dark background animation */}
        <div className="hidden dark:block absolute inset-0 z-0">
          <Animate />
        </div>

        {/* Floating AI Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-emerald-600/50 rounded-full dark:bg-emerald-600/50"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* 💬 Main Chat Container */}
        <div className="relative z-10 max-w-6xl mx-auto mt-6 h-[100vh] flex">
          {/* Sidebar */}
          <div className="hidden lg:flex w-64 flex-col space-y-6 pr-6">
            {/* AI Stats Card */}
            <div className="bg-white dark:bg-black/5 border border-emerald-200 dark:border-emerald-700/30 rounded-2xl p-4 backdrop-blur">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-900 to-teal-900 flex items-center justify-center dark:from-emerald-600 dark:to-teal-600">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-emerald-900 dark:text-emerald-600">AI Mentor v2.5</h3>
                  <p className="text-xs text-emerald-900 dark:text-emerald-600">Online</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tokens Used</span>
                  <span className="font-medium text-emerald-900 dark:text-emerald-600">1,248</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Response Time</span>
                  <span className="font-medium text-emerald-900 dark:text-emerald-600">1.2s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Accuracy</span>
                  <span className="font-medium text-emerald-900 dark:text-emerald-600">98.5%</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-black/5 border border-emerald-200 dark:border-emerald-700/30 rounded-2xl p-4 backdrop-blur">
              <h4 className="font-semibold text-emerald-900 dark:text-emerald-600 mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <button 
                  onClick={clearChat}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-700/20 transition-colors text-emerald-900 dark:text-emerald-600"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>New Chat</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-700/20 transition-colors text-emerald-900 dark:text-emerald-600">
                  <Copy className="w-4 h-4" />
                  <span>Export Chat</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-700/20 transition-colors text-emerald-900 dark:text-emerald-600">
                  <Zap className="w-4 h-4" />
                  <span>Toggle Dark Mode</span>
                </button>
              </div>
            </div>

            {/* Learning Topics */}
            <div className="bg-white dark:bg-black/5 border border-emerald-200 dark:border-emerald-700/30 rounded-2xl p-4 backdrop-blur">
              <h4 className="font-semibold text-emerald-900 dark:text-emerald-600 mb-3">Topics</h4>
              <div className="flex flex-wrap gap-2">
                {["DSA", "React", "Node.js", "Python", "SQL", "System Design", "DevOps", "Algorithms"].map((topic) => (
                  <span 
                    key={topic}
                    className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-600/10 dark:text-emerald-600 border border-emerald-200 dark:border-emerald-700"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-white dark:bg-black/5 border border-emerald-200 dark:border-emerald-700/30 rounded-2xl shadow-lg backdrop-blur">
            {/* Header */}
            <div className="px-6 py-4 border-b border-emerald-200 dark:border-emerald-700/30 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-700/10 dark:to-teal-700/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-900 to-teal-900 flex items-center justify-center dark:from-emerald-600 dark:to-teal-600">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-emerald-900 dark:text-emerald-600">
                      Neural AI Engineering Mentor
                    </h2>
                    <p className="text-sm text-emerald-900 dark:text-emerald-600">
                      Real-time DSA • Web Dev • System Design Guidance
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-900 rounded-full animate-pulse dark:bg-emerald-600"></div>
                  <span className="text-sm text-emerald-900 dark:text-emerald-600">Active</span>
                </div>
              </div>
            </div>

            {/* Guide Chips */}
            <div className="px-6 py-3 border-b border-emerald-100 dark:border-emerald-700/20 bg-white dark:bg-black/5 flex flex-wrap gap-2">
              {[
                "Ask for hints",
                "Share your code",
                "Discuss trade-offs",
                "Think scalable",
                "Optimize step-by-step",
                "Learn by doing",
              ].map((tip) => (
                <span
                  key={tip}
                  className="px-3 py-1.5 text-xs rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-900 dark:from-emerald-600/10 dark:to-teal-600/10 dark:text-emerald-600 border border-emerald-200 dark:border-emerald-700/30"
                >
                  {tip}
                </span>
              ))}
            </div>

            {/* Quick Prompts */}
            <div className="px-6 py-3 border-b border-emerald-100 dark:border-emerald-700/20 bg-emerald-50/50 dark:bg-emerald-700/5">
              <p className="text-xs font-medium text-emerald-900 dark:text-emerald-600 mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {prompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="px-3 py-1.5 text-xs rounded-full bg-white dark:bg-black/20 text-emerald-900 dark:text-emerald-600 border border-emerald-200 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-700/20 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-start space-x-3`}
                >
                  {msg.role === "model" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-emerald-900 to-teal-900 flex items-center justify-center dark:from-emerald-600 dark:to-teal-600">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                  )}
                  
                  <div className="flex-1 max-w-[75%]">
                    <div
                      className={`px-4 py-3 rounded-xl text-sm leading-relaxed whitespace-pre-wrap
                        ${msg.role === "user"
                          ? "bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-br-none dark:from-emerald-600 dark:to-teal-600"
                          : "bg-emerald-50 dark:bg-emerald-700/20 text-emerald-900 dark:text-emerald-100 rounded-bl-none border border-emerald-100 dark:border-emerald-700/30"
                        }`}
                    >
                      {msg.parts[0].text}
                    </div>
                    
                    {/* Message Actions */}
                    <div className="flex items-center space-x-3 mt-2 px-1">
                      {msg.role === "model" && (
                        <>
                          <button
                            onClick={() => copyToClipboard(msg.parts[0].text)}
                            className="text-xs text-emerald-900 dark:text-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-500 transition-colors flex items-center space-x-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>
                          <button className="text-xs text-emerald-900 dark:text-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-500 transition-colors flex items-center space-x-1">
                            <ThumbsUp className="w-3 h-3" />
                            <span>Helpful</span>
                          </button>
                          <button className="text-xs text-emerald-900 dark:text-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-500 transition-colors flex items-center space-x-1">
                            <ThumbsDown className="w-3 h-3" />
                            <span>Not Helpful</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {msg.role === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-emerald-700 to-teal-700 flex items-center justify-center dark:from-emerald-500 dark:to-teal-500">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {/* AI Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-emerald-900 to-teal-900 flex items-center justify-center dark:from-emerald-600 dark:to-teal-600">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-700/20 px-4 py-3 rounded-xl rounded-bl-none border border-emerald-100 dark:border-emerald-700/30">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-emerald-900 dark:text-emerald-600">AI is thinking</span>
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-emerald-900 rounded-full animate-bounce dark:bg-emerald-600"></span>
                        <span className="w-2 h-2 bg-emerald-900 rounded-full animate-bounce delay-150 dark:bg-emerald-600"></span>
                        <span className="w-2 h-2 bg-emerald-900 rounded-full animate-bounce delay-300 dark:bg-emerald-600"></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Regenerate Button */}
              {messages.length > 1 && messages[messages.length - 1].role === "model" && !isTyping && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={regenerateResponse}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-700/20 text-emerald-900 dark:text-emerald-600 border border-emerald-200 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-700/30 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="text-sm font-medium">Regenerate Response</span>
                  </button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="px-6 py-4 border-t border-emerald-200 dark:border-emerald-700/30 bg-white dark:bg-black/5 flex gap-3 items-center rounded-b-2xl"
            >
              <div className="flex-1 relative">
                <input
                  placeholder="Ask about DSA, React, Node.js, System Design..."
                  {...register("message", { required: true, minLength: 2 })}
                  className="w-full px-4 py-3 pl-10 rounded-xl text-sm bg-emerald-50 dark:bg-emerald-700/10 border border-emerald-300 dark:border-emerald-700/30 focus:outline-none focus:ring-2 focus:ring-emerald-900 focus:border-transparent dark:focus:ring-emerald-600 text-emerald-900 dark:text-emerald-100 placeholder-emerald-900/70 dark:placeholder-emerald-600/50"
                />
                <MessageSquare className="absolute left-3 top-3.5 w-4 h-4 text-emerald-900 dark:text-emerald-600" />
              </div>

              <button
                disabled={errors.message || isTyping}
                className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex items-center justify-center hover:from-emerald-800 hover:to-teal-800 dark:from-emerald-600 dark:to-teal-600 dark:hover:from-emerald-500 dark:hover:to-teal-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
              >
                <Send size={20} />
              </button>
            </form>

            {/* Footer */}
            <div className="px-6 py-2 border-t border-emerald-200 dark:border-emerald-700/30 bg-emerald-50/50 dark:bg-emerald-700/5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3 text-emerald-900 dark:text-emerald-600">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-emerald-900 rounded-full animate-pulse dark:bg-emerald-600"></div>
                    <span>AI System • Online</span>
                  </div>
                  <span className="text-emerald-900/70 dark:text-emerald-600/70">•</span>
                  <span>{messages.length} messages</span>
                </div>
                <button className="text-emerald-900 dark:text-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-500 transition-colors">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) translateX(0); opacity: 0.5; }
            50% { transform: translateY(-20px) translateX(10px); opacity: 1; }
          }
        `}</style>
      </div>
    </AppLayout>
  );
}

export default Ask;