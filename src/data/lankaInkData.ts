import { LankaInkCreation, LankaInkArtisan, LankaInkInterview, LankaInkOrder } from '../types';

export const INITIAL_LANKA_INK_CREATIONS: LankaInkCreation[] = [
  {
    id: 'ink-001',
    title: 'The Golden Citadel of Sigiriya: An Illustrated Historical Anthology',
    authorName: 'Maitripala Wickramasinghe',
    authorBio: 'Historical researcher and cultural illustrator based in Kandy.',
    category: 'book',
    excerpt: 'An evocative exploration into ancient Sri Lankan architectural genius, hydraulic engineering, and fresco arts.',
    content: `The granite fortress of Sigiriya stands as an enduring monument to 5th-century engineering prowess. King Kashyapa transformed a sheer rock plateau into an idyllic citadel framed by water gardens, boulder terraces, and vibrant frescoed galleries...`,
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    publishedDate: '2026-01-15',
    likes: 342,
    location: 'Central Province',
    price: 4500,
    status: 'published',
    tags: ['History', 'Architecture', 'Sigiriya', 'Heritage'],
    isFeatured: true,
    bookDetails: {
      publisher: 'Lanka Ink Cultural Press',
      isbn: '978-955-8910-12-4',
      pages: 210,
    }
  },
  {
    id: 'ink-002',
    title: 'Hand-Carved Traditional Kaduru Wood Gurulu Raksha Mask',
    authorName: 'Master Artisan Bandu Karunaratne',
    authorBio: '4th generation master woodcarver from Ambalangoda.',
    category: 'craft',
    excerpt: 'Authentic ceremonial mask carved from sustainable Kaduru wood and painted using natural mineral pigments.',
    content: `Crafted in Ambalangoda following centuries-old iconographic proportions. The Gurulu Raksha (Eagle Demon Mask) symbolizes protection, strength, and triumph over venomous reptiles in traditional Sinhala folklore...`,
    imageUrl: 'https://images.unsplash.com/photo-1606744882061-0d3090f48861?auto=format&fit=crop&w=800&q=80',
    publishedDate: '2026-02-01',
    likes: 512,
    location: 'Ambalangoda',
    price: 18500,
    status: 'published',
    tags: ['Woodcarving', 'Masks', 'Crafts', 'Heritage'],
    isFeatured: true,
    artisanDetails: {
      materialUsed: 'Kaduru Wood (Strychnos nux-vomica) & Organic Dyes',
      craftTechnique: 'Hand Sculpted with traditional chisels',
      stockAvailable: 3,
    }
  },
  {
    id: 'ink-003',
    title: 'Whispers of the Mahaweli River',
    authorName: 'Ruvini Jayasuriya',
    authorBio: 'Poet and lecturer in Sinhala literature.',
    category: 'poem',
    excerpt: 'A poetic ode to the longest river in Sri Lanka, tracing its journey from Adam’s Peak down through ancient agricultural valleys.',
    content: `From misty peaks of Sri Pada’s sacred height,\nThe river flows in silvery ribbons of light,\nThrough tea-clad hills and paddy fields green,\nThe gentlest water the island has seen...\n`,
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    publishedDate: '2026-02-10',
    likes: 218,
    location: 'Nuwara Eliya',
    status: 'published',
    tags: ['Poetry', 'Mahaweli', 'Nature', 'Literature'],
  }
];

export const INITIAL_LANKA_INK_ARTISANS: LankaInkArtisan[] = [
  {
    id: 'artisan-001',
    name: 'Master Bandu Karunaratne',
    craftOrTitle: 'Master Woodcarver & Mask Sculptor',
    district: 'Galle / Ambalangoda',
    bio: 'Heir to a century-old lineage of ritual mask carvers in Southern Sri Lanka, preserving ancestral Kaduru woodcraft.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    contactEmail: 'bandu.carvings@lankaink.lk',
    contactPhone: '+94 91 225 8901',
    portfolioItemsCount: 18,
    isMasterArtisan: true,
  },
  {
    id: 'artisan-002',
    name: 'Soma Somalatha',
    craftOrTitle: 'Dumbara Handloom Weaver',
    district: 'Kandy / Dumbara Valley',
    bio: 'CraftingUNESCO-recognized Dumbara Rata handloom textiles using geometric motif weaving techniques.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    contactEmail: 'soma.dumbara@lankaink.lk',
    portfolioItemsCount: 12,
    isMasterArtisan: true,
  }
];

export const INITIAL_LANKA_INK_INTERVIEWS: LankaInkInterview[] = [
  {
    id: 'int-001',
    title: 'Preserving the UNESCO-Recognized Dumbara Weaving Tradition: An Interview with Soma Somalatha',
    artisanOrAuthorName: 'Soma Somalatha',
    category: 'Handloom & Textile Heritage',
    interviewer: 'Lanka Ink Arts Editor',
    readTime: '6 min read',
    summary: 'Master weaver Soma Somalatha discusses geometric motif traditions, natural plant dye extraction, and training the next generation in Dumbara Valley.',
    content: `Lanka Ink: Soma, welcome. How long has your family been practicing Dumbara Rata weaving?\n\nSoma: For five generations. My grandmother taught me the rhythm of the loom when I was twelve years old in our valley home near Kandy...`,
    imageUrl: 'https://images.unsplash.com/photo-1606744882061-0d3090f48861?auto=format&fit=crop&w=800&q=80',
    publishedDate: '2026-02-12',
  }
];

export const INITIAL_LANKA_INK_ORDERS: LankaInkOrder[] = [];
