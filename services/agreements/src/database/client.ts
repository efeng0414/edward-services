/**
 * Connect to the db and LISTEN to the channel
 *
 * @function
 * @param {string} obj.channelName
 * @param {function} obj.callback - pass the response data
 */

type DataType = {
  payload: string;
  channel: string;
};

import { Pool } from "pg";
import { getDatabaseConfig } from "./index";

export const pool = new Pool(getDatabaseConfig());
const RETRY_SECONDS = 100;

const connectAndListen = (callback: Function, channelName: string) => {
  return pool.connect((err, client) => {
    console.log(channelName);
    if (err) {
      console.error("error connecting", err.stack);

      // Retry
      setTimeout(() => {
        console.log("err: Retry connection");
        connectAndListen(callback, channelName);
      }, 1000 * RETRY_SECONDS);
    } else {
      console.log(`Listening for ${channelName}`);

      // LISTEN to the channel for all updates made to the db
      client.query(`LISTEN ${channelName}`);

      // @ts-ignore
      client.on("notification", (data: DataType) => {
        console.log("notification recieved - ", data);
        if (data.channel === channelName && data.payload) {
          callback(JSON.parse(data.payload));
        }
      });

      client.on("error", err => {
        console.log("error: Reload connection");
        connectAndListen(callback, channelName);
      });

      // @ts-ignore
      client.on("remove", err => {
        console.log("remove: Reload connection");
        connectAndListen(callback, channelName);
      });
    }
  });
};

export default connectAndListen;
