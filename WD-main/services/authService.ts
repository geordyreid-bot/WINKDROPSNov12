
import { User } from '../types';

// In a real app, this would be an API call. Here we use localStorage to simulate a session.
const MOCK_SESSION_KEY = 'winkdrops_session';

/**
 * Simulates a login API call.
 * @throws An error if email or password are "incorrect".
 */
export const login = (email: string, pass: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (email.toLowerCase() === 'user@winkdrops.com' && pass === 'password123') {
                const user: User = {
                    id: 'user-123',
                    name: 'Demo User',
                    email: 'user@winkdrops.com',
                    mfaEnabled: false,
                    consents: { contactSync: true, personalizedAI: true, dataAnalytics: true }
                };
                localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(user));
                resolve(user);
            } else {
                reject(new Error('Invalid email or password.'));
            }
        }, 1000);
    });
};

/**
 * Simulates a signup API call.
 * @throws An error if the email is already "taken".
 */
export const signup = (name: string, email: string, pass: string): Promise<User> => {
     return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (email.toLowerCase() === 'user@winkdrops.com') {
                reject(new Error('An account with this email already exists.'));
            } else {
                 const user: User = {
                    id: `user-${Date.now()}`,
                    name: name,
                    email: email,
                    mfaEnabled: false,
                    consents: { contactSync: true, personalizedAI: true, dataAnalytics: true } // Default consents
                };
                localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(user));
                resolve(user);
            }
        }, 1000);
    });
};


/**
 * Simulates a "Sign in with Google" API call.
 */
export const signInWithGoogle = (): Promise<User> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const user: User = {
                id: 'google-user-456',
                name: 'Google User',
                email: 'google.user@example.com',
                mfaEnabled: true,
                consents: { contactSync: true, personalizedAI: true, dataAnalytics: true }
            };
            localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(user));
            resolve(user);
        }, 1500);
    });
};

/**
 * Simulates a logout API call by clearing the session.
 */
export const logout = (): Promise<void> => {
    return new Promise((resolve) => {
        localStorage.removeItem(MOCK_SESSION_KEY);
        resolve();
    });
};


/**
 * Simulates checking for an active session when the app loads.
 */
export const checkSession = (): Promise<User | null> => {
    return new Promise((resolve) => {
        const sessionData = localStorage.getItem(MOCK_SESSION_KEY);
        if (sessionData) {
            try {
                const user = JSON.parse(sessionData);
                resolve(user);
            } catch (e) {
                resolve(null);
            }
        } else {
            resolve(null);
        }
    });
};

/**
 * Updates the mock user data in the session storage.
 */
export const updateMockUser = (user: User): void => {
    localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(user));
};
