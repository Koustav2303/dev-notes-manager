import { create } from 'zustand';

// Safely check if a user is already logged in from a previous session
const storedUser = localStorage.getItem('devnotes_user');
const initialUser = storedUser ? JSON.parse(storedUser) : null;

const useAppStore = create((set, get) => ({
  // ==========================================
  // --- USER AUTHENTICATION STATE & ACTIONS ---
  // ==========================================
  user: initialUser,
  
  setUser: (user) => set({ user }),

  registerUser: async (username, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://127.0.0.1:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Registration failed');
      
      localStorage.setItem('devnotes_user', JSON.stringify(data));
      set({ user: data, isLoading: false });
      return true; 
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false; 
    }
  },

  loginUser: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://127.0.0.1:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Login failed');
      
      localStorage.setItem('devnotes_user', JSON.stringify(data));
      set({ user: data, isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  logoutUser: () => {
    localStorage.removeItem('devnotes_user');
    set({ user: null, notes: [] }); 
  },

  // ==========================================
  // --- NOTES STATE & ACTIONS -------------
  // ==========================================
  notes: [],
  isLoading: false,
  error: null,

  // 1. Fetch all notes
  fetchNotes: async () => {
    const { user } = get();
    if (!user || !user.token) return;

    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://127.0.0.1:5001/api/notes', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }); 
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      set({ notes: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      console.error("Error fetching notes:", error);
    }
  },

  // 2. Save a new note
  addNote: async (noteData) => {
    const { user } = get();
    if (!user || !user.token) return;

    try {
      const response = await fetch('http://127.0.0.1:5001/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(noteData),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const newNote = await response.json();
      set((state) => ({ notes: [newNote, ...state.notes] }));
    } catch (error) {
      console.error("Error saving note:", error);
    }
  },

  // 3. Delete a note
  deleteNote: async (id) => {
    const { user } = get();
    if (!user || !user.token) return;

    try {
      const response = await fetch(`http://127.0.0.1:5001/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      set((state) => ({ 
        notes: state.notes.filter((note) => note._id !== id) 
      }));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  },

  // 4. Update a note
  updateNote: async (id, updatedData) => {
    const { user } = get();
    if (!user || !user.token) return;

    try {
      const response = await fetch(`http://127.0.0.1:5001/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const updatedNote = await response.json();

      set((state) => ({
        notes: state.notes.map((note) => (note._id === id ? updatedNote : note)),
      }));
    } catch (error) {
      console.error("Error updating note:", error);
    }
  },
  
  // ==========================================
  // --- UI STATE --------------------------
  // ==========================================
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));

export default useAppStore;