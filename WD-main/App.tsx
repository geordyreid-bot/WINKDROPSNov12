

import React, { useState, useCallback, useEffect } from 'react';
import { Dashboard } from './components/pages/Dashboard';
import { Wink, Nudge, Page, InboxItem, Contact, ReactionType, CommunityExperience, SecondOpinionRequest, NotificationSettings, User } from './types';
import { MOCK_INBOX, MOCK_OUTBOX, MOCK_COMMUNITY_WINKS, MOCK_COMMUNITY_EXPERIENCES, MOCK_CONTACTS, findObservableById } from './constants';
import { OnboardingFlow } from './components/OnboardingFlow';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './components/pages/AuthPage';

const VAPID_PUBLIC_KEY = 'BNo5Y_DoHi83Yd_AOR_nS52LSCzC2aYJ9YQIh2sS6Ca5X_VPYoqRfrk1d2cbj2wHWZWpDTCpBcegCZnSHfDi3mU';
const ICON_DATA_URL = 'data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3ClinearGradient id=\'logoGradient\' x1=\'0\' y1=\'0\' x2=\'1\' y2=\'1\'%3E%3Cstop offset=\'0%25\' stop-color=\'%2398d1ff\'/%3E%3Cstop offset=\'100%25\' stop-color=\'%23e9d1ff\'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d=\'M50 10C50 10 15 45.82 15 62.5C15 79.92 30.67 90 50 90C69.33 90 85 79.92 85 62.5C85 45.82 50 10 50 10Z\' stroke=\'url(%23logoGradient)\' stroke-width=\'7\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3Cpath d=\'M58 60 C 58 66, 68 66, 68 60\' stroke=\'url(%23logoGradient)\' stroke-width=\'7\' stroke-linecap=\'round\' stroke-linejoin=\'round\' fill=\'none\'/%3E%3C/svg%3E';

const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
    newWink: true,
    newNudge: true,
    secondOpinionRequest: true,
    communityReaction: true,
    winkUpdate: true,
};

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}


