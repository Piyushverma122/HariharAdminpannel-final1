// config/apiConfig.ts

// Production or main server
export const BASE_URL = 'http://165.22.208.62:5003';

// Local development server
export const TEMP_BASE_URL = 'http://127.0.0.1:5003'; // Your local Flask server

// Optional: A flag to toggle between them (set to true for local development)
export const USE_TEMP_API = true;

// Optional: Unified way to pick base URL
export const getApiBaseUrl = () => (USE_TEMP_API ? TEMP_BASE_URL : BASE_URL);
