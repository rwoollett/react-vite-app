export type StatusError = {
  message: string;
}

export interface StatusErrors {
  data?: {
    errors: StatusError[]; 
  }
  status?: string; 
  error?: string;
} 