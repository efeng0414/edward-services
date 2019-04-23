import { pool } from "./client";

/**
 * Add new notification in notifications table
 *
 * @function
 * @param {string} statement - SQL statement
 */

export default async (statement: string, variables: string[]) => {
  try {
    const response = await pool.query(statement, variables);
    return response;
  } catch (error) {
    console.error(error);
  }
};
