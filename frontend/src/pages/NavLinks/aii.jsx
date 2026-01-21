

// import { useState, useRef, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import axiosClient from "../../utils/axiosClient";
// import { Send } from "lucide-react";
// import Animate from "../../animate";
// import AppLayout from "../../Components/AppLayout";
// import { Bot, Cpu, MessageSquare, Sparkles } from 'lucide-react';
// import { Brain } from "lucide-react";

// function Ask() {
//   const [messages, setMessages] = useState([
//     {
//       role: "model",
//       parts: [
//         {
//           text:
//             "Hi 👋 I'm your AI Software Engineering mentor.\n\n" +
//             "You can ask me about:\n" +
//             "• Data Structures & Algorithms\n" +
//             "• Web Development (Frontend / Backend)\n" +
//             "• System Design & Architecture\n\n" +
//             "Ask for hints, explanations, code reviews, or design guidance 🚀",
//         },
//       ],
//     },
//   ]);

//   const [isTyping, setIsTyping] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const messagesEndRef = useRef(null);

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm();

//   useEffect(() => {
//     // Simulate initial load (or fetch user session / AI init)
//     const timer = setTimeout(() => {
//       setLoading(false);
//     }, 1200); // 1.2s loader
//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, isTyping]);

//   const onSubmit = async (data) => {
//     const userMsg = {
//       role: "user",
//       parts: [{ text: data.message }],
//     };

//     const updatedMessages = [...messages, userMsg];
//     setMessages(updatedMessages);
//     reset();
//     setIsTyping(true);

//     try {
//       const response = await axiosClient.post("/ai/ask", {
//         messages: updatedMessages,
//       });

//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "model",
//           parts: [{ text: response.data.message }],
//         },
//       ]);
//     } catch (err) {
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "model",
//           parts: [
//             {
//               text: "⚠️ Something went wrong. Please try again.",
//             },
//           ],
//         },
//       ]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//     if (loading) {
//     return (
//       <AppLayout>
//         <div className="relative min-h-screen overflow-hidden bg-white text-black dark:bg-black dark:text-white">
//           {/* 🌌 Animated Background (dark only) */}
//           <div className="hidden dark:block">
//             <Animate />
//           </div>
          
//           <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
//             <div className="flex flex-col items-center">
//               <div className="relative">
//                 {/* Light mode: emerald-900, Dark mode: emerald-400/30 */}
//                 <div className="w-20 h-20 border-4 border-emerald-900/30 rounded-full dark:border-emerald-400/30"></div>
                
//                 {/* Light mode: emerald-900, Dark mode: emerald-400 */}
//                 <div className="absolute inset-0 w-20 h-20 border-4 border-emerald-900 border-t-transparent rounded-full animate-spin dark:border-emerald-400 dark:border-t-transparent"></div>
                
//                 {/* Light mode: emerald-900, Dark mode: emerald-400 */}
//                 <Brain className="absolute inset-0 m-auto w-8 h-8 text-emerald-900 dark:text-emerald-400" />
//               </div>
              
//               {/* Light mode: emerald-900, Dark mode: emerald-400 */}
//               <p className="mt-6 text-lg font-medium text-emerald-900 dark:text-emerald-400">
//                 Loading AI...
//               </p>
              
//               {/* Light mode: black with opacity, Dark mode: white with opacity */}
//               <p className="mt-2 text-sm text-black/60 dark:text-white/60">
//                 Preparing the conversation space
//               </p>
//             </div>
//           </div>
//         </div>
//       </AppLayout>
//     );
//   }

  



//   return (
//     <AppLayout>
//       <div className="relative min-h-screen overflow-hidden bg-white text-black dark:bg-black dark:text-white">
//         {/* 🌌 Dark background animation */}
//         <div className="hidden dark:block absolute inset-0 z-0">
//           <Animate />
//         </div>

//         {/* 💬 Chat Container */}
//         <div className="relative z-10 max-w-3xl mx-auto mt-10 h-[92vh] flex flex-col bg-white dark:bg-black/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-lg backdrop-blur">

//           {/* Header */}
//           <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10">
//             <h2 className="text-lg font-extrabold text-gray-900 dark:text-emerald-400">
//               🤖 AI Engineering Mentor
//             </h2>
//             <p className="text-sm text-gray-500 dark:text-white/60">
//               DSA • Web Development • System Design
//             </p>
//           </div>

