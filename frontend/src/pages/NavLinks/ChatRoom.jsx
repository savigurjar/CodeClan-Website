import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { io } from "socket.io-client";
import { 
  Send, Copy, ThumbsUp, ThumbsDown, RefreshCw, Zap, Brain, 
  Cpu, MessageSquare, Sparkles, User, Bot, Users, Hash, 
  Video, Mic, MicOff, VideoOff, Settings, Smile, Paperclip,
  Phone, MoreVertical, Search, Menu, Folder, Star, Pin, 
  Bell, BellOff, Lock, Globe, Code, Database, Cloud, 
  Shield, Upload, Download, Calendar, Clock, FileText,
  Image, File, Music, Film, Map, Link, AtSign, Filter,
  Grid, List, Eye, EyeOff, Trash2, Edit2, Share2, Save,
  Bookmark, BookOpen, TrendingUp, BarChart, Layers,
  Plus, Target, Compass, ChevronRight, ExternalLink,
  HelpCircle, Command, CheckCircle, AlertCircle,
  Volume2, VolumeX, Wifi, WifiOff, Battery, BatteryCharging,
  Thermometer, CloudRain, Wind, Sun, Moon, Coffee
} from "lucide-react";
import Animate from "../../animate";
import AppLayout from "../../Components/AppLayout";

// Initialize Socket.IO client
const socket = io("http://localhost:5173");

