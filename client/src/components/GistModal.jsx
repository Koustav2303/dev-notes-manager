import { useState, useEffect } from 'react';

const GistModal = ({ isOpen, onClose, note, onSuccess }) => {
  // We save the token in localStorage so they only have to enter it once!
  const [token, setToken] = useState(localStorage.getItem('github_pat') || '');
  const [isPublic, setIsPublic] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !note) return null;

  // Map our language to a file extension so GitHub highlights it correctly
  const getExtension = (lang) => {
    const extMap = { javascript: '.js', python: '.py', css: '.css', html: '.html', bash: '.sh' };
    return extMap[lang] || '.txt';
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!token) return setError('Please provide a GitHub Personal Access Token.');
    
    setIsPublishing(true);
    setError('');

    try {
      // 1. Prepare the payload for GitHub
      const filename = `${note.title.replace(/\s+/g, '_').toLowerCase()}${getExtension(note.language)}`;
      const payload = {
        description: `Created via Koustav's Vault - ${note.title}`,
        public: isPublic,
        files: {
          [filename]: { content: note.content }
        }
      };

      // 2. Call the GitHub REST API directly
      const response = await fetch('https://api.github.com/gists', {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `token ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to publish. Check your token permissions (requires "gist" scope).');
      }

      const data = await response.json();
      
      // 3. Save token for future use & trigger success
      localStorage.setItem('github_pat', token);
      onSuccess(data.html_url);
      onClose();

    } catch (err) {
      setError(err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-slate-900 border border-slate-700 p-8 rounded-3xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/20 blur-[60px] rounded-full pointer-events-none"></div>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <svg className="w-6 h-6 text-slate-100" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            Sync to GitHub
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white">&times;</button>
        </div>

        <form onSubmit={handlePublish} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Selected Snippet</label>
            <div className="bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 text-slate-300 font-medium truncate">
              {note.title} <span className="text-emerald-500 text-xs ml-2 border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 rounded">{note.language}</span>
            </div>
          </div>

          <div>
            <label className="flex justify-between items-end text-xs font-bold text-slate-400 uppercase mb-2">
              <span>Personal Access Token</span>
              <a href="https://github.com/settings/tokens/new" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline capitalize normal-case text-[10px]">Get a token &rarr;</a>
            </label>
            <input 
              type="password" 
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" 
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full bg-slate-950 text-slate-100 px-4 py-3 rounded-xl border border-slate-700 focus:border-emerald-500 outline-none placeholder:text-slate-600"
              required
            />
            <p className="text-[10px] text-slate-500 mt-2">Needs the <strong>"gist"</strong> permission scope. Saved locally in your browser.</p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
            <input 
              type="checkbox" 
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4 accent-emerald-500"
            />
            <label htmlFor="isPublic" className="text-sm font-semibold text-slate-300 cursor-pointer">
              Make this Gist Public
            </label>
          </div>

          {error && <p className="text-xs text-red-400 font-bold bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>}

          <button 
            type="submit" 
            disabled={isPublishing}
            className="w-full font-extrabold py-4 rounded-xl text-slate-900 bg-gradient-to-r from-slate-200 to-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all transform hover:-translate-y-1 disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {isPublishing ? 'Pushing to GitHub...' : 'Publish Gist'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GistModal;