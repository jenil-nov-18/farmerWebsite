import { toast } from 'sonner';

export class AppError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public status: number = 500,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: unknown, fallbackMessage: string = 'An error occurred'): AppError => {
  console.error('Error details:', error);

  if (error instanceof AppError) {
    toast.error(error.message);
    return error;
  }

  if (error instanceof Error) {
    const appError = new AppError(error.message);
    toast.error(error.message);
    return appError;
  }

  const appError = new AppError(fallbackMessage);
  toast.error(fallbackMessage);
  return appError;
};

export const createHttpError = (status: number, message: string, code?: string): AppError => {
  return new AppError(message, code || `HTTP_${status}`, status);
};

export const handleApiError = (error: unknown): never => {
  if (error instanceof Response) {
    throw new AppError(
      'API request failed',
      'API_ERROR',
      error.status
    );
  }

  if (error instanceof Error) {
    throw new AppError(error.message, 'API_ERROR');
  }

  throw new AppError('Unknown API error', 'API_ERROR');
};

export const handleValidationError = (errors: Record<string, string>): void => {
  Object.values(errors).forEach(error => {
    toast.error(error);
  });
};

export const isNetworkError = (error: unknown): boolean => {
  return error instanceof Error && (
    error.message.includes('network') ||
    error.message.includes('connection') ||
    error.message.includes('offline')
  );
};

export const handleNetworkError = (): void => {
  toast.error('Network connection error. Please check your internet connection.');
};

export const handleTimeoutError = (): void => {
  toast.error('Request timed out. Please try again.');
};

export const handleAuthError = (error: unknown): void => {
  if (error instanceof AppError && error.status === 401) {
    toast.error('Please log in to continue');
    return;
  }
  
  if (error instanceof AppError && error.status === 403) {
    toast.error('You do not have permission to perform this action');
    return;
  }

  toast.error('Authentication error');
};