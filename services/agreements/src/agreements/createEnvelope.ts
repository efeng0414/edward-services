import request from "request";

interface CreateEnvelopeInput {
  signers: Object;
  authorizationCode: String;
  packageInfo: object;
}

export const createEnvelope = (args: CreateEnvelopeInput) => {
  return new Promise((resolve, reject) => {
    const header = {
      Accept: "application/json",
      Authorization: args.authorizationCode,
      "Content-Type": "application/json"
    };

    const emailUrl = `${process.env.DOCUSIGN_BASEPATH}/v2/accounts/${
      process.env.DOCUSIGN_ACCOUNT_ID
    }/envelopes/`;

    // @ts-ignore // TODO: add types
    const documents = args.packageInfo.files.map((file, index) => ({
      documentBase64: file.base64Doc,
      documentId: (index + 1).toString(),
      name: file.name,
      order: (index + 1).toString()
    }));

    // @ts-ignore // TODO: add types
    const signerDetail = args.signers.map((item, i) => {
      // @ts-ignore // TODO: add types
      item["tabs"] = args.packageInfo.tabs[i];
      return item;
    });

    const emailPostData = {
      documents: documents,
      emailSubject: `Nobul: Please send this document to your Broker of Record`,
      emailBlurb:
        'This is the referral contract from Nobul for introducing you to a client. Please click the "Review document" button to open the DocuSign link, go to "Other actions" and re-assign the document to your Broker of Record.',
      recipients: {
        signers: signerDetail
      },
      status: "sent"
    };

    const emailOptions = {
      method: "POST",
      uri: emailUrl,
      headers: header,
      json: emailPostData
    };

    return request(emailOptions, (err, resp, body) => {
      if (err) {
        console.error("email creating error:", err);
        reject(err);
      } else {
        console.log("email resp:", resp.statusCode);
        console.log("email resp msg:", resp.statusMessage);
        console.log("email resp body:", body);

        if (body.envelopeId) {
          resolve(body.envelopeId);
        } else {
          reject("creating email error");
        }
      }
    });
  });
};
