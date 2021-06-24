const sortOrganisationsAlphabetically = (organisationList) => {
  const alphabetisedOrganisations = {
    a: [],
    b: [],
    c: [],
    d: [],
    e: [],
    f: [],
    g: [],
    h: [],
    i: [],
    j: [],
    k: [],
    l: [],
    m: [],
    n: [],
    o: [],
    p: [],
    q: [],
    r: [],
    s: [],
    t: [],
    u: [],
    v: [],
    w: [],
    x: [],
    y: [],
    z: [],
  };

  organisationList.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });

  organisationList.forEach((organisation) => {
    const firstLetter = organisation.name.charAt(0).toLowerCase();

    alphabetisedOrganisations[firstLetter].push({
      name: organisation.name,
      odsCode: organisation.odsCode,
    });
  });

  return alphabetisedOrganisations;
};

module.exports = sortOrganisationsAlphabetically;
