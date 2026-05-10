declare global {
  interface Window {
    __env?: {
      API_BASE_URL?: string;
    };
  }
}

export const API_BASE_URL =
  window.__env?.API_BASE_URL?.trim() || 'http://localhost:3000/api';

