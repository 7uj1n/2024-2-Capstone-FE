import { create } from 'zustand';

const useStore = create((set) => ({
    token: null,
    expiresIn: null,
    username: null,
    email: null, // 이메일 상태 추가
    isAuthenticated: false,
    setToken: (token) => set({ token }),
    setExpiresIn: (expiresIn) => set({ expiresIn }),
    setUsername: (username) => set({ username }),
    setEmail: (email) => set({ email }), // 이메일 설정 함수 추가
    setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
    clearAuth: () => set({ token: null, expiresIn: null, username: null, email: null, isAuthenticated: false }),
}));

export default useStore;