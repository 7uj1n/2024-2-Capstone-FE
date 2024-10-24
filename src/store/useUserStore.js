import { create } from 'zustand';

const useUserStore = create((set) => ({
    user: null,
    register: (name, email, password, confirmPassword) => {
        if (password !== confirmPassword) {
            throw new Error("Passwords do not match");
        }
        // Here you would typically send a request to your backend to register the user
        const newUser = { name, email };
        set({ user: newUser });
    },
    login: (email, password) => {
        // Here you would typically send a request to your backend to authenticate the user
        const authenticatedUser = { email }; // Mock authenticated user
        set({ user: authenticatedUser });
    },
    logout: () => {
        set({ user: null });
    }
}));

export default useUserStore;