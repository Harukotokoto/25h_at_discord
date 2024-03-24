declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CLIENT_TOKEN: string;
      CLIENT_ID: string;
      CLIENT_SECRET: string;
      DATABASE_CONNECTION_URI: string;
      GUILD_LOG: string;
      ERROR_LOG: string;
      VOIDS_API: string;
    }
  }
}

export {};
