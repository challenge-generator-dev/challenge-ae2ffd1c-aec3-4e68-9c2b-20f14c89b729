import { HttpException, HttpStatus } from '@nestjs/common';

export enum DynamoDBErrorCode {
  CONNECTION_FAILED = 'DYNAMODB_CONNECTION_FAILED',
  TIMEOUT = 'DYNAMODB_TIMEOUT',
  CREDENTIALS_INVALID = 'DYNAMODB_CREDENTIALS_INVALID',
  TABLE_NOT_FOUND = 'DYNAMODB_TABLE_NOT_FOUND',
  THROTTLING = 'DYNAMODB_THROTTLING',
  UNKNOWN = 'DYNAMODB_UNKNOWN_ERROR',
}

export class DynamoDBConnectionException extends HttpException {
  private readonly errorCode: DynamoDBErrorCode;
  private readonly originalError: Error | null;
  private readonly retryable: boolean;

  constructor(
    message: string,
    errorCode: DynamoDBErrorCode = DynamoDBErrorCode.UNKNOWN,
    originalError?: Error,
    retryable: boolean = true,
  ) {
    const response = {
      statusCode: HttpStatus.SERVICE_UNAVAILABLE,
      message: `Database connection error: ${message}`,
      error: 'DynamoDB Connection Error',
      errorCode,
      retryable,
      timestamp: new Date().toISOString(),
    };

    super(response, HttpStatus.SERVICE_UNAVAILABLE);
    this.errorCode = errorCode;
    this.originalError = originalError || null;
    this.retryable = retryable;
  }

  public getErrorCode(): DynamoDBErrorCode {
    return this.errorCode;
  }

  public getOriginalError(): Error | null {
    return this.originalError;
  }

  public isRetryable(): boolean {
    return this.retryable;
  }

  public static forConnectionFailure(originalError?: Error): DynamoDBConnectionException {
    return new DynamoDBConnectionException(
      'Unable to establish connection to DynamoDB',
      DynamoDBErrorCode.CONNECTION_FAILED,
      originalError,
      true,
    );
  }

  public static forTimeout(originalError?: Error): DynamoDBConnectionException {
    return new DynamoDBConnectionException(
      'Request to DynamoDB timed out',
      DynamoDBErrorCode.TIMEOUT,
      originalError,
      true,
    );
  }

  public static forInvalidCredentials(originalError?: Error): DynamoDBConnectionException {
    return new DynamoDBConnectionException(
      'Invalid AWS credentials for DynamoDB access',
      DynamoDBErrorCode.CREDENTIALS_INVALID,
      originalError,
      false,
    );
  }

  public static forTableNotFound(tableName: string): DynamoDBConnectionException {
    return new DynamoDBConnectionException(
      `DynamoDB table '${tableName}' not found`,
      DynamoDBErrorCode.TABLE_NOT_FOUND,
      undefined,
      false,
    );
  }

  public static forThrottling(originalError?: Error): DynamoDBConnectionException {
    return new DynamoDBConnectionException(
      'DynamoDB request throttled due to high load',
      DynamoDBErrorCode.THROTTLING,
      originalError,
      true,
    );
  }
}