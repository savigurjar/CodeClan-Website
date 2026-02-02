import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { io } from "socket.io-client";
import { 
  Send, Copy, ThumbsUp, ThumbsDown, RefreshCw, Zap, Brain, 
  Cpu, MessageSquare, Sparkles, User, Bot, Users, Hash, 
  Video, Mic, MicOff, VideoOff, Settings, Smile, Paperclip,
  Phone, MoreVertical, Search, Menu
} from "lucide-react";
import Animate from "../../animate";
import AppLayout from "../../Components/AppLayout";

// Initialize Socket.IO client
const socket = io( "http://localhost:5173");

function Chat() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeRoom, setActiveRoom] = useState("general");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [rooms, setRooms] = useState([
    { id: "general", name: "General Chat", unread: 0, icon: "💬", description: "General discussions" },
    { id: "webdev", name: "Web Development", unread: 3, icon: "🌐", description: "Frontend & Backend" },
    { id: "dsa", name: "DSA Problems", unread: 5, icon: "⚡", description: "Algorithms & Data Structures" },
    { id: "system-design", name: "System Design", unread: 2, icon: "🏗️", description: "Architecture discussions" },
    { id: "ai-ml", name: "AI/ML", unread: 0, icon: "🧠", description: "Machine Learning topics" },
    { id: "off-topic", name: "Off Topic", unread: 0, icon: "🎮", description: "Casual conversations" },
  ]);
  const [userStatus, setUserStatus] = useState("online");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Sample users data
  const users = [
    { id: 1, name: "Alex Johnson", avatar: "👨‍💻", status: "online", role: "Senior Dev" },
    { id: 2, name: "Sarah Chen", avatar: "👩‍💻", status: "online", role: "Frontend Lead" },
    { id: 3, name: "Mike Brown", avatar: "🧑‍💻", status: "away", role: "Backend Engineer" },
    { id: 4, name: "Emma Wilson", avatar: "👩‍🎨", status: "offline", role: "UI/UX Designer" },
    { id: 5, name: "David Lee", avatar: "👨‍🔬", status: "online", role: "AI Researcher" },
    { id: 6, name: "Lisa Park", avatar: "👩‍💼", status: "online", role: "Product Manager" },
  ];

  useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => {
      setLoading(false);
      loadChatHistory();
      joinRoom(activeRoom);
    }, 1200);

    // Socket event listeners
    socket.on("connect", () => {
      console.log("Connected to chat server");
      socket.emit("joinRoom", { room: activeRoom, username: "You" });
    });

    socket.on("userJoined", (data) => {
      console.log(`${data.username} joined the room`);
      setOnlineUsers(prev => [...prev, data.username]);
      addSystemMessage(`${data.username} joined the chat`);
    });

    socket.on("userLeft", (data) => {
      console.log(`${data.username} left the room`);
      setOnlineUsers(prev => prev.filter(user => user !== data.username));
      addSystemMessage(`${data.username} left the chat`);
    });

    socket.on("receiveMessage", (data) => {
      handleIncomingMessage(data);
    });

    socket.on("typing", (data) => {
      if (data.username !== "You") {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 1000);
      }
    });

    socket.on("usersOnline", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      clearTimeout(timer);
      socket.off("connect");
      socket.off("userJoined");
      socket.off("userLeft");
      socket.off("receiveMessage");
      socket.off("typing");
      socket.off("usersOnline");
    };
  }, [activeRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const loadChatHistory = () => {
    // Simulate loading chat history
    const sampleMessages = [
      {
        id: 1,
        role: "user",
        username: "Alex Johnson",
        avatar: "👨‍💻",
        text: "Has anyone tried the new React 19 features?",
        timestamp: "10:30 AM",
        room: "general"
      },
      {
        id: 2,
        role: "user",
        username: "Sarah Chen",
        avatar: "👩‍💻",
        text: "Yes! The new Actions API is fantastic for forms",
        timestamp: "10:32 AM",
        room: "general"
      },
      {
        id: 3,
        role: "user",
        username: "Mike Brown",
        avatar: "🧑‍💻",
        text: "Still exploring the Document Metadata updates",
        timestamp: "10:35 AM",
        room: "general"
      },
      {
        id: 4,
        role: "system",
        username: "System",
        avatar: "🤖",
        text: "Emma Wilson joined the chat",
        timestamp: "10:40 AM",
        room: "general"
      },
      {
        id: 5,
        role: "user",
        username: "You",
        avatar: "👤",
        text: "Hi everyone! Looking forward to learning together",
        timestamp: "Just now",
        room: "general"
      },
    ];
    setMessages(sampleMessages);
  };

  const joinRoom = (roomId) => {
    socket.emit("joinRoom", { room: roomId, username: "You" });
    setActiveRoom(roomId);
    
    // Reset unread count for the room
    setRooms(prevRooms => 
      prevRooms.map(room => 
        room.id === roomId ? { ...room, unread: 0 } : room
      )
    );
  };

  const handleIncomingMessage = (data) => {
    const newMessage = {
      id: Date.now(),
      role: data.username === "You" ? "user" : "other",
      username: data.username,
      avatar: data.avatar || "👤",
      text: data.message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      room: data.room
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const addSystemMessage = (text) => {
    const systemMessage = {
      id: Date.now(),
      role: "system",
      username: "System",
      avatar: "🤖",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      room: activeRoom
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  const onSubmit = async (data) => {
    if (!data.message.trim()) return;

    const userMsg = {
      id: Date.now(),
      role: "user",
      username: "You",
      avatar: "👤",
      text: data.message,
      timestamp: "Just now",
      room: activeRoom
    };

    setMessages(prev => [...prev, userMsg]);
    
    // Emit message through socket
    socket.emit("sendMessage", {
      room: activeRoom,
      message: data.message,
      username: "You",
      avatar: "👤"
    });

    reset();
    socket.emit("typing", { room: activeRoom, username: "You" });
  };

  const handleTyping = () => {
    socket.emit("typing", { room: activeRoom, username: "You" });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const clearChat = () => {
    setMessages([]);
    addSystemMessage("Chat cleared. New conversation started.");
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const sendEmoji = (emoji) => {
    const emojiMessage = {
      id: Date.now(),
      role: "user",
      username: "You",
      avatar: "👤",
      text: emoji,
      timestamp: "Just now",
      room: activeRoom
    };

    setMessages(prev => [...prev, emojiMessage]);
    socket.emit("sendMessage", {
      room: activeRoom,
      message: emoji,
      username: "You",
      avatar: "👤"
    });
    setShowEmojiPicker(false);
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    // Implement actual audio toggle logic here
  };

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
    // Implement actual video toggle logic here
  };

  const startRecording = () => {
    setIsRecording(true);
    // Implement actual recording logic here
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Implement actual recording stop logic here
  };

  const emojis = ["😊", "👍", "🎉", "🚀", "💻", "🧠", "⚡", "🔥", "✨", "🤔", "👏", "❤️"];

  if (loading) {
    return (
      <AppLayout>
        <div className="relative min-h-screen overflow-hidden bg-white text-black dark:bg-black dark:text-white">
          {/* 🌌 Animated Background */}
          <div className="hidden dark:block">
            <Animate />
          </div>
          
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
            <div className="flex flex-col items-center max-w-md text-center">
              {/* Chat Icon with Animation */}
              <div className="relative mb-8">
                <div className="w-24 h-24 border-4 border-blue-900/20 rounded-full dark:border-blue-400/20"></div>
                <div className="absolute inset-4 flex items-center justify-center">
                  <MessageSquare className="w-12 h-12 text-blue-900 dark:text-blue-400 animate-pulse" />
                  <Users className="absolute -bottom-2 -right-2 w-8 h-8 text-blue-600 dark:text-blue-400 animate-bounce" />
                </div>
              </div>
              
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-cyan-900 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-400">
                Connecting to Chat Room...
              </h1>
              
              <p className="mt-4 text-lg font-medium text-blue-900 dark:text-blue-400">
                Joining the developer community
              </p>
              
              <div className="mt-8 w-full space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-900 dark:text-blue-400">Establishing Connection</span>
                    <span className="font-medium text-blue-900 dark:text-blue-400">90%</span>
                  </div>
                  <div className="w-full h-2 bg-blue-100 dark:bg-blue-700/30 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-900 to-cyan-900 rounded-full animate-progress dark:from-blue-400 dark:to-cyan-400" style={{width: '90%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

        {/* Main Chat Container */}
        <div className="relative z-10 max-w-7xl mx-auto mt-6 h-[calc(100vh-3rem)] flex rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-2xl">
          {/* Left Sidebar - Rooms */}
          <div className="w-64 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black border-r border-gray-200 dark:border-gray-800 flex flex-col">
            {/* User Profile */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xl">
                    👤
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 ${
                    userStatus === 'online' ? 'bg-green-500' : 
                    userStatus === 'away' ? 'bg-yellow-500' : 
                    'bg-gray-500'
                  }`}></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 dark:text-white">You</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{userStatus}</p>
                </div>
                <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Rooms List */}
            <div className="flex-1 overflow-y-auto p-2">
              <div className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Chat Rooms
              </div>
              {rooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => joinRoom(room.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all mb-1 ${
                    activeRoom === room.id
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="text-xl">{room.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{room.name}</div>
                    <div className="text-xs opacity-75">{room.description}</div>
                  </div>
                  {room.unread > 0 && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      activeRoom === room.id
                        ? 'bg-white text-blue-500'
                        : 'bg-blue-500 text-white'
                    }`}>
                      {room.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Create Room Button */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all">
                <Hash className="w-5 h-5" />
                <span className="font-medium">Create New Room</span>
              </button>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <span className="text-xl">
                    {rooms.find(r => r.id === activeRoom)?.icon}
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {rooms.find(r => r.id === activeRoom)?.name}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                      {onlineUsers.slice(0, 3).map((user, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700 border-2 border-white dark:border-gray-900 flex items-center justify-center text-xs"
                        >
                          {user.avatar || user.name.charAt(0)}
                        </div>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {onlineUsers.length} online
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={toggleAudio}
                  className={`p-2 rounded-full ${audioEnabled ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}
                >
                  {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
                <button 
                  onClick={toggleVideo}
                  className={`p-2 rounded-full ${videoEnabled ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}
                >
                  {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>
                <button className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-950">
              {messages
                .filter(msg => msg.room === activeRoom)
                .map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} ${
                      msg.role === "system" ? "justify-center" : ""
                    }`}
                  >
                    {msg.role !== "user" && msg.role !== "system" && (
                      <div className="flex-shrink-0 mr-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg">
                          {msg.avatar}
                        </div>
                      </div>
                    )}
                    
                    <div className={`max-w-[70%] ${
                      msg.role === "user" ? "order-1" : "order-2"
                    }`}>
                      {msg.role !== "system" && (
                        <div className={`flex items-center space-x-2 mb-1 ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        }`}>
                          <span className="font-medium text-gray-900 dark:text-white text-sm">
                            {msg.username}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {msg.timestamp}
                          </span>
                        </div>
                      )}
                      
                      <div className={`px-4 py-3 rounded-2xl ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-br-none"
                          : msg.role === "system"
                          ? "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-center text-sm"
                          : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none border border-gray-200 dark:border-gray-700"
                      }`}>
                        {msg.text}
                      </div>
                      
                      {msg.role === "user" && (
                        <div className="flex justify-end space-x-3 mt-2">
                          <button
                            onClick={() => copyToClipboard(msg.text)}
                            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            Copy
                          </button>
                          <button className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                            Edit
                          </button>
                          <button className="text-xs text-red-500 hover:text-red-700">
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {msg.role === "user" && (
                      <div className="flex-shrink-0 ml-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white text-lg">
                          {msg.avatar}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Someone is typing...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div className="flex flex-wrap gap-2">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => sendEmoji(emoji)}
                      className="text-2xl hover:scale-125 transition-transform"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
            >
              <div className="flex items-center space-x-3">
                {/* Action Buttons */}
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={handleFileUpload}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => {
                      // Handle file upload
                      console.log(e.target.files[0]);
                    }}
                  />
                  
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                  >
                    <Smile className="w-5 h-5" />
                  </button>
                  
                  <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`p-2 ${
                      isRecording
                        ? 'text-red-500 animate-pulse'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'
                    }`}
                  >
                    <div className="relative">
                      <Mic className="w-5 h-5" />
                      {isRecording && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                      )}
                    </div>
                  </button>
                </div>

                {/* Message Input */}
                <div className="flex-1 relative">
                  <input
                    placeholder={`Message #${rooms.find(r => r.id === activeRoom)?.name}`}
                    {...register("message", { required: false, minLength: 1 })}
                    onKeyUp={handleTyping}
                    className="w-full px-4 py-3 pl-12 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <MessageSquare className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                </div>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={errors.message}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white flex items-center justify-center hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>Press Enter to send • Shift + Enter for new line</span>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={clearChat}
                    className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                  >
                    Clear Chat
                  </button>
                  <button
                    type="button"
                    className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                  >
                    Mark as Read
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Right Sidebar - Online Users */}
          <div className="w-64 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black border-l border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white">Online Members</h3>
              <span className="text-sm text-green-500 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                {users.filter(u => u.status === 'online').length} online
              </span>
            </div>
            
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg">
                      {user.avatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${
                      user.status === 'online' ? 'bg-green-500' : 
                      user.status === 'away' ? 'bg-yellow-500' : 
                      'bg-gray-500'
                    }`}></div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{user.role}</div>
                  </div>
                  <button className="text-gray-400 hover:text-blue-500">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            
            {/* Chat Stats */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Chat Statistics</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Messages Today</span>
                    <span className="font-medium text-gray-900 dark:text-white">247</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{width: '70%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Active Members</span>
                    <span className="font-medium text-gray-900 dark:text-white">{users.length}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500" style={{width: '85%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Socket Connection Status */}
        <div className="fixed bottom-4 left-4 z-50">
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-full text-xs font-medium ${
            socket.connected
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              socket.connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`}></div>
            <span>
              {socket.connected ? 'Connected to chat server' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default Chat;