import { HttpException, HttpStatus } from '@nestjs/common';

export class OrderExistsException extends HttpException {
  constructor(orderId: string) {
    const message = `Order with id '${orderId}' already exists in the system`;
    super(
      {
        statusCode: HttpStatus.CONFLICT,
        message: message,
        error: 'Order Already Exists',
        orderId,
        timestamp: new Date().toISOString(),
      },
      HttpStatus.CONFLICT,
    );
  }

  public getOrderId(): string {
    return this.getResponse()['orderId'] as string;
  }

  public getErrorDetails(): { statusCode: number; message: string; error: string } {
    const response = this.getResponse() as Record<string, unknown>;
    return {
      statusCode: response.statusCode as number,
      message: response.message as string,
      error: response.error as string,
    };
  }

  public static forValidation(orderId: string): OrderExistsException {
    if (!orderId || orderId.trim().length === 0) {
      throw new Error('Order ID cannot be empty when throwing OrderExistsException');
    }
    return new OrderExistsException(orderId);
  }
}