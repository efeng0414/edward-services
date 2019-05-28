import { gql, makeExtendSchemaPlugin } from "graphile-utils";

const typeDefs = gql`
  input getMatchingAgentsInput {
    _transactionType: String
    _propertyTypes: [String]
    _priceLow: BigFloat
    _priceHigh: BigFloat
    _latbottom: BigFloat
    _lattop: BigFloat
    _longleft: BigFloat
    _longright: BigFloat
    _areas: [BigInt]
    _fromUserProfile: Boolean
  }

  extend type Query {
    userProfileHomeHub: String!
    userAgents: String!
    getMatchingAgents(input: getMatchingAgentsInput): String!
  }
`;

const resolvers = {
  Query: {
    // @ts-ignore
    async userProfileHomeHub(parent, args, context, info) {
      // Get things from context
      const pgClient = context.pgClient;

      // User details
      const functionResult = await pgClient
        .query(`SELECT * FROM marketplace.user_profile_home_hub()`)
        // @ts-ignore
        .then(res => {
          return res.rows[0];
        });

      //@ts-ignore
      return JSON.stringify(functionResult.user_profile_home_hub);
    },

    // @ts-ignore
    async userAgents(parent, args, context, info) {
      // Get things from context
      const pgClient = context.pgClient;

      // User details
      const functionResult = await pgClient
        .query(`SELECT * FROM marketplace.user_agents()`)
        // @ts-ignore
        .then(res => {
          return res.rows[0];
        });

      //@ts-ignore
      return JSON.stringify(functionResult.user_agents);
    },

    // @ts-ignore
    async getMatchingAgents(parent, args, context, info) {
      // Get things from context
      const pgClient = context.pgClient;

      // User details
      const functionResult = await pgClient
        .query(
          `SELECT * FROM marketplace.get_matching_agents(
          _from_user_profile => false,
          _transaction_type => $1,
          _property_types => $2,
          _price_low => $3,
          _price_high => $4,
          _areas => $5,
          _latbottom => $6,
          _lattop => $7,
          _longleft => $8,
          _longright => $9
        )`,
          [
            args.input._transactionType || "B", // $1
            args.input._propertyTypes || ["House/Townhouse", "Condo/Apartment"], // $2
            args.input._priceLow || 0, // $3
            args.input._priceHigh || 9999999, // $4
            args.input._areas || null, // $5
            args.input._latbottom || null, // $6
            args.input._lattop || null, // $7
            args.input._longleft || null, // $8
            args.input._longright || null // $9
          ]
        )
        // @ts-ignore
        .then(res => {
          return res.rows[0];
        });

      //@ts-ignore
      return JSON.stringify(functionResult.get_matching_agents);
    }
  }
};

const UserProfileHomeHub = makeExtendSchemaPlugin(build => {
  const { pgSql: sql } = build; // Gives access to database
  return {
    typeDefs,
    resolvers
  };
});

export default UserProfileHomeHub;
