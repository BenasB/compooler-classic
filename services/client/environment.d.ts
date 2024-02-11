// Defines what variables are expected in the .env file
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_MAPS_API_KEY: string?;
      EXPO_PUBLIC_GROUP_MAKER_API_URL: string?;
    }
  }
}

export {};
