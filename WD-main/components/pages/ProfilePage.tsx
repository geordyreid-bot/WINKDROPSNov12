
import React, { useState } from 'react';
import { Page, User } from '../../types';
import { Icon } from '../ui/Icon';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../ui/Modal';
import { ConsentManagementModal } from '../ui/ConsentManagementModal';

interface ProfilePageProps {
    navigate: (page: Page) => void;
}

const SettingsCard: React.FC<{
    icon: React.ComponentProps<typeof Icon>['name'];
    title: string;
    description: string;
    onClick?: () => void;
    children?: React.ReactNode;
}> = ({ icon, title, description, onClick, children }) => (
    <div className="bg-brand-surface p-6 rounded-2xl shadow-lg border border-brand-secondary-200/50">
        <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-brand-primary-100 text-brand-primary-600">
                <Icon name={icon} className="w-6 h-6" />
            </div>
            <div className="flex-grow">
                <h3 className="font-bold text-brand-text-primary text-lg">{title}</h3>
                <p className="text-sm text-brand-text-secondary mt-1">{description}</p>
                 {onClick && !children && (
                    <button onClick={onClick} className="mt-3 text-sm font-bold text-brand-primary-600 hover:underline">
                        Manage
                    </button>
                )}
            </div>
        </div>
        {children && <div className="mt-4 pt-4 border-t border-brand-secondary-200">{children}</div>}
    </div>
);


export const ProfilePage: React.FC<ProfilePageProps> = ({ navigate }) => {
    const { user, updateUser } = useAuth();
    const [isMfaModalOpen, setIsMfaModalOpen] = useState(false);
    const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
    const [isMfaEnabled, setIsMfaEnabled] = useState(user?.mfaEnabled || false);

    const handleMfaToggle = () => {
        // In a real app, this would trigger a complex flow (QR code, etc.)
        // Here, we just toggle the state and update the mock user.
        const newMfaState = !isMfaEnabled;
        setIsMfaEnabled(newMfaState);
        if (user) {
            updateUser({ ...user, mfaEnabled: newMfaState });
        }
        setIsMfaModalOpen(false);
        alert(`Multi-Factor Authentication has been ${newMfaState ? 'enabled' : 'disabled'}.`);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
             <div className="relative mb-8">
                <button onClick={() => navigate('Dashboard')} className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-brand-secondary-100 transition-colors interactive-scale md:hidden">
                    <Icon name="chevronLeft" className="w-6 h-6 text-brand-text-secondary" />
                </button>
                <h1 className="text-4xl font-bold text-brand-text-primary text-center">Profile & Settings</h1>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
                <SettingsCard
                    icon="userPlus"
                    title="Account Information"
                    description="Manage your personal details."
                >
                     <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-brand-text-primary mb-1.5">Full Name</label>
                            <input
                                id="name" type="text"
                                defaultValue={user?.name}
                                className="w-full p-3 bg-brand-secondary-100 border border-transparent placeholder-brand-secondary-400 rounded-lg focus:bg-white focus:border-brand-primary-300 focus:ring-1 focus:ring-brand-primary-300 transition-colors"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-brand-text-primary mb-1.5">Email Address</label>
                            <input
                                id="email" type="email"
                                defaultValue={user?.email}
                                disabled
                                className="w-full p-3 bg-brand-secondary-100 border border-transparent placeholder-brand-secondary-400 rounded-lg cursor-not-allowed"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button className="bg-brand-primary-500 text-white font-bold py-2 px-5 rounded-lg shadow-sm hover:bg-brand-primary-600 transition-colors interactive-scale">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </SettingsCard>
                
                <SettingsCard
                    icon="shieldCheck"
                    title="Security"
                    description="Strengthen your account's security."
                >
                     <div className="flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-brand-text-primary">Multi-Factor Authentication (MFA)</p>
                            <p className="text-sm text-brand-text-secondary">{isMfaEnabled ? 'Enabled' : 'Disabled'}</p>
                        </div>
                        <button onClick={() => setIsMfaModalOpen(true)} className="font-bold text-sm py-2 px-4 rounded-lg bg-brand-secondary-100 hover:bg-brand-secondary-200 text-brand-text-primary interactive-scale">
                           {isMfaEnabled ? 'Disable' : 'Enable'}
                        </button>
                    </div>
                </SettingsCard>
                
                 <SettingsCard
                    icon="settings"
                    title="Privacy & Consent"
                    description="Manage how your data is used across the app."
                    onClick={() => setIsConsentModalOpen(true)}
                />
            </div>

             <Modal
                isOpen={isMfaModalOpen}
                onClose={() => setIsMfaModalOpen(false)}
                title="Multi-Factor Authentication"
            >
                <div>
                    <p className="text-brand-text-secondary mb-4">
                        {isMfaEnabled 
                            ? "Are you sure you want to disable MFA? This will reduce your account's security."
                            : "Enabling MFA adds an extra layer of security. In a real application, you would be prompted to scan a QR code with an authenticator app."
                        }
                    </p>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={() => setIsMfaModalOpen(false)}
                            className="px-4 py-2 text-sm font-semibold bg-brand-surface text-brand-text-secondary border border-brand-secondary-200 rounded-lg hover:bg-brand-secondary-100 interactive-scale"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleMfaToggle}
                            className={`px-4 py-2 text-sm font-semibold text-white rounded-lg flex items-center gap-2 interactive-scale ${isMfaEnabled ? 'bg-rose-500 hover:bg-rose-600' : 'bg-brand-primary-500 hover:bg-brand-primary-600'}`}
                        >
                            <Icon name={isMfaEnabled ? "ban" : "check"} className="w-4 h-4" />
                            {isMfaEnabled ? "Confirm Disable" : "Confirm Enable"}
                        </button>
                    </div>
                </div>
            </Modal>
            
            <ConsentManagementModal
                isOpen={isConsentModalOpen}
                onClose={() => setIsConsentModalOpen(false)}
            />
        </div>
    );
};
