import { Firebase } from "../fcm";
import {
  actionCodeSettings,
  EMAIL_VERIFICATION,
  PASSWORD_RESET
} from "../config/constants";

const generateActionLink = async ({ type, email }: any) => {
  switch (type) {
    case EMAIL_VERIFICATION: {
      return await Firebase.auth().generateEmailVerificationLink(
        email,
        actionCodeSettings
      );
    }

    case PASSWORD_RESET: {
      return await Firebase.auth().generatePasswordResetLink(
        email,
        actionCodeSettings
      );
    }

    default:
      return await Promise.resolve();
  }
};

export default generateActionLink;
