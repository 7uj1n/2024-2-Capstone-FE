import { create } from 'zustand';

const useTrafficStore = create((set) => ({
    selectedDateTime: null,
    setSelectedDateTime: (date, time) => set({ selectedDateTime: { date, time } }),
}));

export default useTrafficStore;