// config/apiConfig.ts

// Production or main server
export const BASE_URL = 'http://165.22.208.62:5003';

// Temporary test server (e.g., localhost or staging)
export const TEMP_BASE_URL = 'http://165.22.208.62:5003'; // or another temp endpoint

// Optional: A flag to toggle between them
export const USE_TEMP_API = false;

// Optional: Unified way to pick base URL
export const getApiBaseUrl = () => (USE_TEMP_API ? TEMP_BASE_URL : BASE_URL);
