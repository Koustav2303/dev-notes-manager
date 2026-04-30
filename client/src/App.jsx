import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Lenis from "@studio-freight/lenis";
import useAppStore from "./hooks/useAppStore";

// Component Imports
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  // Pull the current user from our global state
  const { user } = useAppStore();

  // Initialize Lenis for global smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Cleanup the instance when the component unmounts
    return () => lenis.destroy();
  }, []);

  return (
    <Router>
      <div className="min-h-screen w-full flex flex-col selection:bg-emerald-500/30">
        <Navbar />

        <main className="flex-grow flex flex-col p-6 md:p-12">
          <Routes>
            {/* Home Route */}
            <Route
              path="/"
              element={
                <div className="flex-grow flex flex-col items-center justify-center text-center space-y-8 mt-12 md:mt-20">
                  <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500 tracking-tight">
                    Your Brain, <br />{" "}
                    <span className="text-emerald-400">Compiled.</span>
                  </h1>
                  <p className="text-slate-400 text-lg md:text-xl max-w-2xl">
                    A modern developer-focused knowledge management platform
                    with structured storage, search, and syntax-highlighted code
                    snippets.
                  </p>
                  <div className="flex gap-4 pt-4">
                    {/* Dynamic button based on auth state */}
                    {user ? (
                      <Link
                        to="/dashboard"
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-8 py-3 rounded-lg transition-all transform hover:scale-105"
                      >
                        Open Dashboard
                      </Link>
                    ) : (
                      <Link
                        to="/login"
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-8 py-3 rounded-lg transition-all transform hover:scale-105"
                      >
                        Get Started
                      </Link>
                    )}
                    <Link
                      to="/search"
                      className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-8 py-3 rounded-lg transition-all"
                    >
                      Search Snippets
                    </Link>
                  </div>
                </div>
              }
            />

            {/* Public Auth Routes (Redirects to dashboard if already logged in) */}
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/register"
              element={!user ? <Register /> : <Navigate to="/dashboard" />}
            />

            {/* Protected Route (Redirects to login if NOT logged in) */}
            <Route
              path="/dashboard"
              element={user ? <Dashboard /> : <Navigate to="/login" />}
            />

            {/* Future Placeholder Routes */}
            <Route
              path="/search"
              element={
                <div className="text-center text-slate-400 mt-20">
                  Search functionality coming soon...
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
