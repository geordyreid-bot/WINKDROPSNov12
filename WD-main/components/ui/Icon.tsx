

import React from 'react';
import { LucideProps, Inbox, Send, Users, Activity, LogOut, ArrowRight, UserPlus, Eye, Heart, Brain, Apple, Droplets, Check, Loader2, AlertTriangle, ChevronLeft, X, Twitter, Instagram, Smartphone, Ghost, Search, ClipboardCheck, ChevronDown, ChevronUp, SendHorizontal, Quote, Home, Link, PlusCircle, Bell, BellOff, Share2, ChevronRight, ThumbsUp, ThumbsDown, ShieldCheck, Settings, Trash2, Ban, Sparkles, Gift, Music4, HelpCircle, Contact, Mail, Pencil, Feather, Facebook, Linkedin } from 'lucide-react';

const WinkDropIcon: React.FC<LucideProps> = (props) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M50 10C50 10 15 45.82 15 62.5C15 79.92 30.67 90 50 90C69.33 90 85 79.92 85 62.5C85 45.82 50 10 50 10Z" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M58 60 C 58 66, 68 66, 68 60" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);


export const icons = {
  inbox: Inbox,
  send: Send,
  users: Users,
  activity: Activity,
  logout: LogOut,
  arrowRight: ArrowRight,
  userPlus: UserPlus,
  eye: Eye,
  heart: Heart,
  brain: Brain,
  apple: Apple,
  droplets: Droplets,
  check: Check,
  loader: Loader2,
  warning: AlertTriangle,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  x: X,
  twitter: Twitter,
  instagram: Instagram,
  smartphone: Smartphone,
  ghost: Ghost,
  search: Search,
  nudge: Feather,
  clipboardCheck: ClipboardCheck,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  sendHorizontal: SendHorizontal,
  quote: Quote,
  home: Home,
  link: Link,
  plusCircle: PlusCircle,
  bell: Bell,
  bellOff: BellOff,
  share: Share2,
  thumbsUp: ThumbsUp,
  thumbsDown: ThumbsDown,
  shieldCheck: ShieldCheck,
  settings: Settings,
  trash: Trash2,
  ban: Ban,
  sparkles: Sparkles,
  gift: Gift,
  tiktok: Music4,
  helpCircle: HelpCircle,
  contact: Contact,
  mail: Mail,
  pencil: Pencil,
  winkDrop: WinkDropIcon,
  facebook: Facebook,
  linkedin: Linkedin
};

type IconProps = LucideProps & {
  name: keyof typeof icons;
};

export const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const LucideIcon = icons[name];
  return <LucideIcon {...props} />;
};
