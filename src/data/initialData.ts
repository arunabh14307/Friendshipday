import type { FriendshipCardData, TimelineItem, PhotoItem, QuoteItem, QuizQuestion, BadgeItem, GiftItem } from '../types';

export const defaultCardData: FriendshipCardData = {
  friendName: "",
  yourName: "",
  tagline: "",
  message: "Thank you for always being the person I can count on, whether we are celebrating huge wins or laughing about silly mistakes at 2 AM. You are family to me!",
  friendPhotoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
  yourPhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
  themeStyle: "neon",
  secretMessage: "Toh fir kab mil rahe ho party ke liye 🎉🥳",
  createdAt: "2026-08-02"
};

export const defaultTimeline: TimelineItem[] = [
  {
    id: "1",
    title: "The Accidental First Meet",
    date: "Summer 2021",
    description: "We spilled coffee on each other at campus orientation. Instead of getting mad, we ended up sharing a laugh and a table.",
    iconName: "Coffee",
    photoUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "2",
    title: "Best Memory Ever",
    date: "New Year's Eve 2022",
    description: "Road trip to the coast! We sang full volume to retro songs with the roof down under a starry sky.",
    iconName: "Sparkles",
    photoUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "3",
    title: "Funniest Moment",
    date: "Halloween Night 2023",
    description: "Attempted baking a multi-tiered cake from scratch. Resulted in a delicious chocolate mountain disaster and flour everywhere!",
    iconName: "Laugh",
    photoUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "4",
    title: "Favorite Epic Trip",
    date: "Spring 2024",
    description: "Hiking up the mountain summit at 5 AM to catch the golden sunrise above the clouds.",
    iconName: "Compass",
    photoUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "5",
    title: "The Unbreakable Inside Joke",
    date: "Ongoing Legend",
    description: "'Wait, is the pineapple listening?' — Only the two of us will ever understand why this causes instant laughter.",
    iconName: "MessageCircleHeart",
    photoUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "6",
    title: "Forever & Always",
    date: "Present & Future",
    description: "No matter how busy life gets, distance or time zone, we remain unbreakable soulmates in friendship.",
    iconName: "HeartHandshake",
    photoUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80"
  }
];

export const defaultPhotos: PhotoItem[] = [
  {
    id: "p1",
    caption: "Golden hour sunset vibes 🌅",
    photoUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
    date: "Aug 2024",
    rotateDeg: -3
  },
  {
    id: "p2",
    caption: "Concert night madness! 🎸",
    photoUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
    date: "Dec 2024",
    rotateDeg: 2
  },
  {
    id: "p3",
    caption: "Late night study session (or snack run) 🍕",
    photoUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80",
    date: "Mar 2025",
    rotateDeg: -1
  },
  {
    id: "p4",
    caption: "Beach day squad goals 🌊",
    photoUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    date: "Jul 2025",
    rotateDeg: 4
  }
];

export const quotesList: QuoteItem[] = [
  {
    id: "q1",
    quote: "A real friend is one who walks in when the rest of the world walks out.",
    author: "Walter Winchell",
    tag: "Loyalty"
  },
  {
    id: "q2",
    quote: "Friendship is born at that moment when one person says to another: 'What! You too? I thought I was the only one.'",
    author: "C.S. Lewis",
    tag: "Connection"
  },
  {
    id: "q3",
    quote: "There is nothing on this earth more to be prized than true friendship.",
    author: "Thomas Aquinas",
    tag: "Treasured"
  },
  {
    id: "q4",
    quote: "Good friends are like stars. You don't always see them, but you know they're always there.",
    author: "Old Proverb",
    tag: "Timeless"
  },
  {
    id: "q5",
    quote: "A sweet friendship refreshes the soul.",
    author: "Proverbs 27:9",
    tag: "Soulful"
  },
  {
    id: "q6",
    quote: "True friends are never apart, maybe in distance but never in heart.",
    author: "Helen Keller",
    tag: "Forever"
  }
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "When you two hang out, what is the #1 activity?",
    options: [
      { text: "Hunting down epic food & boba tea", badgeCategory: "Food Partners", icon: "Utensils" },
      { text: "Sending memes and laughing uncontrollably", badgeCategory: "Meme King", icon: "Smile" },
      { text: "Late night deep conversations under stars", badgeCategory: "Night Owl", icon: "Moon" },
      { text: "Gaming marathons and fierce competition", badgeCategory: "Gaming Bros", icon: "Gamepad2" }
    ]
  },
  {
    id: 2,
    question: "How do you handle plans when meeting up?",
    options: [
      { text: "We plan 3 weeks in advance with itineraries", badgeCategory: "Legendary Friends", icon: "Calendar" },
      { text: "One of us is ALWAYS 20 minutes late", badgeCategory: "Always Late", icon: "Clock" },
      { text: "Spontaneous 2 AM road trips & chaotic energy", badgeCategory: "Chaos Duo", icon: "Zap" },
      { text: "Cozy couch, Netflix, and zero judgment", badgeCategory: "Soul Sisters", icon: "Heart" }
    ]
  },
  {
    id: 3,
    question: "What happens when one of you has a bad day?",
    options: [
      { text: "Instant emergency call & 100% emotional support", badgeCategory: "Soul Sisters", icon: "ShieldHeart" },
      { text: "Show up with emergency ice cream & snacks", badgeCategory: "Food Partners", icon: "IceCream" },
      { text: "Spam hilarious TikToks until smiles return", badgeCategory: "Chaos Duo", icon: "Film" },
      { text: "Listen patiently without giving unwanted advice", badgeCategory: "Legendary Friends", icon: "Ear" }
    ]
  },
  {
    id: 4,
    question: "What is your shared superpower as a friendship duo?",
    options: [
      { text: "Communicating with just eye contact across a room", badgeCategory: "Legendary Friends", icon: "Eye" },
      { text: "Turning boring errands into chaotic adventures", badgeCategory: "Chaos Duo", icon: "Rocket" },
      { text: "Keeping each other's secrets locked in a vault", badgeCategory: "Soul Sisters", icon: "Lock" },
      { text: "Never getting bored even in total silence", badgeCategory: "Gaming Bros", icon: "Sparkles" }
    ]
  },
  {
    id: 5,
    question: "Describe your friendship in one word:",
    options: [
      { text: "Unbreakable 💎", badgeCategory: "Legendary Friends", icon: "Gem" },
      { text: "Unfiltered Chaos ⚡", badgeCategory: "Chaos Duo", icon: "Flame" },
      { text: "Soul Family 💜", badgeCategory: "Soul Sisters", icon: "Heart" },
      { text: "Partner in Crime 🕵️", badgeCategory: "Gaming Bros", icon: "UserCheck" }
    ]
  }
];

