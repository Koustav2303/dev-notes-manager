import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import useAppStore from '../hooks/useAppStore';
import CodeBlock from '../components/CodeBlock';

const Search = () => {
  const { notes } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  
  const resultsGridRef = useRef(null);

  // --- THE SEARCH ENGINE LOGIC ---
  const filteredNotes = notes.filter((note) => {
    // 1. Check if the search query matches the title OR the code content
    const matchesSearch = 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 2. Check if it matches the selected language filter
    const matchesLanguage = selectedLanguage === 'all' || note.language === selectedLanguage;

    return matchesSearch && matchesLanguage;
  });

  // --- GSAP ANIMATION ---
  useEffect(() => {
    if (filteredNotes.length > 0 && resultsGridRef.current) {
      gsap.fromTo(
        resultsGridRef.current.children,
        { y: 20, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: 0.05,
          ease: 'power2.out',
          clearProps: 'all'
        }
      );
    }
  }, [searchQuery, selectedLanguage]); // Re-animate when filters change

  // Extract unique languages from user's notes for the filter buttons
  const availableLanguages = ['all', ...new Set(notes.map(note => note.language))];

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 space-y-8 px-4 md:px-0">
      {/* --- Header & Search Bar --- */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="flex justify-between items-center mb-8 relative z-10">
          <h1 className="text-3xl font-bold text-white tracking-tight">Global Search</h1>
          <Link to="/dashboard" className="text-emerald-400 hover:text-emerald-300 font-semibold text-sm transition-colors flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/20">
            <span>&larr;</span> Back to Vault
          </Link>
        </div>

        <div className="relative z-10">
          <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input 
            type="text" 
            placeholder="Search snippets by title, syntax, or keyword..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="w-full bg-slate-950/80 text-slate-100 text-lg px-14 py-5 rounded-xl border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-600 shadow-inner font-medium"
          />
        </div>

        {/* --- Language Filter Chips --- */}
        <div className="flex flex-wrap gap-3 mt-6 relative z-10">
          {availableLanguages.map(lang => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                selectedLanguage === lang 
                  ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-105' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* --- Results Area --- */}
      <div>
        <div className="flex justify-between items-end mb-6 px-2">
          <h2 className="text-xl font-bold text-slate-200 tracking-tight">Search Results</h2>
          <p className="text-sm font-semibold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            {filteredNotes.length} {filteredNotes.length === 1 ? 'match' : 'matches'} found
          </p>
        </div>

        {filteredNotes.length === 0 ? (
          <div className="bg-slate-900/50 border-2 border-slate-800/50 rounded-3xl p-16 text-center border-dashed">
            <svg className="w-12 h-12 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <p className="text-slate-400 text-lg font-medium">No snippets found matching your criteria.</p>
            <button onClick={() => {setSearchQuery(''); setSelectedLanguage('all')}} className="mt-4 text-emerald-400 hover:text-emerald-300 text-sm font-bold underline transition-colors">Clear Filters</button>
          </div>
        ) : (
          <div ref={resultsGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <div 
                key={note._id} 
                className="group bg-slate-900/80 backdrop-blur-sm border border-slate-800 hover:border-emerald-500/50 rounded-2xl transition-all duration-300 hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.2)] hover:-translate-y-1 relative overflow-hidden flex flex-col h-72"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Decorative Window Controls */}
                <div className="bg-slate-950/40 px-4 py-2 border-b border-slate-800 flex items-center justify-between z-10">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500/80">
                    {note.language}
                  </span>
                </div>

                <div className="p-5 flex-grow flex flex-col relative">
                  <h3 className="text-lg font-bold text-slate-100 truncate mb-3 z-10 pr-2">{note.title}</h3>
                  
                  <div className="bg-slate-950 rounded-lg p-4 flex-grow overflow-hidden relative border border-slate-800/50 shadow-inner">
                    
                    {/* SYNTAX HIGHLIGHTER INJECTED HERE */}
                    <div className="absolute inset-0 p-4 pb-12 overflow-hidden">
                      <CodeBlock code={note.content} language={note.language} />
                    </div>

                    <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none z-10"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;