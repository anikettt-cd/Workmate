'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, Users, Phone, Video } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: number;
  content: string;
  senderId: number;
  receiverId: number;
  jobId?: number;
  isRead: boolean;
  createdAt: string;
  sender: {
    name: string;
    imageUrl?: string;
  };
}

interface ChatSystemProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  selectedJob?: any;
  selectedUser?: any;
}

export default function ChatSystem({ user, isOpen, onClose, selectedJob, selectedUser }: ChatSystemProps) {
  const { theme } = useTheme();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Initialize socket connection (configurable for prod)
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';
      const newSocket = io(socketUrl);
      setSocket(newSocket);

      // Join user room
      newSocket.emit('join-user', user.id);

      // Listen for messages
      newSocket.on('new-message', (message) => {
        setMessages(prev => [...prev, message]);
      });

      // Listen for online users
      newSocket.on('user-online', (userId) => {
        setOnlineUsers(prev => [...prev, userId]);
      });

      newSocket.on('user-offline', (userId) => {
        setOnlineUsers(prev => prev.filter(id => id !== userId));
      });

      // Load existing messages
      loadMessages();

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isOpen, user.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    if (!selectedUser) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/messages?userId=${selectedUser.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !socket || !selectedUser) return;

    const messageData = {
      receiverId: selectedUser.id,
      message: newMessage.trim(),
      senderId: user.id,
      jobId: selectedJob?.id
    };

    // Send via socket
    socket.emit('send-message', messageData);

    // Also save to database
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(messageData)
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }

    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg shadow-xl max-w-4xl w-full h-[80vh] flex flex-col ${
        theme === 'LIGHT' ? 'bg-white' : 'bg-gray-800'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          theme === 'LIGHT' ? 'border-gray-200' : 'border-gray-700'
        }`}>
          <div className="flex items-center space-x-3">
            <img 
              src={selectedUser?.imageUrl || '/api/dicebear/7.x/avataaars/svg?seed=default'} 
              alt={selectedUser?.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className={`font-semibold ${theme === 'LIGHT' ? 'text-gray-900' : 'text-white'}`}>
                {selectedUser?.name}
              </h3>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  onlineUsers.includes(selectedUser?.id) ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
                <span className={`text-sm ${theme === 'LIGHT' ? 'text-gray-500' : 'text-gray-400'}`}>
                  {onlineUsers.includes(selectedUser?.id) ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className={`p-2 rounded-lg ${theme === 'LIGHT' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'}`}>
              <Phone className="h-5 w-5" />
            </button>
            <button className={`p-2 rounded-lg ${theme === 'LIGHT' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'}`}>
              <Video className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${theme === 'LIGHT' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'}`}
            >
              ×
            </button>
          </div>
        </div>

        {/* Job Context */}
        {selectedJob && (
          <div className={`p-3 border-b ${theme === 'LIGHT' ? 'bg-blue-50 border-blue-200' : 'bg-blue-900 border-blue-700'}`}>
            <p className={`text-sm ${theme === 'LIGHT' ? 'text-blue-800' : 'text-blue-200'}`}>
              <strong>Job:</strong> {selectedJob.title} - {selectedJob.location}
            </p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className={`mt-2 text-sm ${theme === 'LIGHT' ? 'text-gray-600' : 'text-gray-400'}`}>
                Loading messages...
              </p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className={`h-12 w-12 mx-auto mb-4 ${theme === 'LIGHT' ? 'text-gray-400' : 'text-gray-600'}`} />
              <p className={`${theme === 'LIGHT' ? 'text-gray-500' : 'text-gray-400'}`}>
                No messages yet. Start a conversation!
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-xs lg:max-w-md ${message.senderId === user.id ? 'flex-row-reverse' : 'flex-row'}`}>
                  <img 
                    src={message.sender.imageUrl || '/api/dicebear/7.x/avataaars/svg?seed=default'} 
                    alt={message.sender.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className={`mx-2 ${message.senderId === user.id ? 'text-right' : 'text-left'}`}>
                    <div className={`px-4 py-2 rounded-lg ${
                      message.senderId === user.id
                        ? 'bg-blue-600 text-white'
                        : theme === 'LIGHT'
                          ? 'bg-gray-200 text-gray-900'
                          : 'bg-gray-700 text-white'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <p className={`text-xs mt-1 ${theme === 'LIGHT' ? 'text-gray-500' : 'text-gray-400'}`}>
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className={`p-4 border-t ${theme === 'LIGHT' ? 'border-gray-200' : 'border-gray-700'}`}>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                theme === 'LIGHT' 
                  ? 'border-gray-300 bg-white text-gray-900' 
                  : 'border-gray-600 bg-gray-700 text-white'
              }`}
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
