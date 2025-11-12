
import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Icon } from './Icon';
import { Contact, ContactMethod } from '../../types';
import { COUNTRY_CODES } from '../../constants';

interface SyncContactsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddContacts: (newContacts: Contact[]) => void;
    onSyncDeviceContacts: () => Promise<void>;
    isSyncingDevice: boolean;
}

const MOCK_SOCIAL_CONTACTS: Record<Exclude<ContactMethod, 'Phone' | 'WinkDrops' | 'Email'>, Omit<Contact, 'id'>[]> = {
    'Instagram': [
        { name: 'Insta Friend 1', method: 'Instagram', handle: '@insta_friend_1' },
        { name: 'Insta Friend 2', method: 'Instagram', handle: '@insta_friend_2' },
    ],
    'X': [
        { name: 'X Colleague', method: 'X', handle: '@x_colleague' },
    ],
    'Snapchat': [
        { name: 'Snap Pal', method: 'Snapchat', handle: 'snap_pal' },
        { name: 'Bestie Snap', method: 'Snapchat', handle: 'bestie_snap' },
    ],
    'TikTok': [
        { name: 'TikTok Creator', method: 'TikTok', handle: '@tiktok_creator' },
    ],
    // Added for new requirements
    'Facebook': [
        { name: 'Maria Garcia', method: 'Facebook', handle: 'maria.garcia.75' },
        { name: 'Chen Wei', method: 'Facebook', handle: 'chen.wei.3' },
    ],
    'LinkedIn': [
        { name: 'Dr. Evelyn Reed', method: 'LinkedIn', handle: 'in/evelynreedphd' },
        { name: 'Raj Patel', method: 'LinkedIn', handle: 'in/rajpatel-pm' },
    ]
};

const MANUAL_CONTACT_METHODS: ContactMethod[] = ['Phone', 'Email', 'Instagram', 'X', 'Snapchat', 'TikTok', 'WinkDrops', 'Facebook', 'LinkedIn'];

const PermissionStep: React.FC<{
    platform: string;
    onAllow: () => void;
    onCancel: () => void;
}> = ({ platform, onAllow, onCancel }) => (
    <div className="text-center">
        <Icon name="share" className="w-12 h-12 text-brand-primary-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-brand-text-primary">Connect with {platform}</h3>
        <p className="text-brand-text-secondary my-3">
            To make it easier to find your friends, WinkDrops will securely access your {platform} contacts. We only import the name and handle, and we never post anything without your permission.
        </p>
        <div className="flex justify-center gap-4 mt-6">
            <button onClick={onCancel} className="font-semibold text-brand-text-secondary hover:underline">Cancel</button>
            <button onClick={onAllow} className="bg-brand-primary-500 text-white font-bold py-2 px-6 rounded-lg shadow-sm hover:bg-brand-primary-600 interactive-scale">Allow</button>
        </div>
    </div>
);

