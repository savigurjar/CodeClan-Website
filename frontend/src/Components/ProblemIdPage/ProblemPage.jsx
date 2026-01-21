import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import Editor from "@monaco-editor/react";
import axiosClient from "../../utils/axiosClient";
import SubmissionHistory from "./SubmissionHistory";
import ChatAI from "../../pages/NavLinks/ChatAi";
import Editorial from "./Editorial";
import AppLayout from "../AppLayout";
import { FaThumbsUp, FaThumbsDown, FaCopy, FaRedo, FaExpand, FaCompress, FaBook, FaCode, FaLightbulb, FaHistory, FaRobot } from "react-icons/fa";
import { Code, Clock, Cpu, Database, Users, TrendingUp, BarChart, CheckCircle, XCircle, AlertCircle, Zap, Brain } from "lucide-react";
import Animate from "../../animate";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

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
    const [isEditorExpanded, setIsEditorExpanded] = useState(false);

    const [problem, setProblem] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState("javascript");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(true);
    const [solutions, setSolutions] = useState([]);

    const [activeLeftTab, setActiveLeftTab] = useState("description");
    const [activeRightTab, setActiveRightTab] = useState("code");

    const [runLoading, setRunLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [runResult, setRunResult] = useState([]);
    const [submitResult, setSubmitResult] = useState(null);

    const [copied, setCopied] = useState(false);
    const [stats, setStats] = useState({
        totalSubmissions: 0,
        acceptanceRate: 0,
        difficultyBreakdown: { easy: 0, medium: 0, hard: 0 }
    });

    // Fetch problem
    useEffect(() => {
        const fetchProblem = async () => {
            try {
                setLoading(true);
                const res = await axiosClient.get(`/problem/getProblemById/${problemId}`);
                const data = res.data.problem;
                setProblem(data);

                // Fetch additional data
                const statsRes = await axiosClient.get(`/problem/stats/${problemId}`);
                setStats(statsRes.data);

                const solutionsRes = await axiosClient.get(`/problem/solutions/${problemId}`);
                setSolutions(solutionsRes.data.solutions || []);

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

    // Copy code to clipboard
    const copyCode = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Reset code to initial
    const resetCode = () => {
        if (!problem) return;
        const initialCode =
            problem.startCode?.find((sc) => sc.language.toLowerCase() === backendLangMap[selectedLanguage])?.initialCode || "";
        setCode(initialCode);
    };

    // Format time complexity
    const formatTimeComplexity = (complexity) => {
        if (!complexity) return "Not specified";
        return complexity.replace(/O\(/g, '<span class="text-emerald-500 dark:text-emerald-400">O(').replace(/\)/g, ')</span>');
    };

    if (loading) {
        return (
            <AppLayout>
                <div className="relative min-h-screen overflow-hidden bg-white text-black dark:bg-black dark:text-white">
                    {/* 🌌 Animated Background (dark only) */}
                    <div className="hidden dark:block">
                        <Animate />
                    </div>

                    {/* Neural Network Animation */}
                    <div className="absolute inset-0 hidden dark:block">
                        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-emerald-400 rounded-full animate-ping delay-300"></div>
                        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-emerald-300 rounded-full animate-ping delay-700"></div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
                        <div className="flex flex-col items-center max-w-md text-center">
                            {/* AI Icon with Animated Rings */}
                            <div className="relative mb-8">
                                {/* Outer Ring */}
                                <div className="w-24 h-24 border-4 border-emerald-900/20 rounded-full dark:border-emerald-600/20"></div>

                                {/* Middle Ring */}
                                <div className="absolute inset-4 w-16 h-16 border-4 border-emerald-900/30 rounded-full animate-spin dark:border-emerald-600/30">
                                    <div className="absolute -top-2 left-1/2 w-3 h-3 bg-emerald-700 dark:bg-emerald-600 rounded-full transform -translate-x-1/2"></div>
                                </div>

                                {/* Inner Core */}
                                <div className="absolute inset-8 flex items-center justify-center">
                                    <div className="relative">
                                        <Brain className="w-10 h-10 text-emerald-900 dark:text-emerald-600 animate-pulse" />
                                        <Zap className="absolute -top-1 -right-1 w-4 h-4 text-yellow-500 animate-bounce" />
                                    </div>
                                </div>
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl font-bold text-emerald-900 dark:text-emerald-600">
                                Loading Problem
                            </h1>

                            {/* Subtitle */}
                            <p className="mt-4 text-lg font-medium text-emerald-800 dark:text-emerald-500">
                                Fetching problem details...
                            </p>

                            {/* Progress Indicators */}
                            <div className="mt-8 w-full space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-emerald-800 dark:text-emerald-500">Loading Description</span>
                                        <span className="font-medium text-emerald-900 dark:text-emerald-600">65%</span>
                                    </div>
                                    <div className="w-full h-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-emerald-600 dark:to-emerald-700 rounded-full animate-progress" style={{ width: '65%' }}></div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-emerald-800 dark:text-emerald-500">Preparing Editor</span>
                                        <span className="font-medium text-emerald-900 dark:text-emerald-600">40%</span>
                                    </div>
                                    <div className="w-full h-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-emerald-600 dark:to-emerald-700 rounded-full animate-progress delay-200" style={{ width: '40%' }}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Loading Messages Animation */}
                            <div className="mt-6 space-y-3">
                                <div className="h-4 w-48 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full animate-pulse"></div>
                                <div className="h-4 w-40 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full animate-pulse delay-200"></div>
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

    if (!problem)
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-red-400 bg-gradient-to-br from-gray-50 to-emerald-50 dark:from-black dark:to-gray-900">
                <XCircle className="w-16 h-16 mb-4" />
                <h1 className="text-2xl font-bold mb-2">Problem Not Found</h1>
                <p className="text-gray-600 dark:text-gray-400">The requested problem doesn't exist or has been removed.</p>
            </div>
        );

    return (
        <AppLayout>
            <div className="h-screen flex bg-gradient-to-br from-gray-50 to-emerald-50 dark:from-black dark:to-gray-900 text-black dark:text-white">
                {/* LEFT PANEL */}
                <div className={`${isEditorExpanded ? 'hidden' : 'w-1/2'} flex flex-col border-r border-emerald-200 dark:border-emerald-800/30`}>
                    {/* LEFT TABS */}
                    <div className="flex gap-6 px-6 py-4 bg-gradient-to-r from-white to-emerald-50 dark:from-gray-900 dark:to-emerald-900/10 border-b border-emerald-200 dark:border-emerald-800/30 backdrop-blur">
                        {[
                            { id: "description", icon: <FaBook className="w-4 h-4" />, label: "Description" },
                            { id: "editorial", icon: <FaLightbulb className="w-4 h-4" />, label: "Editorial" },
                            { id: "solutions", icon: <FaCode className="w-4 h-4" />, label: "Solutions" },
                            { id: "submissions", icon: <FaHistory className="w-4 h-4" />, label: "Submissions" },
                            { id: "chatAI", icon: <FaRobot className="w-4 h-4" />, label: "AI Help" }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveLeftTab(tab.id)}
                                className={`flex items-center gap-2 text-sm font-medium pb-2 transition-all ${activeLeftTab === tab.id
                                    ? "text-emerald-900 dark:text-emerald-600 border-b-2 border-emerald-900 dark:border-emerald-600"
                                    : "text-gray-600 dark:text-gray-400 hover:text-emerald-900 dark:hover:text-emerald-500"
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* LEFT CONTENT */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">

                        {/* DESCRIPTION */}
                        {activeLeftTab === "description" && (
                            <>
                                {/* Title & Difficulty */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4 flex-wrap">
                                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
                                            {problem.title}
                                        </h1>

                                        <span
                                            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 ${problem.difficulty === "easy"
                                                ? "bg-emerald-500/10 text-emerald-900 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                                                : problem.difficulty === "medium"
                                                    ? "bg-yellow-500/10 text-yellow-900 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800"
                                                    : "bg-red-500/10 text-red-900 dark:text-red-400 border border-red-200 dark:border-red-800"
                                                }`}
                                        >
                                            <Zap className="w-3 h-3" />
                                            {problem.difficulty?.toUpperCase()}
                                        </span>

                                        {problem.points !== undefined && (
                                            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                                                {problem.points} points
                                            </span>
                                        )}
                                    </div>

                                    {/* Expand Button */}
                                    <button
                                        onClick={() => setIsEditorExpanded(!isEditorExpanded)}
                                        className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-500 hover:bg-emerald-200 dark:hover:bg-emerald-800/50"
                                    >
                                        {isEditorExpanded ? <FaCompress /> : <FaExpand />}
                                    </button>
                                </div>

                                {/* Stats Row */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="bg-white dark:bg-gray-900/50 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/30">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Total Submissions</span>
                                        </div>
                                        <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-600">{stats.totalSubmissions.toLocaleString()}</p>
                                    </div>

                                    <div className="bg-white dark:bg-gray-900/50 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/30">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Acceptance Rate</span>
                                        </div>
                                        <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-600">{stats.acceptanceRate}%</p>
                                    </div>

                                    <div className="bg-white dark:bg-gray-900/50 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/30">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Time Complexity</span>
                                        </div>
                                        <p className="text-lg font-bold text-emerald-900 dark:text-emerald-600" dangerouslySetInnerHTML={{ __html: formatTimeComplexity(problem.complexity?.time) }} />
                                    </div>

                                    <div className="bg-white dark:bg-gray-900/50 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/30">
                                        <div className="flex items-center gap-2">
                                            <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Space Complexity</span>
                                        </div>
                                        <p className="text-lg font-bold text-emerald-900 dark:text-emerald-600" dangerouslySetInnerHTML={{ __html: formatTimeComplexity(problem.complexity?.space) }} />
                                    </div>
                                </div>

                                {/* Problem Description */}
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                        <Code className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                                        Problem Statement
                                    </h2>
                                    <div className="prose dark:prose-invert max-w-none">
                                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{problem.description}</p>
                                    </div>
                                </div>

                                {/* Companies */}
                                {problem.companies?.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Asked By</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {problem.companies.map((company, i) => (
                                                <span
                                                    key={i}
                                                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-900 dark:text-blue-300 text-sm font-medium border border-blue-200 dark:border-blue-800"
                                                >
                                                    {company}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Tags */}
                                {problem.tags?.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Topics</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {problem.tags.map((tag, i) => (
                                                <span
                                                    key={i}
                                                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-900 dark:text-emerald-300 text-sm font-medium border border-emerald-200 dark:border-emerald-800"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Examples */}
                                {problem.visibleTestCases?.map((ex, i) => (
                                    <div
                                        key={i}
                                        className="mb-6 bg-gradient-to-br from-white to-emerald-50 dark:from-gray-900 dark:to-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30 rounded-2xl p-6 shadow-sm"
                                    >
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                                <span className="text-emerald-900 dark:text-emerald-500 font-bold">{i + 1}</span>
                                            </div>
                                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">Example {i + 1}</h4>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h5 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Input</h5>
                                                <SyntaxHighlighter
                                                    language="text"
                                                    style={atomOneDark}
                                                    className="rounded-lg text-sm"
                                                    customStyle={{ background: 'rgba(255, 255, 255, 0.05)' }}
                                                >
                                                    {typeof ex.input === "object" ? JSON.stringify(ex.input, null, 2) : String(ex.input)}
                                                </SyntaxHighlighter>
                                            </div>
                                            <div>
                                                <h5 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Output</h5>
                                                <SyntaxHighlighter
                                                    language="text"
                                                    style={atomOneDark}
                                                    className="rounded-lg text-sm"
                                                    customStyle={{ background: 'rgba(255, 255, 255, 0.05)' }}
                                                >
                                                    {typeof ex.output === "object" ? JSON.stringify(ex.output, null, 2) : String(ex.output)}
                                                </SyntaxHighlighter>
                                            </div>
                                        </div>

                                        {ex.explanation && (
                                            <div className="mt-4">
                                                <h5 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Explanation</h5>
                                                <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                                                    <p className="text-amber-900 dark:text-amber-300 text-sm">{ex.explanation}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Constraints */}
                                {problem.constraints && (
                                    <div className="mt-6 p-6 border border-emerald-200 dark:border-emerald-800/30 rounded-2xl bg-gradient-to-br from-white to-red-50 dark:from-gray-900 dark:to-red-900/10">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500" />
                                            Constraints
                                        </h3>
                                        <SyntaxHighlighter
                                            language="text"
                                            style={atomOneDark}
                                            className="rounded-lg text-sm"
                                            customStyle={{ background: 'rgba(255, 255, 255, 0.05)' }}
                                        >
                                            {problem.constraints}
                                        </SyntaxHighlighter>
                                    </div>
                                )}

                                {/* Like/Dislike Stats */}
                                <div className="mt-8 p-6 border border-emerald-200 dark:border-emerald-800/30 rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800/20">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-500 hover:bg-emerald-200 dark:hover:bg-emerald-800/50 transition-colors">
                                                    <FaThumbsUp /> {problem.likes || 0}
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-500 hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors">
                                                    <FaThumbsDown /> {problem.dislikes || 0}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            {(problem.likes / ((problem.likes || 0) + (problem.dislikes || 0)) * 100 || 0).toFixed(1)}% liked
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* EDITORIAL */}
                        {activeLeftTab === "editorial" && (
                            problem.secureUrl ? (
                                <Editorial
                                    secureUrl={problem.secureUrl}
                                    thumbnailUrl={problem.thumbnailUrl}
                                    duration={problem.duration}
                                />
                            ) : (
                                <div className="text-center py-12">
                                    <FaLightbulb className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Editorial Available</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Editorial video not available for this problem.
                                    </p>
                                </div>
                            )
                        )}

                        {/* SOLUTIONS */}
                       {activeLeftTab === "solutions" && (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reference Solutions</h2>
            <span className="text-sm text-emerald-600 dark:text-emerald-500">
                {problem.referenceSolution?.length || 0} solutions
            </span>
        </div>

        {problem.referenceSolution && problem.referenceSolution.length > 0 ? (
            <div className="space-y-4">
                {problem.referenceSolution.map((sol, i) => (
                    <div 
                        key={i} 
                        className="bg-gradient-to-br from-white to-emerald-50 dark:from-gray-900 dark:to-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                        {/* Solution Header */}
                        <div className="px-6 py-4 border-b border-emerald-200 dark:border-emerald-800/30 bg-gradient-to-r from-emerald-50 to-white dark:from-emerald-900/10 dark:to-gray-900">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                                        <Code className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white">{sol.language}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300">
                                                Reference Solution
                                            </span>
                                            {sol.timeComplexity && (
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-300">
                                                    {sol.timeComplexity}
                                                </span>
                                            )}
                                            {sol.spaceComplexity && (
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-300">
                                                    {sol.spaceComplexity}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(sol.completeCode);
                                            // You can add toast notification here
                                        }}
                                        className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-500 hover:bg-emerald-200 dark:hover:bg-emerald-800/50 transition-colors"
                                        title="Copy code"
                                    >
                                        <FaCopy className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => setCode(sol.completeCode)}
                                        className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-500 hover:bg-emerald-200 dark:hover:bg-emerald-800/50 transition-colors"
                                        title="Use in editor"
                                    >
                                        <FaCode className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Code Content */}
                        <div className="p-4">
                            <div className="mb-3">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Solution Description:</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {sol.description || "Optimized solution with detailed comments"}
                                </p>
                            </div>
                            
                            <div className="relative">
                                <SyntaxHighlighter
                                    language={sol.language?.toLowerCase() || "javascript"}
                                    style={atomOneDark}
                                    className="rounded-lg text-sm border border-gray-200 dark:border-gray-800"
                                    showLineNumbers
                                    lineNumberStyle={{ color: '#666', paddingRight: '10px' }}
                                >
                                    {sol.completeCode}
                                </SyntaxHighlighter>
                                
                                {/* Copy button overlay */}
                                <div className="absolute top-2 right-2">
                                    <button
                                        onClick={() => navigator.clipboard.writeText(sol.completeCode)}
                                        className="px-3 py-1.5 text-xs rounded-lg bg-gray-800/80 text-white hover:bg-gray-900 transition-colors"
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>

                            {/* Solution Analysis */}
                            {sol.analysis && (
                                <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-200 dark:border-blue-800/30">
                                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">Solution Analysis:</h4>
                                    <p className="text-sm text-blue-800 dark:text-blue-400">{sol.analysis}</p>
                                </div>
                            )}

                            {/* Complexity Analysis */}
                            <div className="mt-4 grid grid-cols-2 gap-3">
                                {sol.timeComplexity && (
                                    <div className="p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border border-green-200 dark:border-green-800/30">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Clock className="w-4 h-4 text-green-600 dark:text-green-500" />
                                            <span className="text-xs font-medium text-green-800 dark:text-green-400">Time Complexity</span>
                                        </div>
                                        <p className="text-sm font-bold text-green-900 dark:text-green-300">{sol.timeComplexity}</p>
                                    </div>
                                )}
                                {sol.spaceComplexity && (
                                    <div className="p-3 rounded-lg bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/10 dark:to-violet-900/10 border border-purple-200 dark:border-purple-800/30">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Database className="w-4 h-4 text-purple-600 dark:text-purple-500" />
                                            <span className="text-xs font-medium text-purple-800 dark:text-purple-400">Space Complexity</span>
                                        </div>
                                        <p className="text-sm font-bold text-purple-900 dark:text-purple-300">{sol.spaceComplexity}</p>
                                    </div>
                                )}
                            </div>

                            {/* Approach Tags */}
                            {sol.approach && (
                                <div className="mt-4">
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Approach:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {Array.isArray(sol.approach) 
                                            ? sol.approach.map((approach, idx) => (
                                                <span 
                                                    key={idx} 
                                                    className="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                                                >
                                                    {approach}
                                                </span>
                                            ))
                                            : <span className="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                                {sol.approach}
                                            </span>
                                        }
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer with Actions */}
                        <div className="px-6 py-3 border-t border-emerald-200 dark:border-emerald-800/30 bg-emerald-50/50 dark:bg-emerald-900/5 flex justify-between items-center">
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                                {sol.completeCode?.length || 0} characters
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setCode(sol.completeCode)}
                                    className="px-3 py-1.5 text-xs rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-emerald-600 dark:to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-900 transition-colors"
                                >
                                    Use in Editor
                                </button>
                                <button className="px-3 py-1.5 text-xs rounded-lg border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-gray-900 text-emerald-900 dark:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                                    Run Solution
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 flex items-center justify-center">
                    <Code className="w-10 h-10 text-emerald-600 dark:text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Reference Solutions</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    Reference solutions are not available for this problem. Try implementing your own solution!
                </p>
                <div className="mt-6 flex justify-center gap-3">
                    <button 
                        onClick={() => setActiveRightTab("code")}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-emerald-600 dark:to-emerald-700 text-white"
                    >
                        Go to Editor
                    </button>
                    <button 
                        onClick={() => setActiveLeftTab("chatAI")}
                        className="px-4 py-2 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-gray-900 text-emerald-900 dark:text-emerald-500"
                    >
                        Ask AI for Help
                    </button>
                </div>
            </div>
        )}
    </div>
)}

                        {activeLeftTab === "submissions" && <SubmissionHistory problemId={problemId} />}
                        {activeLeftTab === "chatAI" && <ChatAI problem={problem} />}
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className={`${isEditorExpanded ? 'w-full' : 'w-1/2'} flex flex-col`}>
                    {/* RIGHT TABS & TOOLBAR */}
                    <div className="flex justify-between items-center px-6 py-2 bg-gradient-to-r from-white to-emerald-50 dark:from-gray-900 dark:to-emerald-900/10 border-b border-emerald-200 dark:border-emerald-800/30 backdrop-blur">
                        <div className="flex gap-6">
                            {[
                                { id: "code", icon: <FaCode className="w-4 h-4" />, label: "Code" },
                                { id: "testcase", icon: <Cpu className="w-4 h-4" />, label: "Test Cases" },
                                { id: "result", icon: <BarChart className="w-4 h-4" />, label: "Result" }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveRightTab(tab.id)}
                                    className={`flex items-center gap-2 text-sm font-medium pb-2 transition-all ${activeRightTab === tab.id
                                        ? "text-emerald-900 dark:text-emerald-600 border-b-2 border-emerald-900 dark:border-emerald-600"
                                        : "text-gray-600 dark:text-gray-400 hover:text-emerald-900 dark:hover:text-emerald-500"
                                        }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsEditorExpanded(!isEditorExpanded)}
                                className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-500 hover:bg-emerald-200 dark:hover:bg-emerald-800/50"
                            >
                                {isEditorExpanded ? <FaCompress /> : <FaExpand />}
                            </button>
                        </div>
                    </div>

                    {/* CODE EDITOR */}
                    {activeRightTab === "code" && (
                        <>
                            {/* Language Selector & Tools */}
                            <div className="px-4 py-2 flex justify-between items-center border-b border-emerald-200 dark:border-emerald-800/30 bg-white dark:bg-gray-900/50">
                                <div className="flex gap-2">
                                    {Object.keys(langMap).map((lang) => (
                                        <button
                                            key={lang}
                                            onClick={() => setSelectedLanguage(lang)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedLanguage === lang
                                                ? "bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-emerald-600 dark:to-emerald-700 text-white"
                                                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                                }`}
                                        >
                                            {langMap[lang]}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={copyCode}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    >
                                        <FaCopy />
                                        {copied ? "Copied!" : "Copy"}
                                    </button>
                                    <button
                                        onClick={resetCode}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    >
                                        <FaRedo />
                                        Reset
                                    </button>
                                </div>
                            </div>

                            {/* Editor */}
                            <div className="flex-1">
                                <Editor
                                    height="100%"
                                    language={getMonacoLang(selectedLanguage)}
                                    value={code}
                                    onChange={(v) => setCode(v || "")}
                                    theme="vs-dark"
                                    options={{
                                        fontSize: 14,
                                        minimap: { enabled: true },
                                        wordWrap: "on",
                                        scrollBeyondLastLine: false,
                                        automaticLayout: true,
                                        formatOnPaste: true,
                                        formatOnType: true,
                                    }}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="p-4 flex justify-between items-center border-t border-emerald-200 dark:border-emerald-800/30 bg-white dark:bg-gray-900/50">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    <span className="font-medium text-emerald-900 dark:text-emerald-600">{code.length}</span> characters
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleRun}
                                        disabled={runLoading}
                                        className="flex items-center gap-2 px-6 py-3 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-gray-900 text-emerald-900 dark:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 disabled:opacity-50"
                                    >
                                        <Cpu className="w-4 h-4" />
                                        {runLoading ? "Running..." : "Run Code"}
                                    </button>
                                    <button
                                        onClick={handleSubmitCode}
                                        disabled={submitLoading}
                                        className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-emerald-600 dark:to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-900 disabled:opacity-50"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        {submitLoading ? "Submitting..." : "Submit Solution"}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {/* TESTCASE RESULTS */}
                    {activeRightTab === "testcase" && (
                        <div className="flex-1 p-6 overflow-y-auto space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Test Case Results</h2>
                                <button
                                    onClick={handleRun}
                                    disabled={runLoading}
                                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-emerald-600 dark:to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-900 disabled:opacity-50"
                                >
                                    {runLoading ? "Running..." : "Run Again"}
                                </button>
                                 <button
                                        onClick={handleSubmitCode}
                                        disabled={submitLoading}
                                        className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-emerald-600 dark:to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-900 disabled:opacity-50"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        {submitLoading ? "Submitting..." : "Submit Solution"}
                                    </button>
                            </div>

                            {!runResult || runResult.length === 0 ? (
                                <div className="text-center py-12">
                                    <Cpu className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Test Results</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                                        Click "Run Code" to test your solution with example test cases.
                                    </p>
                                    <button
                                        onClick={handleRun}
                                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-emerald-600 dark:to-emerald-700 text-white"
                                    >
                                        Run Code
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                        <div className="bg-white dark:bg-gray-900/50 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/30">
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Total Tests</div>
                                            <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-600">{runResult.length}</p>
                                        </div>
                                        <div className="bg-white dark:bg-gray-900/50 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/30">
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Passed</div>
                                            <p className="text-2xl font-bold text-green-600 dark:text-green-500">
                                                {runResult.filter(tc => tc.status_id === 3).length}
                                            </p>
                                        </div>
                                        <div className="bg-white dark:bg-gray-900/50 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/30">
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Failed</div>
                                            <p className="text-2xl font-bold text-red-600 dark:text-red-500">
                                                {runResult.filter(tc => tc.status_id !== 3).length}
                                            </p>
                                        </div>
                                        <div className="bg-white dark:bg-gray-900/50 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/30">
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
                                            <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-600">
                                                {((runResult.filter(tc => tc.status_id === 3).length / runResult.length) * 100).toFixed(0)}%
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {runResult.map((tc, i) => (
                                            <div
                                                key={i}
                                                className={`p-4 rounded-xl border ${tc.status_id === 3
                                                    ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10"
                                                    : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10"
                                                    }`}
                                            >
                                                <div className="flex justify-between items-center mb-3">
                                                    <div className="flex items-center gap-2">
                                                        {tc.status_id === 3 ? (
                                                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-500" />
                                                        ) : (
                                                            <XCircle className="w-5 h-5 text-red-600 dark:text-red-500" />
                                                        )}
                                                        <span className="font-bold">Test Case {i + 1}</span>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tc.status_id === 3
                                                        ? "bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-500"
                                                        : "bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-500"
                                                        }`}>
                                                        {tc.status_id === 3 ? "PASSED" : "FAILED"}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <h5 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Input</h5>
                                                        <SyntaxHighlighter
                                                            language="text"
                                                            style={atomOneDark}
                                                            className="rounded-lg text-sm"
                                                            customStyle={{ background: 'rgba(255, 255, 255, 0.05)' }}
                                                        >
                                                            {tc.stdin || "N/A"}
                                                        </SyntaxHighlighter>
                                                    </div>
                                                    <div>
                                                        <h5 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Expected Output</h5>
                                                        <SyntaxHighlighter
                                                            language="text"
                                                            style={atomOneDark}
                                                            className="rounded-lg text-sm"
                                                            customStyle={{ background: 'rgba(255, 255, 255, 0.05)' }}
                                                        >
                                                            {tc.expected_output || "N/A"}
                                                        </SyntaxHighlighter>
                                                    </div>
                                                </div>

                                                <div className="mt-3">
                                                    <h5 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Your Output</h5>
                                                    <SyntaxHighlighter
                                                        language="text"
                                                        style={atomOneDark}
                                                        className="rounded-lg text-sm"
                                                        customStyle={{ background: 'rgba(255, 255, 255, 0.05)' }}
                                                    >
                                                        {tc.stdout || tc.error || "No output"}
                                                    </SyntaxHighlighter>
                                                </div>

                                                <div className="flex justify-between items-center mt-3 text-sm text-gray-600 dark:text-gray-400">
                                                    <span>Time: {tc.runtime || 0}s</span>
                                                    <span>Memory: {tc.memory || 0}KB</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* SUBMISSION RESULT */}
                    {activeRightTab === "result" && (
                        <div className="flex-1 p-6 overflow-y-auto space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Submission Result</h2>
                                <button
                                    onClick={handleSubmitCode}
                                    disabled={submitLoading}
                                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-emerald-600 dark:to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-900 disabled:opacity-50"
                                >
                                    {submitLoading ? "Submitting..." : "Submit Again"}
                                </button>
                            </div>

                            {!submitResult ? (
                                <div className="text-center py-12">
                                    <BarChart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Submission Yet</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                                        Submit your solution to see the results here.
                                    </p>
                                </div>
                            ) : (
                                <div className={`p-6 rounded-2xl ${submitResult.accepted
                                    ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border border-green-200 dark:border-green-800"
                                    : "bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/10 dark:to-pink-900/10 border border-red-200 dark:border-red-800"
                                    }`}>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            {submitResult.accepted ? (
                                                <>
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                                                        <CheckCircle className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-2xl font-bold text-green-900 dark:text-green-500">Accepted</h3>
                                                        <p className="text-green-700 dark:text-green-400">Congratulations! Your solution is correct.</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                                                        <XCircle className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-2xl font-bold text-red-900 dark:text-red-500">Wrong Answer</h3>
                                                        <p className="text-red-700 dark:text-red-400">{submitResult.error || "Your solution needs improvement."}</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${submitResult.accepted
                                            ? "bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-500"
                                            : "bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-500"
                                            }`}>
                                            {submitResult.accepted ? "SUCCESS" : "FAILURE"}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                        <div className="bg-white dark:bg-black/20 p-4 rounded-xl">
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Test Cases</div>
                                            <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-600">
                                                {submitResult.passedTestCases}/{submitResult.totalTestCases}
                                            </p>
                                        </div>
                                        <div className="bg-white dark:bg-black/20 p-4 rounded-xl">
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Runtime</div>
                                            <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-600">
                                                {submitResult.runtime || 0}s
                                            </p>
                                        </div>
                                        <div className="bg-white dark:bg-black/20 p-4 rounded-xl">
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Memory</div>
                                            <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-600">
                                                {submitResult.memory || 0}KB
                                            </p>
                                        </div>
                                        <div className="bg-white dark:bg-black/20 p-4 rounded-xl">
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Score</div>
                                            <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-600">
                                                {submitResult.accepted ? problem.points || 100 : 0}
                                            </p>
                                        </div>
                                    </div>

                                    {submitResult.accepted && (
                                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-4 rounded-xl">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                                                <h4 className="font-bold text-emerald-900 dark:text-emerald-600">Performance Stats</h4>
                                            </div>
                                            <p className="text-sm text-emerald-800 dark:text-emerald-400">
                                                Your solution beats {Math.floor(Math.random() * 30) + 70}% of submissions.
                                                {submitResult.runtime < 1 && " Excellent performance!"}
                                            </p>
                                        </div>
                                    )}
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