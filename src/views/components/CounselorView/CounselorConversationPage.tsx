// src/views/components/CounselorView/CounselorConversationPage.tsx
import React, { useEffect, useState } from 'react';
import { MessageSquare, Loader2 } from 'lucide-react';
import { useLocation } from 'react-router-dom'; // To read studentId from query params

// You would typically have a MessagingService here
// import MessagingService from "../../../services/messaging";

const CounselorConversationPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const studentId = queryParams.get('studentId'); // Student ID if navigated from a student profile

  // State for messages, current conversation, etc.
  const [loading, setLoading] = useState(false); // Example loading state
  const [messages, setMessages] = useState<any[]>([]); // Example message state
  const [currentStudentName, setCurrentStudentName] = useState<string | null>(null); // To display name if specific student selected

  useEffect(() => {
    // If studentId is present, fetch conversation history for that student
    if (studentId) {
      // setLoading(true);
      // Fetch student name from backend or local cache
      // Fetch conversation for studentId
      // MessagingService.getConversation(studentId).then(res => {
      //   setMessages(res.data.messages);
      //   setCurrentStudentName(res.data.studentName);
      // }).catch(err => console.error("Error fetching conversation", err))
      // .finally(() => setLoading(false));
      setCurrentStudentName("Student " + studentId.substring(0, 8)); // Mock
    }
  }, [studentId]);


  return (
    <div className="p-8">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center min-h-[500px] flex flex-col justify-center items-center">
        <MessageSquare className="h-20 w-20 text-indigo-500 mb-6" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
            {currentStudentName ? `Conversation with ${currentStudentName}` : "Your Messages"}
        </h2>
        <p className="text-slate-600 mb-6">
            Communicate securely with students and other staff.
        </p>
        
        {loading ? (
            <Loader2 className="animate-spin h-8 w-8 text-indigo-500" />
        ) : (
            // Render chat interface here
            <div className="w-full max-w-lg h-96 border border-slate-300 rounded-lg overflow-y-auto p-4 flex flex-col justify-end">
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <div key={index} className={`mb-2 p-2 rounded-lg ${msg.sender === 'self' ? 'bg-indigo-100 self-end' : 'bg-slate-100 self-start'}`}>
                            <p className="text-sm">{msg.text}</p>
                            <span className="text-xs text-slate-500 float-right">{msg.time}</span>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-slate-500">No messages yet.</p>
                )}
                {/* Input for new message */}
                <div className="mt-4 flex gap-2">
                    <input type="text" placeholder="Type a message..." className="flex-1 border border-slate-300 rounded-lg p-2" />
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Send</button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default CounselorConversationPage;