const ManualAddView: React.FC<{
    onAdd: (contact: Omit<Contact, 'id'>) => void;
    onBack: () => void;
}> = ({ onAdd, onBack }) => {
    const [name, setName] = useState('');
    const [method, setMethod] = useState<ContactMethod>('Phone');
    const [handle, setHandle] = useState('');
    const [countryCode, setCountryCode] = useState('+1');
    const [errors, setErrors] = useState<{ name?: string; handle?: string }>({});
    const [isDirty, setIsDirty] = useState(false);

    const validate = (currentName: string, currentHandle: string, currentMethod: ContactMethod) => {
        const newErrors: { name?: string; handle?: string } = {};
        if (!currentName.trim()) {
            newErrors.name = 'Name is required.';
        }
        if (!currentHandle.trim()) {
            newErrors.handle = 'This field is required.';
        } else {
            if (currentMethod === 'Email') {
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentHandle)) {
                    newErrors.handle = 'Please enter a valid email address (e.g., name@example.com).';
                }
            } else if (currentMethod === 'Phone') {
                const numericHandle = currentHandle.replace(/[\s-()]/g, '');
                if (!/^\d+$/.test(numericHandle)) {
                    newErrors.handle = 'Phone number can only contain digits.';
                }
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        if (isDirty) {
            validate(name, handle, method);
        }
    }, [name, handle, method, isDirty]);
    
    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
        if (!isDirty) setIsDirty(true);
        setter(value);
    };

    const handleSave = () => {
        setIsDirty(true);
        if (validate(name, handle, method)) {
            const finalHandle = method === 'Phone' ? `${countryCode} ${handle.trim()}` : handle.trim();
            onAdd({ name: name.trim(), method, handle: finalHandle });
        }
    };
    
    const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setMethod(e.target.value as ContactMethod);
        setHandle('');
        setErrors(prev => ({ name: prev.name })); // Keep name error, clear handle error
    };
    
     const getHandleInput = () => {
        switch (method) {
            case 'Phone':
                return (
                    <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-1">
                            <label htmlFor="manual-country-code" className="block text-sm font-semibold text-brand-text-primary mb-1.5">Code</label>
                            <select
                                id="manual-country-code"
                                value={countryCode}
                                onChange={(e) => setCountryCode(e.target.value)}
                                className="w-full p-3 bg-white border border-brand-secondary-300 rounded-lg focus:border-brand-primary-300 focus:ring-1 focus:ring-brand-primary-300 transition-colors"
                            >
                                {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.code} ({c.name})</option>)}
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label htmlFor="manual-handle-phone" className="block text-sm font-semibold text-brand-text-primary mb-1.5">Phone Number</label>
                            <input
                                id="manual-handle-phone"
                                type="tel"
                                value={handle}
                                onChange={(e) => handleInputChange(setHandle, e.target.value)}
                                placeholder="(555) 123-4567"
                                className="w-full p-3 bg-white border border-brand-secondary-300 rounded-lg focus:border-brand-primary-300 focus:ring-1 focus:ring-brand-primary-300 transition-colors"
                                aria-invalid={!!errors.handle}
                                aria-describedby="manual-handle-error"
                            />
                        </div>
                    </div>
                );
            case 'Email':
                return (
                    <div>
                        <label htmlFor="manual-handle-email" className="block text-sm font-semibold text-brand-text-primary mb-1.5">Email Address</label>
                        <input
                            id="manual-handle-email"
                            type="email"
                            value={handle}
                            onChange={(e) => handleInputChange(setHandle, e.target.value)}
                            placeholder="name@example.com"
                            className="w-full p-3 bg-white border border-brand-secondary-300 rounded-lg focus:border-brand-primary-300 focus:ring-1 focus:ring-brand-primary-300 transition-colors"
                             aria-invalid={!!errors.handle}
                             aria-describedby="manual-handle-error"
                        />
                    </div>
                );
            default:
                 return (
                    <div>
                        <label htmlFor="manual-handle-text" className="block text-sm font-semibold text-brand-text-primary mb-1.5">Handle / Username</label>
                        <input
                            id="manual-handle-text"
                            type="text"
                            value={handle}
                            onChange={(e) => handleInputChange(setHandle, e.target.value)}
                            placeholder={method === 'WinkDrops' ? 'WinkDrops Username' : '@username'}
                            className="w-full p-3 bg-white border border-brand-secondary-300 rounded-lg focus:border-brand-primary-300 focus:ring-1 focus:ring-brand-primary-300 transition-colors"
                            aria-invalid={!!errors.handle}
                            aria-describedby="manual-handle-error"
                        />
                    </div>
                );
        }
    };
    
    const isSaveDisabled = Object.keys(errors).length > 0 || !name || !handle;

    return (
        <div>
            <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-brand-text-secondary mb-4 hover:text-brand-text-primary">
                <Icon name="chevronLeft" className="w-4 h-4" />
                Back to Sync Options
            </button>
            <div className="space-y-4">
                 <div>
                    <label htmlFor="manual-name" className="block text-sm font-semibold text-brand-text-primary mb-1.5">Name</label>
                    <input
                        id="manual-name"
                        type="text"
                        value={name}
                        onChange={(e) => handleInputChange(setName, e.target.value)}
                        placeholder="e.g., Jane Doe"
                        className="w-full p-3 bg-white border border-brand-secondary-300 rounded-lg focus:border-brand-primary-300 focus:ring-1 focus:ring-brand-primary-300 transition-colors"
                        aria-required="true"
                        aria-invalid={!!errors.name}
                        aria-describedby="manual-name-error"
                    />
                    {errors.name && <p id="manual-name-error" className="text-sm text-rose-600 mt-1">{errors.name}</p>}
                </div>
                 <div>
                    <label htmlFor="manual-method" className="block text-sm font-semibold text-brand-text-primary mb-1.5">Method</label>
                    <select
                        id="manual-method"
                        value={method}
                        onChange={handleMethodChange}
                        className="w-full p-3 bg-white border border-brand-secondary-300 rounded-lg focus:border-brand-primary-300 focus:ring-1 focus:ring-brand-primary-300 transition-colors"
                    >
                        {MANUAL_CONTACT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
                <div>
                    {getHandleInput()}
                    {errors.handle && <p id="manual-handle-error" className="text-sm text-rose-600 mt-1">{errors.handle}</p>}
                </div>
                 <button
                    onClick={handleSave}
                    disabled={isSaveDisabled}
                    className="w-full !mt-6 bg-brand-primary-500 text-white font-bold py-3 px-4 rounded-lg shadow-sm hover:bg-brand-primary-600 transition-colors flex items-center justify-center gap-2 interactive-scale disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                    <Icon name="userPlus" className="w-5 h-5" />
                    Save Contact
                </button>
            </div>
        </div>
    );
};

