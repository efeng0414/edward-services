/**
 * Connect to the db and LISTEN to the channel
 *
 * @function
 * @param {string} obj.channelName
 * @param {function} obj.callback - pass the response data
 */

import { Pool } from "pg";
import { getDatabaseConfig } from "./index";

export const pool = new Pool(getDatabaseConfig());
