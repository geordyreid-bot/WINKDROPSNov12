
import React, { useState } from 'react';
import { Modal } from './Modal';
import { Icon } from './Icon';
import { useAuth } from '../../context/AuthContext';

interface ConsentManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ToggleSwitch: React.FC<{
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    description: string;
}> = ({ checked, onChange, label, description }) => (
    <label className="flex justify-between items-center cursor-pointer p-4 rounded-lg hover:bg-brand-secondary-50 transition-colors">
        <div>
            <p className="font-semibold text-brand-text-primary">{label}</p>
            <p className="text-sm text-brand-text-secondary">{description}</p>
        </div>
        <div className="relative">
            <input 
                type="checkbox" 
                checked={checked}
                onChange={(e) => onChange(e.target.checked)} 
                className="sr-only peer" 
            />
            <div className={`block w-12 h-7 rounded-full transition-colors peer-focus:ring-2 peer-focus:ring-brand-primary-300 ${checked ? 'bg-brand-primary-500' : 'bg-brand-secondary-300'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${checked ? 'translate-x-5' : ''}`}></div>
        </div>
    </label>
);


export const ConsentManagementModal: React.FC<ConsentManagementModalProps> = ({ isOpen, onClose }) => {
    const { user, updateUser } = useAuth();
    
    // In a real app, these values would be stored per-user in the backend.
    // We simulate this by attaching it to the mock user object in the auth context.
    const [consents, setConsents] = useState(user?.consents || {
        contactSync: false,
        personalizedAI: true,
        dataAnalytics: true,
    });

    const handleConsentChange = (key: keyof typeof consents, value: boolean) => {
        setConsents(prev => ({ ...prev, [key]: value }));
    };

    const handleSaveChanges = () => {
        if (user) {
            updateUser({ ...user, consents });
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Privacy & Consent Management" size="lg">
            <div>
                <p className="text-brand-text-secondary text-sm mb-4 px-4">
                    We respect your privacy. You have control over how your data is used. These settings can be updated at any time. Your choices do not affect core app functionality.
                </p>
                <div className="space-y-2">
                    <ToggleSwitch 
                        label="Contact Data Syncing"
                        description="Allow WinkDrops to access and store synced contacts for easier selection."
                        checked={consents.contactSync}
                        onChange={(checked) => handleConsentChange('contactSync', checked)}
                    />
                     <ToggleSwitch 
                        label="Personalized AI Suggestions"
                        description="Allow us to use your interaction history to improve AI suggestion relevance."
                        checked={consents.personalizedAI}
                        onChange={(checked) => handleConsentChange('personalizedAI', checked)}
                    />
                     <ToggleSwitch 
                        label="Usage Data & Analytics"
                        description="Allow collection of anonymous usage data to help us improve the app."
                        checked={consents.dataAnalytics}
                        onChange={(checked) => handleConsentChange('dataAnalytics', checked)}
                    />
                </div>
                 <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold bg-brand-surface text-brand-text-secondary border border-brand-secondary-200 rounded-lg hover:bg-brand-secondary-100 interactive-scale"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveChanges}
                        className="px-4 py-2 text-sm font-semibold bg-brand-primary-500 text-white rounded-lg hover:bg-brand-primary-600 flex items-center gap-2 interactive-scale"
                    >
                        <Icon name="check" className="w-4 h-4" />
                        Save Preferences
                    </button>
                </div>
            </div>
        </Modal>
    );
};