export const badgesList: BadgeItem[] = [
  {
    id: "b1",
    title: "Legendary Friends",
    description: "Gold standard friendship built on trust, loyalty, and unforgettable memories.",
    icon: "Crown",
    gradient: "from-amber-400 to-yellow-600",
    unlocked: true
  },
  {
    id: "b2",
    title: "Chaos Duo",
    description: "Unfiltered energy, spontaneous ideas, and pure hilarious mayhem wherever you go.",
    icon: "Zap",
    gradient: "from-purple-500 to-indigo-600",
    unlocked: true
  },
  {
    id: "b3",
    title: "Food Partners",
    description: "Bonded over late-night cravings, street food tours, and endless dessert trips.",
    icon: "UtensilsCrossed",
    gradient: "from-pink-500 to-rose-500",
    unlocked: true
  },
  {
    id: "b4",
    title: "Gaming Legends",
    description: "Unstoppable co-op team, clutch plays, and endless gaming sessions.",
    icon: "Gamepad2",
    gradient: "from-cyan-400 to-blue-600",
    unlocked: true
  },
  {
    id: "b5",
    title: "Soul Sisters / Bros",
    description: "More than friends — family connected by heart, understanding, and love.",
    icon: "HeartHandshake",
    gradient: "from-fuchsia-500 to-pink-600",
    unlocked: true
  },
  {
    id: "b6",
    title: "Night Owl Squad",
    description: "Mastering 3 AM deep talks, midnight philosophical debates, and stargazing.",
    icon: "MoonStar",
    gradient: "from-indigo-600 to-slate-800",
    unlocked: true
  },
  {
    id: "b7",
    title: "Meme Monarch",
    description: "Communicating 90% in memes, inside jokes, and reel shares.",
    icon: "Laugh",
    gradient: "from-emerald-400 to-teal-600",
    unlocked: true
  },
  {
    id: "b8",
    title: "Always Late",
    description: "Running on '5 minutes away' time zone but always worth waiting for!",
    icon: "Clock",
    gradient: "from-orange-400 to-amber-500",
    unlocked: true
  }
];

export const giftItems: GiftItem[] = [
  {
    id: "g1",
    name: "Golden Gourmet Chocolates 🍫",
    icon: "Sparkles",
    description: "A luxury box of hand-crafted Belgian chocolates filled with sweet memories.",
    quote: "Life is like a box of chocolates, but having you as a friend is the sweetest part!",
    color: "from-amber-600 to-amber-900"
  },
  {
    id: "g2",
    name: "Fresh Sunflower Bouquet 🌻",
    icon: "Flower2",
    description: "Bright, radiant sunflowers that bloom with the warmth of your friendship.",
    quote: "You bring sunshine into every room you enter!",
    color: "from-yellow-400 to-amber-500"
  },
  {
    id: "g3",
    name: "Lifetime Coffee & Boba Pass 🧋",
    icon: "Coffee",
    description: "Unlimited coffee, boba tea, and deep conversations on me forever.",
    quote: "May our conversations stay warm and our boba pearls stay sweet!",
    color: "from-pink-500 to-purple-600"
  },
  {
    id: "g4",
    name: "Midnight Pizza Party 🍕",
    icon: "Pizza",
    description: "Extra cheese, crust filled with joy, and no sharing required (except with each other).",
    quote: "You hold a pizza my heart forever!",
    color: "from-red-500 to-orange-500"
  },
  {
    id: "g5",
    name: "Unbreakable Friendship Bracelet 💫",
    icon: "Gem",
    description: "Woven with threads of loyalty, laughter, and unbreakable cosmic bond.",
    quote: "A constant reminder that no matter where life leads, we walk together.",
    color: "from-blue-500 to-indigo-600"
  }
];
