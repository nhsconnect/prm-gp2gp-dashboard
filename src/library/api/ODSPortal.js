import { convertToTitleCase } from "../utils/convertToTitleCase/index";

export const ODS_PORTAL_URL =
  process.env.GATSBY_ACTIVE_ENV === "dev"
    ? "http://localhost:3000/organisations"
    : "https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations";

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
