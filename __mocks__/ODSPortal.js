export const response = {
  Organisation: {
    Name: "MARKET SQUARE SURGERY",
    Date: [
      {
        Type: "Operational",
        Start: "2000-09-01",
      },
    ],
    OrgId: {
      root: "2.16.840.1.113883.2.1.3.2.4.18.48",
      assigningAuthorityName: "HSCIC",
      extension: "F81749",
    },
    Status: "Active",
    LastChangeDate: "2019-12-03",
    orgRecordClass: "RC1",
    GeoLoc: {
      Location: {
        AddrLn1: "WALTHAM ABBEY HEALTH CTRE",
        AddrLn2: "13 SEWARDSTONE ROAD",
        Town: "WALTHAM ABBEY",
        County: "ESSEX",
        PostCode: "EN9 1NP",
        Country: "ENGLAND",
      },
    },
    Contacts: {
      Contact: [
        {
          type: "tel",
          value: "01992 707130",
        },
      ],
    },
    Roles: {
      Role: [
        {
          id: "RO177",
          uniqueRoleId: 79992,
          primaryRole: true,
          Date: [
            {
              Type: "Operational",
              Start: "2000-09-01",
            },
          ],
          Status: "Active",
        },
        {
          id: "RO76",
          uniqueRoleId: 183493,
          Date: [
            {
              Type: "Operational",
              Start: "2014-04-15",
            },
          ],
          Status: "Active",
        },
      ],
    },
    Rels: {
      Rel: [
        {
          Date: [
            {
              Type: "Operational",
              Start: "2019-10-01",
            },
          ],
          Status: "Active",
          Target: {
            OrgId: {
              root: "2.16.840.1.113883.2.1.3.2.4.18.48",
              assigningAuthorityName: "HSCIC",
              extension: "U56676",
            },
            PrimaryRoleId: {
              id: "RO272",
              uniqueRoleId: 388365,
            },
          },
          id: "RE8",
          uniqueRelId: 613959,
        },
        {
          Date: [
            {
              Type: "Operational",
              Start: "2013-04-01",
            },
          ],
          Status: "Active",
          Target: {
            OrgId: {
              root: "2.16.840.1.113883.2.1.3.2.4.18.48",
              assigningAuthorityName: "HSCIC",
              extension: "07H",
            },
            PrimaryRoleId: {
              id: "RO98",
              uniqueRoleId: 161360,
            },
          },
          id: "RE4",
          uniqueRelId: 254055,
        },
        {
          Date: [
            {
              Type: "Operational",
              Start: "2006-10-01",
              End: "2013-03-31",
            },
          ],
          Status: "Inactive",
          Target: {
            OrgId: {
              root: "2.16.840.1.113883.2.1.3.2.4.18.48",
              assigningAuthorityName: "HSCIC",
              extension: "5PV",
            },
            PrimaryRoleId: {
              id: "RO179",
              uniqueRoleId: 119639,
            },
          },
          id: "RE4",
          uniqueRelId: 254054,
        },
        {
          Date: [
            {
              Type: "Operational",
              Start: "2000-09-01",
              End: "2006-09-30",
            },
          ],
          Status: "Inactive",
          Target: {
            OrgId: {
              root: "2.16.840.1.113883.2.1.3.2.4.18.48",
              assigningAuthorityName: "HSCIC",
              extension: "5AJ",
            },
            PrimaryRoleId: {
              id: "RO179",
              uniqueRoleId: 42373,
            },
          },
          id: "RE4",
          uniqueRelId: 254053,
        },
      ],
    },
  },
};
