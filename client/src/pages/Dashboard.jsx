import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import useAppStore from '../hooks/useAppStore';

const Dashboard = () => {
  const { user, notes, fetchNotes, addNote, deleteNote, updateNote, logoutUser, isLoading } = useAppStore();
  const navigate = useNavigate();
  
  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('javascript');
  
  // Edit State (Tracks if we are creating or modifying)
  const [editingId, setEditingId] = useState(null);

  const notesGridRef = useRef(null);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    if (notes.length > 0 && notesGridRef.current) {
      gsap.fromTo(
        notesGridRef.current.children,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.05,
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
      // If editing an existing note
      await updateNote(editingId, { title, content, language });
      setEditingId(null); // Exit edit mode
    } else {
      // If creating a new note
      await addNote({ title, content, language });
    }
    
    // Clear form
    setTitle('');
    setContent('');
    setLanguage('javascript');
  };

  const handleEditClick = (note) => {
    setEditingId(note._id);
    setTitle(note.title);
    setContent(note.content);
    setLanguage(note.language);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll up to the form
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setLanguage('javascript');
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-8 space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Welcome, <span className="text-emerald-400">{user?.username}</span>
          </h1>
          <p className="text-slate-400 mt-1">Your secure snippet vault.</p>
        </div>
        <button 
          onClick={handleLogout}
          className="mt-4 md:mt-0 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-lg transition-colors border border-slate-700"
        >
          Sign Out
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- Create / Edit Form --- */}
        <div className="lg:col-span-1">
          <form 
            onSubmit={handleSubmit} 
            className={`bg-slate-900/80 backdrop-blur-xl border rounded-2xl p-6 sticky top-24 shadow-2xl transition-colors duration-300 ${editingId ? 'border-amber-500/50' : 'border-slate-800'}`}
          >
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              {editingId ? (
                <><span className="text-amber-500">✏️</span> Edit Snippet</>
              ) : (
                <><svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg> New Snippet</>
              )}
            </h2>

            <div className="space-y-4">
              <div>
                <input 
                  type="text" 
                  placeholder="Snippet Title..." 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 px-4 py-3 rounded-lg border border-slate-800 focus:border-emerald-500 outline-none font-medium"
                  required
                />
              </div>

              <div>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-slate-950 text-slate-400 px-4 py-3 rounded-lg border border-slate-800 focus:border-emerald-500 outline-none cursor-pointer"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="css">CSS / Tailwind</option>
                  <option value="html">HTML</option>
                  <option value="bash">Terminal / Bash</option>
                </select>
              </div>

              <div>
                <textarea 
                  placeholder="Paste your code or notes here..." 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows="8"
                  className="w-full bg-slate-950 text-slate-300 font-mono text-sm px-4 py-3 rounded-lg border border-slate-800 focus:border-emerald-500 outline-none resize-none"
                  required
                ></textarea>
              </div>

              <div className="flex gap-3">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className={`flex-1 font-bold py-3 rounded-lg transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 text-slate-950 ${editingId ? 'bg-amber-500 hover:bg-amber-400' : 'bg-emerald-500 hover:bg-emerald-400'}`}
                >
                  {editingId ? 'Update Note' : 'Save to Vault'}
                </button>
                
                {editingId && (
                  <button 
                    type="button" 
                    onClick={handleCancelEdit}
                    className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* --- Notes Grid --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Recent Snippets</h2>
            <span className="text-xs font-semibold px-3 py-1 bg-slate-800 text-slate-400 rounded-full">
              {notes.length} Total
            </span>
          </div>

          {notes.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-12 text-center border-dashed">
              <p className="text-slate-500">Your vault is empty. Create your first snippet to see it here.</p>
            </div>
          ) : (
            <div ref={notesGridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {notes.map((note) => (
                <div 
                  key={note._id} 
                  className="group bg-slate-900/80 backdrop-blur-sm border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] relative overflow-hidden flex flex-col"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-slate-100 truncate pr-4">{note.title}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-slate-800 text-emerald-400 rounded-md">
                      {note.language}
                    </span>
                  </div>
                  
                  <div className="bg-slate-950 rounded-lg p-4 h-32 overflow-hidden relative mb-4">
                    <pre className="text-xs text-slate-400 font-mono">
                      <code>{note.content}</code>
                    </pre>
                    <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-slate-950 to-transparent"></div>
                  </div>

                  {/* Actions (Edit / Delete) */}
                  <div className="mt-auto flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEditClick(note)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-md transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => deleteNote(note._id)}
                      className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs rounded-md transition-colors"
                    >
                      Delete
                    </button>
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