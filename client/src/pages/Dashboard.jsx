import { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import useAppStore from '../hooks/useAppStore';
import CodeBlock from '../components/CodeBlock';
import HolographicCard from '../components/HolographicCard';

const Dashboard = () => {
  const { user, notes, fetchNotes, addNote, deleteNote, updateNote, logoutUser, isLoading } = useAppStore();
  const navigate = useNavigate();
  
  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [folder, setFolder] = useState('');
  const [tags, setTags] = useState('');
  
  // UI State
  const [editingId, setEditingId] = useState(null);
  const [activeFolder, setActiveFolder] = useState('All');

  const notesGridRef = useRef(null);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Derived Data: Get all unique folders from the user's notes
  const uniqueFolders = useMemo(() => {
    const folders = notes.map(note => note.folder || 'Uncategorized');
    return ['All', ...new Set(folders)];
  }, [notes]);

  // Filter notes based on the active folder tab
  const displayedNotes = useMemo(() => {
    if (activeFolder === 'All') return notes;
    return notes.filter(note => (note.folder || 'Uncategorized') === activeFolder);
  }, [notes, activeFolder]);

  // Entrance Animation when active folder changes
  useEffect(() => {
    if (displayedNotes.length > 0 && notesGridRef.current) {
      gsap.fromTo(
        notesGridRef.current.children,
        { y: 30, opacity: 0, scale: 0.98 },
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
  }, [displayedNotes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    // Convert comma-separated string to an array and clean up spaces
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
    const finalFolder = folder.trim() || 'Uncategorized';

    if (editingId) {
      await updateNote(editingId, { title, content, language, folder: finalFolder, tags: tagsArray });
      setEditingId(null);
    } else {
      await addNote({ title, content, language, folder: finalFolder, tags: tagsArray });
    }
    
    // Clear form
    setTitle('');
    setContent('');
    setLanguage('javascript');
    setFolder('');
    setTags('');
  };

  const handleEditClick = (note) => {
    setEditingId(note._id);
    setTitle(note.title);
    setContent(note.content);
    setLanguage(note.language);
    setFolder(note.folder || 'Uncategorized');
    setTags(note.tags?.join(', ') || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setLanguage('javascript');
    setFolder('');
    setTags('');
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div className="w-full max-w-7xl mx-auto mt-6 space-y-10 px-4 md:px-0">
      
      {/* --- HEADER --- */}
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
          <button onClick={() => navigate('/search')} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-sm font-bold rounded-xl transition-all border border-emerald-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            Search Vault
          </button>
          <button onClick={handleLogout} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-sm font-bold rounded-xl transition-colors border border-slate-700 shadow-lg">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Logout
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* --- LEFT COLUMN: EDITOR FORM --- */}
        <div className="lg:col-span-4">
          <form onSubmit={handleSubmit} className={`relative bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-8 sticky top-24 shadow-2xl transition-all duration-500 overflow-hidden ${editingId ? 'border-2 border-amber-500/50 shadow-[0_0_40px_rgba(245,158,11,0.15)]' : 'border border-slate-700/50'}`}>
            {editingId && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500"></div>}

            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              {editingId ? (
                <><span className="p-2 bg-amber-500/20 text-amber-500 rounded-lg shadow-inner"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></span> Edit Mode</>
              ) : (
                <><span className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg shadow-inner"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg></span> New Snippet</>
              )}
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Title</label>
                <input type="text" placeholder="e.g. JWT Auth Hook" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-slate-950/50 text-slate-100 px-5 py-3 rounded-xl border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all font-medium placeholder:text-slate-600 shadow-inner" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Language</label>
                  <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full bg-slate-950/50 text-slate-300 px-4 py-3 rounded-xl border border-slate-700 focus:border-emerald-500 outline-none cursor-pointer shadow-inner">
                    <option value="javascript">JS / React</option>
                    <option value="python">Python</option>
                    <option value="css">CSS</option>
                    <option value="html">HTML</option>
                    <option value="bash">Terminal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Folder</label>
                  <input type="text" list="folder-options" placeholder="Root" value={folder} onChange={(e) => setFolder(e.target.value)} className="w-full bg-slate-950/50 text-slate-300 px-4 py-3 rounded-xl border border-slate-700 focus:border-emerald-500 outline-none placeholder:text-slate-600 shadow-inner" />
                  <datalist id="folder-options">
                    {uniqueFolders.filter(f => f !== 'All').map(f => <option key={f} value={f} />)}
                  </datalist>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tags (Comma Separated)</label>
                <input type="text" placeholder="e.g. backend, security, fix" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full bg-slate-950/50 text-slate-300 px-5 py-3 rounded-xl border border-slate-700 focus:border-emerald-500 outline-none placeholder:text-slate-600 shadow-inner" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Code Content</label>
                <textarea placeholder="// Paste code here..." value={content} onChange={(e) => setContent(e.target.value)} rows="8" className="w-full bg-slate-950/80 text-emerald-300 font-mono text-sm px-5 py-4 rounded-xl border border-slate-700 focus:border-emerald-500 outline-none resize-none custom-scrollbar shadow-inner" spellCheck="false" required></textarea>
              </div>

              <div className="flex gap-4 pt-2">
                <button type="submit" disabled={isLoading} className={`flex-1 font-extrabold py-4 rounded-xl transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 text-slate-900 shadow-lg ${editingId ? 'bg-gradient-to-r from-amber-400 to-orange-500 hover:shadow-orange-500/25' : 'bg-gradient-to-r from-emerald-400 to-teal-500 hover:shadow-emerald-500/25'}`}>
                  {editingId ? 'Commit Changes' : 'Save to Vault'}
                </button>
                {editingId && (
                  <button type="button" onClick={handleCancelEdit} className="px-6 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-colors border border-slate-700">Cancel</button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* --- RIGHT COLUMN: NOTES GRID --- */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* FOLDER NAVIGATION TABS */}
          <div className="flex overflow-x-auto pb-4 custom-scrollbar gap-2 border-b border-slate-800">
            {uniqueFolders.map((folderName) => (
              <button 
                key={folderName} 
                onClick={() => setActiveFolder(folderName)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${activeFolder === folderName ? 'bg-emerald-500 text-slate-900 shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-105' : 'bg-slate-900/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-700/50'}`}
              >
                <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                {folderName}
              </button>
            ))}
          </div>

          {displayedNotes.length === 0 ? (
            <div className="bg-slate-900/40 border-2 border-slate-800/50 rounded-3xl p-16 text-center border-dashed flex flex-col items-center justify-center h-72">
              <svg className="w-12 h-12 text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
              <p className="text-slate-400 text-lg font-medium">No snippets found in '{activeFolder}'.</p>
            </div>
          ) : (
            <div ref={notesGridRef} className="grid grid-cols-1 xl:grid-cols-2 gap-8 perspective-[2000px]">
              {displayedNotes.map((note) => (
                <div key={note._id}>
                  <HolographicCard>
                    
                    {/* Decorative Window Controls & Folder Name */}
                    <div className="bg-slate-950/50 px-5 py-3 border-b border-slate-800 flex items-center justify-between z-10">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                          {note.folder || 'Uncategorized'}
                        </span>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500/80">
                          {note.language}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6 flex-grow flex flex-col relative z-10">
                      <h3 className="text-xl font-bold text-slate-100 truncate mb-4 pr-12">{note.title}</h3>
                      
                      <div className="bg-slate-950 rounded-xl p-4 flex-grow overflow-hidden relative shadow-inner border border-slate-800/50 mb-4">
                        <div className="absolute inset-0 p-4 pb-12 overflow-hidden">
                          <CodeBlock code={note.content} language={note.language} />
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none z-10"></div>
                      </div>

                      {/* TAGS BADGES */}
                      {note.tags && note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-auto">
                          {note.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-slate-800/80 text-emerald-300 rounded border border-slate-700/50">
                              #{tag}
                            </span>
                          ))}
                          {note.tags.length > 3 && (
                            <span className="text-[10px] font-bold text-slate-500 px-1 py-1">+{note.tags.length - 3}</span>
                          )}
                        </div>
                      )}

                      {/* Action Buttons Overlay */}
                      <div className="absolute top-4 right-4 flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        <button onClick={() => handleEditClick(note)} className="p-2 bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white rounded-lg transition-colors shadow-lg">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        </button>
                        <button onClick={() => deleteNote(note._id)} className="p-2 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg transition-colors shadow-lg">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </div>
                    </div>
                    
                  </HolographicCard>
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