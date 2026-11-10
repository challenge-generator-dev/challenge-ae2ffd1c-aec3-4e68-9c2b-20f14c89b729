import { AxiosError } from 'axios';

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: Record<string, unknown>;
}

export function isAxiosError(error: unknown): error is AxiosError {
  return error instanceof AxiosError;
}

export function handleApiError(error: unknown): AppError {
  if (isAxiosError(error)) {
    const response = error.response;
    const statusCode = response?.status;
    
    if (statusCode === 400) {
      return {
        message: 'Los datos enviados no son válidos. Verifica los campos requeridos.',
        code: 'BAD_REQUEST',
        statusCode,
        details: response?.data as Record<string, unknown>,
      };
    }
    
    if (statusCode === 401) {
      return {
        message: 'No tienes autorización para realizar esta acción.',
        code: 'UNAUTHORIZED',
        statusCode,
      };
    }
    
    if (statusCode === 403) {
      return {
        message: 'Acceso prohibido. No tienes permisos suficientes.',
        code: 'FORBIDDEN',
        statusCode,
      };
    }
    
    if (statusCode === 404) {
      return {
        message: 'El recurso solicitado no fue encontrado.',
        code: 'NOT_FOUND',
        statusCode,
      };
    }
    
    if (statusCode === 409) {
      return {
        message: 'Ya existe un recurso con esos datos. Verifica que el identificador no esté duplicado.',
        code: 'CONFLICT',
        statusCode,
        details: response?.data as Record<string, unknown>,
      };
    }
    
    if (statusCode && statusCode >= 500) {
      return {
        message: 'Error del servidor. Intenta más tarde o contacta al administrador.',
        code: 'SERVER_ERROR',
        statusCode,
      };
    }
    
    return {
      message: error.message || 'Ocurrió un error al procesar la solicitud.',
      code: 'UNKNOWN',
      statusCode,
    };
  }
  
  if (error instanceof Error) {
    return {
      message: error.message || 'Ocurrió un error inesperado.',
      code: 'UNKNOWN',
    };
  }
  
  return {
    message: 'Ocurrió un error desconocido.',
    code: 'UNKNOWN',
  };
}

export function getErrorMessage(error: unknown): string {
  const appError = handleApiError(error);
  return appError.message;
}

export function logError(error: unknown, context?: string): void {
  const appError = handleApiError(error);
  const timestamp = new Date().toISOString();
  const contextPrefix = context ? `[${context}] ` : '';
  
  console.error(
    `${timestamp} ${contextPrefix}Error: ${appError.message}`,
    {
      code: appError.code,
      statusCode: appError.statusCode,
      details: appError.details,
      originalError: error,
    }
  );
}