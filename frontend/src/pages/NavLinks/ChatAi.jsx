import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../../utils/axiosClient";
import { Send } from "lucide-react";
import Animate from "../../animate";

function ChatAi({ problem }) {
  const [messages, setMessages] = useState([
    {
      role: "model",
      parts: [
        {
          text: "Hi 👋 I'm your DSA mentor. Ask me anything about logic, hints, or problem-solving.",
        },
      ],
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

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
      const response = await axiosClient.post("/ai/chat", {
        messages: updatedMessages,                 // ✅ latest messages
        title: problem?.title,
        description: problem?.description,
        testCases: problem?.visibleTestCases,     // ✅ important
        startCode: problem?.startCode,             // ✅ important
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
          parts: [{ text: "⚠️ Something went wrong. Please try again." }],
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-black dark:bg-black dark:text-white">
      
      {/* 🌌 Dark background animation */}
      <div className="hidden dark:block absolute inset-0 z-0">
        <Animate />
      </div>

      {/* 💬 Chat Container */}
      <div className="relative z-10 max-w-3xl mx-auto h-[92vh] flex flex-col bg-white dark:bg-black/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-lg backdrop-blur">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10">
          <h2 className="text-lg font-extrabold text-gray-900 dark:text-emerald-400">
            🤖 DSA AI Mentor
          </h2>
          <p className="text-sm text-gray-500 dark:text-white/60">
            Get hints, logic explanations & optimized approaches
          </p>
        </div>

        {/* Guide Chips */}
        <div className="px-6 py-3 border-b border-gray-100 bg-gray-50 dark:bg-black/10 text-xs flex flex-wrap gap-2">
          {[
            "Read problem carefully",
            "Start brute force",
            "Dry run examples",
            "Identify patterns",
            "Optimize step-by-step",
            "Practice daily",
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
                  }
                `}
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
            placeholder="Ask about hints, logic, edge cases..."
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
  );
}

export default ChatAi; 

























// import { useState, useRef, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import axiosClient from "../../utils/axiosClient";
// import { Send, Minimize2, MessageCircle } from "lucide-react";
// import Animate from "../../animate";

// function ChatAi({ problem }) {
//   const [messages, setMessages] = useState([
//     {
//       role: "model",
//       parts: [
//         { text: "Hi 👋 I'm your DSA mentor. Ask me anything about logic or hints." },
//       ],
//     },
//   ]);

//   const [isTyping, setIsTyping] = useState(false);
//   const [isOpen, setIsOpen] = useState(false); // chat window open/close
//   const [isMinimized, setIsMinimized] = useState(false); // minimized state

//   const messagesEndRef = useRef(null);
//   const { register, handleSubmit, reset } = useForm();

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, isTyping]);

//   const onSubmit = async (data) => {
//     const userMsg = { role: "user", parts: [{ text: data.message }] };
//     const updatedMessages = [...messages, userMsg];

//     setMessages(updatedMessages);
//     reset();
//     setIsTyping(true);

//     try {
//       const res = await axiosClient.post("/ai/chat", {
//         messages: updatedMessages,
//         title: problem?.title,
//         description: problem?.description,
//         testCases: problem?.visibleTestCases,
//         startCode: problem?.startCode,
//       });

//       setMessages((prev) => [
//         ...prev,
//         { role: "model", parts: [{ text: res.data.message }] },
//       ]);
//     } catch {
//       setMessages((prev) => [
//         ...prev,
//         { role: "model", parts: [{ text: "⚠️ Something went wrong." }] },
//       ]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   return (
//     <>
//       {/* 🟢 FLOATING BUTTON - ALWAYS Visible */}
//       <div className="fixed bottom-6 right-6 z-50">
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           className="flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700"
//         >
//           <MessageCircle size={18} />
//           DSA Chat
//         </button>
//       </div>

//       {/* 🔵 CHAT WINDOW */}
//       {isOpen && (
//         <div className="fixed bottom-20 right-6 z-50 w-[350px] h-[500px] flex flex-col bg-white dark:bg-black/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-lg backdrop-blur">
//           {/* Header */}
//           <div className="px-4 py-3 border-b flex justify-between items-center">
//             <h2 className="text-sm font-bold dark:text-emerald-400">
//               🤖 DSA AI Mentor
//             </h2>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setIsMinimized(!isMinimized)}
//                 className="p-1 rounded hover:bg-gray-100 dark:hover:bg-white/10"
//               >
//                 <Minimize2 size={16} />
//               </button>
//               <button
//                 onClick={() => setIsOpen(false)}
//                 className="p-1 rounded hover:bg-gray-100 dark:hover:bg-white/10"
//               >
//                 ✕
//               </button>
//             </div>
//           </div>

//           {/* Messages */}
//           {!isMinimized && (
//             <>
//               <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
//                 {messages.map((msg, i) => (
//                   <div
//                     key={i}
//                     className={`flex ${
//                       msg.role === "user" ? "justify-end" : "justify-start"
//                     }`}
//                   >
//                     <div
//                       className={`max-w-[75%] px-3 py-2 rounded-xl text-sm whitespace-pre-wrap ${
//                         msg.role === "user"
//                           ? "bg-emerald-600 text-white rounded-br-none"
//                           : "bg-gray-100 dark:bg-black/40 dark:text-white rounded-bl-none"
//                       }`}
//                     >
//                       {msg.parts[0].text}
//                     </div>
//                   </div>
//                 ))}

//                 {isTyping && (
//                   <div className="flex justify-start">
//                     <div className="bg-gray-100 dark:bg-black/40 px-3 py-2 rounded-xl">
//                       <span className="text-emerald-400">Typing...</span>
//                     </div>
//                   </div>
//                 )}

//                 <div ref={messagesEndRef} />
//               </div>

//               {/* Input */}
//               <form
//                 onSubmit={handleSubmit(onSubmit)}
//                 className="px-4 py-3 border-t flex gap-2"
//               >
//                 <input
//                   {...register("message", { required: true })}
//                   placeholder="Ask about logic, hints, edge cases..."
//                   className="flex-1 px-3 py-2 rounded-xl border focus:ring-2 focus:ring-emerald-400"
//                 />
//                 <button className="w-10 h-10 bg-emerald-700 text-white rounded-xl flex items-center justify-center">
//                   <Send size={16} />
//                 </button>
//               </form>
//             </>
//           )}
//         </div>
//       )}
//     </>
//   );
// }

// export default ChatAi;
