import { Configuration } from './configuration.interface';

export const configuration = (): Configuration => {
  return {
    db: {
      host: process.env.DB_HOST || 'localhost',
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'admin',
      database: process.env.DB_NAME,
      port: +process.env.DB_PORT,
      schema: process.env.DB_SCHEMA,
    },
  };
};
