import { create } from 'zustand';

const useAppStore = create((set) => ({
  // --- User Authentication State ---
  user: null,
  setUser: (user) => set({ user }),

  // --- Notes State ---
  notes: [],
  isLoading: false,
  error: null,

  // 1. Fetch all notes from MongoDB
  fetchNotes: async () => {
    set({ isLoading: true, error: null });
    try {
      // Fetching from your updated port 5001
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
      // FIXED: Sending the POST request to port 5001
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
  
  // --- UI State ---
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));

export default useAppStore;