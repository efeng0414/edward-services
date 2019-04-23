import { gql, makeExtendSchemaPlugin } from "graphile-utils";
import axios from "axios";

const typeDefs = gql`
  extend type Query {
    transactionEmail(type: String): Boolean
  }
`;

const resolvers = {
  Query: {
    // @ts-ignore
    async transactionEmail(parent, args, context, info) {
      // Get things from context
      const firebaseUserId = context.firebaseUserId;
      const pgClient = context.pgClient;

      // User details
      const userDetails = await pgClient
        .query(
          `SELECT * FROM users_firebase
          JOIN users ON users_firebase.user_uid = users.user_key
          WHERE users_firebase.firebase_uid = $1`,
          [firebaseUserId]
        )
        // @ts-ignore
        .then(res => {
          const user = res.rows[0];
          return {
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name
          };
        });

      console.log({ userDetails });

      // Email type
      const type = args.type;

      const resp = await axios.post(process.env.EMAIL_SERVICE_ENDPOINT, {
        type,
        email: userDetails.email,
        first_name: userDetails.firstName
      });

      //@ts-ignore
      return resp.data.success;
    }
  }
};

const EmailService = makeExtendSchemaPlugin(build => {
  const { pgSql: sql } = build; // Gives access to database
  return {
    typeDefs,
    resolvers
  };
});

export default EmailService;
