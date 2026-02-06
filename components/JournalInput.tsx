
import React, { useState, useRef } from 'react';
import { ICONS } from '../constants';

interface JournalInputProps {
  onSubmit: (content: string, type: 'text' | 'image') => void;
  isProcessing: boolean;
}

const JournalInput: React.FC<JournalInputProps> = ({ onSubmit, isProcessing }) => {
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (activeTab === 'text' && text.trim()) {
      onSubmit(text, 'text');
    } else if (activeTab === 'image' && imagePreview) {
      onSubmit(imagePreview, 'image');
    }
  };

  return (
    <div className="glass-card rounded-3xl p-8 shadow-xl border border-white/40">
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 font-medium transition-all ${activeTab === 'text' ? 'bg-teal-500 text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
        >
          <ICONS.Message size={20} /> Write Journal
        </button>
        <button 
          onClick={() => setActiveTab('image')}
          className={`flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 font-medium transition-all ${activeTab === 'image' ? 'bg-teal-500 text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
        >
          <ICONS.Camera size={20} /> Photo of Journal
        </button>
      </div>

      {activeTab === 'text' ? (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="How are you feeling today? Don't worry about being perfect, just let it all out..."
          className="w-full h-64 p-6 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-teal-400 outline-none resize-none bg-slate-50 text-lg leading-relaxed transition-all"
        />
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-64 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-teal-300 hover:bg-teal-50/30 transition-all overflow-hidden relative"
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
          ) : (
            <>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 text-slate-400 shadow-sm">
                <ICONS.Camera size={32} />
              </div>
              <p className="text-slate-500 font-medium">Click to upload your handwritten journal</p>
              <p className="text-slate-400 text-sm mt-1">Make sure the text is clear and well-lit</p>
            </>
          )}
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isProcessing || (activeTab === 'text' ? !text : !imagePreview)}
        className={`w-full mt-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${isProcessing ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-teal-500 text-white hover:bg-teal-600 shadow-xl shadow-teal-200'}`}
      >
        {isProcessing ? 'Gently scanning your thoughts...' : 'Analyze & Support Me'}
        {!isProcessing && <ICONS.ArrowRight size={24} />}
      </button>
    </div>
  );
};

export default JournalInput;
