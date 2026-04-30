import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import useAppStore from '../hooks/useAppStore';

const MarkdownEditor = () => {
  // Added a title state
  const [title, setTitle] = useState('My Awesome Snippet');
  const [content, setContent] = useState('# Hello World\n\nWrite your code or notes here.');
  const { addNote } = useAppStore();

  const handleSave = async () => {
    if (!title || !content) return alert("Title and Content are required!");
    
    // Pass the correctly formatted object to our API
    await addNote({ title, content, tags: ["draft"] });
    
    // Clear the form after saving
    setTitle('');
    setContent('');
  };

  return (
    <div className="w-full flex flex-col gap-4 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-6 shadow-2xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-800">
        
        {/* Title Input */}
        <input 
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Snippet Title..."
          className="bg-transparent text-xl font-bold text-white tracking-wide outline-none border-b border-transparent focus:border-emerald-500 transition-colors w-full md:w-1/2 placeholder:text-slate-600"
        />

        <button 
          onClick={handleSave}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-6 py-2 rounded-lg transition-all transform hover:scale-105 active:scale-95 whitespace-nowrap"
        >
          Save to Database
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[400px]">
        {/* Editor Pane */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Markdown Input</label>
          <textarea
            className="flex-grow w-full bg-slate-950 text-slate-300 p-4 rounded-lg border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none resize-none font-mono text-sm transition-all"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your markdown here..."
          />
        </div>

        {/* Live Preview Pane */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Live Preview</label>
          <div className="flex-grow w-full bg-slate-950/50 text-slate-300 p-4 rounded-lg border border-slate-800 overflow-y-auto prose prose-invert prose-emerald max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;