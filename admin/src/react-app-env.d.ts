declare module '*.png';
declare module '*.svg';
declare module '*.jpeg';
declare module '*.jpg';

/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_MAP_API_KEY: string; // Add other variables as needed
  // Add any other environment variables you want to declare
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
