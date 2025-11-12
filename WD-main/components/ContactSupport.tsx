
import React, { useState, useEffect } from 'react';
import { Page, Contact, ContactMethod } from '../types';
import { Icon } from './ui/Icon';
import { COUNTRY_CODES } from '../constants';

interface ContactSupportProps {
    navigate: (page: Page) => void;
    onAddContacts: (newContacts: Contact[]) => void;
}

export const ContactSupport: React.FC<ContactSupportProps> = ({ navigate, onAddContacts }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [countryCode, setCountryCode] = useState('+1');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        // Real-time validation for email and phone
        const newErrors: { email?: string; phone?: string } = {};

        // Validate email only if it's not empty
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email structure (e.g., example@domain.com).';
        }

        // Validate phone only if it's not empty
        if (phone) {
            const numericPhone = phone.replace(/[\s-()]/g, '');
            if (numericPhone && !/^\d+$/.test(numericPhone)) {
                newErrors.phone = 'Phone number should only contain digits and formatting characters.';
            }
        }
        
        setErrors(newErrors);
    }, [email, phone]);
    
    const handleSyncDeviceContacts = async () => {
        if (!('contacts' in navigator && 'ContactsManager' in window)) {
            alert('Contact Picker API is not supported on this browser or device.');
            return;
        }
        setIsSyncing(true);
        try {
            const props = ['name', 'tel', 'email'];
            const opts = { multiple: true };
            // The ContactsManager API is still experimental and might not be typed
            const deviceContacts = await (navigator.contacts as any).select(props, opts);

            if (deviceContacts.length > 0) {
                const newContacts: Contact[] = deviceContacts.flatMap((contact: any) => {
                    const created: Contact[] = [];
                    if (contact.name && contact.name.length > 0) {
                        if (contact.tel && contact.tel.length > 0) {
                            created.push({
                                id: `sync-tel-${contact.name[0]}-${Date.now()}-${created.length}`,
                                name: contact.name[0],
                                method: 'Phone' as ContactMethod,
                                handle: contact.tel[0],
                            });
                        }
                        if (contact.email && contact.email.length > 0) {
                            created.push({
                                id: `sync-email-${contact.name[0]}-${Date.now()}-${created.length}`,
                                name: contact.name[0],
                                method: 'Email' as ContactMethod,
                                handle: contact.email[0],
                            });
                        }
                    }
                    return created;
                }).filter(c => c.name); // Filter out contacts with no name

                if(newContacts.length > 0) {
                    onAddContacts(newContacts);
                    alert(`${newContacts.length} contact(s) were successfully synced!`);
                } else {
                    alert('No contacts with names were selected or found.');
                }
            }
        } catch (err) {
            console.error('Error syncing contacts:', err);
            alert('Contact sync was cancelled or failed. Please try again.');
        } finally {
            setIsSyncing(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Final validation before submit
        if (!message.trim() || Object.values(errors).some(e => e)) return;
        
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 1500);
    };

    if (isSubmitted) {
        return (
            <div className="flex justify-center items-start p-4 sm:p-6 lg:p-8 min-h-full">
                <div className="bg-brand-surface w-full max-w-lg p-6 sm:p-8 rounded-2xl shadow-xl border border-brand-secondary-200/50 text-center animate-fade-in-up">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                        <Icon name="check" className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-brand-text-primary mt-6">Thank You!</h1>
                    <p className="text-brand-text-secondary mt-2">Your feedback has been submitted. Our team will review it shortly. If you provided contact details, we may reach out for more information.</p>
                    <button
                        onClick={() => navigate('Dashboard')}
                        className="w-full mt-8 bg-brand-primary-500 text-white font-bold py-3 px-4 rounded-lg shadow-sm hover:bg-brand-primary-600 transition-colors flex items-center justify-center gap-2 interactive-scale"
                    >
                        <Icon name="home" className="w-5 h-5" />
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const isSubmitDisabled = !message.trim() || isSubmitting || Object.values(errors).some(e => e);

    return (
        <div className="flex justify-center items-start p-4 sm:p-6 lg:p-8 min-h-full">
            <div className="bg-brand-surface w-full max-w-lg p-6 sm:p-8 rounded-2xl shadow-xl border border-brand-secondary-200/50">
                <div className="relative mb-6">
                    <button onClick={() => navigate('Dashboard')} className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-brand-secondary-100 transition-colors interactive-scale">
                        <Icon name="chevronLeft" className="w-6 h-6 text-brand-text-secondary" />
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-bold text-brand-text-primary text-center">Contact & Feedback</h1>
                </div>
                <p className="text-center text-brand-text-secondary mb-8 -mt-4">
                    Have a question, suggestion, or need support? We'd love to hear from you.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-brand-text-primary mb-1.5">Name (Optional)</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Name"
                            className="w-full p-3 bg-brand-secondary-100 border border-transparent placeholder-brand-secondary-400 rounded-lg focus:bg-white focus:border-brand-primary-300 focus:ring-1 focus:ring-brand-primary-300 transition-colors"
                        />
                    </div>
                     <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-brand-text-primary mb-1.5">Email (Optional)</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@domain.com"
                            className="w-full p-3 bg-brand-secondary-100 border border-transparent placeholder-brand-secondary-400 rounded-lg focus:bg-white focus:border-brand-primary-300 focus:ring-1 focus:ring-brand-primary-300 transition-colors"
                            aria-invalid={!!errors.email}
                            aria-describedby="email-error"
                        />
                         {errors.email ? 
                            <p id="email-error" className="text-sm text-rose-600 mt-1">{errors.email}</p> :
                            <p className="text-xs text-brand-text-secondary mt-1">Provide an email if you'd like a response.</p>
                        }
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-brand-text-primary mb-1.5">Phone (Optional)</label>
                        <div className="flex gap-2">
                            <select
                                id="country-code"
                                aria-label="Country Code"
                                value={countryCode}
                                onChange={(e) => setCountryCode(e.target.value)}
                                className="p-3 bg-brand-secondary-100 border border-transparent rounded-lg focus:bg-white focus:border-brand-primary-300 focus:ring-1 focus:ring-brand-primary-300 transition-colors"
                            >
                                {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                            </select>
                            <input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="(XXX) XXX-XXXX"
                                className="flex-1 w-full p-3 bg-brand-secondary-100 border border-transparent placeholder-brand-secondary-400 rounded-lg focus:bg-white focus:border-brand-primary-300 focus:ring-1 focus:ring-brand-primary-300 transition-colors"
                                aria-invalid={!!errors.phone}
                                aria-describedby="phone-error"
                            />
                        </div>
                         {errors.phone && <p id="phone-error" className="text-sm text-rose-600 mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-semibold text-brand-text-primary mb-1.5">Message</label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="How can we help?"
                            required
                            rows={5}
                            className="w-full p-3 bg-brand-secondary-100 border border-transparent placeholder-brand-secondary-400 rounded-lg focus:bg-white focus:border-brand-primary-300 focus:ring-1 focus:ring-brand-primary-300 transition-colors"
                        />
                    </div>
                     <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitDisabled}
                            className="w-full bg-brand-primary-500 text-white font-bold py-3 px-4 rounded-lg shadow-sm hover:bg-brand-primary-600 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 interactive-scale"
                        >
                            {isSubmitting ? <Icon name="loader" className="w-5 h-5 animate-spin" /> : <Icon name="send" className="w-5 h-5" />}
                            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                        </button>
                    </div>
                </form>

                 <div className="mt-8 pt-6 border-t border-dashed border-brand-secondary-200">
                    <h3 className="text-lg font-semibold text-brand-text-primary mb-2">Manage Contacts</h3>
                    <p className="text-sm text-brand-text-secondary mb-3">
                        Need to add contacts to your WinkDrops address book? You can sync them directly from your device here.
                    </p>
                    <button
                        type="button"
                        onClick={handleSyncDeviceContacts}
                        disabled={isSyncing}
                        className="w-full bg-brand-secondary-100 text-brand-secondary-800 font-bold py-3 px-4 rounded-lg shadow-sm hover:bg-brand-secondary-200 transition-colors disabled:bg-slate-200 disabled:cursor-not-allowed flex items-center justify-center gap-2 interactive-scale"
                    >
                        {isSyncing ? <Icon name="loader" className="w-5 h-5 animate-spin" /> : <Icon name="smartphone" className="w-5 h-5" />}
                        {isSyncing ? 'Syncing...' : 'Sync Contacts from Device'}
                    </button>
                </div>
            </div>
        </div>
    );
};
