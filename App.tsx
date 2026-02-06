
import React, { useState } from 'react';
import { AppState, AnalysisResult } from './types';
import Layout from './components/Layout';
import JournalInput from './components/JournalInput';
import AnalysisView from './components/AnalysisView';
import ChatInterface from './components/ChatInterface';
import { analyzeJournal } from './services/geminiService';
import { HELPLINES, ICONS } from './constants';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.HOME);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [showCrisisModal, setShowCrisisModal] = useState(false);

  const clearSession = () => {
    setAnalysis(null);
    setState(AppState.HOME);
  };

  const handleJournalSubmit = async (content: string, type: 'text' | 'image') => {
    setIsProcessing(true);
    try {
      const result = await analyzeJournal(content, type);
      setAnalysis(result);
      setState(AppState.RESULTS);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderContent = () => {
    switch (state) {
      case AppState.HOME:
        return (
          <div className="text-center space-y-12 py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="max-w-2xl mx-auto space-y-6">
              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-800 leading-tight">
                Your safe anchor in the <span className="text-teal-500">exam storm</span>.
              </h1>
              <p className="text-xl text-slate-500 leading-relaxed">
                Exam stress can be overwhelming. Share your journal with us—written or photographed—and receive immediate support through MindFlow.
              </p>
            </div>
            
            <JournalInput onSubmit={handleJournalSubmit} isProcessing={isProcessing} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {[
                { title: 'Empathetic Scan', desc: 'AI that understands human emotions and detects stress patterns.', icon: <ICONS.Heart className="text-teal-500" /> },
                { title: 'Zero Data Storage', desc: 'Your journal is processed for analysis and then immediately forgotten.', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-500"><path d="M20 20L4 4m16 0L4 20"/></svg> },
                { title: 'Calm Talk', desc: 'A temporary space to be heard without judgment or records.', icon: <ICONS.Mic className="text-teal-500" /> }
              ].map((feature, i) => (
                <div key={i} className="bg-white/40 p-6 rounded-3xl border border-white/60">
                  <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1">{feature.title}</h3>
                  <p className="text-slate-500 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>

            <div className="p-6 bg-slate-100/50 rounded-3xl border border-slate-200/50 flex flex-col items-center gap-4 max-w-xl mx-auto">
              <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Privacy Guarantee
              </div>
              <p className="text-slate-500 text-sm text-center">
                MindFlow does not use cookies, local storage, or databases. Your data is kept in your device's RAM during this session only. Refreshing the page or clicking "Wipe Data" permanently destroys all session information.
              </p>
            </div>
          </div>
        );

      case AppState.RESULTS:
        return analysis ? (
          <AnalysisView 
            result={analysis} 
            onTalkClick={() => setState(AppState.TALKING)}
            onReset={clearSession}
          />
        ) : null;

      case AppState.TALKING:
        return (
          <div className="animate-in zoom-in duration-500">
            <ChatInterface 
              initialContext={analysis?.summary || 'User is feeling stressed.'} 
              onClose={() => setState(AppState.RESULTS)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Layout 
        onCrisisClick={() => setShowCrisisModal(true)} 
        showHome={() => setState(AppState.HOME)}
        onWipeSession={clearSession}
        hasActiveSession={analysis !== null}
      >
        {renderContent()}
      </Layout>

      {showCrisisModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            onClick={() => setShowCrisisModal(false)}
          ></div>
          <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full relative z-10 shadow-2xl border border-white">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center">
                  <ICONS.Info size={28} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">You Are Not Alone</h2>
              </div>
              <button 
                onClick={() => setShowCrisisModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full"
              >
                <ICONS.Close size={24} />
              </button>
            </div>
            
            <p className="text-slate-600 mb-8 leading-relaxed">
              If you are feeling like you might hurt yourself or someone else, please contact one of these helplines immediately. Your life is precious.
            </p>

            <div className="space-y-4">
              {HELPLINES.map((h, i) => (
                <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
                  <span className="font-medium text-slate-700">{h.country}</span>
                  <span className="text-rose-600 font-bold text-lg">{h.number}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setShowCrisisModal(false)}
              className="w-full mt-8 bg-slate-800 text-white py-4 rounded-2xl font-bold hover:bg-slate-900 transition-colors"
            >
              Back to MindFlow
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