export const SyncContactsModal: React.FC<SyncContactsModalProps> = ({ isOpen, onClose, onAddContacts, onSyncDeviceContacts, isSyncingDevice }) => {
    const [view, setView] = useState<'main' | 'manual' | 'permission'>('main');
    const [permissionPlatform, setPermissionPlatform] = useState<string>('');
    const [permissionAction, setPermissionAction] = useState<(() => void) | null>(null);

    const handleClose = () => {
        // Reset to main view when modal is closed
        setTimeout(() => setView('main'), 300);
        onClose();
    };

    const requestPermission = (platform: string, action: () => void) => {
        setPermissionPlatform(platform);
        setPermissionAction(() => action); // Store the action in state
        setView('permission');
    };

    const handleMockSync = (method: Exclude<ContactMethod, 'Phone' | 'WinkDrops' | 'Email'>) => {
        const newContacts: Contact[] = MOCK_SOCIAL_CONTACTS[method].map((contact, index) => ({
            ...contact,
            id: `mock-${method.toLowerCase()}-${Date.now()}-${index}`
        }));
        onAddContacts(newContacts);
        alert(`Simulated: Added ${newContacts.length} contact(s) from ${method}.`);
        handleClose();
    };

    const handleManualAdd = (contactData: Omit<Contact, 'id'>) => {
        const newContact: Contact = {
            id: `manual-${Date.now()}`,
            ...contactData,
        };

        onAddContacts([newContact]);
        alert(`Contact "${newContact.name}" added successfully!`);
        handleClose();
    };

    const syncOptions: {
        label: string;
        icon: React.ComponentProps<typeof Icon>['name'];
        action: () => void;
        platform: string;
        disabled?: boolean;
    }[] = [
        { label: 'Sync from Device', icon: 'smartphone', platform: 'your Device', action: () => onSyncDeviceContacts(), disabled: isSyncingDevice },
        { label: 'Sync from Facebook', icon: 'facebook', platform: 'Facebook', action: () => handleMockSync('Facebook') },
        { label: 'Sync from LinkedIn', icon: 'linkedin', platform: 'LinkedIn', action: () => handleMockSync('LinkedIn') },
        { label: 'Sync from Instagram', icon: 'instagram', platform: 'Instagram', action: () => handleMockSync('Instagram') },
        { label: 'Sync from X', icon: 'twitter', platform: 'X', action: () => handleMockSync('X') },
    ];
    
    const renderContent = () => {
        switch(view) {
            case 'permission':
                return <PermissionStep 
                            platform={permissionPlatform} 
                            onAllow={() => {
                                permissionAction?.();
                            }}
                            onCancel={() => setView('main')}
                        />
            case 'manual':
                 return (
                    <ManualAddView 
                        onBack={() => setView('main')}
                        onAdd={handleManualAdd}
                    />
                )
            case 'main':
            default:
                 return (
                    <div>
                        <h4 className="font-semibold text-brand-text-primary text-center mb-4">Sync from a Service</h4>
                        <div className="space-y-3">
                            {syncOptions.map(opt => (
                                <button
                                    key={opt.label}
                                    onClick={() => requestPermission(opt.platform, opt.action)}
                                    disabled={opt.disabled}
                                    className="w-full flex items-center gap-4 p-4 bg-brand-secondary-50 rounded-lg text-left hover:bg-brand-secondary-100 transition-colors disabled:opacity-50 interactive-scale"
                                >
                                    <Icon name={opt.icon} className="w-6 h-6 text-brand-secondary-600"/>
                                    <span className="font-semibold text-brand-text-primary">{opt.label}</span>
                                    {opt.disabled && <Icon name="loader" className="w-5 h-5 animate-spin ml-auto text-brand-secondary-500"/>}
                                </button>
                            ))}
                        </div>
                        <p className="text-brand-text-secondary my-6 text-center text-sm font-semibold">- OR -</p>
                        <button
                            onClick={() => setView('manual')}
                            className="w-full flex items-center justify-center gap-4 p-4 bg-brand-secondary-50 rounded-lg hover:bg-brand-secondary-100 transition-colors interactive-scale"
                        >
                             <Icon name="pencil" className="w-6 h-6 text-brand-secondary-600"/>
                             <span className="font-semibold text-brand-text-primary">Add Contact Manually</span>
                        </button>
                    </div>
                );
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Add & Sync Contacts">
            {renderContent()}
        </Modal>
    );
};