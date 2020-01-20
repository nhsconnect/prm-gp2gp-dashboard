import axios from "axios";
import capitalize from "lodash/capitalize";

const ODS_PORTAL_URL =
  "https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations";

export const fetchPracticeDataByODSCode = async (
  ODSCode,
  url = ODS_PORTAL_URL
) => {
  const response = await axios.get(`${url}/${ODSCode}`);

  return response.data;
};

export const transformPracticeData = data => {
  const org = data.Organisation;
  const name = convertToTitleCase(org.Name);
  const location = org.GeoLoc.Location;
  const ODSCode = org.OrgId.extension;
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

export const getPracticeDetails = async ODSCode => {
  const response = await fetchPracticeDataByODSCode(ODSCode);
  const transformedResponse = transformPracticeData(response);

  return transformedResponse;
};

const convertToTitleCase = string => string.replace(/\w+/g, capitalize);
