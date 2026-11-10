import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const now = Date.now();
    const requestId = request.headers['x-request-id'] || this.generateRequestId();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const duration = Date.now() - now;
        const statusCode = response.statusCode;

        this.logRequest(method, url, statusCode, duration, requestId);
      }),
    );
  }

  private logRequest(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
    requestId: string,
  ): void {
    const logLevel = statusCode >= 400 ? 'error' : 'log';
    const message = `[${requestId}] \${method} \${url} - \${statusCode} (\${duration}ms)`;

    if (logLevel === 'error') {
      console.error(message);
    } else {
      console.log(message);
    }
  }

  private generateRequestId(): string {
    return `req-\${Date.now()}-\${Math.random().toString(36).substring(2, 9)}`;
  }
}