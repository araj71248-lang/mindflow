
import React from 'react';
import { AnalysisResult, AppState } from '../types';
import { ICONS } from '../constants';

interface AnalysisViewProps {
  result: AnalysisResult;
  onTalkClick: () => void;
  onReset: () => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ result, onTalkClick, onReset }) => {
  const getStressColor = (level: string) => {
    switch(level) {
      case 'low': return 'text-green-500 bg-green-50';
      case 'moderate': return 'text-amber-500 bg-amber-50';
      case 'high': return 'text-orange-500 bg-orange-50';
      case 'severe': return 'text-rose-500 bg-rose-50';
      default: return 'text-slate-500 bg-slate-50';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="glass-card rounded-3xl p-10 shadow-xl border border-white/50 relative overflow-hidden">
        <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-3xl font-bold uppercase tracking-wider text-xs ${getStressColor(result.stressLevel)}`}>
          Stress Level: {result.stressLevel}
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600">
            <ICONS.Heart size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Your Heart's Reflection</h2>
            <p className="text-slate-500">I've heard you, and I'm here for you.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/50 rounded-2xl p-6 border border-white/20">
            <h3 className="text-teal-700 font-bold mb-2 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-teal-400 rounded-full"></span>
              A Warm Message for You
            </h3>
            <p className="text-lg text-slate-700 leading-relaxed italic">"{result.comfortingMessage}"</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
              <h3 className="text-slate-700 font-bold mb-3">What I observed:</h3>
              <p className="text-slate-600 leading-relaxed">{result.summary}</p>
            </div>
            
            <div className="bg-teal-50/50 rounded-2xl p-6 border border-teal-100">
              <h3 className="text-teal-700 font-bold mb-3">Little steps for today:</h3>
              <ul className="space-y-3">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="flex gap-2 text-slate-700 text-sm">
                    <span className="text-teal-500 font-bold">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={onTalkClick}
          className="flex-1 bg-white border-2 border-teal-500 text-teal-600 py-4 rounded-2xl font-bold text-lg hover:bg-teal-50 transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <ICONS.Mic size={24} /> Talk to MindAnchor
        </button>
        <button 
          onClick={onReset}
          className="flex-1 bg-teal-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-teal-600 transition-all flex items-center justify-center gap-2 shadow-xl shadow-teal-200"
        >
          <ICONS.Message size={24} /> Journal Again
        </button>
      </div>

      {result.stressLevel === 'severe' && (
        <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6 animate-pulse">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center text-rose-500 flex-shrink-0">
            <ICONS.Info size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-rose-700 mb-1">Please reach out for help</h3>
            <p className="text-rose-600 leading-relaxed">It sounds like you're going through a very difficult time right now. You don't have to carry this alone. Please consider talking to a professional or using one of the helplines listed above.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisView;
