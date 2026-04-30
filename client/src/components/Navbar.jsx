import { Link } from 'react-router-dom';
import useAppStore from '../hooks/useAppStore';

const Navbar = () => {
  const { user } = useAppStore();

  return (
    <nav className="w-full py-4 px-6 md:px-12 flex items-center justify-between border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
        <span className="text-emerald-400">&lt;/&gt;</span>
        DevNotes
      </Link>

      <div className="flex items-center gap-6">
        {/* Placeholder links - we'll build these pages next */}
        <Link to="/search" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
          Search
        </Link>
        
        {user ? (
          <Link to="/dashboard" className="text-sm font-medium bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-md border border-emerald-500/20 hover:bg-emerald-500/20 transition-all">
            Dashboard
          </Link>
        ) : (
          <Link to="/login" className="text-sm font-medium bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition-all">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;