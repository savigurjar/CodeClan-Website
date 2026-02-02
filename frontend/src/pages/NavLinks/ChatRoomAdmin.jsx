import React from 'react';
import { Link } from 'react-router'; 
import AppLayout from '../../Components/AppLayout';
import { Shield } from 'lucide-react';
import Animate from '../../animate';

const ChatRoomAdmin = () => {
  return (
    <AppLayout>
      <div className="relative min-h-screen overflow-hidden bg-white text-black dark:bg-black dark:text-white">
        <div className="hidden dark:block">
          <Animate />
        </div>
        
        {/* Center container both vertically and horizontally */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="text-center p-8 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10 max-w-md w-full relative z-10 shadow-lg">
            <div 
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center"
              aria-hidden="true"
            >
              <Shield className="w-8 h-8 text-emerald-700 dark:text-emerald-400" />
            </div>
            <h1 
              id="admin-access-title"
              className="text-2xl font-bold text-emerald-900 dark:text-emerald-400 mb-2"
            >
              Admin Access Required
            </h1>
            <p className="text-emerald-700 dark:text-emerald-300 mb-6">
              This chat room is only accessible to administrators.
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-900  text-white hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 min-w-[140px]"
              aria-label="Go back to home page"
            >
              Go Back to Home
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ChatRoomAdmin;