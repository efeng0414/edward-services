import { NULL_OFF_SET_BROWSE, POOL, GARAGE, FIRE_PLACE } from "./constants";

export const generatePayload = params => {
  const payload = [
    // Do not change the order of variables.
    // Update the query apropriately if change is required.
    params.filter ? null : NULL_OFF_SET_BROWSE,
    params.filter ? null : params.pageNumber * 10 || 0,
    params.latBottom || null,
    params.latTop || null,
    params.lngLeft || null,
    params.lngRight || null,
    params.priceLow || null,
    params.priceHigh > 5000000 ? null : params.priceHigh,
    params.provinceOrState || null,
    "1,2",
    params.minBedrooms || null,
    params.minBathrooms || null,
    params.minParking || null,
    params.lat || null,
    params.lng || null,
    params.sortBy || null,
    params.sortByType || null,
    params.area_id || null,
    params.buildingFeatures ? params.buildingFeatures.includes(POOL) : null,
    params.buildingFeatures ? params.buildingFeatures.includes(GARAGE) : null,
    params.buildingFeatures
      ? params.buildingFeatures.includes(FIRE_PLACE)
      : null,
    params.forSaleSince ? params.forSaleSince : null,
    params.squareFootage ? JSON.parse(params.squareFootage).min : null,
    params.squareFootage ? JSON.parse(params.squareFootage).max : null
  ];

  return payload;
};
