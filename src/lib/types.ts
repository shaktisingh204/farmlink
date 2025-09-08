
export interface Produce {
  id: string;
  name: string;
  icon?: React.ComponentType<{ className?: string }>;
  quantity: number;
  price: number;
  description: string;
  variety?: string;
  imageUrl?: string;
  farmerId: string;
}

export interface Farmer {
  id: string;
  name: string;
  location: string;
  avatarUrl: string;
  bio: string;
  produce: Produce[];
}

export interface Market {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  contact: string;
  operatingHours: string;
}

export interface Order {
    id: string;
    produceId: string;
    farmerId: string;
    retailerId: string;
    quantity: number;
    totalPrice: number;
    status: 'placed' | 'confirmed' | 'shipped' | 'delivered';
    orderDate: string;
    produce?: Produce;
    farmer?: { name: string };
    retailer?: { name: string };
}

export interface UserProfile {
    uid: string;
    email: string;
    name: string;
    role: 'farmer' | 'retailer' | 'admin' | 'market';
    location?: string;
}
