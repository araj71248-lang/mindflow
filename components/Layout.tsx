
import React from 'react';
import { ICONS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  onCrisisClick: () => void;
  showHome: () => void;
  onWipeSession: () => void;
  hasActiveSession: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, onCrisisClick, showHome, onWipeSession, hasActiveSession }) => {
  return (
    <div className="min-h-screen gradient-soft flex flex-col font-sans text-slate-800">
      <header className="px-6 py-4 flex items-center justify-between glass-card sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div 
            className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
            onClick={showHome}
          >
            <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-200">
              <ICONS.Heart size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-teal-900">MindFlow</span>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-xs font-bold border border-teal-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            PRIVATE SESSION
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {hasActiveSession && (
            <button 
              onClick={onWipeSession}
              className="text-slate-400 hover:text-rose-500 p-2 transition-colors flex items-center gap-1 text-sm font-medium"
              title="Permanently wipe this session"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
              <span className="hidden sm:inline">Wipe Data</span>
            </button>
          )}
          <button 
            onClick={onCrisisClick}
            className="bg-rose-100 text-rose-600 px-4 py-2 rounded-full font-semibold text-sm hover:bg-rose-200 transition-colors flex items-center gap-2"
          >
            <ICONS.Info size={18} />
            Emergency Support
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-6 pb-24">
        {children}
      </main>

      <footer className="text-center py-8 text-slate-400 text-sm space-y-2">
        <p>© 2024 MindFlow • Your well-being matters more than your grades.</p>
        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-300">Zero-Data Retention Policy • Ephemeral Browser Session</p>
      </footer>
    </div>
  );
};

export default Layout;
