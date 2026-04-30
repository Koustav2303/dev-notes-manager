import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import useAppStore from '../hooks/useAppStore';
import MarkdownEditor from '../components/MarkdownEditor';

const Dashboard = () => {
  // Pull in fetchNotes alongside your notes array
  const { notes, fetchNotes } = useAppStore();
  const dashboardRef = useRef(null);

  useEffect(() => {
    // Trigger the API call to get notes from MongoDB
    fetchNotes();

    const ctx = gsap.context(() => {
      gsap.fromTo('.stagger-item', 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      );
    }, dashboardRef);

    return () => ctx.revert();
  }, [fetchNotes]); // Added fetchNotes to dependency array

  return (
    <div ref={dashboardRef} className="w-full max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="stagger-item flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Analytics</h1>
          <p className="text-slate-400 mt-1">Manage your centralized personal knowledge base.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-900 border border-slate-800 px-6 py-3 rounded-lg text-center">
            <span className="block text-2xl font-bold text-emerald-400">{notes.length}</span>
            <span className="text-xs text-slate-500 uppercase tracking-wider">Total Notes</span>
          </div>
        </div>
      </header>

      {/* Editor Section */}
      <section className="stagger-item">
        <MarkdownEditor />
      </section>

      {/* Database Notes Grid */}
      <section className="stagger-item space-y-4">
        <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-2">Recent Snippets</h3>
        {notes.length === 0 ? (
          <p className="text-slate-500 italic">No notes found. Create your first snippet above!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {notes.map((note) => (
              <div key={note._id} className="bg-slate-900 p-4 rounded-lg border border-slate-800 hover:border-emerald-500/50 transition-colors cursor-pointer flex flex-col justify-between">
                <div>
                  <h4 className="text-emerald-400 font-bold text-lg mb-1">{note.title}</h4>
                  <p className="text-slate-300 text-sm line-clamp-3 mb-4">{note.content}</p>
                </div>
                <span className="text-xs text-slate-500">
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;