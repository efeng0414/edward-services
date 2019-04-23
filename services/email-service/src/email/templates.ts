import {
  NOTIFICATION_TYPE,
  EMAIL_TEMPLATES,
  USER_TYPES,
  EMAIL_ACTION
} from "./../config/constants";
import sgMail from "./sendGrid";

import { timeConversion } from "./helpers";

const currentTime = new Date();

const templates = async ({ type, payload }: any) => {
  switch (type) {
    case NOTIFICATION_TYPE.AGENT_RECEIVED_MEETING_REQUEST: {
      const msg = {
        from: {
          email: payload.from.email,
          name: "Meeting Request"
        },
        personalizations: [
          {
            to: [
              {
                email: payload.agent.email,
                name: `${payload.agent.first_name} ${payload.agent.last_name}`
              }
            ],
            dynamic_template_data: {
              subject: "A consumer has requested a meeting",
              consumer_name: `${payload.consumer.first_name} ${
                payload.consumer.last_name
              }`,
              agent_name: `${payload.agent.first_name} ${
                payload.agent.last_name
              }`,
              consumer_email: payload.consumer.email,
              agent_email: payload.agent.email,
              meeting_start_time: timeConversion({
                // @ts-ignore
                dateObj: new Date(
                  payload.consumer.meeting_start_time || currentTime
                )
              }),
              meeting_end_time: timeConversion({
                // @ts-ignore
                dateObj: new Date(payload.consumer.meeting_end_time)
              }),
              meeting_type: payload.consumer.meeting_type,
              agent_phone_number: payload.agent.phone_number,
              consumer_phone_number: payload.consumer.phone_number
            }
          }
        ],
        template_id: EMAIL_TEMPLATES.AGENT_RECEIVED_MEETING_REQUEST
      };
      if (payload.agent.notification_setting) return await sgMail.send(msg);
      else return;
    }

    case NOTIFICATION_TYPE.CONSUMER_ACCEPTED_PROPOSAL: {
      const msg = {
        from: {
          email: payload.from.email,
          name: "Proposal Acccepted"
        },
        personalizations: [
          {
            to: [
              {
                email: payload.agent.email,
                name: `${payload.agent.first_name} ${payload.agent.last_name}`
              }
            ],
            dynamic_template_data: {
              subject: "A consumer accepted your proposal",
              consumer_name: `${payload.consumer.first_name} ${
                payload.consumer.last_name
              }`,
              agent_name: `${payload.agent.first_name} ${
                payload.agent.last_name
              }`,
              consumer_email: payload.consumer.email,
              agent_phone_number: payload.agent.phone_number,
              consumer_phone_number: payload.consumer.phone_number
            }
          }
        ],
        template_id: EMAIL_TEMPLATES.CONSUMER_ACCEPTED_PROPOSAL
      };
      if (payload.agent.notification_setting) return await sgMail.send(msg);
      else return;
    }

    case NOTIFICATION_TYPE.CONSUMER_RECIEVED_PROPOSAL: {
      const msg = {
        from: {
          email: payload.from.email,
          name: "Proposal Received"
        },
        personalizations: [
          {
            to: [
              {
                email: payload.consumer.email,
                name: `${payload.consumer.first_name} ${
                  payload.consumer.last_name
                }`
              }
            ],
            dynamic_template_data: {
              subject: "An agent offered a proposal",
              consumer_name: `${payload.consumer.first_name} ${
                payload.consumer.last_name
              }`,
              agent_name: `${payload.agent.first_name} ${
                payload.agent.last_name
              }`,
              consumer_email: payload.consumer.email,
              brokerage_name: payload.agent.brokerage_name,
              proposal_url: payload.agent.url,
              agent_phone_number: payload.agent.phone_number,
              consumer_phone_number: payload.consumer.phone_number
            }
          }
        ],
        template_id: EMAIL_TEMPLATES.CONSUMER_RECIEVED_PROPOSAL
      };
      if (payload.consumer.notification_setting) return await sgMail.send(msg);
      else return;
    }

    case NOTIFICATION_TYPE.WELCOME_USERS: {
      const msg = {
        from: {
          email: payload.from.email,
          name: payload.from.name
        },
        personalizations: [
          {
            to: [
              {
                email: payload.user.email,
                name: payload.user.first_name
              }
            ],
            dynamic_template_data: {
              first_name: payload.user.first_name
            }
          }
        ],
        template_id:
          payload.user.user_type === USER_TYPES.AGENT
            ? EMAIL_TEMPLATES.WELCOME_USER_AGENT
            : EMAIL_TEMPLATES.WELCOME_USER_CONSUMER
      };
      return await sgMail.send(msg);
    }

    case EMAIL_ACTION.EMAIL_VERIFICATION: {
      const msg = {
        from: {
          email: payload.from.email,
          name: payload.from.name
        },
        personalizations: [
          {
            to: [
              {
                email: payload.user.email,
                name: payload.user.first_name
              }
            ],
            dynamic_template_data: {
              first_name: payload.user.first_name,
              link: payload.link
            }
          }
        ],
        template_id: EMAIL_TEMPLATES.EMAIL_VERIFICATION
      };
      return await sgMail.send(msg);
    }

    case EMAIL_ACTION.PASSWORD_RESET: {
      const msg = {
        from: {
          email: payload.from.email,
          name: payload.from.name
        },
        personalizations: [
          {
            to: [
              {
                email: payload.user.email,
                name: payload.user.first_name
              }
            ],
            dynamic_template_data: {
              first_name: payload.user.first_name,
              link: payload.link
            }
          }
        ],
        template_id: EMAIL_TEMPLATES.PASSWORD_RESET
      };
      return await sgMail.send(msg);
    }

    default:
      return;
  }
};

export default templates;
