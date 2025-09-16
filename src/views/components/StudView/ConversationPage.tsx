// src/views/components/StudView/ConversationPage.tsx
import React from 'react';
import { MessageSquare } from 'lucide-react';

const ConversationPage: React.FC = () => {
  return (
    <div className="p-8">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center min-h-[500px] flex flex-col justify-center items-center">
        <MessageSquare className="h-20 w-20 text-blue-500 mb-6" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Your Messages</h2>
        <p className="text-slate-600 mb-6">Connect with your counselors and peers here.</p>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Start New Conversation
        </button>
      </div>
    </div>
  );
};

export default ConversationPage;