import { create } from 'zustand';

const useTimeStore = create((set) => ({
    currentTime: '',
    setCurrentTime: (time) => set({ currentTime: time }),
}));

export default useTimeStore;