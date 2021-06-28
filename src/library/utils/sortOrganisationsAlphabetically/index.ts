type OrganisationType = {
  name: string;
  odsCode: string;
  practices?: string[];
  asids?: string[];
};

const getSortLetter = (organisationName: string): string => {
  const indexOfSortLetter = organisationName.startsWith("NHS") ? 4 : 0;
  const sortLetter = organisationName.charAt(indexOfSortLetter).toUpperCase();
  return sortLetter;
};

export const sortOrganisationsAlphabetically = (
  organisationList: OrganisationType[]
): { [key: string]: OrganisationType[] } => {
  organisationList.sort((a, b) => a.name.localeCompare(b.name));

  const alphabetisedOrganisations: { [key: string]: OrganisationType[] } = {};

  organisationList.forEach((organisation) => {
    const sortLetter = getSortLetter(organisation.name);

    const formattedOrganisation = {
      name: organisation.name,
      odsCode: organisation.odsCode,
    };

    if (alphabetisedOrganisations[sortLetter]) {
      alphabetisedOrganisations[sortLetter].push(formattedOrganisation);
    } else {
      alphabetisedOrganisations[sortLetter] = [formattedOrganisation];
    }
  });

  return alphabetisedOrganisations;
};
