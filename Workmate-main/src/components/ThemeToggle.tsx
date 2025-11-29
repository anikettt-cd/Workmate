'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-colors ${
        theme === 'LIGHT' 
          ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' 
          : 'bg-gray-700 hover:bg-gray-600 text-white'
      }`}
      aria-label="Toggle theme"
    >
      {theme === 'LIGHT' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </button>
  );
}
