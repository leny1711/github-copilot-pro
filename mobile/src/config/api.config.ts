import { Platform } from 'react-native';

/**
 * API Configuration for different environments
 * 
 * For Android Emulator: use 10.0.2.2 instead of localhost
 * For iOS Simulator: use localhost
 * For Real Device: use your computer's IP address
 */

// Production configuration - set via environment or build config
const PRODUCTION_API_URL = 'https://your-production-api.com/api';
const PRODUCTION_SOCKET_URL = 'https://your-production-api.com';

// Determine the appropriate base URL based on platform
const getBaseUrl = (): string => {
  // Check if running in development mode
  const isDevelopment = __DEV__;

  if (!isDevelopment) {
    // Production URL
    return PRODUCTION_API_URL;
  }

  // Development URLs
  if (Platform.OS === 'android') {
    // Android emulator uses 10.0.2.2 to access host machine's localhost
    return 'http://10.0.2.2:3000/api';
  } else if (Platform.OS === 'ios') {
    // iOS simulator can use localhost
    return 'http://localhost:3000/api';
  } else {
    // Web or other platforms
    return 'http://localhost:3000/api';
  }
};

// Determine socket URL based on environment
const getSocketUrl = (): string => {
  const isDevelopment = __DEV__;

  if (!isDevelopment) {
    return PRODUCTION_SOCKET_URL;
  }

  // Development URLs
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  } else if (Platform.OS === 'ios') {
    return 'http://localhost:3000';
  } else {
    return 'http://localhost:3000';
  }
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// Socket configuration
export const SOCKET_CONFIG = {
  URL: getSocketUrl(),
  OPTIONS: {
    transports: ['websocket'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  },
};
