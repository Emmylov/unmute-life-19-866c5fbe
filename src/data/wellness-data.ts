
// Mock data for the Wellness page components

export const featuredContent = [
  {
    id: "fc1",
    title: "How to Stay Grounded in Chaos",
    description: "Learn practical techniques to maintain your peace even when surrounded by chaos and uncertainty.",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    type: "video" as const,
    tag: "Mental Health",
    duration: "12 min",
    isPaid: false,
    url: "#"
  },
  {
    id: "fc2",
    title: "Modern Etiquette for Digital Communication",
    description: "Professional etiquette tips for emails, social media, and virtual meetings in today's digital world.",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    type: "article" as const,
    tag: "Etiquette Tip",
    duration: "5 min read",
    isPaid: false,
    url: "#"
  },
  {
    id: "fc3",
    title: "Finding Your Purpose: Guided Meditation",
    description: "A soothing guided meditation to help you connect with your inner purpose and direction.",
    imageUrl: "https://images.unsplash.com/photo-1518495973542-4542c06a5843",
    type: "audio" as const,
    tag: "Meditation",
    duration: "15 min",
    isPaid: false,
    url: "#"
  },
  {
    id: "fc4",
    title: "Healing from Past Relationships",
    description: "Comprehensive course on emotional healing after difficult relationships and finding peace within.",
    imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    type: "video" as const,
    tag: "Mini-course",
    duration: "4 sessions",
    isPaid: true,
    price: 12000,
    url: "#"
  },
  {
    id: "fc5",
    title: "Setting Boundaries with Grace",
    description: "Learn how to establish healthy boundaries in relationships without causing unnecessary friction.",
    imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    type: "article" as const,
    tag: "Relationships",
    duration: "8 min read",
    isPaid: false,
    url: "#"
  },
  {
    id: "fc6",
    title: "Evening Calming Routine",
    description: "A step-by-step audio guide to develop an evening routine that promotes deep, restful sleep.",
    imageUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    type: "audio" as const,
    tag: "Sleep Health",
    duration: "10 min",
    isPaid: false,
    url: "#"
  }
];

export const dailyDoses = [
  {
    id: "dd1",
    title: "Today's Reminder",
    snippet: "You are not behind. You are exactly where you need to be. Your path is your own.",
    audioUrl: "#",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
    date: "Today"
  },
  {
    id: "dd2",
    title: "Morning Affirmation",
    snippet: "Your worth is not measured by your productivity. You are valuable simply because you exist.",
    audioUrl: "#",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
    date: "Yesterday"
  },
  {
    id: "dd3",
    title: "Mental Health Minute",
    snippet: "Take a deep breath. Feel the air filling your lungs. You are alive, and that is a beautiful gift.",
    audioUrl: "#",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
    date: "2 days ago"
  },
  {
    id: "dd4",
    title: "Wisdom Note",
    snippet: "The most meaningful growth happens during life's most challenging seasons.",
    audioUrl: "#",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
    date: "3 days ago"
  }
];

export const books = [
  {
    id: "b1",
    title: "Modern Etiquette: Navigate Life with Grace",
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
    description: "A comprehensive guide to modern etiquette in social settings, workplace environments, and digital communication. Learn how to handle any situation with confidence and grace.",
    price: 8500,
    rating: 5,
    previewUrl: "#"
  },
  {
    id: "b2",
    title: "Healing Pathways: Finding Peace After Pain",
    coverUrl: "https://images.unsplash.com/photo-1544716278-e513176f20b5",
    description: "A heartfelt exploration of emotional healing after trauma, loss, or difficult life transitions. Chioma shares personal stories and practical exercises to guide readers through their unique healing journey.",
    price: 7000,
    rating: 4,
    previewUrl: "#"
  }
];

export const testimonials = [
  {
    id: "t1",
    name: "Amara Johnson",
    imageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "Chioma's etiquette course completely transformed how I present myself professionally. I've received multiple comments about my improved communication style and presence in meetings.",
    rating: 5
  },
  {
    id: "t2",
    name: "Daniel Okafor",
    text: "After struggling with anxiety for years, Chioma's healing sessions gave me practical tools that actually work. For the first time, I feel in control of my emotions rather than being controlled by them.",
    rating: 5
  },
  {
    id: "t3",
    name: "Sophia Chen",
    imageUrl: "https://randomuser.me/api/portraits/women/67.jpg",
    text: "The couples therapy with Chioma saved my marriage. She created a safe space for difficult conversations and helped us rebuild our foundation with new communication skills.",
    rating: 4
  },
  {
    id: "t4",
    name: "Michael Adebayo",
    text: "Chioma's book on modern etiquette is my go-to reference for navigating professional situations. Her advice is practical, culturally sensitive, and has helped me feel confident in international business settings.",
    rating: 5
  }
];
