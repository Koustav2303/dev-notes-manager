import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAppStore from './hooks/useAppStore';

// --- Pages ---
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';

function App() {
  // Grab the current user from our global store to determine who gets access
  const { user } = useAppStore();

  return (
    <Router>
      {/* Global Wrapper for consistent background and text colors */}
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30">
        
        <main className="container mx-auto px-4 py-8">
          <Routes>
            {/* 1. Default Route: Send users to Dashboard if logged in, otherwise Login */}
            <Route 
              path="/" 
              element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
            />

            {/* 2. Public Auth Routes: Block access if already logged in */}
            <Route 
              path="/login" 
              element={!user ? <Login /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/register" 
              element={!user ? <Register /> : <Navigate to="/dashboard" />} 
            />

            {/* 3. Protected Routes: Block access if NOT logged in */}
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/search" 
              element={user ? <Search /> : <Navigate to="/login" />} 
            />

            {/* 4. Catch-all: If someone types a random URL, send them back home */}
            <Route 
              path="*" 
              element={<Navigate to="/" />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;