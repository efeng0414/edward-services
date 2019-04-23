const { placesAutoComplete } = require("../utilities/google");

/**
 * Issues a places auto-complete request.
 *
 * @function
 * @example https://DOMAIN-NAME.com/places-autocomplete?input=Toron
 * @example https://DOMAIN-NAME.com/places-autocomplete?input=Toron&sessionToken=RANDOM_STRING
 * @example https://DOMAIN-NAME.com/places-autocomplete?input=Toron&sessionToken=RANDOM_STRING&type=establishment
 * @param {string} input - Input string to search places by (REQUIRED)
 * @param {string} sessionToken - Group together multiple requests for a single search by providing the same session token (for billing purposes).
 * @param {string} type - Type of places to filter by. Refer to https://developers.google.com/places/supported_types#table3
 * @returns Top 5 recommended places based on the input string.
 */
module.exports.placesAutoComplete = async (req, res) => {
  const { input, sessionToken, type } = req.query;
  if (input) {
    try {
      const result = await placesAutoComplete({ input, sessionToken, type });
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send(error);
    }
  } else {
    const error = {
      status: "error",
      message: "An input must be provided."
    };
    res.status(400).send(error);
  }
};
