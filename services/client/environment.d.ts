// Defines what variables are expected in the .env file
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_MAPS_API_KEY: string;
    }
  }
}

export {};
