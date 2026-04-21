import {create} from 'zustand';

interface CV {

    id: string;
    title: string;
    fullname: string;
    education: string;
    description: string;
    email: string;
}

interface CVState {
  cvs: CV[];
  setCVs: (cvs: CV[]) => void;
  addCV: (cv: CV) => void;
  updateCV: (cv: CV) => void;
  removeCV: (id: string) => void;
}

export const useCVStore = create<CVState>((set) => ({
  cvs: [],
  setCVs: (cvs) => set({ cvs }),
  addCV: (cv) => set((state) => ({ cvs: [...state.cvs, cv] })),
  updateCV: (updated) => set((state) => ({
    cvs: state.cvs.map(c => c.id === updated.id ? updated : c)
  })),
  removeCV: (id) => set((state) => ({
    cvs: state.cvs.filter(c => c.id !== id)
  })),
}));