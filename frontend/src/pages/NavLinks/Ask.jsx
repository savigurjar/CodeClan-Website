

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../../utils/axiosClient";
import { Send } from "lucide-react";
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
  const messagesEndRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    // Simulate initial load (or fetch user session / AI init)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200); // 1.2s loader
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="flex flex-col items-center bg-green-50 dark:bg-black/20 border border-green-200 dark:border-white/20 rounded-2xl p-8 shadow-lg">
          {/* Spinner */}
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-900 dark:border-emerald-400 mb-4"></div>
          {/* Message */}
          <p className="text-green-900 dark:text-emerald-400 font-semibold text-lg">
            Initializing AI Mentor...
          </p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="relative min-h-screen overflow-hidden bg-white text-black dark:bg-black dark:text-white">
        {/* 🌌 Dark background animation */}
        <div className="hidden dark:block absolute inset-0 z-0">
          <Animate />
        </div>

        {/* 💬 Chat Container */}
        <div className="relative z-10 max-w-3xl mx-auto mt-10 h-[92vh] flex flex-col bg-white dark:bg-black/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-lg backdrop-blur">

          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10">
            <h2 className="text-lg font-extrabold text-gray-900 dark:text-emerald-400">
              🤖 AI Engineering Mentor
            </h2>
            <p className="text-sm text-gray-500 dark:text-white/60">
              DSA • Web Development • System Design
            </p>
          </div>

          {/* Guide Chips */}
          <div className="px-6 py-3 border-b border-gray-100 bg-gray-50 dark:bg-black/10 text-xs flex flex-wrap gap-2">
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
                className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
              >
                {tip}
              </span>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-xl text-sm leading-relaxed whitespace-pre-wrap
                    ${
                      msg.role === "user"
                        ? "bg-emerald-600 text-white rounded-br-none"
                        : "bg-gray-100 text-gray-900 dark:bg-black/40 dark:text-white rounded-bl-none"
                    }`}
                >
                  {msg.parts[0].text}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-black/40 px-4 py-3 rounded-xl rounded-bl-none">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-150" />
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-300" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="px-6 py-4 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-black/5 flex gap-3 items-center rounded-b-2xl"
          >
            <input
              placeholder="Ask about DSA, React, Node.js, System Design..."
              {...register("message", { required: true, minLength: 2 })}
              className="flex-1 px-4 py-3 rounded-xl text-sm bg-gray-50 dark:bg-black/10 border border-gray-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />

            <button
              disabled={errors.message || isTyping}
              className="w-11 h-11 rounded-xl bg-emerald-700 text-white flex items-center justify-center hover:bg-emerald-900 transition-all disabled:opacity-40"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

export default Ask;