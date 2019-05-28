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

function ticker() {
  const today = new Date();
  console.log(
    "Tick: " +
      today.getHours() +
      ":" +
      today.getMinutes() +
      ":" +
      today.getSeconds()
  );
}
setInterval(ticker, 60 * 60 * 1000);

// Post server - Local only
// *************************************
// if (isLocal()) {
ReferralPost();
// }
