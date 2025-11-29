'use client';

import { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}

export default function NotificationSystem() {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Listen for custom notification events
    const handleNotification = (event: CustomEvent) => {
      addNotification(event.detail);
    };

    window.addEventListener('show-notification', handleNotification as EventListener);
    return () => {
      window.removeEventListener('show-notification', handleNotification as EventListener);
    };
  }, []);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString();
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);

    // Auto remove after duration
    const duration = notification.duration || 5000;
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return theme === 'LIGHT' ? 'bg-green-50 border-green-200' : 'bg-green-900 border-green-700';
      case 'error':
        return theme === 'LIGHT' ? 'bg-red-50 border-red-200' : 'bg-red-900 border-red-700';
      case 'warning':
        return theme === 'LIGHT' ? 'bg-yellow-50 border-yellow-200' : 'bg-yellow-900 border-yellow-700';
      default:
        return theme === 'LIGHT' ? 'bg-blue-50 border-blue-200' : 'bg-blue-900 border-blue-700';
    }
  };

  const getTextColor = (type: string) => {
    switch (type) {
      case 'success':
        return theme === 'LIGHT' ? 'text-green-800' : 'text-green-200';
      case 'error':
        return theme === 'LIGHT' ? 'text-red-800' : 'text-red-200';
      case 'warning':
        return theme === 'LIGHT' ? 'text-yellow-800' : 'text-yellow-200';
      default:
        return theme === 'LIGHT' ? 'text-blue-800' : 'text-blue-200';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`max-w-sm w-full border rounded-lg shadow-lg p-4 transition-all duration-300 transform ${
            getBgColor(notification.type)
          }`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {getIcon(notification.type)}
            </div>
            <div className="ml-3 flex-1">
              <h4 className={`text-sm font-medium ${getTextColor(notification.type)}`}>
                {notification.title}
              </h4>
              <p className={`text-sm mt-1 ${getTextColor(notification.type)} opacity-90`}>
                {notification.message}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <button
                onClick={() => removeNotification(notification.id)}
                className={`inline-flex rounded-md p-1.5 ${
                  theme === 'LIGHT' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'
                }`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Helper function to show notifications
export const showNotification = (notification: Omit<Notification, 'id'>) => {
  const event = new CustomEvent('show-notification', { detail: notification });
  window.dispatchEvent(event);
};