//           {/* Guide Chips */}
//           <div className="px-6 py-3 border-b border-gray-100 bg-gray-50 dark:bg-black/10 text-xs flex flex-wrap gap-2">
//             {[
//               "Ask for hints",
//               "Share your code",
//               "Discuss trade-offs",
//               "Think scalable",
//               "Optimize step-by-step",
//               "Learn by doing",
//             ].map((tip) => (
//               <span
//                 key={tip}
//                 className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
//               >
//                 {tip}
//               </span>
//             ))}
//           </div>

//           {/* Messages */}
//           <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
//             {messages.map((msg, idx) => (
//               <div
//                 key={idx}
//                 className={`flex ${
//                   msg.role === "user" ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 <div
//                   className={`max-w-[75%] px-4 py-3 rounded-xl text-sm leading-relaxed whitespace-pre-wrap
//                     ${
//                       msg.role === "user"
//                         ? "bg-emerald-600 text-white rounded-br-none"
//                         : "bg-gray-100 text-gray-900 dark:bg-black/40 dark:text-white rounded-bl-none"
//                     }`}
//                 >
//                   {msg.parts[0].text}
//                 </div>
//               </div>
//             ))}

//             {/* Typing Indicator */}
//             {isTyping && (
//               <div className="flex justify-start">
//                 <div className="bg-gray-100 dark:bg-black/40 px-4 py-3 rounded-xl rounded-bl-none">
//                   <div className="flex gap-1">
//                     <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
//                     <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-150" />
//                     <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-300" />
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input */}
//           <form
//             onSubmit={handleSubmit(onSubmit)}
//             className="px-6 py-4 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-black/5 flex gap-3 items-center rounded-b-2xl"
//           >
//             <input
//               placeholder="Ask about DSA, React, Node.js, System Design..."
//               {...register("message", { required: true, minLength: 2 })}
//               className="flex-1 px-4 py-3 rounded-xl text-sm bg-gray-50 dark:bg-black/10 border border-gray-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400"
//             />

//             <button
//               disabled={errors.message || isTyping}
//               className="w-11 h-11 rounded-xl bg-emerald-700 text-white flex items-center justify-center hover:bg-emerald-900 transition-all disabled:opacity-40"
//             >
//               <Send size={18} />
//             </button>
//           </form>
//         </div>
//       </div>
//     </AppLayout>
//   );
// }

// export default Ask;



import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import Editor from "@monaco-editor/react";
import axiosClient from "../../utils/axiosClient";
import SubmissionHistory from "./SubmissionHistory";
import ChatAI from "../../pages/NavLinks/ChatAi";
import Editorial from "./Editorial";
import AppLayout from "../AppLayout";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { Code } from "lucide-react";
import Animate from "../../animate";

// Display names for buttons
const langMap = { cpp: "C++", java: "Java", javascript: "JavaScript", c: "C", python: "Python" };

// Monaco editor language mapping
const getMonacoLang = (lang) => {
    switch (lang) {
        case "cpp": return "cpp";
        case "c": return "c";
        case "java": return "java";
        case "javascript": return "javascript";
        case "python": return "python";
        default: return "javascript";
    }
};

// Backend enum mapping
const backendLangMap = { cpp: "c++", java: "java", javascript: "javascript", c: "c", python: "python" };

