import axios from "axios";
import startCase from "lodash/startCase";
import toLower from "lodash/toLower";

export const fetchPracticeDataByODSCode = async ODSCode => {
  const response = await axios.get(
    `https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations/${ODSCode}`
  );

  const org = response.data.Organisation;
  const name = convertToTitleCase(org.Name);
  const location = org.GeoLoc.Location;
  const postCode = location.PostCode;
  const town = convertToTitleCase(location.Town);
  const lines = [];

  Object.keys(location)
    .sort()
    .forEach(key => {
      if (key.includes("AddrLn")) {
        lines.push(convertToTitleCase(location[key]));
      }
    });

  return {
    ODSCode,
    name,
    address: {
      postCode,
      town,
      lines,
    },
  };
};

const convertToTitleCase = string => startCase(toLower(string));
