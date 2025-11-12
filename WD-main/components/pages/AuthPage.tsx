
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Icon } from '../ui/Icon';
import { Logo } from '../ui/Logo';
import { Modal } from '../ui/Modal';
import { TermsAndConditions, PrivacyPolicy } from './PolicyPages';

export const AuthPage: React.FC = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const { login, signup, signInWithGoogle } = useAuth();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
    const [modalContent, setModalContent] = useState<'terms' | 'privacy' | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            if (isLoginView) {
                await login(email, password);
            } else {
                if (password !== confirmPassword) {
                    throw new Error("Passwords do not match.");
                }
                if (!hasAcceptedTerms) {
                    throw new Error("You must accept the terms and conditions to sign up.");
                }
                await signup(name, email, password);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError(null);
        setIsLoading(true);
        try {
            await signInWithGoogle();
        } catch (err) {
             setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
             setIsLoading(false);
        }
    };

    const toggleView = () => {
        setIsLoginView(!isLoginView);
        setError(null);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setName('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-primary-100 via-brand-bg to-brand-accent-300 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md bg-brand-surface p-8 rounded-2xl shadow-2xl border border-brand-secondary-200/50 animate-fade-in-up">
                <div className="text-center">
                    <Logo className="justify-center mb-2" />
                    <h1 className="text-2xl font-bold text-brand-text-primary">{isLoginView ? 'Welcome Back' : 'Create an Account'}</h1>
                    <p className="text-brand-text-secondary mt-1">{isLoginView ? 'Sign in to continue to WinkDrops.' : 'Get started with your anonymous support network.'}</p>
                </div>

                <div className="mt-6">
                    <button onClick={handleGoogleSignIn} disabled={isLoading} className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-brand-secondary-300 rounded-lg hover:bg-brand-secondary-50 transition-colors interactive-scale">
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span className="font-semibold text-brand-text-secondary">Continue with Google</span>
                    </button>
                </div>

                <div className="my-6 flex items-center">
                    <div className="flex-grow border-t border-brand-secondary-200"></div>
                    <span className="flex-shrink mx-4 text-xs font-semibold text-brand-secondary-400">OR</span>
                    <div className="flex-grow border-t border-brand-secondary-200"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLoginView && (
                         <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-brand-text-primary mb-1.5">Full Name</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Jane Doe"
                                className="w-full p-3 bg-brand-secondary-100 border border-transparent placeholder-brand-secondary-400 rounded-lg focus:bg-white focus:border-brand-primary-300 focus:ring-1 focus:ring-brand-primary-300 transition-colors"
                            />
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-brand-text-primary mb-1.5">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                            className="w-full p-3 bg-brand-secondary-100 border border-transparent placeholder-brand-secondary-400 rounded-lg focus:bg-white focus:border-brand-primary-300 focus:ring-1 focus:ring-brand-primary-300 transition-colors"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-brand-text-primary mb-1.5">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full p-3 bg-brand-secondary-100 border border-transparent placeholder-brand-secondary-400 rounded-lg focus:bg-white focus:border-brand-primary-300 focus:ring-1 focus:ring-brand-primary-300 transition-colors"
                        />
                    </div>
                     {!isLoginView && (
                        <>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-brand-text-primary mb-1.5">Confirm Password</label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full p-3 bg-brand-secondary-100 border border-transparent placeholder-brand-secondary-400 rounded-lg focus:bg-white focus:border-brand-primary-300 focus:ring-1 focus:ring-brand-primary-300 transition-colors"
                                />
                            </div>
                            <div className="pt-2">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={hasAcceptedTerms}
                                        onChange={() => setHasAcceptedTerms(!hasAcceptedTerms)}
                                        className="h-5 w-5 rounded border-gray-300 text-brand-primary-600 focus:ring-brand-primary-500"
                                        aria-describedby="terms-description"
                                    />
                                    <span id="terms-description" className="text-sm text-brand-text-secondary">
                                        I agree to the 
                                        <button type="button" onClick={() => setModalContent('terms')} className="font-semibold text-brand-primary-600 hover:underline mx-1">Terms</button> 
                                        and 
                                        <button type="button" onClick={() => setModalContent('privacy')} className="font-semibold text-brand-primary-600 hover:underline ml-1">Privacy Policy</button>.
                                    </span>
                                </label>
                            </div>
                        </>
                    )}

                    {error && <p className="text-sm text-rose-600 bg-rose-50 p-3 rounded-lg">{error}</p>}

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading || (!isLoginView && !hasAcceptedTerms)}
                            className="w-full bg-brand-primary-500 text-white font-bold py-3 px-4 rounded-lg shadow-sm hover:bg-brand-primary-600 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 interactive-scale"
                        >
                            {isLoading && <Icon name="loader" className="w-5 h-5 animate-spin" />}
                            {isLoginView ? 'Sign In' : 'Sign Up'}
                        </button>
                    </div>
                </form>

                <p className="mt-6 text-center text-sm text-brand-text-secondary">
                    {isLoginView ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={toggleView} className="font-semibold text-brand-primary-600 hover:underline ml-1">
                        {isLoginView ? 'Sign up' : 'Sign in'}
                    </button>
                </p>
            </div>
             <Modal isOpen={!!modalContent} onClose={() => setModalContent(null)} title={modalContent === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'} size="xl">
                {modalContent === 'terms' && <TermsAndConditions />}
                {modalContent === 'privacy' && <PrivacyPolicy />}
            </Modal>
        </div>
    );
};
