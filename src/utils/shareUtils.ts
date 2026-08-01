import type { FriendshipCardData } from '../types';

export function encodeCardToUrl(card: FriendshipCardData): string {
  try {
    const jsonStr = JSON.stringify(card);
    const base64 = btoa(encodeURIComponent(jsonStr));
    const url = new URL(window.location.href);
    url.hash = `card=${base64}`;
    return url.toString();
  } catch (err) {
    console.error("Failed to encode card to URL", err);
    return window.location.href;
  }
}

export function decodeCardFromUrl(): FriendshipCardData | null {
  try {
    const hash = window.location.hash;
    if (!hash || !hash.includes('card=')) return null;
    const base64 = hash.split('card=')[1];
    if (!base64) return null;
    const jsonStr = decodeURIComponent(atob(base64));
    return JSON.parse(jsonStr) as FriendshipCardData;
  } catch (err) {
    console.error("Failed to decode card from URL", err);
    return null;
  }
}

export function saveCardToLocalStorage(card: FriendshipCardData): void {
  try {
    localStorage.setItem('friendverse_saved_card_v3', JSON.stringify(card));
  } catch (err) {
    console.error("LocalStorage save failed", err);
  }
}

export function getCardFromLocalStorage(): FriendshipCardData | null {
  try {
    const saved = localStorage.getItem('friendverse_saved_card_v3');
    return saved ? JSON.parse(saved) : null;
  } catch (err) {
    return null;
  }
}
