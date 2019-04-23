interface CreateTabInputs {
  tabLabel: String;
  anchorString: String;
}
interface CreateTextTabInputs {
  anchorString: String;
  value: String;
}

interface Address {
  address1: String;
  address2: String;
  city: String;
  country: String;
  provinceOrState: String;
}
/*
    Tab helper functions
*/
export const tabDefaults = {
  anchorXOffset: "0",
  anchorYOffset: "0",
  anchorIgnoreIfNotPresent: "true",
  anchorUnits: "inches"
};

export const textTabDefaults = {
  ...tabDefaults,
  locked: "true",
  tabLabel: "EditableDataField"
};

export const createTab = (args: CreateTabInputs) => {
  return { ...tabDefaults, ...args };
};

export const createTextTab = (args: CreateTextTabInputs) => {
  return { ...textTabDefaults, ...args };
};

export const constructAddressString = (args: Address) => {
  const addressElems = [
    args.address1,
    args.address2,
    args.city,
    args.provinceOrState,
    args.country
  ];
  return addressElems.filter(el => !!el).join(", ");
};
