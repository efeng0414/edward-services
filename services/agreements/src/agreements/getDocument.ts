const { Storage } = require("@google-cloud/storage");

// tslint:disable-next-line:interface-name
interface GetReferralDocumentInputs {
  country: string;
  region: string;
}

export const getReferralDocument = (args: GetReferralDocumentInputs) => {
  // Creates a client
  const storage = new Storage({
    projectId: process.env.FIREBASE_PROJECT_ID
  });
  let pdfBytes = new Buffer("");

  // Default to CA doc
  const filePath = args.country === "US" ? "US1.pdf" : "Canada1.pdf"; // TODO: Constants

  return new Promise((resolve, reject) => {
    if (!filePath) {
      reject(new Error("No referral file URL"));
    }

    return (
      storage
        .bucket(`${process.env.FIREBASE_PROJECT_ID}-blank-agreements`)
        .file(`referral/${filePath}`)
        .createReadStream()
        // @ts-ignore
        .on("data", chunk => {
          pdfBytes = Buffer.concat([pdfBytes, chunk]);
        })
        // @ts-ignore
        .on("error", err => {
          console.error("reading error:", err);
          reject(err);
        })
        .on("finish", () => {
          const base64Doc = pdfBytes.toString("base64");
          resolve({
            base64Doc,
            fileName: `referral-generated.pdf`, // TODO: Constants
            filePath
          });
        })
    );
  });
};
