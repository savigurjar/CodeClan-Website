import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import Editor from "@monaco-editor/react";
import axiosClient from "../../utils/axiosClient";
import SubmissionHistory from "./SubmissionHistory";
import ChatAI from "../../pages/NavLinks/ChatAi";
import Editorial from "./Editorial";
import AppLayout from "../AppLayout";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

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

    //     useEffect(() => {
    //     const fetchProblem = async () => {
    //         try {
    //             setLoading(true);

    //             // Fetch the problem from backend
    //             const res = await axiosClient.get(`/problem/getProblemById/${problemId}`);

    //             // Extract the actual problem object
    //             const data = res.data.problem;

    //             if (!data) {
    //                 console.error("Problem not found in response");
    //                 setProblem(null);
    //                 return;
    //             }

    //             setProblem(data);

    //             // Get initial code for the selected language
    //             const initialCode =
    //                 data?.startCode?.find(
    //                     (sc) => sc.language.toLowerCase() === backendLangMap[selectedLanguage]
    //                 )?.initialCode || "";

    //             setCode(initialCode);

    //         } catch (err) {
    //             console.error("Problem fetch failed:", err);
    //             setProblem(null);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchProblem();
    // }, [problemId, selectedLanguage]);


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
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center bg-green-50 border border-green-200 rounded-2xl p-8 shadow-lg">
        {/* Spinner */}
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-900 mb-4"></div>
        {/* Message */}
        <p className="text-green-900 font-semibold text-lg">
          Loading problem...
        </p>
      </div>
    </div>
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
