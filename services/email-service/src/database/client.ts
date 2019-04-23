import { PG_NOTIFY, SENDER_INFORMATION } from "./../config/constants";
import { Pool } from "pg";
import getDatabaseConfig from "./index";
import { templates } from "../email";

type DataType = {
  payload: string;
  channel: string;
};

export const pool = new Pool(getDatabaseConfig());

/**
 * Connect to the db and LISTEN to the channel
 *
 * @function
 * @param {string} obj.channels
 * @param {function} obj.callback (OPTIONAL) - pass the response data
 */

export default (callback: Function = () => {}, channels: Array<string>) =>
  pool.connect((err, client) => {
    if (err) {
      console.error("error connecting to db", err.stack);
    } else {
      // LISTEN to the channel for all updates made to the db
      channels.map(channel => client.query(`LISTEN ${channel}`));

      // `notification` is not the channel but pg_notify
      // @ts-ignore
      client.on(PG_NOTIFY, async (data: DataType) => {
        callback(data);

        const result = JSON.parse(data.payload);

        const sendEmail = result.user
          ? result.user.master_settings.master_email_notification
          : result.master_settings.master_email_notification;

        if (sendEmail) {
          try {
            await templates({
              type: result.notification_type,
              payload: {
                ...SENDER_INFORMATION,
                ...result
              }
            });
          } catch (err) {
            console.log("Error sending email: ", err);
          }
        }
      });
    }
  });
