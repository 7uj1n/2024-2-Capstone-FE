import { create } from 'zustand';

const useStore = create((set) => ({
    token: null,
    expiresIn: null,
    username: null,
    isAuthenticated: false,
    setToken: (token) => set({ token }),
    setExpiresIn: (expiresIn) => set({ expiresIn }),
    setUsername: (username) => set({ username }),
    setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
    clearAuth: () => set({ token: null, expiresIn: null, username: null, isAuthenticated: false }),
}));

export default useStore;