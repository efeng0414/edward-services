import query from "../database/query";
import { getAccessToken } from "./accessToken";
import { createEnvelope } from "./createEnvelope";
import { getReferralDocument } from "./getDocument";
import { createTab, createTextTab } from "./helpers";

type ReferralData = {
  brokeragename: string;
  brokerageaddressline1: string;
  brokerageaddressline2: string;
  brokerageaddresszippostal: string;
  brokerageaddresscity: string;
  brokerageaddressstateprovince: string;
  brokerageaddresscountry: string;
  brokeragephone: string;
  agentfirstname: string;
  agentmiddlename: string;
  agentlastname: string;
  agentemail: string;
  customerfirstname: string;
  customermiddlename: string;
  customerlastname: string;
  customerphone: string;
  customeremail: string;
  opportunityid: string;
};

type FileInfo = {
  base64Doc: string;
  fileName: string;
  filePath: string;
};

// tslint:disable-next-line:interface-name
interface SendReferral {
  fileInfo: FileInfo;
  referralData: ReferralData;
}

// tslint:disable-next-line:interface-name
interface StoreEnvelopeInput {
  envelopeId: string;
  opportunityid: string;
}

export const sendReferralContract = (referralData: ReferralData) => {
  console.log({ referralData });

  const document = getReferralDocument({
    country: referralData.brokerageaddresscountry, // referralData.brokerageaddresscountry
    region: "ON" // referralData.brokerageaddressstateprovince
  })
    .then((args: FileInfo) =>
      sendDocusignReferral({ fileInfo: args, referralData })
    )
    .catch((error: Error) => {
      console.log({ "Get document error": error });
    });

  console.log({ document });
};

const sendDocusignReferral = (args: SendReferral) => {
  const referralData = args.referralData;
  const fileInfo = args.fileInfo;

  // Set signer to agent for now. They will redirect to the broker of record.
  const signers = [
    {
      email: referralData.agentemail,
      name: `${referralData.agentfirstname} ${referralData.agentlastname}`,
      recipientId: "1",
      routingOrder: "1"
    }
  ];

  // Construct address from agent data
  const brokerageAddress = [];
  referralData.brokerageaddressline1 &&
    brokerageAddress.push(referralData.brokerageaddressline1);
  referralData.brokerageaddressline2 &&
    brokerageAddress.push(referralData.brokerageaddressline2);
  referralData.brokerageaddresscity &&
    brokerageAddress.push(referralData.brokerageaddresscity);
  referralData.brokerageaddressstateprovince &&
    brokerageAddress.push(referralData.brokerageaddressstateprovince);
  referralData.brokerageaddresscountry &&
    brokerageAddress.push(referralData.brokerageaddresscountry);
  referralData.brokerageaddresszippostal &&
    brokerageAddress.push(referralData.brokerageaddresszippostal);

  // This sets up the docusign stuff.
  const referralPackage = {
    files: [
      {
        name: "Referral Agreement",
        base64Doc: fileInfo.base64Doc
      }
    ],
    tabs: [
      {
        signHereTabs: [
          createTab({ tabLabel: "signHere", anchorString: "\\s3\\" })
        ],
        initialHereTabs: [
          createTab({ tabLabel: "initialHere", anchorString: "\\i3\\" })
        ],
        dateSignedTabs: [
          createTab({ tabLabel: "todaysDate", anchorString: "\\d3\\" })
        ],
        fullNameTabs: [
          createTab({ tabLabel: "fullName", anchorString: "\\n3\\" })
        ],
        textTabs: [
          createTextTab({
            anchorString: "\\clientName\\",
            value: `${referralData.customerfirstname} ${
              referralData.customerlastname
            }` // Client full name
          }),
          createTextTab({
            anchorString: "\\clientPhone\\",
            value: referralData.customerphone // Client phone
          }),
          createTextTab({
            anchorString: "\\referralReference\\",
            value: referralData.opportunityid // OfferId
          }),
          createTextTab({
            anchorString: "\\brokerageName\\",
            value: referralData.brokeragename // Brokerage name
          }),
          createTextTab({
            anchorString: "\\brokeragePhone\\",
            value: referralData.brokeragephone // Brokerage phone number
          }),
          createTextTab({
            anchorString: "\\brokerageAddress\\",
            value: brokerageAddress.join(", ") // Brokerage address
          })
        ]
      }
    ]
  };

  // 4: Now! Go to docusign, get a token.
  return getAccessToken()
    .then((authorizationCode: string) =>
      // 5: Got the token, create the envelope.
      createEnvelope({
        signers,
        authorizationCode,
        packageInfo: referralPackage
      })
        .then((envelopeId: string) =>
          storeEnvelopeId({
            opportunityid: referralData.opportunityid,
            envelopeId
          })
        )
        .catch(error => {
          console.error("Create envelope error", error);
          return Promise.reject(new Error("Creating envelopes failed."));
        })
    )
    .catch(error => {
      console.error("getAccessToken error", error);
      return Promise.reject(new Error("Getting accessToken failed."));
    });
};

const storeEnvelopeId = (args: StoreEnvelopeInput) => {
  console.log("storeEnvelopeId", args.envelopeId, args.opportunityid);
  query(
    "UPDATE marketplace.referral_agreement SET form_number = $1 WHERE fk_opportunity = $2",
    [args.envelopeId, args.opportunityid]
  );
};