const AppContent: React.FC = () => {
    const { user, logout } = useAuth();
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
        // In a real app, this would be part of the user object from the backend
        return typeof window !== 'undefined' && window.localStorage.getItem(`winkdrops_onboarding_completed_${user?.id}`) === 'true';
    });

    const [currentPage, setCurrentPage] = useState<Page>('Dashboard');
    const [inbox, setInbox] = useState<InboxItem[]>(MOCK_INBOX);
    const [outbox, setOutbox] = useState<InboxItem[]>(MOCK_OUTBOX);
    const [communityWinks, setCommunityWinks] = useState<Wink[]>(MOCK_COMMUNITY_WINKS);
    const [communityExperiences, setCommunityExperiences] = useState<CommunityExperience[]>(MOCK_COMMUNITY_EXPERIENCES);
    
    // Note on "Best Practices": This app uses localStorage for simplicity and to maintain user privacy
    // as outlined in the Privacy Policy (no data is sent to a server).
    // For features like cross-device sync, a cloud database like Firestore would be the next step.
    const [contacts, setContacts] = useState<Contact[]>(() => {
        if (typeof window === 'undefined' || !user) {
            return MOCK_CONTACTS;
        }
        try {
            const savedContacts = window.localStorage.getItem(`winkdrops_contacts_${user.id}`);
            return savedContacts ? JSON.parse(savedContacts) : MOCK_CONTACTS;
        } catch (error) {
            console.error('Error parsing contacts from localStorage', error);
            return MOCK_CONTACTS;
        }
    });
    
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(true);
    const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => {
        if (typeof window === 'undefined' || !user) return DEFAULT_NOTIFICATION_SETTINGS;
        const savedSettings = window.localStorage.getItem(`winkdrops_notification_settings_${user.id}`);
        return savedSettings ? JSON.parse(savedSettings) : DEFAULT_NOTIFICATION_SETTINGS;
    });

    useEffect(() => {
        if (typeof window !== 'undefined' && user) {
            window.localStorage.setItem(`winkdrops_contacts_${user.id}`, JSON.stringify(contacts));
        }
    }, [contacts, user]);

    const updateNotificationSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
        setNotificationSettings(prev => {
            const updated = { ...prev, ...newSettings };
            if (user) {
                window.localStorage.setItem(`winkdrops_notification_settings_${user.id}`, JSON.stringify(updated));
            }
            return updated;
        });
    }, [user]);

    const showLocalNotification = useCallback((title: string, body: string, type: keyof NotificationSettings) => {
        if (!notificationSettings[type]) {
            console.log(`Notification of type "${type}" is disabled by user settings.`);
            return;
        }

        if ('serviceWorker' in navigator && notificationPermission === 'granted') {
            navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(title, {
                    body,
                    icon: ICON_DATA_URL,
                    badge: ICON_DATA_URL
                });
            });
        }
    }, [notificationPermission, notificationSettings]);
    
    useEffect(() => {
        if ('Notification' in window) {
            setNotificationPermission(Notification.permission);
        }
    }, []);


    useEffect(() => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            console.warn('Push messaging is not supported');
            setIsSubscriptionLoading(false);
            return;
        }

        navigator.serviceWorker.ready.then(reg => {
            reg.pushManager.getSubscription().then(sub => {
                if (sub) {
                    setIsSubscribed(true);
                } else {
                    setIsSubscribed(false);
                }
                setIsSubscriptionLoading(false);
            });
        });
    }, []);

    const handleNotificationSubscribe = useCallback(async () => {
        if (!('Notification' in window)) {
            alert('This browser does not support desktop notification');
            return;
        }

        if (notificationPermission === 'denied') {
            alert('Notification permission has been blocked in your browser settings. Please enable it to receive notifications.');
            return;
        }

        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);

        if (permission === 'granted') {
            setIsSubscriptionLoading(true);
            try {
                const registration = await navigator.serviceWorker.ready;
                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
                });
                console.log('User is subscribed:', subscription);
                // In a real app, you would send this subscription object to your server.
                setIsSubscribed(true);
            } catch (err) {
                console.error('Failed to subscribe the user: ', err);
                setIsSubscribed(false);
            } finally {
                setIsSubscriptionLoading(false);
            }
        }
    }, [notificationPermission]);

    const addWinkToOutbox = useCallback((wink: Wink) => {
        setOutbox(prev => [wink, ...prev]);
        // Note: The prompt asks for settings on *received* notifications, so "sent" notifications are not shown.
    }, []);

    const addNudgeToOutbox = useCallback((nudge: Nudge) => {
        setOutbox(prev => [nudge, ...prev]);
        // Note: The prompt asks for settings on *received* notifications, so "sent" notifications are not shown.
    }, []);

    const handleCommunityWinkReaction = useCallback((winkId: string, reactionType: ReactionType) => {
        const outboxWink = outbox.find(item => item.id === winkId && item.type === 'Wink');
        
        setCommunityWinks(winks => winks.map(wink => {
            if (wink.id === winkId) {
                // If this community wink matches one in our outbox, simulate the original sender getting a notification.
                if (outboxWink && outboxWink.type === 'Wink') {
                    showLocalNotification('Your Wink was seen!', `Someone reacted to your Wink for ${outboxWink.recipient}.`, 'communityReaction');
                }
                const newReactions = { ...(wink.reactions || {}) };
                newReactions[reactionType] = (newReactions[reactionType] || 0) + 1;
                return { ...wink, reactions: newReactions };
            }
            return wink;
        }));
    }, [showLocalNotification, outbox]);

    const addCommunityExperience = useCallback((experience: CommunityExperience) => {
        setCommunityExperiences(prev => [experience, ...prev]);
    }, []);

    const markItemAsRead = useCallback((itemId: string) => {
        const markAsRead = (items: InboxItem[]) => items.map(item => item.id === itemId ? { ...item, isRead: true } : item);
        setInbox(prev => markAsRead(prev));
        setOutbox(prev => markAsRead(prev));
    }, []);

    const handleDeleteItem = useCallback((itemId: string) => {
        setInbox(prev => prev.filter(item => item.id !== itemId));
        setOutbox(prev => prev.filter(item => item.id !== itemId));
    }, []);

    const handleDeleteContact = useCallback((contactId: string) => {
        setContacts(prev => prev.filter(c => c.id !== contactId));
    }, []);

    const handleToggleBlockContact = useCallback((contactId: string, isBlocked: boolean) => {
        setContacts(prev => prev.map(c => c.id === contactId ? { ...c, isBlocked } : c));
    }, []);

    const handleAddContacts = useCallback((newContacts: Contact[]) => {
        setContacts(prevContacts => {
            const existingContacts = new Set(prevContacts.map(c => `${c.name}-${c.handle}`));
            const uniqueNewContacts = newContacts.filter(nc => !existingContacts.has(`${nc.name}-${nc.handle}`));
            return [...prevContacts, ...uniqueNewContacts];
        });
    }, []);

    const handleEditContact = useCallback((updatedContact: Contact) => {
        setContacts(prev => prev.map(c => c.id === updatedContact.id ? updatedContact : c));
    }, []);

    /**
     * A centralized helper to apply updates to a Wink, whether it's in the inbox or outbox.
     * @param winkId The ID of the Wink to update.
     * @param updateFn A function that takes the current Wink and returns the updated Wink.
     */
    const updateWinkInCollections = useCallback((
        winkId: string,
        updateFn: (wink: Wink) => Wink
    ) => {
        const applyUpdate = (items: InboxItem[]) =>
            items.map(item => {
                if (item.id === winkId && item.type === 'Wink') {
                    return updateFn(item as Wink);
                }
                return item;
            });
    
        setInbox(prev => applyUpdate(prev));
        setOutbox(prev => applyUpdate(prev));
    }, []);

    const handleSendSecondOpinionRequests = useCallback((winkId: string, contacts: Contact[]) => {
        const wink = [...inbox, ...outbox].find(item => item.id === winkId && item.type === 'Wink') as Wink | undefined;
    
        if (!wink) return;
    
        const requests: SecondOpinionRequest[] = contacts.map(contact => ({
            id: `sor-${winkId}-${contact.id}-${Date.now()}`,
            type: 'SecondOpinionRequest',
            winkId: wink!.id,
            originalRecipientName: wink!.recipient,
            winkObservables: wink!.observables,
            timestamp: new Date(),
            isRead: false,
        }));
        
        setInbox(prev => [...requests, ...prev]);
        
        updateWinkInCollections(winkId, (currentWink) => ({
            ...currentWink,
            secondOpinion: {
                agreements: currentWink.secondOpinion?.agreements || 0,
                disagreements: currentWink.secondOpinion?.disagreements || 0,
                totalRequests: (currentWink.secondOpinion?.totalRequests || 0) + contacts.length,
                respondedIds: currentWink.secondOpinion?.respondedIds || []
            }
        }));

        showLocalNotification('New Second Opinion Request', `Your opinion is requested for a Wink about ${wink.recipient}.`, 'secondOpinionRequest');
    }, [inbox, outbox, showLocalNotification, updateWinkInCollections]);

    const handleSecondOpinionResponse = useCallback((requestId: string, winkId: string, response: 'agree' | 'disagree') => {
        markItemAsRead(requestId);

        updateWinkInCollections(winkId, (currentWink) => {
            const so = currentWink.secondOpinion;
            if (so && !so.respondedIds.includes(requestId)) {
                return {
                    ...currentWink,
                    secondOpinion: {
                        ...so,
                        agreements: so.agreements + (response === 'agree' ? 1 : 0),
                        disagreements: so.disagreements + (response === 'disagree' ? 1 : 0),
                        respondedIds: [...so.respondedIds, requestId],
                    }
                };
            }
            return currentWink;
        });
    }, [markItemAsRead, updateWinkInCollections]);
    
    const handleAddWinkUpdate = useCallback((winkId: string, updateTexts: string[]) => {
        let recipientName = 'Unknown';
        setOutbox(prev => prev.map(item => {
            if (item.id === winkId && item.type === 'Wink') {
                recipientName = item.recipient;
                const newUpdates = updateTexts.map(text => ({ text, timestamp: new Date() }));
                const existingUpdates = item.updates || [];
                return {
                    ...item,
                    updates: [...existingUpdates, ...newUpdates]
                };
            }
            return item;
        }));
        showLocalNotification(
            'Positive Update Received',
            `Someone has noticed positive changes regarding a past Wink for ${recipientName}.`,
            'winkUpdate'
        );
    }, [showLocalNotification]);

    const handleCompleteOnboarding = () => {
        if (user) {
            window.localStorage.setItem(`winkdrops_onboarding_completed_${user.id}`, 'true');
        }
        setHasCompletedOnboarding(true);
    };
    
    if (!user) {
        return <AuthPage />;
    }

    if (!hasCompletedOnboarding) {
        return <OnboardingFlow onComplete={handleCompleteOnboarding} />;
    }

    return (
        <Dashboard
            currentPage={currentPage}
            navigate={setCurrentPage}
            onLogout={logout}
            inbox={inbox}
            outbox={outbox}
            communityWinks={communityWinks}
            communityExperiences={communityExperiences}
            contacts={contacts}
            addWinkToOutbox={addWinkToOutbox}
            addNudgeToOutbox={addNudgeToOutbox}
            handleCommunityWinkReaction={handleCommunityWinkReaction}
            addCommunityExperience={addCommunityExperience}
            notificationPermission={notificationPermission}
            notificationSettings={notificationSettings}
            updateNotificationSettings={updateNotificationSettings}
            isSubscribed={isSubscribed}
            isSubscriptionLoading={isSubscriptionLoading}
            onSubscribe={handleNotificationSubscribe}
            markItemAsRead={markItemAsRead}
            handleSendSecondOpinionRequests={handleSendSecondOpinionRequests}
            handleSecondOpinionResponse={handleSecondOpinionResponse}
            handleDeleteItem={handleDeleteItem}
            onDeleteContact={handleDeleteContact}
            onToggleBlockContact={handleToggleBlockContact}
            onAddContacts={handleAddContacts}
            onEditContact={handleEditContact}
            onAddWinkUpdate={handleAddWinkUpdate}
        />
    );
};

export const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};
