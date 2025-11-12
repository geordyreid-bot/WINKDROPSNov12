import React, { useState, useRef, useEffect } from 'react';
import { Page } from '../../types';
import { Icon } from '../ui/Icon';

interface WinkSocialProps {
    navigate: (page: Page) => void;
}

const MOCK_CONDITIONS = ["Burnout", "Depression", "Anxiety", "Stress", "Grief", "ADHD"];

type ForumMessage = {
    id: string;
    text: string;
    timestamp: Date;
    avatarColor: string;
};

const MOCK_FORUMS: Record<string, ForumMessage[]> = {
    "Burnout": [
        { id: 'b1', text: "I feel so drained all the time. Just... empty. Anyone else?", timestamp: new Date(Date.now() - 3600000 * 2), avatarColor: 'bg-red-200' },
        { id: 'b2', text: "Yes. It feels like nothing I do matters at work anymore. I used to love my job.", timestamp: new Date(Date.now() - 3600000 * 1.5), avatarColor: 'bg-sky-200' },
        { id: 'b3', text: "Same. I'm so irritable with my family and I hate it. I just have no energy left for them.", timestamp: new Date(Date.now() - 3600000 * 1), avatarColor: 'bg-emerald-200' },
        { id: 'b4', text: "For anyone struggling, taking a real break (not just a weekend) helped me a little. It's hard but necessary.", timestamp: new Date(Date.now() - 3600000 * 0.5), avatarColor: 'bg-amber-200' },
    ],
    "Depression": [
        { id: 'd1', text: "Does anyone else have days where just getting out of bed feels impossible? It's not about being tired, it's... heavy.", timestamp: new Date(Date.now() - 86400000 * 1), avatarColor: 'bg-indigo-200' },
        { id: 'd2', text: "All the time. And then the guilt for not being 'productive' makes it even worse. It's a vicious cycle.", timestamp: new Date(Date.now() - 3600000 * 18), avatarColor: 'bg-rose-200' },
        { id: 'd3', text: "Losing interest in things I used to love is the hardest part for me. Everything feels gray.", timestamp: new Date(Date.now() - 3600000 * 10), avatarColor: 'bg-slate-200' },
    ],
    "Anxiety": [
        { id: 'a1', text: "My heart races for no reason. It's so frustrating. Does anyone have tips for calming down in the moment?", timestamp: new Date(Date.now() - 3600000 * 5), avatarColor: 'bg-teal-200' },
        { id: 'a2', text: "The 5-4-3-2-1 grounding technique sometimes helps me. 5 things you can see, 4 you can touch, etc. It brings me back to the present.", timestamp: new Date(Date.now() - 3600000 * 4), avatarColor: 'bg-fuchsia-200' },
    ]
};

const ChatView: React.FC<{
    condition: string;
    onBack: () => void;
}> = ({ condition, onBack }) => {
    const [messages, setMessages] = useState<ForumMessage[]>(MOCK_FORUMS[condition] || []);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const newMsg: ForumMessage = {
            id: `msg-${Date.now()}`,
            text: newMessage.trim(),
            timestamp: new Date(),
            avatarColor: 'bg-violet-200', // User's messages
        };
        setMessages(prev => [...prev, newMsg]);
        setNewMessage('');
    };

    return (
        <div className="flex flex-col h-full animate-fade-in-up">
            {/* Header */}
            <div className="p-4 sm:p-6 flex-shrink-0 border-b border-brand-secondary-200">
                <div className="relative">
                    <button onClick={onBack} className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-brand-secondary-100 transition-colors interactive-scale">
                        <Icon name="chevronLeft" className="w-6 h-6 text-brand-text-secondary" />
                    </button>
                    <div className="text-center">
                        <h1 className="text-xl sm:text-2xl font-bold text-brand-text-primary">{condition}</h1>
                        <p className="text-sm text-brand-text-secondary">Anonymous Forum</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {messages.map((msg, index) => (
                    <div key={msg.id} className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full ${msg.avatarColor} flex-shrink-0`}></div>
                        <div className="bg-brand-secondary-100 p-3 rounded-lg max-w-[80%]">
                            <p className="text-sm text-brand-text-primary">{msg.text}</p>
                            <p className="text-xs text-brand-text-secondary/70 mt-1 text-right">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 sm:p-6 flex-shrink-0 border-t border-brand-secondary-200">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Share your thoughts anonymously..."
                        className="w-full p-3 bg-brand-secondary-100 border border-transparent placeholder-brand-secondary-400 rounded-lg focus:bg-white focus:border-brand-primary-300 focus:ring-1 focus:ring-brand-primary-300 transition-colors"
                    />
                    <button type="submit" disabled={!newMessage.trim()} className="p-3 bg-brand-primary-500 text-white rounded-lg shadow-sm hover:bg-brand-primary-600 disabled:bg-slate-300 interactive-scale">
                        <Icon name="send" className="w-6 h-6" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export const WinkSocial: React.FC<WinkSocialProps> = ({ navigate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCondition, setSelectedCondition] = useState<string | null>(null);

    const filteredConditions = MOCK_CONDITIONS.filter(c =>
        c.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedCondition) {
        return <ChatView condition={selectedCondition} onBack={() => setSelectedCondition(null)} />;
    }

    return (
        <div className="flex flex-col h-full p-2 sm:p-4 md:p-6">
            <div className="bg-brand-surface w-full max-w-2xl mx-auto rounded-2xl shadow-xl border border-brand-secondary-200/50 flex flex-col flex-1">
                {/* Header */}
                <div className="p-6 sm:p-8 flex-shrink-0">
                    <div className="relative">
                        <button onClick={() => navigate('Dashboard')} className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-brand-secondary-100 transition-colors interactive-scale">
                            <Icon name="chevronLeft" className="w-6 h-6 text-brand-text-secondary" />
                        </button>
                        <h1 className="text-2xl sm:text-3xl font-bold text-brand-text-primary text-center">Wink Social</h1>
                    </div>
                    <p className="text-center text-brand-text-secondary mt-2">Find anonymous forums to connect with others who may be experiencing similar things. You are not alone.</p>
                </div>
                
                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 sm:px-8 pb-6">
                    <div className="relative mb-6">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search for a condition..."
                            className="w-full p-3 pl-10 bg-brand-secondary-100 border border-transparent placeholder-brand-secondary-400 rounded-lg focus:bg-white focus:border-brand-primary-300 focus:ring-1 focus:ring-brand-primary-300 transition-colors"
                        />
                        <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-secondary/50"/>
                    </div>
                    
                    <div className="space-y-3">
                        {filteredConditions.map(condition => (
                            <button
                                key={condition}
                                onClick={() => setSelectedCondition(condition)}
                                className="w-full flex justify-between items-center p-4 bg-white border border-brand-secondary-200 rounded-xl hover:border-brand-primary-400 hover:shadow-lg hover:-translate-y-0.5 transition-all group interactive-scale"
                            >
                                <span className="font-bold text-lg text-brand-text-primary group-hover:text-brand-primary-600">{condition}</span>
                                <Icon name="arrowRight" className="w-5 h-5 text-brand-secondary-400 group-hover:text-brand-primary-600 transition-transform group-hover:translate-x-1" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
