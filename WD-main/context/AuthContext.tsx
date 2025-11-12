
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';
import * as authService from '../services/authService';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, pass: string) => Promise<void>;
    signup: (name: string, email: string, pass: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    logout: () => void;
    updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate checking for an existing session on app load
        const checkSession = async () => {
            try {
                const sessionUser = await authService.checkSession();
                if (sessionUser) {
                    setUser(sessionUser);
                }
            } catch (error) {
                console.error("Session check failed", error);
            } finally {
                setIsLoading(false);
            }
        };
        checkSession();
    }, []);

    const login = async (email: string, pass: string) => {
        const loggedInUser = await authService.login(email, pass);
        setUser(loggedInUser);
    };

    const signup = async (name: string, email: string, pass: string) => {
        const newUser = await authService.signup(name, email, pass);
        setUser(newUser);
    };
    
    const signInWithGoogle = async () => {
        const googleUser = await authService.signInWithGoogle();
        setUser(googleUser);
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
    };
    
    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        authService.updateMockUser(updatedUser); // Update mock session
    };


    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-bg">
                <Icon name="loader" className="w-12 h-12 text-brand-primary-500 animate-spin" />
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, signup, signInWithGoogle, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// A simple Icon component to avoid import cycle issues if needed, or assume it's globally available
const Icon: React.FC<{ name: string; className?: string }> = ({ name, className }) => (
    <div className={`icon-${name} ${className}`}></div>
);
