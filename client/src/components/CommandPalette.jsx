import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../hooks/useAppStore';

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const { notes, user, logoutUser } = useAppStore();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // --- 1. GLOBAL KEYBOARD LISTENER ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // --- 2. COMMAND LOGIC ---
  // Static system commands
  const staticCommands = [
    { id: 'dash', title: 'Go to Vault Dashboard', icon: '🏠', action: () => navigate('/dashboard') },
    { id: 'search', title: 'Open Global Search', icon: '🔍', action: () => navigate('/search') },
    { id: 'logout', title: 'Sign Out', icon: '👋', action: () => { logoutUser(); navigate('/login'); } }
  ];

  // Map user notes into commands
  const noteCommands = notes.map(note => ({
    id: note._id,
    title: `Snippet: ${note.title}`,
    subtitle: note.language,
    icon: '📄',
    action: () => {
      // Navigate to search and auto-fill the query to find this note
      navigate('/search');
      // Note: To make this auto-fill, you'd pass state in navigate, but jumping to search is great!
    }
  }));

  // Filter all commands based on input
  const allCommands = user ? [...staticCommands, ...noteCommands] : [];
  const filteredCommands = query === '' 
    ? staticCommands 
    : allCommands.filter(cmd => cmd.title.toLowerCase().includes(query.toLowerCase()));

  // --- 3. PALETTE NAVIGATION ---
  const handleItemKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredCommands.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && filteredCommands.length > 0) {
      e.preventDefault();
      filteredCommands[selectedIndex].action();
      setIsOpen(false);
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current && listRef.current.children[selectedIndex]) {
      listRef.current.children[selectedIndex].scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  // Don't render anything if it's closed
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Background Blur Overlay */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      ></div>

      {/* The Palette Modal */}
      <div className="relative w-full max-w-2xl bg-slate-900/90 backdrop-blur-2xl border border-slate-700/60 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.15)] overflow-hidden flex flex-col transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Search Input Area */}
        <div className="flex items-center px-4 border-b border-slate-700/50 relative">
          <svg className="w-6 h-6 text-emerald-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent text-slate-100 text-lg py-5 outline-none placeholder:text-slate-500"
            placeholder="Type a command or search snippets..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleItemKeyDown}
          />
          <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded border border-slate-700">ESC</span>
        </div>

        {/* Results Area */}
        <div 
          ref={listRef}
          className="max-h-[40vh] overflow-y-auto p-2 custom-scrollbar space-y-1"
        >
          {filteredCommands.length === 0 ? (
            <div className="py-10 text-center text-slate-500 text-sm">
              No results found for "{query}"
            </div>
          ) : (
            filteredCommands.map((cmd, index) => (
              <div
                key={cmd.id}
                onMouseEnter={() => setSelectedIndex(index)}
                onClick={() => {
                  cmd.action();
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-colors ${
                  selectedIndex === index 
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' 
                    : 'bg-transparent text-slate-300 border border-transparent hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{cmd.icon}</span>
                  <div>
                    <span className="font-semibold text-sm">{cmd.title}</span>
                    {cmd.subtitle && (
                      <span className="ml-2 text-xs font-bold uppercase tracking-wider opacity-60">
                        ({cmd.subtitle})
                      </span>
                    )}
                  </div>
                </div>
                {selectedIndex === index && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                )}
              </div>
            ))
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-slate-950/50 px-4 py-3 border-t border-slate-700/50 flex items-center gap-4 text-xs font-medium text-slate-500">
          <span className="flex items-center gap-1">Use <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 border border-slate-700">↑</kbd> <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 border border-slate-700">↓</kbd> to navigate</span>
          <span className="flex items-center gap-1">Use <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 border border-slate-700">Enter</kbd> to select</span>
        </div>

      </div>
    </div>
  );
};

export default CommandPalette;