const { geocodeAddress } = require("../utilities/google");

/**
 * Issues a geocode request.
 * @function
 * @example https://DOMAIN-NAME.com/geocode?address=123 fake street
 * @param {string} address - Address to geocode (REQUIRED)
 * @returns A google geocode response
 */
module.exports.geocode = async (req, res) => {
  const { address } = req.query;
  if (address) {
    try {
      const result = await geocodeAddress({ address });
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send(error);
    }
  } else {
    const error = {
      status: "error",
      message: "An address must be provided."
    };
    res.status(400).send(error);
  }
};
