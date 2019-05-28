import { Pool } from "pg";
import { getDatabaseConfig } from ".";

const pool = new Pool(getDatabaseConfig());

/**
 * Add new notification in notifications table
 *
 * @function
 * @param {string} statement - SQL statement
 */

export default function(statement: string, variables: string[], cb: Function) {
  return pool.connect(function(err, client, done) {
    if (err) throw err;
    return client.query(statement, variables, function(err, result) {
      if (err) throw err;
      done();
      cb(result.rows);
    });
  });
}
