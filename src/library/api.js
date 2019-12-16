import axios from "axios";
import startCase from "lodash/startCase";
import toLower from "lodash/toLower";

export const fetchPracticeDataByODSCode = async ODSCode => {
  const response = await axios.get(
    `https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations/${ODSCode}`
  );
  const org = response.data.Organisation;
  const { AddrLn1, AddrLn2, AddrLn3, AddrLn4 } = org.GeoLoc.Location;
  const name = startCase(toLower(org.Name));

  const town = startCase(toLower(org.GeoLoc.Location.Town));
  let lines = [AddrLn1, AddrLn2, AddrLn3, AddrLn4]
    .filter(line => Boolean(line))
    .map(line => startCase(toLower(line)))
    .join(", ");

  return {
    ODSCode: org.OrgId.extension,
    name,
    address: {
      lines,
      postCode: org.GeoLoc.Location.PostCode,
      town,
    },
  };
};
