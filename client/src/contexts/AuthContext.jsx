import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const login = (userData) => {
        // Backend returns: { token, user: { id, email, role } }
        // Just save the user data in state, token is handled by cookies
        setUser(userData);
    };

    const logout = () => {
        // Just clear the user state
        setUser(null);
        // Token will be cleared by the server when logout API is called
    };

    const updateUser = (updatedUserData) => {
        setUser({ ...user, ...updatedUserData });
    };

    const value = {
        user,
        isLoading,
        setUser,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user,

        // User info getters
        getUserId: () => user?.id,
        getUserRole: () => user?.role,
        getUserEmail: () => user?.email,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
