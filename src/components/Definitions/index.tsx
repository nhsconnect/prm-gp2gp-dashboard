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
    <h3 id={ariaLabelId}>Transfers received</h3>
    <p>
      All GP2GP transfers that were requested by the practice between the 1st
      and last day of the month and successfully received.
    </p>
    <p>It does not include GP2GP transfers that:</p>
    <ul>
      <li>failed to transfer, or</li>
      <li>were rejected by the receiving practice.</li>
    </ul>
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
  </>
);

export const NotIntegratedWithin8DaysDefinition: FC<DefinitionProps> = ({
  ariaLabelId,
}) => (
  <>
    <h3 id={ariaLabelId}>
      Not integrated within 8 days{" "}
      <span className="gp2gp-title-emphasis">(paper copy sent)</span>
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
    <p className="gp2gp-text-emphasis">
      For the purpose of this site, each transfer is categorised 14 days after
      it started. See Notes about this data to learn more about how we
      categorise transfers.
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

export const DefinitionsContent = () => (
  <div className="nhsuk-u-reading-width">
    <h2 className="nhsuk-u-margin-top-6">Definitions</h2>
    <TransfersReceivedDefinition />
    <IntegratedWithin3DaysDefinition />
    <IntegratedWithin8DaysDefinition />
    <NotIntegratedWithin8DaysDefinition />
  </div>
);
