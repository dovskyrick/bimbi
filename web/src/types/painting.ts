export interface Painting {
  id: string;
  title: string;
  price: number;
  currency: string;
  width: number;
  height: number;
  medium: string;
  year: number;
  description: string;
  tags?: string[];
  available: boolean;
  imageUrl: string;
  thumbnailUrl: string;
  createdAt: Date;
  updatedAt: Date;
}
