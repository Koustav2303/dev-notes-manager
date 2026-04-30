import { create } from 'zustand';

// Safely check if a user is already logged in from a previous session
const storedUser = localStorage.getItem('devnotes_user');
const initialUser = storedUser ? JSON.parse(storedUser) : null;

const useAppStore = create((set) => ({
  // ==========================================
  // --- USER AUTHENTICATION STATE & ACTIONS ---
  // ==========================================
  user: initialUser,
  
  // Directly set user (rarely needed outside of the auth functions below)
  setUser: (user) => set({ user }),

  // 1. Register a New User
  registerUser: async (username, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://127.0.0.1:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // Save the generated JWT token and user info to the browser
      localStorage.setItem('devnotes_user', JSON.stringify(data));
      set({ user: data, isLoading: false });
      return true; // Let the UI component know it was successful
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false; // Let the UI component know it failed
    }
  },

  // 2. Login an Existing User
  loginUser: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://127.0.0.1:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Save the generated JWT token and user info to the browser
      localStorage.setItem('devnotes_user', JSON.stringify(data));
      set({ user: data, isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  // 3. Logout User
  logoutUser: () => {
    localStorage.removeItem('devnotes_user');
    set({ user: null });
  },

  // ==========================================
  // --- NOTES STATE & ACTIONS -------------
  // ==========================================
  notes: [],
  isLoading: false,
  error: null,

  // 1. Fetch all notes from MongoDB
  fetchNotes: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://127.0.0.1:5001/api/notes'); 
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      set({ notes: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      console.error("Error fetching notes:", error);
    }
  },

  // 2. Save a new note to MongoDB
  addNote: async (noteData) => {
    try {
      const response = await fetch('http://127.0.0.1:5001/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newNote = await response.json();
      
      // Add the newly created note directly into the UI state so it shows up instantly
      set((state) => ({ notes: [newNote, ...state.notes] }));
    } catch (error) {
      console.error("Error saving note:", error);
    }
  },
  
  // ==========================================
  // --- UI STATE --------------------------
  // ==========================================
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));

export default useAppStore;