const ProblemPage = () => {
    const { problemId } = useParams();
    const editorRef = useRef(null);

    const [problem, setProblem] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState("javascript");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(true);

    const [activeLeftTab, setActiveLeftTab] = useState("description");
    const [activeRightTab, setActiveRightTab] = useState("code");

    const [runLoading, setRunLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [runResult, setRunResult] = useState([]);
    const [submitResult, setSubmitResult] = useState(null);

    // Fetch problem
    useEffect(() => {
        const fetchProblem = async () => {
            try {
                setLoading(true);
                const res = await axiosClient.get(`/problem/getProblemById/${problemId}`);
                const data = res.data.problem;
                setProblem(data);

                const initialCode =
                    data?.startCode?.find((sc) => sc.language.toLowerCase() === backendLangMap[selectedLanguage])?.initialCode || "";
                setCode(initialCode);
            } catch (err) {
                console.error("Problem fetch failed:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProblem();
    }, [problemId, selectedLanguage]);

   

    // Update code on language change
    useEffect(() => {
        if (!problem) return;
        const initialCode =
            problem.startCode?.find((sc) => sc.language.toLowerCase() === backendLangMap[selectedLanguage])?.initialCode || "";
        setCode(initialCode);
    }, [selectedLanguage, problem]);

    // Run code
    const handleRun = async () => {
        if (!code.trim()) return;
        try {
            setRunLoading(true);
            setRunResult([]);

            const res = await axiosClient.post(`/submission/run/${problemId}`, {
                code,
                language: backendLangMap[selectedLanguage]
            });

            setRunResult(res.data.testCases || []);
            setActiveRightTab("testcase");
        } catch (err) {
            console.error(err);
            setRunResult([{ status_id: 4, error: "Execution failed" }]);
            setActiveRightTab("testcase");
        } finally {
            setRunLoading(false);
        }
    };

    // Submit code
    const handleSubmitCode = async () => {
        if (!code.trim()) return;
        try {
            setSubmitLoading(true);
            setSubmitResult(null);

            const res = await axiosClient.post(`/submission/submit/${problemId}`, {
                code,
                language: backendLangMap[selectedLanguage]
            });

            setSubmitResult(res.data || {});
            setActiveRightTab("result");
        } catch (err) {
            console.error(err);
            setSubmitResult({ accepted: false, error: "Submission failed", passedTestCases: 0, totalTestCases: 0 });
            setActiveRightTab("result");
        } finally {
            setSubmitLoading(false);
        }
    };

  if (loading) {
   return (
     <AppLayout>
       <div className="relative min-h-screen overflow-hidden bg-white text-black dark:bg-black dark:text-white">
         {/* 🌌 Animated Background (dark only) */}
         <div className="hidden dark:block">
           <Animate />
         </div>
         
         <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
           <div className="flex flex-col items-center">
             <div className="relative">
               {/* Light mode: emerald-900, Dark mode: emerald-400/30 */}
               <div className="w-20 h-20 border-4 border-emerald-900/30 rounded-full dark:border-emerald-400/30"></div>
               
               {/* Light mode: emerald-900, Dark mode: emerald-400 */}
               <div className="absolute inset-0 w-20 h-20 border-4 border-emerald-900 border-t-transparent rounded-full animate-spin dark:border-emerald-400 dark:border-t-transparent"></div>
               
               {/* Light mode: emerald-900, Dark mode: emerald-400 */}
               <Code className="absolute inset-0 m-auto w-8 h-8 text-emerald-900 dark:text-emerald-400" />
             </div>
             
             {/* Light mode: emerald-900, Dark mode: emerald-400 */}
             <p className="mt-6 text-lg font-medium text-emerald-900 dark:text-emerald-400">
               Loading problems...
             </p>
             
             {/* Light mode: black with opacity, Dark mode: white with opacity */}
             <p className="mt-2 text-sm text-black/60 dark:text-white/60">
               Getting your problem set ready
             </p>
           </div>
         </div>
       </div>
     </AppLayout>
   );
 }

    if (!problem)
        return (
            <div className="min-h-screen flex items-center justify-center text-red-400">
                Problem not found
            </div>
        );

    return (
        <AppLayout>
            <div className="h-screen flex bg-white text-black dark:bg-black dark:text-white">
                {/* LEFT PANEL */}
                <div className="w-1/2 flex flex-col border-r border-black/10 dark:border-white/10">
                    {/* LEFT TABS */}
                    <div className="flex gap-6 px-6 py-4 bg-white/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10 backdrop-blur">
                        {["description", "editorial", "solutions", "submissions", "chatAI"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveLeftTab(tab)}
                                className={`text-sm font-medium pb-2 transition-all ${activeLeftTab === tab
                                    ? "text-emerald-400 border-b-2 border-emerald-400"
                                    : "text-black/60 dark:text-white/60 hover:text-emerald-400"
                                    }`}
                            >
                                {tab.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    {/* LEFT CONTENT */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">

                        {/* DESCRIPTION */}
                        {activeLeftTab === "description" && (
                            <>
                                {/* Title & Difficulty */}
                                <div className="flex items-center gap-4 flex-wrap mb-4">
                                    <h1 className="text-3xl sm:text-4xl font-extrabold text-black dark:text-white">
                                        {problem.title}
                                    </h1>

                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${problem.difficulty === "easy"
                                            ? "bg-emerald-500/10 text-emerald-400"
                                            : problem.difficulty === "medium"
                                                ? "bg-yellow-500/10 text-yellow-400"
                                                : "bg-red-500/10 text-red-400"
                                            }`}
                                    >
                                        {problem.difficulty?.toUpperCase()}
                                    </span>

                                    {problem.points !== undefined && (
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400">
                                            {problem.points} points
                                        </span>
                                    )}
                                </div>

                                {/* Companies */}
                                {problem.companies?.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {problem.companies.map((company, i) => (
                                            <span
                                                key={i}
                                                className="px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-xs font-medium"
                                            >
                                                {company}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Tags */}
                                {problem.tags?.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {problem.tags.map((tag, i) => (
                                            <span
                                                key={i}
                                                className="px-2 py-1 rounded-full bg-indigo-200 dark:bg-indigo-800 text-xs text-indigo-800 dark:text-indigo-200"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Visible Test Cases */}
                                {problem.visibleTestCases?.map((ex, i) => (
                                    <div
                                        key={i}
                                        className="bg-white/5 dark:bg-black/10 border border-black/10 dark:border-white/10 rounded-2xl p-4 mb-4 backdrop-blur hover:scale-[1.02] transition-transform"
                                    >
                                        <p className="font-semibold mb-2">Example {i + 1}</p>
                                        <pre className="text-xs font-mono whitespace-pre-wrap">
                                            Input: {typeof ex.input === "object" ? JSON.stringify(ex.input, null, 2) : ex.input}
                                            {"\n"}Output: {typeof ex.output === "object" ? JSON.stringify(ex.output, null, 2) : ex.output}
                                            {"\n"}Explanation: {ex.explanation}
                                        </pre>
                                    </div>
                                ))}

                                {/* Constraints */}
                                {problem.constraints && (
                                    <div className="mt-4 p-4 border border-black/10 dark:border-white/10 rounded-2xl bg-white/5 backdrop-blur">
                                        <p className="font-semibold mb-2">Constraints:</p>
                                        <pre className="text-xs font-mono whitespace-pre-wrap">{problem.constraints}</pre>
                                    </div>
                                )}

                                {/* Complexity */}
                                {problem.complexity && (
                                    <div className="mt-4 p-4 border border-black/10 dark:border-white/10 rounded-2xl bg-white/5 backdrop-blur">
                                        <p className="font-semibold mb-2">Complexity:</p>
                                        <p>Time: {problem.complexity.time}</p>
                                        <p>Space: {problem.complexity.space}</p>
                                    </div>
                                )}

                                {/* Likes / Dislikes */}
                                <div className="flex gap-6 mt-6 text-gray-600 dark:text-gray-300">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-emerald-400 transition-colors">
                                        <FaThumbsUp /> {problem.likes || 0}
                                    </div>
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-red-400 transition-colors">
                                        <FaThumbsDown /> {problem.dislikes || 0}
                                    </div>
                                </div>
                            </>
                        )}



                        {/* {activeLeftTab === "editorial" && problem.secureUrl && (
                            <Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration} />
                        )} */}
                        {activeLeftTab === "editorial" && (
                            problem.secureUrl ? (
                                <Editorial
                                    secureUrl={problem.secureUrl}
                                    thumbnailUrl={problem.thumbnailUrl}
                                    duration={problem.duration}
                                />
                            ) : (
                                <div className="text-gray-400 text-sm">
                                    Editorial video not available for this problem.
                                </div>
                            )
                        )}


                        {activeLeftTab === "solutions" &&
                            problem.referenceSolution?.map((sol, i) => (
                                <div key={i} className="bg-white/5 border border-black/10 dark:border-white/10 rounded-xl overflow-hidden my-2">
                                    <div className="px-4 py-2 font-semibold border-b border-black/10 dark:border-white/10">{sol.language}</div>
                                    <pre className="p-4 text-xs font-mono overflow-x-auto">{sol.completeCode}</pre>
                                </div>
                            ))}

                        {activeLeftTab === "submissions" && <SubmissionHistory problemId={problemId} />}
                        {activeLeftTab === "chatAI" && <ChatAI problem={problem} />}
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="w-1/2 flex flex-col">
                    {/* RIGHT TABS */}
                    <div className="flex gap-6 px-6 py-4 bg-white/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10 backdrop-blur">
                        {["code", "testcase", "result"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveRightTab(tab)}
                                className={`text-sm font-medium pb-2 transition-all ${activeRightTab === tab
                                    ? "text-emerald-400 border-b-2 border-emerald-400"
                                    : "text-black/60 dark:text-white/60 hover:text-emerald-400"
                                    }`}
                            >
                                {tab.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    {/* CODE */}
                    {activeRightTab === "code" && (
                        <>
                            <div className="p-2 flex gap-2 border-b border-black/10 dark:border-white/10">
                                {Object.keys(langMap).map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => setSelectedLanguage(lang)}
                                        className={`px-4 py-1.5 rounded-lg text-sm ${selectedLanguage === lang ? "bg-emerald-500 text-black" : "bg-white/5 hover:bg-white/10"
                                            }`}
                                    >
                                        {langMap[lang]}
                                    </button>
                                ))}
                            </div>

                            <Editor
                                height="100%"
                                language={getMonacoLang(selectedLanguage)}
                                value={code}
                                onChange={(v) => setCode(v || "")}
                                theme="vs-dark"
                                options={{ fontSize: 14, minimap: { enabled: false } }}
                            />

                            <div className="p-4 flex justify-end gap-3 border-t border-black/10 dark:border-white/10">
                                <button
                                    onClick={handleRun}
                                    disabled={runLoading}
                                    className="px-4 py-2 rounded-lg border border-black/10 dark:border-white/10 hover:bg-white/10"
                                >
                                    {runLoading ? "Running…" : "Run"}
                                </button>
                                <button
                                    onClick={handleSubmitCode}
                                    disabled={submitLoading}
                                    className="px-4 py-2 rounded-lg bg-emerald-500 text-black hover:bg-emerald-400"
                                >
                                    {submitLoading ? "Submitting…" : "Submit"}
                                </button>
                            </div>
                        </>
                    )}

                    {/* TESTCASE */}
                    {activeRightTab === "testcase" && (
                        <div className="flex-1 p-4 overflow-y-auto space-y-4">
                            {!runResult || runResult.length === 0 ? (
                                <div className="text-gray-500">Click "Run" to test your code with example test cases.</div>
                            ) : (
                                runResult.map((tc, i) => (
                                    <div
                                        key={i}
                                        className="bg-white/5 p-4 rounded-xl border border-black/10 dark:border-white/10 font-mono text-xs"
                                    >
                                        <div><strong>Input:</strong> {tc.stdin}</div>
                                        <div><strong>Expected:</strong> {tc.expected_output}</div>
                                        <div><strong>Output:</strong> {tc.stdout}</div>
                                        {tc.error && <div className="text-red-500"><strong>Error:</strong> {tc.error}</div>}
                                        <div className={tc.status_id === 3 ? "text-green-600" : "text-red-600"}>
                                            {tc.status_id === 3 ? "✓ Passed" : "✗ Failed"}
                                        </div>
                                        <div className="text-gray-400 text-xs">Time: {tc.runtime}s, Memory: {tc.memory}KB</div>
                                    </div>
                                ))
                            )}
                            <div className="p-4 flex justify-end gap-3 border-t border-black/10 dark:border-white/10">
                                <button
                                    onClick={handleRun}
                                    disabled={runLoading}
                                    className="px-4 py-2 rounded-lg border border-black/10 dark:border-white/10 hover:bg-white/10"
                                >
                                    {runLoading ? "Running…" : "Run"}
                                </button>
                                <button
                                    onClick={handleSubmitCode}
                                    disabled={submitLoading}
                                    className="px-4 py-2 rounded-lg bg-emerald-500 text-black hover:bg-emerald-400"
                                >
                                    {submitLoading ? "Submitting…" : "Submit"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* RESULT */}
                    {activeRightTab === "result" && (
                        <div className="flex-1 p-4 overflow-y-auto space-y-4">
                            {!submitResult && <div className="text-gray-500">Click "Submit" to evaluate your solution.</div>}
                            {submitResult && (
                                <div className={`alert ${submitResult.accepted ? "alert-success" : "alert-error"}`}>
                                    <div>
                                        {submitResult.accepted ? (
                                            <>
                                                <h4 className="font-bold text-lg">🎉 Accepted</h4>
                                                <p>Test Cases Passed: {submitResult.passedTestCases}/{submitResult.totalTestCases}</p>
                                                <p>Runtime: {submitResult.runtime}s</p>
                                                <p>Memory: {submitResult.memory}KB</p>
                                            </>
                                        ) : (
                                            <>
                                                <h4 className="font-bold text-lg">❌ {submitResult.error || "Failed"}</h4>
                                                <p>Test Cases Passed: {submitResult.passedTestCases}/{submitResult.totalTestCases}</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default ProblemPage;
