import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../../utils/axiosClient";
import { Send } from "lucide-react";
import Animate from "../../animate";
import AppLayout from "../../Components/AppLayout";

function ChatAi({ problem }) {
  const [messages, setMessages] = useState([
    {
      role: "model",
      parts: [
        {
          text: "Hi 👋 I'm your DSA mentor. Ask me anything about DSA or logic building.",
        },
      ],
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const onSubmit = async (data) => {
    const userMsg = { role: "user", parts: [{ text: data.message }] };
    setMessages(prev => [...prev, userMsg]);
    reset();
    setIsTyping(true);

    try {
      const response = await axiosClient.post("/ai/chat", {
        messages,
        title: problem?.title,
        description: problem?.description,
      });

      setMessages(prev => [
        ...prev,
        { role: "model", parts: [{ text: response.data.message }] },
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: "model", parts: [{ text: "⚠️ Something went wrong. Try again." }] },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AppLayout>
      <div className="relative min-h-screen  overflow-hidden bg-white text-black dark:bg-black dark:text-white">

        {/* Background for dark mode */}
        <div className="hidden dark:block absolute inset-0 z-0">
          <Animate />
        </div>

        {/* Chat container */}
        <div className="relative z-10 max-w-3xl mt-10 mx-auto h-[92vh] flex flex-col bg-white dark:bg-black/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-lg backdrop-blur">

          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10">
            <h2 className="text-lg font-extrabold text-gray-900 dark:text-emerald-400">
              🤖 DSA AI Mentor
            </h2>
            <p className="text-sm text-gray-500 dark:text-white/60">
              Get hints, logic explanations & problem-solving guidance
            </p>
          </div>

          {/* DSA Guide Top Chips */}
          <div className="px-6 py-3 border-b border-gray-100 bg-gray-50 dark:bg-black/10 text-xs flex flex-wrap gap-2">
            <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">Read problem carefully</span>
            <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700">Start brute force</span>
            <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">Dry run examples</span>
            <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-700">Identify patterns</span>
            <span className="px-2 py-1 rounded-full bg-pink-100 text-pink-700">Optimize step-by-step</span>
            <span className="px-2 py-1 rounded-full bg-teal-100 text-teal-700">Practice daily</span>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 bg-white dark:bg-transparent">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`
    max-w-[75%] px-4 py-3 rounded-xl text-sm leading-relaxed
    ${msg.role === "user"
                      ? "bg-emerald-600 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-900 dark:bg-black/40 dark:text-white rounded-bl-none"}
  `}
                >
                  {msg.parts[0].text}
                </div>

              </div>
            ))}

            {/* Typing indicator */}
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
          <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-black/5 flex gap-3 items-center rounded-b-2xl">
            <input
              placeholder="Ask about DSA, logic, or thinking approach..."
              {...register("message", { required: true, minLength: 2 })}
              className="flex-1 px-4 py-3 rounded-xl text-sm bg-gray-50 dark:bg-black/10 border border-gray-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <button
              disabled={errors.message}
              className="w-11 h-11 rounded-xl bg-emerald-700text-white  flex items-center justify-center hover:bg-emerald-900 transition-all disabled:opacity-40"
            >
              <Send size={18} />
            </button>
          </form>

        </div>
      </div>
    </AppLayout>
  );
}

export default ChatAi;
