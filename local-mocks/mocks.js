const practiceWithIntegrations = {
  Organisation: {
    Name: "Test GP Practice With Integrations",
    OrgId: {
      extension: "A12345",
    },
    GeoLoc: {
      Location: {
        AddrLn1: "125 Some Address",
        Town: "Some Town",
        County: "Some County",
        PostCode: "BL3 5DP",
        Country: "ENGLAND",
      },
    },
  },
};

const practiceWithAnIntegration = {
  Organisation: {
    Name: "Test GP Practice With An Integration",
    OrgId: {
      extension: "Z12347",
    },
    GeoLoc: {
      Location: {
        Town: "Some Other Town",
        County: "Some Other County",
        PostCode: "BL4 5AA",
        Country: "ENGLAND",
      },
    },
  },
};

const practiceWithSomeIntegrations = {
  Organisation: {
    Name: "Test GP Practice With Some Integrations",
    OrgId: {
      extension: "A12347",
    },
    GeoLoc: {
      Location: {
        AddrLn1: "123 Some Address",
        Town: "Some Town",
        County: "Some County",
        PostCode: "BL3 5DP",
        Country: "ENGLAND",
      },
    },
  },
};

module.exports = {
  practiceWithIntegrations,
  practiceWithSomeIntegrations,
  practiceWithAnIntegration,
};
