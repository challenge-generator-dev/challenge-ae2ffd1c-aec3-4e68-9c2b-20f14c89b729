export interface CatalogProduct {
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  stock?: number;
}

export interface CatalogRepository {
  exists(productId: string): Promise<boolean>;
  existsMany(productIds: string[]): Promise<Map<string, boolean>>;
  findById(productId: string): Promise<CatalogProduct | null>;
}