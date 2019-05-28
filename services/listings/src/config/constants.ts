export const NULL_OFF_SET_BROWSE = 10;
export const DETACHED = "detached";
export const SEMI_DETACHED = "semiDetached";
export const ATTACHED_TOWNHOUSE = "attachedTownhouse";
export const FIRE_PLACE = "firePlace";
export const OPEN_HOUSE = "openHouse";
export const GARAGE = "garage";
export const POOL = "pool";

export const GET_LISTINGS = `SELECT * FROM nobul.getlistings(
    _nulimit => $1
    , _nuoffset => $2
    , _latbottom => $3
    , _lattop => $4
    , _longleft => $5
    , _longright => $6
    , _pricelow => $7
    , _pricehigh => $8
    , _provinceorstate => $9
    , _propertytypes => $10
    , _minbedrooms => $11
    , _minbathrooms => $12
    , _minparking => $13
    , _lat => $14
    , _long => $15
    , _sortby => $16
    , _sortbytype => $17
    , _area_id => $18
    , _pool => $19
    , _garage => $20
    , _fireplace => $21
    , _forsalesince => $22
    , _sqftmin => $23
    , _sqftmax => $24
  );      
  `;

export const GET_LISTING_IDS = `SELECT * FROM nobul.getlistingsid(
    _nulimit => $1
    , _nuoffset => $2
    , _latbottom => $3
    , _lattop => $4
    , _longleft => $5
    , _longright => $6
    , _pricelow => $7
    , _pricehigh => $8
    , _provinceorstate => $9
    , _propertytypes => $10
    , _minbedrooms => $11
    , _minbathrooms => $12
    , _minparking => $13
    , _lat => $14
    , _long => $15
    , _sortby => $16
    , _sortbytype => $17
    , _area_id => $18
    , _pool => $19
    , _garage => $20
    , _fireplace => $21
    , _forsalesince => $22
    , _sqftmin => $23
    , _sqftmax => $24
  );      
  `;
