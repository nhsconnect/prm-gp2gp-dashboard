const organisations = {
  Organisations: [
    {
      Name: "Test GP Practice with Integrations",
      OrgId: "A12345",
      TargetOrgId: "A12345",
      Status: "Active",
      OrgRecordClass: "RC1",
      PostCode: "BL3 5DP",
      LastChangeDate: "2019-12-03",
      PrimaryRoleId: "RO177",
      PrimaryRoleDescription: "PRESCRIBING COST CENTRE",
      OrgLink:
        "https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations/A12345",
    },
    {
      Name: "Test GP Practice with no Integrations",
      OrgId: "A12346",
      TargetOrgId: "A12346",
      Status: "Active",
      OrgRecordClass: "RC1",
      PostCode: "BL4 0JR",
      LastChangeDate: "2016-04-20",
      PrimaryRoleId: "RO177",
      PrimaryRoleDescription: "PRESCRIBING COST CENTRE",
      OrgLink:
        "https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations/A12346",
    },
    {
      Name: "Test GP Practice with some Integrations",
      OrgId: "A12347",
      TargetOrgId: "A12347",
      Status: "Active",
      OrgRecordClass: "RC1",
      PostCode: "BL4 0JR",
      LastChangeDate: "2016-04-20",
      PrimaryRoleId: "RO177",
      PrimaryRoleDescription: "PRESCRIBING COST CENTRE",
      OrgLink:
        "https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations/A12347",
    },
  ],
};

const practiceWithIntegrations = {
  Organisation: {
    Name: "Test GP Practice With Integrations",
    OrgId: {
      extension: "A12345",
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

const practicesWithSomeIntegrations = {
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
  organisations,
  practiceWithIntegrations,
  practicesWithSomeIntegrations,
};
