export interface Configuration {
  db: DBConfiguration;
}

export interface DBConfiguration {
  host: string;
  username: string;
  password: string;
  database: string;
  port: number;
  schema: string;
}

