

export type Category = 'Physical' | 'Mental' | 'Nutritional' | 'Hygiene' | 'Social' | 'Behavioral';

export type Page = 'Dashboard' | 'Inbox' | 'Outbox' | 'Community' | 'Create Wink' | 'Create Nudge' | 'Self Check-in' | 'Contact Support' | 'Gift Marketplace' | 'Wink Updates' | 'Wink Social' | 'Privacy Policy' | 'Contacts' | 'Profile';

export interface User {
    id: string;
    name: string;
    email: string;
    mfaEnabled: boolean;
    consents: {
        contactSync: boolean;
        personalizedAI: boolean;
        dataAnalytics: boolean;
    };
}

export interface Observable {
    id: string;
    text: string;
    category: Category;
    keywords?: string[];
    negativeKeywords?: string[];
}

export interface GroundedContent {
    text: string;
    sources: any[]; // Can be maps or web chunks
}

export interface AIGeneratedContent {
    disclaimer: string;
    possibleConditions: {
        name: string;
        likelihood: 'low' | 'medium' | 'high';
        description: string;
    }[];
    resources: {
        title: string;
        type: 'article' | 'product' | 'clinic' | 'support group';
        description: string;
    }[];
    localResources?: GroundedContent;
    socialResources?: GroundedContent;
}

export interface SecondOpinionPoll {
    agreements: number;
    disagreements: number;
    totalRequests: number;
    respondedIds: string[];
}

export const ReactionTypes = ['support', 'thinking', 'seen'] as const;
export type ReactionType = typeof ReactionTypes[number];

export interface NotificationSettings {
    newWink: boolean;
    newNudge: boolean;
    secondOpinionRequest: boolean;
    communityReaction: boolean;
    winkUpdate: boolean;
}

export interface Wink {
    id: string;
    type: 'Wink';
    recipient: string;
    senderLocation?: string;
    observables: Observable[];
    aiContent: AIGeneratedContent | null;
    timestamp: Date;
    isRead: boolean;
    secondOpinion?: SecondOpinionPoll;
    reactions?: { [key in ReactionType]?: number };
    updates?: { timestamp: Date; text: string }[];
}

export interface Nudge {
    id:string;
    type: 'Nudge';
    recipient: string;
    message: string;
    timestamp: Date;
    isRead: boolean;
}

export interface SecondOpinionRequest {
    id: string;
    type: 'SecondOpinionRequest';
    winkId: string; // ID of the original wink
    originalRecipientName: string;
    winkObservables: Observable[];
    timestamp: Date;
    isRead: boolean;
}


export type InboxItem = Wink | Nudge | SecondOpinionRequest;

export type ContactMethod = 'WinkDrops' | 'Phone' | 'Email' | 'Instagram' | 'X' | 'Snapchat' | 'TikTok' | 'Facebook' | 'LinkedIn';

export interface Contact {
    id: string;
    name: string;
    method: ContactMethod;
    handle: string;
    location?: string;
    isBlocked?: boolean;
}

export interface SocialMediaPost {
    platform: 'X' | 'Instagram' | 'TikTok' | 'Generic';
    content: string;
    timestamp: Date;
    user: {
        name: string;
        handle: string;
        avatar: string; // URL or identifier for mock avatar
    };
    likes: number;
    comments: number;
}

export interface CommunityExperience {
    id: string;
    text: string;
    timestamp: Date;
}

export interface GiftCardSuggestion {
    store: string;
    category: string;
    reasoning: string;
}
