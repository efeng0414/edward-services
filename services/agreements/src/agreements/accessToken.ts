import request from "request";
import jwt from "jsonwebtoken";
import fs from "fs";

/*******************/
/*   AccessToken   */
/*******************/

export const getAccessToken = () => {
  return new Promise((resolve, reject) => {
    const head = {
      typ: "JWT",
      alg: "RS256"
    };
    const bod = {
      iss: process.env.DOCUSIGN_INTEGRATOR_KEY,
      sub: process.env.DOCUSIGN_API_USERNAME,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      aud: process.env.DOCUSIGN_TOKEN_DOMAIN,
      scope: "signature impersonation"
    };

    jwt.sign(
      bod,
      fs.readFileSync(process.env.DOCUSIGN_PRIVATE_KEY),
      { header: head, algorithm: "RS256" },
      // @ts-ignore
      (err, webToken) => {
        if (err) {
          console.error("jwt err:", err);
          reject(err);
        } else {
          const tokenUrl = `${process.env.DOCUSIGN_URL}token`;
          const options = {
            uri: tokenUrl,
            method: "POST",
            json: {
              grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
              assertion: webToken
            }
          };
          // @ts-ignore
          request(options, (err, resp, body) => {
            if (err) {
              console.log("accessToken error:", err);
              reject("accessToken fetching failed... error!");
            } else {
              const accessToken = body.access_token;
              const tokenType = body.token_type;

              const authorization_code = `${tokenType} ${accessToken}`;
              console.log("authorization_code:", authorization_code);
              resolve(authorization_code);
            }
          });
        }
      }
    );
  });
};
