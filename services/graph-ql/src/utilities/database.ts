import fs from "fs";

import { isLocal } from "../config";

export type DatabaseConfigType = {
  user: string;
  password: string;
  database: string;
  host: string;
  ssl?: {
    rejectUnauthorized: boolean;
    ca: Buffer;
    key: Buffer;
    cert: Buffer;
  };
};

export function getDatabaseConfig(): DatabaseConfigType {
  const config: DatabaseConfigType = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST
  };
  if (isLocal()) {
    // If the server is connecting to the DB from localhost, we need to connect with SSL.
    config.ssl = {
      rejectUnauthorized: false,
      ca: fs.readFileSync(process.env.DB_SSL_SERVER_CA.toString()),
      key: fs.readFileSync(process.env.DB_SSL_CLIENT_KEY.toString()),
      cert: fs.readFileSync(process.env.DB_SSL_CLIENT_CERT.toString())
    };
  } else {
    // If the server is running within App Engine, connection is made to the DB with SSL by default.
    // Connections from within App Engine also expect the host string in this format:
    // `/cloudsql/INSTANCE_CONNECTION_NAME`
    // instead of the database IP address
    config.host = process.env.DB_HOST_STRING;
  }

  return config;
}
