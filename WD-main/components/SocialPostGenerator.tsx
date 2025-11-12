
import React, { useState } from 'react';
import { AIGeneratedContent, SocialMediaPost } from '../types';
import { generateSocialPosts } from '../services/geminiService';
import { Icon } from './ui/Icon';

interface SocialPostGeneratorProps {
    aiContent: AIGeneratedContent;
    onClose?: () => void;
}

export const SocialPostGenerator: React.FC<SocialPostGeneratorProps> = ({ aiContent, onClose }) => {
    const [keywords, setKeywords] = useState('');
    const [posts, setPosts] = useState<SocialMediaPost[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copiedPost, setCopiedPost] = useState<string | null>(null);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!keywords.trim()) return;
        setIsLoading(true);
        setError(null);
        setPosts([]);
        try {
            const generatedPosts = await generateSocialPosts(
                aiContent.possibleConditions,
                aiContent.resources,
                keywords
            );
            setPosts(generatedPosts);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCopy = (content: string) => {
        navigator.clipboard.writeText(content);
        setCopiedPost(content);
        setTimeout(() => setCopiedPost(null), 2000);
    };

    return (
        <div className="bg-brand-secondary-50 p-4 rounded-lg border border-brand-secondary-200 relative animate-fade-in">
             {onClose && (
                <button onClick={onClose} className="absolute top-2 right-2 p-1 rounded-full hover:bg-brand-secondary-200 transition-colors">
                    <Icon name="x" className="w-4 h-4 text-brand-secondary-500" />
                </button>
            )}
            <h4 className="font-semibold text-brand-text-primary mb-2">Generate Social Posts</h4>
            <p className="text-sm text-brand-text-secondary mb-3">Add some keywords (e.g., "my journey," "feeling hopeful") to personalize the posts.</p>
            
            <form onSubmit={handleGenerate} className="flex items-center gap-2">
                <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="Your keywords..."
                    className="flex-grow p-2 bg-white border border-brand-secondary-300 rounded-md focus:border-brand-primary-300 focus:ring-1 focus:ring-brand-primary-300 transition-colors text-sm"
                />
                <button type="submit" disabled={isLoading || !keywords.trim()} className="flex items-center gap-2 text-sm font-semibold bg-brand-secondary-600 text-white px-3 py-2 rounded-lg hover:bg-brand-secondary-700 disabled:opacity-50 interactive-scale">
                    {isLoading ? <Icon name="loader" className="w-4 h-4 animate-spin"/> : <Icon name="sparkles" className="w-4 h-4"/>}
                    Generate
                </button>
            </form>

            {error && <p className="text-xs text-red-600 mt-2">{error}</p>}

            {posts.length > 0 && !isLoading && (
                <div className="mt-4 space-y-3">
                    {posts.map((post, index) => (
                        <div key={index} className="bg-white p-3 rounded-lg border border-brand-secondary-200">
                            <p className="text-sm font-bold text-brand-text-primary">{post.platform} Post</p>
                            <p className="text-sm text-brand-text-secondary mt-1 whitespace-pre-wrap">{post.content}</p>
                            <button onClick={() => handleCopy(post.content)} className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-brand-primary-600 hover:text-brand-primary-800">
                                <Icon name={copiedPost === post.content ? "check" : "clipboardCheck"} className="w-3 h-3"/>
                                {copiedPost === post.content ? "Copied!" : "Copy Text"}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
