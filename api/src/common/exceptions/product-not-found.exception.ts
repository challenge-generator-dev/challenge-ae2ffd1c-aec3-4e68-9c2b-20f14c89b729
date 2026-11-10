import { HttpException, HttpStatus } from '@nestjs/common';

export class ProductNotFoundException extends HttpException {
  private readonly missingProducts: string[];

  constructor(productIds: string | string[]) {
    const products = Array.isArray(productIds) ? productIds : [productIds];
    const message =
      products.length === 1
        ? `Product with id '${products[0]}' not found in catalog`
        : `Products not found in catalog: ${products.join(', ')}`;

    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message: message,
        error: 'Product Not Found',
        missingProducts: products,
        timestamp: new Date().toISOString(),
      },
      HttpStatus.NOT_FOUND,
    );
    this.missingProducts = products;
  }

  public getMissingProducts(): string[] {
    return [...this.missingProducts];
  }

  public hasMultipleMissingProducts(): boolean {
    return this.missingProducts.length > 1;
  }

  public getFirstMissingProduct(): string {
    return this.missingProducts[0];
  }

  public static forSingleProduct(productId: string): ProductNotFoundException {
    if (!productId || productId.trim().length === 0) {
      throw new Error('Product ID cannot be empty when throwing ProductNotFoundException');
    }
    return new ProductNotFoundException(productId);
  }

  public static forMultipleProducts(productIds: string[]): ProductNotFoundException {
    if (!productIds || productIds.length === 0) {
      throw new Error('At least one product ID must be provided when throwing ProductNotFoundException');
    }
    const validIds = productIds.filter((id) => id && id.trim().length > 0);
    if (validIds.length === 0) {
      throw new Error('All provided product IDs are empty');
    }
    return new ProductNotFoundException(validIds);
  }
}