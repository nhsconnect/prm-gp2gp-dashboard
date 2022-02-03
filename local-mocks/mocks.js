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

const practiceWithNoIntegrations = {
  Organisation: {
    Name: "Test GP Practice With no Integrations",
    OrgId: {
      extension: "A12346",
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
  practiceWithNoIntegrations,
};
