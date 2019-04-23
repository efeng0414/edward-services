const googleMapsClient = require("@google/maps").createClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
  Promise: Promise
});

module.exports.geocodeAddress = async ({ address = "" }) => {
  const response = await googleMapsClient.geocode({ address }).asPromise();
  return response.json;
};

// It seems like only one type of place is allowed.
// https://developers.google.com/places/supported_types
// "If nothing is specified, all types are returned. In general only a single type is allowed."
module.exports.placesAutoComplete = async ({ input, sessionToken, type }) => {
  const token =
    sessionToken ||
    require("@google/maps").util.placesAutoCompleteSessionToken();
  const response = await googleMapsClient
    .placesAutoComplete({
      input,
      sessiontoken: token,
      types: type
    })
    .asPromise();
  return response.json;
};
