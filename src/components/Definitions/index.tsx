import React, { FC } from "react";

type DefinitionProps = {
  ariaLabelId?: string;
};

type WhyIntegrateWithin8DaysProps = {
  title?: string;
};

export const TransfersReceivedDefinition: FC<DefinitionProps> = ({
  ariaLabelId,
}) => (
  <>
    <h3 id={ariaLabelId}>GP2GP transfers received</h3>
    <p>
      Total number of GP2GP transfers between the 1st and last day of the month
      that were successfully received by the registering practice.
    </p>
    <p>
      This <strong>includes</strong> transfers that have not been integrated.
    </p>
    <p>
      This <strong>does not include</strong> GP2GP transfers that
    </p>
    <ul>
      <li>failed to transfer, or</li>
      <li>were rejected by the receiving practice</li>
    </ul>
    <p>
      For information about how the data is calculated see the 'Notes about this
      data' section.
    </p>
  </>
);

export const IntegratedWithin3DaysDefinition: FC<DefinitionProps> = ({
  ariaLabelId,
}) => (
  <>
    <h3 id={ariaLabelId}>Integrated within 3 days</h3>
    <p>
      The percentage of transfers received that were integrated (filed or
      suppressed) within 3 days of the record being sent.
    </p>
    <p>
      3 days is considered best practice for integrating or suppressing records
      transferred via GP2GP.
    </p>
    <TimeToIntegrate />
    <p>
      For information about how the data is calculated see the 'Notes about this
      data' section.
    </p>
  </>
);

export const IntegratedWithin8DaysDefinition: FC<DefinitionProps> = ({
  ariaLabelId,
}) => (
  <>
    <h3 id={ariaLabelId}>Integrated within 8 days</h3>
    <p>
      The percentage of transfers received that were integrated (filed or
      suppressed) within 8 days of the record being sent.
    </p>
    <p>
      Integrating within 8 days means that a paper copy of the record is not
      unnecessarily requested.
    </p>
    <TimeToIntegrate />
    <p>
      For information about how the data is calculated see the 'Notes about this
      data' section.
    </p>
  </>
);

export const NotIntegratedWithin8DaysDefinition: FC<DefinitionProps> = ({
  ariaLabelId,
}) => (
  <>
    <h3 id={ariaLabelId}>
      Not integrated within 8 days{" "}
      <span className="gp2gp-title-emphasis">(paper copy requested)</span>
    </h3>
    <p>
      The percentage of transfers received that were not integrated within 8
      days.
    </p>
    <p>This includes transfers that were:</p>
    <ul>
      <li>integrated after 8 days, or</li>
      <li>not integrated when the transfer was categorised.</li>
    </ul>
    <p>
      Not integrating transfers within 8 days increases the amount of paper
      records that your practice will need to process and store.
    </p>
    <TimeToIntegrate />
    <p>
      For information about how the data is calculated see the 'Notes about this
      data' section.
    </p>
  </>
);

export const TimeToIntegrate: FC = () => (
  <>
    <p>
      <strong>Time to integrate</strong>
    </p>
    <p>
      The time to integrate is calculated from the time the GP2GP transfer
      starts to the time the record is integrated by the registering practice.
    </p>
    <p>
      For example, the GP2GP transfer for a record takes 10 minutes. The
      practice integrates the record 2 hours after receiving it. The time to
      integrate would be 2 hours 10 minutes (within 3 days).
    </p>
  </>
);

export const WhyIntegrateWithin8Days: FC<WhyIntegrateWithin8DaysProps> = ({
  title,
}) => (
  <>
    {title && <h4>{title}</h4>}
    <p>
      If transfers are not integrated within 8 days, this increases the quantity
      of paper records your practice will need to process and store.
    </p>
    <p>
      The previous practice will be automatically notified that the record has
      not been integrated, and that a paper copy of the electronic record should
      be printed, to send with the Lloyd George envelope to the new practice.
    </p>
    <p>
      Unnecessary printing causes avoidable work and expense for both your
      practice and the previous practice.
    </p>
  </>
);

export const IntegrationsDefinitionsContent = () => (
  <div className="nhsuk-u-reading-width">
    <h2 className="nhsuk-u-margin-top-6">Definitions</h2>
    <TransfersReceivedDefinition />
    <IntegratedWithin3DaysDefinition />
    <IntegratedWithin8DaysDefinition />
    <NotIntegratedWithin8DaysDefinition />
  </div>
);
