import React, { FC } from "react";
import { Helmet } from "react-helmet";
import { AboutThisDataContent } from "../components/AboutThisDataContent";
import { Expander } from "../components/common/Expander";
import {
  GP2GPTechnicalFailuresDefinition,
  IntegratedWithin3DaysDefinition,
  IntegratedWithin8DaysDefinition,
  NotIntegratedWithin8DaysDefinition,
  RegistrationsTriggeredByGP2GPDefinition,
  TransfersReceivedDefinition,
} from "../components/Definitions";

const DefinitionsAndNotes: FC = () => {
  return (
    <>
      <Helmet>
        <title>
          Definitions and notes about this data - GP Registrations Data
        </title>
        <meta
          name="description"
          content="Definition and notes about this data for GP Registrations Data"
        />
      </Helmet>
      <div className="nhsuk-u-reading-width">
        <h1>Definitions and notes about this data</h1>
        <div>
          <h2>Definitions</h2>
          <div className="nhsuk-expander-group">
            <Expander
              title="Registrations that triggered GP2GP transfer"
              content={<RegistrationsTriggeredByGP2GPDefinition />}
            />
            <Expander
              title="GP2GP transfers received"
              content={<TransfersReceivedDefinition />}
            />
            <Expander
              title="GP2GP technical failures (paper copy requested)"
              content={<GP2GPTechnicalFailuresDefinition />}
            />
            <Expander
              title="Integrated within 3 days"
              content={<IntegratedWithin3DaysDefinition />}
            />
            <Expander
              title="Integrated within 8 days"
              content={<IntegratedWithin8DaysDefinition />}
            />
            <Expander
              title="Not integrated within 8 days (paper copy requested)"
              content={<NotIntegratedWithin8DaysDefinition />}
            />
          </div>
        </div>
        <h2 className="nhsuk-u-margin-top-8">About this data</h2>
        <AboutThisDataContent />
      </div>
    </>
  );
};

export default DefinitionsAndNotes;
