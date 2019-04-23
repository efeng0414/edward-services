console.log("START REFERRAL WATCHER");

// Dotenv config
import { configure } from "./config";
configure();

// Imports
import ReferralPost from "./agreements/post";
import { sendReferralContract } from "./agreements/referral";
import { isLocal } from "./config";
import connect from "./database/client";

// DB watcher
// *************************************
connect(
  sendReferralContract,
  "referral_agreement_created"
);

// Post server - Local only
// *************************************
if (isLocal()) {
  ReferralPost();
}
