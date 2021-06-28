type OrganisationType = {
  name: string;
  odsCode: string;
  practices?: string[];
  asids?: string[];
};

const generateAlphabetisedObject = (): { [index: string]: any[] } => {
  const charCodes = Array.from(Array(26)).map((e, i) => i + 65);

  const alphabetisedObject: { [index: string]: any[] } = {};

  charCodes.forEach((x) => {
    alphabetisedObject[String.fromCharCode(x)] = [];
  });
  return alphabetisedObject;
};

export const sortOrganisationsAlphabetically = (
  organisationList: OrganisationType[]
): { [index: string]: { name: string; odsCode: string }[] } => {
  const alphabetisedOrganisations: {
    [index: string]: { name: string; odsCode: string }[];
  } = generateAlphabetisedObject();

  organisationList.sort((a, b) => a.name.localeCompare(b.name));

  organisationList.forEach((organisation) => {
    const indexOfSortLetter = organisation.name.startsWith("NHS") ? 4 : 0;

    const sortLetter = organisation.name
      .charAt(indexOfSortLetter)
      .toUpperCase();

    alphabetisedOrganisations[sortLetter].push({
      name: organisation.name,
      odsCode: organisation.odsCode,
    });
  });

  return alphabetisedOrganisations;
};
