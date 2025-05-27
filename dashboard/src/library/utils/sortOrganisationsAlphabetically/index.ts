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
): Map<string, OrganisationType[]> => {
  const alphabetisedOrganisations: Map<string, OrganisationType[]> = new Map();

  organisationList.forEach((organisation) => {
    const sortLetter = getSortLetter(organisation.name);

    const formattedOrganisation = {
      odsCode: organisation.odsCode,
      name: organisation.name,
    };

    const orgsBeginningWithLetter =
      alphabetisedOrganisations.get(sortLetter) || [];

    const updatedOrgsBeginningWithLetter = [
      ...orgsBeginningWithLetter,
      formattedOrganisation,
    ].sort((a, b) => a.name.localeCompare(b.name));

    alphabetisedOrganisations.set(sortLetter, updatedOrgsBeginningWithLetter);
  });

  return new Map([...alphabetisedOrganisations].sort());
};
