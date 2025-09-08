export interface Produce {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  quantity: string;
  price: string;
  description: string;
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
