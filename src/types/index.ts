export type CardTheme = 'neon' | 'sunset' | 'cosmic' | 'gold' | 'cyberpunk';

export interface FriendshipCardData {
  friendName: string;
  yourName: string;
  tagline: string;
  message: string;
  friendPhotoUrl: string;
  yourPhotoUrl: string;
  themeStyle: CardTheme;
  secretMessage: string;
  createdAt?: string;
}

export interface TimelineItem {
  id: string;
  title: string;
  date: string;
  description: string;
  iconName: string;
  photoUrl?: string;
}

export interface PhotoItem {
  id: string;
  caption: string;
  photoUrl: string;
  date: string;
  rotateDeg: number;
}

export interface QuoteItem {
  id: string;
  quote: string;
  author: string;
  tag: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    badgeCategory: string;
    icon: string;
  }[];
}

export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  unlocked: boolean;
}

export interface GiftItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  quote: string;
  color: string;
}