// Component: Message Component
const MessageComponent = ({ message, onReact, onReply, onPin, onDelete, isCurrentUser }) => {
  const [showActions, setShowActions] = useState(false);
  const [reactions, setReactions] = useState({ '👍': 3, '❤️': 2, '🎉': 1 });

  const handleReaction = (emoji) => {
    setReactions(prev => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1
    }));
    onReact?.(message.id, emoji);
  };

  return (
    <div 
      className={`relative group ${isCurrentUser ? 'ml-auto' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3 mb-4`}>
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white text-lg relative">
            {message.avatar}
            {message.role === 'ai' && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                <Cpu className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Message Content */}
        <div className={`max-w-[70%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
          {/* Header */}
          <div className={`flex items-center gap-2 mb-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
            <span className="font-semibold text-emerald-900 dark:text-emerald-400 text-sm">
              {message.username}
            </span>
            {message.role === 'admin' && (
              <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs rounded-full">
                Admin
              </span>
            )}
            <span className="text-xs text-emerald-700 dark:text-emerald-300">
              {message.timestamp}
            </span>
            {message.edited && (
              <span className="text-xs text-emerald-500 dark:text-emerald-400 italic">
                (edited)
              </span>
            )}
          </div>

          {/* Message Body */}
          <div className={`relative ${isCurrentUser ? 'text-right' : 'text-left'}`}>
            {message.replyingTo && (
              <div className="mb-2 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border-l-4 border-emerald-500">
                <div className="text-xs text-emerald-700 dark:text-emerald-300 truncate">
                  Replying to {message.replyingTo.username}
                </div>
                <div className="text-sm text-emerald-900 dark:text-emerald-200 truncate">
                  {message.replyingTo.text}
                </div>
              </div>
            )}
            
            <div className={`px-4 py-3 rounded-2xl ${
              isCurrentUser
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-br-none'
                : 'bg-white dark:bg-gray-800 text-emerald-900 dark:text-emerald-100 rounded-bl-none border border-emerald-200 dark:border-emerald-700'
            }`}>
              {message.text}
              
              {/* File Attachments */}
              {message.attachments && message.attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.attachments.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-white/20 dark:bg-black/20 rounded-lg">
                      {file.type === 'image' ? <Image className="w-4 h-4" /> : <File className="w-4 h-4" />}
                      <span className="text-sm truncate">{file.name}</span>
                      <a href={file.url} className="ml-auto">
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reactions */}
            {Object.keys(reactions).length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {Object.entries(reactions).map(([emoji, count]) => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(emoji)}
                    className="px-2 py-1 bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700 rounded-full text-xs flex items-center gap-1 hover:scale-105 transition-transform"
                  >
                    <span>{emoji}</span>
                    <span className="font-medium">{count}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hover Actions */}
      {showActions && (
        <div className={`absolute ${isCurrentUser ? 'left-0' : 'right-0'} top-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
          <button
            onClick={() => onReply?.(message)}
            className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
            title="Reply"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onPin?.(message)}
            className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
            title="Pin"
          >
            <Pin className="w-4 h-4" />
          </button>
          {isCurrentUser && (
            <button
              onClick={() => onDelete?.(message.id)}
              className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-red-50 dark:hover:bg-red-900/20"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Component: Room Card
const RoomCard = ({ room, isActive, onJoin, onFavorite }) => {
  const [isFavorite, setIsFavorite] = useState(room.isFavorite);

  const handleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    onFavorite?.(room.id, !isFavorite);
  };

  return (
    <div
      onClick={() => onJoin(room.id)}
      className={`p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.02] ${
        isActive
          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white transform scale-[1.02]'
          : 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-lg'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{room.icon}</div>
          <div>
            <h3 className={`font-bold ${isActive ? 'text-white' : 'text-emerald-900 dark:text-emerald-400'}`}>
              {room.name}
            </h3>
            <p className={`text-sm ${isActive ? 'text-emerald-100' : 'text-emerald-700 dark:text-emerald-300'}`}>
              {room.description}
            </p>
          </div>
        </div>
        <button
          onClick={handleFavorite}
          className="p-2 hover:bg-white/20 rounded-full"
        >
          <Star className={`w-5 h-5 ${isFavorite ? 'fill-yellow-500 text-yellow-500' : 'text-current'}`} />
        </button>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className={`w-4 h-4 ${isActive ? 'text-emerald-100' : 'text-emerald-600 dark:text-emerald-400'}`} />
            <span className="text-sm">{room.members} online</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className={`w-4 h-4 ${isActive ? 'text-emerald-100' : 'text-emerald-600 dark:text-emerald-400'}`} />
            <span className="text-sm">{room.messages} messages</span>
          </div>
        </div>
        {room.unread > 0 && (
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
            isActive
              ? 'bg-white text-emerald-500'
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
          }`}>
            {room.unread} new
          </span>
        )}
      </div>
    </div>
  );
};

// Component: User Card
const UserCard = ({ user, onMessage, onCall }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-lg transition-all cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white text-lg">
            {user.avatar}
          </div>
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 ${
            user.status === 'online' ? 'bg-emerald-500' : 
            user.status === 'away' ? 'bg-yellow-500' : 
            'bg-gray-500'
          }`}></div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-emerald-900 dark:text-emerald-400">{user.name}</h4>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">{user.role}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onMessage?.(user)}
                className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full hover:bg-emerald-200 dark:hover:bg-emerald-900/50"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </button>
              <button
                onClick={() => onCall?.(user)}
                className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full hover:bg-emerald-200 dark:hover:bg-emerald-900/50"
              >
                <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </button>
            </div>
          </div>
          
          {isHovered && (
            <div className="mt-3 pt-3 border-t border-emerald-200 dark:border-emerald-700">
              <div className="flex flex-wrap gap-2">
                {user.skills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 text-emerald-700 dark:text-emerald-400 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Component: Statistics Dashboard
const StatisticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('weekly');
  
  const stats = {
    messages: { total: 1247, change: '+12%' },
    activeUsers: { total: 48, change: '+8%' },
    responseTime: { total: '2.4s', change: '-15%' },
    satisfaction: { total: '94%', change: '+3%' }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-emerald-200 dark:border-emerald-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-400">Chat Analytics</h3>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-1 bg-white dark:bg-gray-900 border border-emerald-200 dark:border-emerald-700 rounded-lg text-sm text-emerald-900 dark:text-emerald-400"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-emerald-200 dark:border-emerald-700">
            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-400">{value.total}</div>
            <div className="text-sm text-emerald-700 dark:text-emerald-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
            <div className={`text-xs mt-1 ${value.change.startsWith('+') ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {value.change} from last {timeRange}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t border-emerald-200 dark:border-emerald-700">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-emerald-900 dark:text-emerald-400">Activity Trend</h4>
          <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="h-32 flex items-end gap-1">
          {[40, 60, 80, 65, 90, 70, 85].map((height, idx) => (
            <div
              key={idx}
              className="flex-1 bg-gradient-to-t from-emerald-500 to-teal-500 rounded-t-lg"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Component: Quick Actions Panel
const QuickActionsPanel = ({ onAction }) => {
  const quickActions = [
    { icon: <Code className="w-5 h-5" />, label: 'Code Snippet', color: 'from-blue-500 to-cyan-500' },
    { icon: <Image className="w-5 h-5" />, label: 'Share Image', color: 'from-purple-500 to-pink-500' },
    { icon: <FileText className="w-5 h-5" />, label: 'Send File', color: 'from-amber-500 to-orange-500' },
    { icon: <Calendar className="w-5 h-5" />, label: 'Schedule', color: 'from-red-500 to-rose-500' },
    { icon: <Link className="w-5 h-5" />, label: 'Share Link', color: 'from-indigo-500 to-blue-500' },
    { icon: <AtSign className="w-5 h-5" />, label: 'Mention', color: 'from-green-500 to-emerald-500' },
  ];

  return (
    <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-emerald-200 dark:border-emerald-700">
      <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-400 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action, idx) => (
          <button
            key={idx}
            onClick={() => onAction?.(action.label)}
            className="p-3 rounded-xl bg-white dark:bg-gray-900 border border-emerald-200 dark:border-emerald-700 hover:shadow-lg transition-all group"
          >
            <div className={`w-12 h-12 mx-auto mb-2 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center text-white`}>
              {action.icon}
            </div>
            <span className="text-sm font-medium text-emerald-900 dark:text-emerald-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-300">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Main Chat Component
function Chat() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeRoom, setActiveRoom] = useState("general");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [rooms, setRooms] = useState([
    { id: "general", name: "General Chat", unread: 0, icon: "💬", description: "General discussions", members: 42, messages: 1247, isFavorite: true },
    { id: "webdev", name: "Web Development", unread: 3, icon: "🌐", description: "Frontend & Backend", members: 38, messages: 892, isFavorite: true },
    { id: "dsa", name: "DSA Problems", unread: 5, icon: "⚡", description: "Algorithms & Data Structures", members: 29, messages: 567, isFavorite: false },
    { id: "system-design", name: "System Design", unread: 2, icon: "🏗️", description: "Architecture discussions", members: 24, messages: 345, isFavorite: false },
    { id: "ai-ml", name: "AI/ML", unread: 0, icon: "🧠", description: "Machine Learning topics", members: 31, messages: 478, isFavorite: true },
    { id: "off-topic", name: "Off Topic", unread: 0, icon: "🎮", description: "Casual conversations", members: 56, messages: 1234, isFavorite: false },
  ]);
  const [userStatus, setUserStatus] = useState("online");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [pinnedMessages, setPinnedMessages] = useState([]);
  const [showAdvancedStats, setShowAdvancedStats] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [searchQuery, setSearchQuery] = useState('');
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Enhanced users data
  const users = [
    { id: 1, name: "Alex Johnson", avatar: "👨‍💻", status: "online", role: "Senior Dev", skills: ["React", "Node.js", "AWS"] },
    { id: 2, name: "Sarah Chen", avatar: "👩‍💻", status: "online", role: "Frontend Lead", skills: ["Vue", "TypeScript", "UI/UX"] },
    { id: 3, name: "Mike Brown", avatar: "🧑‍💻", status: "away", role: "Backend Engineer", skills: ["Python", "Docker", "PostgreSQL"] },
    { id: 4, name: "Emma Wilson", avatar: "👩‍🎨", status: "offline", role: "UI/UX Designer", skills: ["Figma", "Prototyping", "Animation"] },
    { id: 5, name: "David Lee", avatar: "👨‍🔬", status: "online", role: "AI Researcher", skills: ["TensorFlow", "PyTorch", "NLP"] },
    { id: 6, name: "Lisa Park", avatar: "👩‍💼", status: "online", role: "Product Manager", skills: ["Agile", "Analytics", "Strategy"] },
    { id: 7, name: "Raj Patel", avatar: "👨‍💼", status: "online", role: "DevOps Engineer", skills: ["Kubernetes", "Terraform", "CI/CD"] },
    { id: 8, name: "Maya Rodriguez", avatar: "👩‍🔧", status: "online", role: "QA Engineer", skills: ["Testing", "Automation", "Security"] },
  ];

  // Enhanced useEffect for socket connections
  useEffect(() => {
    // Simulate initial load with more features
    const timer = setTimeout(() => {
      setLoading(false);
      loadEnhancedChatHistory();
      joinRoom(activeRoom);
      loadPinnedMessages();
    }, 1500);

    // Enhanced Socket event listeners
    socket.on("connect", () => {
      console.log("Connected to chat server with ID:", socket.id);
      socket.emit("joinRoom", { 
        room: activeRoom, 
        username: "You",
        userId: generateUserId(),
        status: userStatus
      });
    });

    socket.on("userJoined", (data) => {
      console.log(`${data.username} joined with role: ${data.role}`);
      setOnlineUsers(prev => [...prev, data]);
      addSystemMessage(`${data.username} joined the chat`);
      
      // Update room member count
      setRooms(prev => prev.map(room => 
        room.id === activeRoom 
          ? { ...room, members: room.members + 1 }
          : room
      ));
    });

    socket.on("userLeft", (data) => {
      console.log(`${data.username} left the room`);
      setOnlineUsers(prev => prev.filter(user => user.userId !== data.userId));
      addSystemMessage(`${data.username} left the chat`);
      
      // Update room member count
      setRooms(prev => prev.map(room => 
        room.id === activeRoom 
          ? { ...room, members: Math.max(0, room.members - 1) }
          : room
      ));
    });

    socket.on("receiveMessage", (data) => {
      handleIncomingMessage(data);
    });

    socket.on("typing", (data) => {
      if (data.username !== "You") {
        setIsTyping({ user: data.username, room: data.room });
        setTimeout(() => setIsTyping(null), 2000);
      }
    });

    socket.on("usersOnline", (users) => {
      setOnlineUsers(users);
    });

    socket.on("messageReacted", (data) => {
      updateMessageReaction(data.messageId, data.reaction);
    });

    socket.on("messagePinned", (data) => {
      addPinnedMessage(data.message);
    });

    socket.on("roomUpdated", (data) => {
      updateRoomSettings(data.room, data.settings);
    });

    return () => {
      clearTimeout(timer);
      socket.off("connect");
      socket.off("userJoined");
      socket.off("userLeft");
      socket.off("receiveMessage");
      socket.off("typing");
      socket.off("usersOnline");
      socket.off("messageReacted");
      socket.off("messagePinned");
      socket.off("roomUpdated");
    };
  }, [activeRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const generateUserId = () => {
    return 'user_' + Math.random().toString(36).substr(2, 9);
  };

  const loadEnhancedChatHistory = () => {
    const sampleMessages = [
      {
        id: 1,
        role: "user",
        username: "Alex Johnson",
        avatar: "👨‍💻",
        text: "Has anyone tried the new React 19 features? The Actions API looks promising for form handling!",
        timestamp: "10:30 AM",
        room: "general",
        reactions: { '👍': 3, '🎯': 2 },
        edited: false,
        attachments: [{ name: 'react-19-docs.pdf', type: 'file', url: '#' }]
      },
      {
        id: 2,
        role: "user",
        username: "Sarah Chen",
        avatar: "👩‍💻",
        text: "Yes! The new Actions API is fantastic for forms. Also loving the Document Metadata updates.",
        timestamp: "10:32 AM",
        room: "general",
        reactions: { '❤️': 4 },
        edited: true,
        replyingTo: { username: "Alex Johnson", text: "Has anyone tried the new React 19 features?" }
      },
      {
        id: 3,
        role: "ai",
        username: "CodeBot",
        avatar: "🤖",
        text: "I can help with that! React 19 introduces several new features including Actions, Document Metadata, and improved hydration. Need specific examples?",
        timestamp: "10:35 AM",
        room: "general",
        reactions: { '🤖': 5, '⚡': 3 },
        edited: false
      },
      {
        id: 4,
        role: "system",
        username: "System",
        avatar: "⚙️",
        text: "Emma Wilson joined the chat",
        timestamp: "10:40 AM",
        room: "general",
        edited: false
      },
      {
        id: 5,
        role: "user",
        username: "You",
        avatar: "👤",
        text: "Hi everyone! Looking forward to learning together and building amazing projects.",
        timestamp: "Just now",
        room: "general",
        reactions: { '👋': 2 },
        edited: false
      },
    ];
    setMessages(sampleMessages);
  };

  const loadPinnedMessages = () => {
    const pinned = [
      {
        id: 101,
        username: "Admin",
        text: "Welcome to General Chat! Please read the community guidelines.",
        timestamp: "Yesterday",
        pinnedBy: "Alex Johnson"
      },
      {
        id: 102,
        username: "Sarah Chen",
        text: "Important: Weekly meeting moved to Friday 3 PM",
        timestamp: "2 hours ago",
        pinnedBy: "System"
      }
    ];
    setPinnedMessages(pinned);
  };

  const joinRoom = (roomId) => {
    socket.emit("joinRoom", { 
      room: roomId, 
      username: "You",
      userId: generateUserId(),
      status: userStatus
    });
    setActiveRoom(roomId);
    
    // Reset unread count for the room
    setRooms(prevRooms => 
      prevRooms.map(room => 
        room.id === roomId ? { ...room, unread: 0 } : room
      )
    );
    
    // Notify user
    addSystemMessage(`Joined #${rooms.find(r => r.id === roomId)?.name}`);
  };

  const handleIncomingMessage = (data) => {
    const newMessage = {
      id: Date.now(),
      role: data.username === "You" ? "user" : data.role || "user",
      username: data.username,
      avatar: data.avatar || "👤",
      text: data.message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      room: data.room,
      reactions: {},
      edited: false,
      attachments: data.attachments || []
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Update room message count
    if (data.room === activeRoom) {
      setRooms(prev => prev.map(room => 
        room.id === data.room 
          ? { ...room, messages: room.messages + 1 }
          : room
      ));
    }
  };

  const addSystemMessage = (text) => {
    const systemMessage = {
      id: Date.now(),
      role: "system",
      username: "System",
      avatar: "⚙️",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      room: activeRoom,
      edited: false
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
      room: activeRoom,
      reactions: {},
      edited: false
    };

    setMessages(prev => [...prev, userMsg]);
    
    // Emit message through socket
    socket.emit("sendMessage", {
      room: activeRoom,
      message: data.message,
      username: "You",
      avatar: "👤",
      userId: generateUserId()
    });

    reset();
    socket.emit("typing", { room: activeRoom, username: "You" });
  };

  const handleTyping = () => {
    socket.emit("typing", { room: activeRoom, username: "You" });
  };

  const updateMessageReaction = (messageId, reaction) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const currentCount = msg.reactions[reaction] || 0;
        return {
          ...msg,
          reactions: {
            ...msg.reactions,
            [reaction]: currentCount + 1
          }
        };
      }
      return msg;
    }));
  };

  const addPinnedMessage = (message) => {
    setPinnedMessages(prev => [message, ...prev.slice(0, 4)]);
  };

  const updateRoomSettings = (roomId, settings) => {
    setRooms(prev => prev.map(room => 
      room.id === roomId ? { ...room, ...settings } : room
    ));
  };

  const handleQuickAction = (action) => {
    const actionMessages = {
      'Code Snippet': '```javascript\nconsole.log("Hello World!");\n```',
      'Share Image': 'Check out this design I created! 🎨',
      'Send File': 'I\'m sharing the project files with you.',
      'Schedule': 'Let\'s schedule a meeting for next week.',
      'Share Link': 'Here\'s an interesting article: https://example.com',
      'Mention': '@all Important announcement!'
    };
    
    setValue('message', actionMessages[action] || action);
  };

  const toggleUserStatus = () => {
    const statuses = ['online', 'away', 'busy', 'offline'];
    const currentIndex = statuses.indexOf(userStatus);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    setUserStatus(nextStatus);
    addSystemMessage(`Status changed to ${nextStatus}`);
  };

  // Fix missing functions
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
      room: activeRoom,
      reactions: {},
      edited: false
    };

    setMessages(prev => [...prev, emojiMessage]);
    socket.emit("sendMessage", {
      room: activeRoom,
      message: emoji,
      username: "You",
      avatar: "👤",
      userId: generateUserId()
    });
    setShowEmojiPicker(false);
  };

  const startRecording = () => {
    setIsRecording(true);
    // Implement actual recording logic here
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Implement actual recording stop logic here
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    // Implement actual audio toggle logic here
  };

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
    // Implement actual video toggle logic here
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const clearChat = () => {
    setMessages([]);
    addSystemMessage("Chat cleared. New conversation started.");
  };

  const emojis = ["😊", "👍", "🎉", "🚀", "💻", "🧠", "⚡", "🔥", "✨", "🤔", "👏", "❤️"];

  // Enhanced loading component
  if (loading) {
    return (
      <AppLayout>
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-black dark:to-gray-800">
          {/* Animated Background */}
          <div className="hidden dark:block">
            <Animate />
          </div>
          
          {/* Enhanced Loading Animation */}
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
            <div className="max-w-4xl w-full">
              {/* Loading Header */}
              <div className="text-center mb-12">
                <div className="relative inline-block mb-6">
                  <div className="w-32 h-32 border-4 border-emerald-900/10 dark:border-emerald-400/10 rounded-full animate-spin-slow"></div>
                  <div className="absolute inset-8 border-4 border-emerald-900/20 dark:border-emerald-400/20 rounded-full animate-spin-slow-reverse"></div>
                  <div className="absolute inset-16 border-4 border-emerald-900/30 dark:border-emerald-400/30 rounded-full animate-ping"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MessageSquare className="w-16 h-16 text-emerald-900 dark:text-emerald-400 animate-pulse" />
                  </div>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-900 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-400 dark:to-emerald-400 animate-gradient">
                  Loading Enhanced Chat Experience
                </h1>
                <p className="mt-4 text-lg text-emerald-900 dark:text-emerald-400">
                  Initializing real-time communication protocols...
                </p>
              </div>

              {/* Loading Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {['Connection', "Security", "History"].map((item, idx) => (
                  <div key={idx} className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-emerald-200 dark:border-emerald-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-emerald-900 dark:text-emerald-400">{item}</h3>
                      <div className="flex space-x-1">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.1}s` }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="h-2 bg-emerald-100 dark:bg-emerald-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-loading-bar"
                        style={{ width: `${70 + idx * 10}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: <Video className="w-6 h-6" />, text: "Video Calls" },
                  { icon: <Mic className="w-6 h-6" />, text: "Voice Messages" },
                  { icon: <File className="w-6 h-6" />, text: "File Sharing" },
                  { icon: <Shield className="w-6 h-6" />, text: "End-to-End Encryption" },
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-emerald-200 dark:border-emerald-700 text-center"
                  >
                    <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white">
                      {feature.icon}
                    </div>
                    <span className="text-sm font-medium text-emerald-900 dark:text-emerald-400">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes spin-slow {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes spin-slow-reverse {
              0% { transform: rotate(360deg); }
              100% { transform: rotate(0deg); }
            }
            @keyframes gradient {
              0%, 100% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
            }
            @keyframes loading-bar {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(0); }
            }
            .animate-spin-slow {
              animation: spin-slow 3s linear infinite;
            }
            .animate-spin-slow-reverse {
              animation: spin-slow-reverse 4s linear infinite;
            }
            .animate-gradient {
              background-size: 200% auto;
              animation: gradient 3s ease-in-out infinite;
            }
            .animate-loading-bar {
              animation: loading-bar 1.5s ease-in-out infinite;
            }
          `}</style>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-black dark:to-gray-800">
        {/* Enhanced Background */}
        <div className="hidden dark:block">
          <Animate />
        </div>

        {/* Enhanced Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-30 dark:opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${4 + Math.random() * 6}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
                transform: `scale(${0.5 + Math.random()})`,
              }}
            />
          ))}
        </div>

        {/* Main Container */}
        <div className="relative z-10 max-w-7xl mx-auto p-6">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white text-2xl">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Zap className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-900 to-teal-900 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-400">
                  DevConnect Pro
                </h1>
                <p className="text-emerald-700 dark:text-emerald-400">
                  Real-time collaboration platform for developers
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowAdvancedStats(!showAdvancedStats)}
                className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 rounded-lg border border-emerald-200 dark:border-emerald-700 flex items-center gap-2"
              >
                <BarChart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-900 dark:text-emerald-400">Analytics</span>
              </button>
              
              <button
                onClick={toggleUserStatus}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  userStatus === 'online' 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                    : userStatus === 'away'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                    : userStatus === 'busy'
                    ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white'
                    : 'bg-gradient-to-r from-gray-500 to-gray-700 text-white'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${
                  userStatus === 'online' ? 'bg-white' :
                  userStatus === 'away' ? 'bg-white' :
                  userStatus === 'busy' ? 'bg-white' : 'bg-white'
                }`} />
                <span className="capitalize">{userStatus}</span>
              </button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Rooms & Quick Actions */}
            <div className="lg:col-span-1 space-y-6">
              {/* Rooms Panel */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-black rounded-2xl border border-emerald-200 dark:border-emerald-800 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-emerald-900 dark:text-emerald-400">Chat Rooms</h2>
                  <button className="p-2 hover:bg-emerald-100 dark:hover:bg-gray-800 rounded-lg">
                    <Plus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  {rooms.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      isActive={activeRoom === room.id}
                      onJoin={joinRoom}
                      onFavorite={(roomId, favorite) => {
                        setRooms(prev => prev.map(r => 
                          r.id === roomId ? { ...r, isFavorite: favorite } : r
                        ));
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Quick Actions Panel */}
              <QuickActionsPanel onAction={handleQuickAction} />
            </div>

            {/* Main Chat Area */}
            <div className="lg:col-span-2 flex flex-col">
              {/* Enhanced Chat Header */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-2xl border border-emerald-200 dark:border-emerald-800 p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white text-2xl">
                      {rooms.find(r => r.id === activeRoom)?.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-emerald-900 dark:text-emerald-400">
                        {rooms.find(r => r.id === activeRoom)?.name}
                      </h2>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-sm text-emerald-700 dark:text-emerald-300">
                            {rooms.find(r => r.id === activeRoom)?.members} members
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-sm text-emerald-700 dark:text-emerald-300">
                            {rooms.find(r => r.id === activeRoom)?.messages} messages
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-emerald-100 dark:hover:bg-gray-800 rounded-lg">
                      <Pin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </button>
                    <button className="p-2 hover:bg-emerald-100 dark:hover:bg-gray-800 rounded-lg">
                      <Bell className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </button>
                    <button className="p-2 hover:bg-emerald-100 dark:hover:bg-gray-800 rounded-lg">
                      <Settings className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Enhanced Messages Area */}
              <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl border border-emerald-200 dark:border-emerald-800 overflow-hidden flex flex-col">
                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-6">
                  {/* Pinned Messages */}
                  {pinnedMessages.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Pin className="w-5 h-5 text-amber-500" />
                        <h3 className="font-semibold text-emerald-900 dark:text-emerald-400">Pinned Messages</h3>
                      </div>
                      <div className="space-y-2">
                        {pinnedMessages.map((msg) => (
                          <div key={msg.id} className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-lg border border-amber-200 dark:border-amber-700">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-amber-900 dark:text-amber-400">{msg.username}</span>
                              <span className="text-xs text-amber-700 dark:text-amber-300">{msg.timestamp}</span>
                            </div>
                            <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">{msg.text}</p>
                            <div className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                              Pinned by {msg.pinnedBy}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Messages */}
                  <div className="space-y-1">
                    {messages
                      .filter(msg => msg.room === activeRoom)
                      .map((msg) => (
                        <MessageComponent
                          key={msg.id}
                          message={msg}
                          isCurrentUser={msg.username === "You"}
                          onReact={(messageId, reaction) => {
                            socket.emit("reactToMessage", {
                              messageId,
                              reaction,
                              room: activeRoom
                            });
                          }}
                          onReply={(message) => {
                            setValue('message', `@${message.username} `);
                            document.querySelector('input[name="message"]')?.focus();
                          }}
                          onPin={(message) => {
                            socket.emit("pinMessage", {
                              messageId: message.id,
                              room: activeRoom
                            });
                            addPinnedMessage(message);
                          }}
                          onDelete={(messageId) => {
                            setMessages(prev => prev.filter(msg => msg.id !== messageId));
                          }}
                        />
                      ))}
                  </div>

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg border border-emerald-200 dark:border-emerald-700">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-150"></div>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-300"></div>
                      </div>
                      <span className="text-sm text-emerald-700 dark:text-emerald-400">
                        {isTyping.user} is typing...
                      </span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Enhanced Input Area */}
                <div className="border-t border-emerald-200 dark:border-emerald-800 p-4">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    {/* Quick Reply Options */}
                    <div className="flex flex-wrap gap-2">
                      {['👍', '👎', '🎉', '🤔', '👀', '🚀'].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => sendEmoji(emoji)}
                          className="p-2 hover:bg-emerald-100 dark:hover:bg-gray-800 rounded-lg text-xl"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>

                    {/* Main Input */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={handleFileUpload}
                          className="p-2 hover:bg-emerald-100 dark:hover:bg-gray-800 rounded-lg"
                        >
                          <Paperclip className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
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
                          className="p-2 hover:bg-emerald-100 dark:hover:bg-gray-800 rounded-lg"
                        >
                          <Smile className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </button>
                        <button
                          type="button"
                          onClick={isRecording ? stopRecording : startRecording}
                          className={`p-2 rounded-lg ${
                            isRecording
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse'
                              : 'hover:bg-emerald-100 dark:hover:bg-gray-800'
                          }`}
                        >
                          <Mic className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex-1 relative">
                        <input
                          type="text"
                          placeholder={`Message #${rooms.find(r => r.id === activeRoom)?.name}...`}
                          {...register("message")}
                          onKeyUp={handleTyping}
                          className="w-full px-4 py-3 rounded-xl bg-emerald-50 dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-emerald-900 dark:text-emerald-100 placeholder-emerald-700/70 dark:placeholder-emerald-400/50"
                        />
                        <div className="absolute right-3 top-3 flex items-center gap-2">
                          <button
                            type="button"
                            className="text-xs text-emerald-600 dark:text-emerald-400"
                          >
                            Enter to send
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex items-center justify-center hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Users & Stats */}
            <div className="lg:col-span-1 space-y-6">
              {/* Online Users */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-black rounded-2xl border border-emerald-200 dark:border-emerald-800 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-emerald-900 dark:text-emerald-400">Online Members</h2>
                  <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm rounded-full">
                    {users.filter(u => u.status === 'online').length} online
                  </span>
                </div>
                
                <div className="space-y-3">
                  {users.map((user) => (
                    <UserCard
                      key={user.id}
                      user={user}
                      onMessage={(user) => {
                        setValue('message', `@${user.name} `);
                        document.querySelector('input[name="message"]')?.focus();
                      }}
                      onCall={(user) => {
                        addSystemMessage(`Calling ${user.name}...`);
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Statistics Dashboard */}
              {showAdvancedStats && <StatisticsDashboard />}
            </div>
          </div>

          {/* Enhanced Footer */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-emerald-200 dark:border-emerald-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-emerald-900 dark:text-emerald-400">Connection Speed</div>
                  <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-400">24ms</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-emerald-200 dark:border-emerald-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-emerald-900 dark:text-emerald-400">Security Status</div>
                  <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-400">Active</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-emerald-200 dark:border-emerald-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-emerald-900 dark:text-emerald-400">Storage</div>
                  <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-400">2.4 GB</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="fixed bottom-6 left-6 z-50">
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm ${
              socket.connected
                ? 'bg-emerald-100/80 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-red-100/80 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  socket.connected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                }`}></div>
                <span>{socket.connected ? 'Connected' : 'Disconnected'}</span>
              </div>
            </div>
            
            <div className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <Globe className="w-4 h-4" />
                <span>Server: US-East</span>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) translateX(0) scale(1); }
            33% { transform: translateY(-20px) translateX(10px) scale(1.1); }
            66% { transform: translateY(10px) translateX(-10px) scale(0.9); }
          }
        `}</style>
      </div>
    </AppLayout>
  );
}

export default Chat;