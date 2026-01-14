export interface Painting {
  id: string;
  title: string;
  price: number;
  width: number;
  height: number;
  medium: string;
  year: number;
  description: string;
  available: boolean;
  imageUrl: string;
  thumbnailUrl: string;
  status: 'available' | 'reserved' | 'sold';
  createdAt: Date;
  updatedAt: Date;
  reservedUntil?: Date;
}

