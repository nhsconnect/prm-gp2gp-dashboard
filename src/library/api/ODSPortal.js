import { convertToTitleCase } from "../common/index";

export const ODS_PORTAL_URL =
  "https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations";

export const transformPracticeAddress = location => {
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
    postCode,
    town,
    lines,
  };
};
