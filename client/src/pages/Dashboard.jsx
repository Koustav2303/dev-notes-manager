import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import useAppStore from '../hooks/useAppStore';
import CodeBlock from '../components/CodeBlock';

const Dashboard = () => {
  const { user, notes, fetchNotes, addNote, deleteNote, updateNote, logoutUser, isLoading } = useAppStore();
  const navigate = useNavigate();
  
  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('javascript');
  
  // Edit State
  const [editingId, setEditingId] = useState(null);

  const notesGridRef = useRef(null);

  // Fetch notes on load
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Entrance Animation
  useEffect(() => {
    if (notes.length > 0 && notesGridRef.current) {
      gsap.fromTo(
        notesGridRef.current.children,
        { y: 50, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'all'
        }
      );
    }
  }, [notes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    if (editingId) {
      await updateNote(editingId, { title, content, language });
      setEditingId(null);
    } else {
      await addNote({ title, content, language });
    }
    
    setTitle('');
    setContent('');
    setLanguage('javascript');
  };

  const handleEditClick = (note) => {
    setEditingId(note._id);
    setTitle(note.title);
    setContent(note.content);
    setLanguage(note.language);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setLanguage('javascript');
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div className="w-full max-w-7xl mx-auto mt-6 space-y-10 px-4 md:px-0">
      
      {/* --- PREMIUM HEADER --- */}
      <header className="relative flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none rounded-3xl">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full"></div>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span className="text-emerald-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
            </span>
            Vault: <span className="font-light">{user?.username}</span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm font-medium tracking-wide uppercase">Your encrypted code repository</p>
        </div>
        
        <div className="relative z-10 flex items-center gap-4 mt-6 md:mt-0 w-full md:w-auto">
          <button 
            onClick={() => navigate('/search')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-sm font-bold rounded-xl transition-all border border-emerald-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            Search Vault
          </button>
          
          <button 
            onClick={handleLogout}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-sm font-bold rounded-xl transition-colors border border-slate-700 shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Logout
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* --- LEFT COLUMN: EDITOR FORM --- */}
        <div className="lg:col-span-4">
          <form 
            onSubmit={handleSubmit} 
            className={`relative bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-8 sticky top-24 shadow-2xl transition-all duration-500 overflow-hidden ${editingId ? 'border-2 border-amber-500/50 shadow-[0_0_40px_rgba(245,158,11,0.15)]' : 'border border-slate-700/50'}`}
          >
            {editingId && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500"></div>}

            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              {editingId ? (
                <><span className="p-2 bg-amber-500/20 text-amber-500 rounded-lg shadow-inner"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></span> Edit Mode</>
              ) : (
                <><span className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg shadow-inner"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg></span> New Snippet</>
              )}
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Authentication Hook" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950/50 text-slate-100 px-5 py-4 rounded-xl border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all font-medium placeholder:text-slate-600 shadow-inner"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Language</label>
                <div className="relative">
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-slate-950/50 text-slate-300 px-5 py-4 rounded-xl border border-slate-700 focus:border-emerald-500 outline-none cursor-pointer appearance-none shadow-inner font-medium"
                  >
                    <option value="javascript">JavaScript / React</option>
                    <option value="python">Python</option>
                    <option value="css">CSS / Tailwind</option>
                    <option value="html">HTML</option>
                    <option value="bash">Terminal / Bash</option>
                  </select>
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Code Content</label>
                <textarea 
                  placeholder="// Paste your masterpiece here..." 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows="10"
                  className="w-full bg-slate-950/80 text-emerald-300 font-mono text-sm px-5 py-4 rounded-xl border border-slate-700 focus:border-emerald-500 outline-none resize-none shadow-inner leading-relaxed custom-scrollbar"
                  spellCheck="false"
                  required
                ></textarea>
              </div>

              <div className="flex gap-4 pt-2">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className={`flex-1 font-extrabold py-4 rounded-xl transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 text-slate-900 shadow-lg ${editingId ? 'bg-gradient-to-r from-amber-400 to-orange-500 hover:shadow-orange-500/25' : 'bg-gradient-to-r from-emerald-400 to-teal-500 hover:shadow-emerald-500/25'}`}
                >
                  {isLoading ? 'Processing...' : (editingId ? 'Commit Changes' : 'Save to Vault')}
                </button>
                
                {editingId && (
                  <button 
                    type="button" 
                    onClick={handleCancelEdit}
                    className="px-6 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-colors border border-slate-700"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* --- RIGHT COLUMN: NOTES GRID --- */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-end justify-between border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">Recent Additions</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-sm font-semibold text-slate-400">
                {notes.length} Snippet{notes.length !== 1 && 's'} Found
              </span>
            </div>
          </div>

          {notes.length === 0 ? (
            <div className="bg-slate-900/40 border-2 border-slate-800/50 rounded-3xl p-16 text-center border-dashed flex flex-col items-center justify-center h-96">
              <svg className="w-16 h-16 text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              <h3 className="text-xl font-bold text-slate-300 mb-2">Your vault is empty</h3>
              <p className="text-slate-500 max-w-sm">Write some code in the editor on the left and save it to start building your personal library.</p>
            </div>
          ) : (
            <div ref={notesGridRef} className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {notes.map((note) => (
                <div 
                  key={note._id} 
                  className="group bg-slate-900/60 backdrop-blur-md border border-slate-700/60 hover:border-emerald-500/50 rounded-2xl transition-all duration-300 hover:shadow-[0_10px_40px_-10px_rgba(16,185,129,0.2)] hover:-translate-y-1 relative overflow-hidden flex flex-col h-72"
                >
                  {/* Decorative Mac-OS style window controls */}
                  <div className="bg-slate-950/50 px-5 py-3 border-b border-slate-800 flex items-center justify-between z-10">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500/80">
                      {note.language}
                    </span>
                  </div>
                  
                  <div className="p-6 flex-grow flex flex-col relative">
                    <h3 className="text-xl font-bold text-slate-100 truncate mb-4 pr-12 z-10">{note.title}</h3>
                    
                    <div className="bg-slate-950 rounded-xl p-4 flex-grow overflow-hidden relative shadow-inner border border-slate-800/50">
                      
                      {/* SYNTAX HIGHLIGHTER INJECTED HERE */}
                      <div className="absolute inset-0 p-4 pb-12 overflow-hidden">
                        <CodeBlock code={note.content} language={note.language} />
                      </div>

                      {/* Gradient Fade to hide long code naturally */}
                      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none z-10"></div>
                    </div>

                    {/* Action Buttons Overlay - Appears on Hover */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                      <button 
                        onClick={() => handleEditClick(note)}
                        className="p-2 bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white rounded-lg transition-colors shadow-lg group/btn"
                        title="Edit Snippet"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      </button>
                      <button 
                        onClick={() => deleteNote(note._id)}
                        className="p-2 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg transition-colors shadow-lg"
                        title="Delete Snippet"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;