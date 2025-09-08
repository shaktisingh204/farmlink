import type { Farmer, Market, Produce } from '@/lib/types';
import { Apple, Carrot, Leaf, Wheat } from 'lucide-react';

export const PRODUCE_TYPES = [
  { name: 'Tomatoes', icon: Leaf },
  { name: 'Lettuce', icon: Leaf },
  { name: 'Apples', icon: Apple },
  { name: 'Carrots', icon: Carrot },
  { name: 'Wheat', icon: Wheat },
];

export const produce: Produce[] = [
  {
    id: 'p1',
    name: 'Organic Tomatoes',
    icon: Leaf,
    quantity: '50kg available',
    price: '$3.50/kg',
    description: 'Fresh, sun-ripened organic tomatoes, perfect for salads and sauces.',
  },
  {
    id: 'p2',
    name: 'Crisp Lettuce',
    icon: Leaf,
    quantity: '30 heads available',
    price: '$1.50/head',
    description: 'Crisp and fresh romaine lettuce, grown locally without pesticides.',
  },
  {
    id: 'p3',
    name: 'Gala Apples',
    icon: Apple,
    quantity: '120kg available',
    price: '$4.00/kg',
    description: 'Sweet and juicy Gala apples, ideal for snacking or baking.',
  },
  {
    id: 'p4',
    name: 'Sweet Carrots',
    icon: Carrot,
    quantity: '75kg available',
    price: '$2.00/kg',
    description: 'Vibrant orange carrots, great for roasting, steaming, or eating raw.',
  },
];

export const farmers: Farmer[] = [
  {
    id: 'f1',
    name: 'Alice Green',
    location: 'Valley Farm, CA',
    avatarUrl: 'https://picsum.photos/100/100?random=1',
    bio: 'A third-generation farmer passionate about sustainable agriculture and growing the freshest produce for the local community.',
    produce: [produce[0], produce[1]],
  },
  {
    id: 'f2',
    name: 'Bob White',
    location: 'Hillside Orchard, OR',
    avatarUrl: 'https://picsum.photos/100/100?random=2',
    bio: 'Specializing in heirloom apple varieties and organic farming practices for over 20 years.',
    produce: [produce[2]],
  },
  {
    id: 'f3',
    name: 'Charlie Brown',
    location: 'Sunrise Fields, TX',
    avatarUrl: 'https://picsum.photos/100/100?random=3',
    bio: 'We run a family-owned farm focusing on root vegetables and providing fresh, healthy food for everyone.',
    produce: [produce[3], produce[1]],
  },
  {
    id: 'f4',
    name: 'Diana Prince',
    location: 'Green Pastures, VT',
    avatarUrl: 'https://picsum.photos/100/100?random=4',
    bio: 'Committed to organic methods and biodiversity, our farm offers a wide range of seasonal vegetables.',
    produce: [produce[0], produce[1], produce[3]],
  },
];

export const markets: Market[] = [
  {
    id: 'm1',
    name: 'City Center Farmers Market',
    location: '123 Main St, Downtown',
    imageUrl: 'https://picsum.photos/600/400?random=5',
    contact: 'market@example.com',
    operatingHours: 'Saturdays, 8 AM - 2 PM',
  },
  {
    id: 'm2',
    name: 'Riverside Organic Market',
    location: '456 River Rd, Suburbia',
    imageUrl: 'https://picsum.photos/600/400?random=6',
    contact: 'riverside.market@example.com',
    operatingHours: 'Sundays, 9 AM - 1 PM',
  },
  {
    id: 'm3',
    name: 'Uptown Grocers',
    location: '789 High St, Uptown',
    imageUrl: 'https://picsum.photos/600/400?random=7',
    contact: 'contact@uptowngrocers.com',
    operatingHours: 'Mon-Fri, 9 AM - 8 PM',
  },
  {
    id: 'm4',
    name: 'Community Food Co-op',
    location: '101 Community Dr, West End',
    imageUrl: 'https://picsum.photos/600/400?random=8',
    contact: 'info@communitycoop.org',
    operatingHours: 'Daily, 10 AM - 7 PM',
  },
];
