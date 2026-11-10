export interface CatalogProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  inStock: boolean;
  quantity?: number;
  createdAt?: Date;
  updatedAt?: Date;
}