// TODO: this is only for testing triggers
// DO NOT USE THIS FOR PROD FEATURES
import { pool } from "./client";

export default async (statement: string) => {
  try {
    const response = await pool.query(statement);
    return response;
  } catch (error) {
    console.error(error);
  }
};
