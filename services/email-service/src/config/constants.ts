import moment from "moment";
const currentTimestamp = moment().unix();

export type PayloadType = {
  title: string;
  body: string;
  meeting_notification: boolean;
  proposal_notification: boolean;
  profile_notification: boolean;
  email_notification: boolean;
  news_notification: boolean;
  first_name: string;
  last_name: string;
  notification_name: string;
  notification_date: string;
  notification_from: string;
  notification_action: string;
  notification_object: object;
  url_path: string;
  master_settings: {
    master_email_notification: boolean;
    master_news_notification: boolean;
    master_push_notification: boolean;
  };
  email: string;
  template_id: string;
};

export const NOTIFICATION_TABLE_FIELDS = {
  fk_meeting: "fk_meeting",
  fk_opportunity: "fk_opportunity",
  fk_consumer_requirement: "fk_consumer_requirement",
  notification_status: "notification_status"
};

export const NOTIFICATION_TYPE = {
  // channels from pg_notify on db
  CONSUMER_ACCEPTED_PROPOSAL: "consumer_accepted_proposal",
  WELCOME_USERS: "welcome_users",
  CONSUMER_RECIEVED_PROPOSAL: "consumer_recieved_proposal",
  AGENT_RECEIVED_MEETING_REQUEST: "agent_received_meeting_request"
};

export const NOTIFICATION_CHANNEL = "notifications";
export const EMAIL_ACTIONS = "email_actions";

export const EMAIL_ACTION = {
  EMAIL_VERIFICATION: "Email_Verification",
  PASSWORD_RESET: "Password_Reset"
};

export const USER_TYPES = {
  CONSUMER: "consumer",
  AGENT: "agent"
};

export const PG_NOTIFY = "notification";

export const EMAIL_TEMPLATES = {
  WELCOME_USER_AGENT: "d-bbd7b121559841c38f2b7613bb664a4e",
  WELCOME_USER_CONSUMER: "d-581699ab705a49b6a497ac773f8fd1eb",
  NOTIFICATIONS: "d-bc553d411e82438387e826b961cb78b1",
  CONSUMER_ACCEPTED_PROPOSAL: "d-0f30eab7a8334d8aae699ad0a6052061",
  CONSUMER_RECIEVED_PROPOSAL: "d-7f2417ce527d48ceab226c63f6a3e85f",
  AGENT_RECEIVED_MEETING_REQUEST: "d-94ad05e87cc944ae8562572de148aaad",
  EMAIL_VERIFICATION: "d-c30e7454ea7b4adaa4346e11232a7e23",
  PASSWORD_RESET: "d-4ba394d970564f44ad31351982bc275a"
};

export const SENDER_INFORMATION = {
  id: 451202,
  nickname: `Nobul Corporation`,
  from: { email: "support@nobul.com", name: `Nobul Corporation` },
  reply_to: { email: "support@nobul.com", name: `Nobul Corporation` },
  address: "200 Wellington",
  address_2: "Suite 310",
  city: "Toronto",
  state: "On",
  zip: "M5V 3C7",
  country: "Canada",
  updated_at: currentTimestamp,
  created_at: currentTimestamp,
  locked: false,
  phone: "1-833-490-9042"
};

export const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for
  // this URL must be whitelisted in the Firebase Console.

  //@ts-ignore
  url: process.env.EMAIL_ACTION_URL

  // TODO:
  // Figure if we need the config below

  // handleCodeInApp: true,
  // iOS: {
  //   bundleId: "com.example.ios"
  // },
  // android: {
  //   packageName: "com.example.android",
  //   installApp: true,
  //   minimumVersion: "12"
  // },
  // dynamicLinkDomain: "coolapp.page.link"
};

export const EMAIL_VERIFICATION = "Email_Verification";
export const PASSWORD_RESET = "Password_Reset";
