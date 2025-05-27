import { graphql } from "gatsby";

export const sicblQueryFragment = graphql`
  fragment SICBLQueryFragment on OrganisationsJsonSicbls {
    name
    odsCode
  }
`;

export const practiceOrganisationMetadataFragment = graphql`
  fragment PracticeOrganisationMetadataFragment on OrganisationsJsonPractices {
    name
    odsCode
    sicblName
    sicblOdsCode
  }
`;

export const metricsMetadataFragment = graphql`
  fragment MetricsMetadataFragment on OrganisationsJsonPracticesMetrics {
    month
    year
  }
`;

export const practiceDownloadFragment = graphql`
  fragment PracticeDownloadFragment on OrganisationsJsonPractices {
    ...PracticeOrganisationMetadataFragment
    metrics {
      ...MetricsMetadataFragment
      requestedTransfers {
        requestedCount
        receivedCount
        receivedPercentOfRequested
        integratedWithin3DaysCount
        integratedWithin3DaysPercentOfReceived
        integratedWithin8DaysCount
        integratedWithin8DaysPercentOfReceived
        notIntegratedWithin8DaysTotal
        notIntegratedWithin8DaysPercentOfReceived
        failuresTotalCount
        failuresTotalPercentOfRequested
      }
    }
  }
`;

export const practiceIntegrationTimesFragment = graphql`
  fragment PracticeIntegrationTimesFragment on OrganisationsJsonPractices {
    ...PracticeOrganisationMetadataFragment
    metrics {
      ...MetricsMetadataFragment
      requestedTransfers {
        receivedCount
        integratedWithin3DaysCount
        integratedWithin3DaysPercentOfReceived
        integratedWithin8DaysCount
        integratedWithin8DaysPercentOfReceived
        notIntegratedWithin8DaysTotal
        notIntegratedWithin8DaysPercentOfReceived
      }
    }
  }
`;

export const practiceTransfersRequestedFragment = graphql`
  fragment PracticeTransfersRequestedFragment on OrganisationsJsonPractices {
    ...PracticeOrganisationMetadataFragment
    metrics {
      ...MetricsMetadataFragment
      requestedTransfers {
        requestedCount
        receivedCount
        receivedPercentOfRequested
        failuresTotalCount
        failuresTotalPercentOfRequested
      }
    }
  }
`;
