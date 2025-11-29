import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import NotificationSystem from '@/components/NotificationSystem';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WorkMate - Job Seeker Hiring Platform',
  description: 'AI-powered hiring platform connecting contractors and job seekers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          {children}
          <NotificationSystem />
        </ThemeProvider>
      </body>
    </html>
  );
}
