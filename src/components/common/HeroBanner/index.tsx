import React, { FC } from "react";
import "./index.scss";

type HeroBannerProps = {
  title: string;
  subtitle: string;
};

export const HeroBanner: FC<HeroBannerProps> = ({ title, subtitle }) => (
  <section className="nhsuk-hero">
    <div className="nhsuk-width-container nhsuk-hero--border">
      <div className="nhsuk-grid-row">
        <div className="nhsuk-grid-column-two-thirds">
          <div className="nhsuk-hero__wrapper">
            <h1 className="nhsuk-u-margin-bottom-3">{title}</h1>
            <p className="nhsuk-body-l nhsuk-u-margin-bottom-0">{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);
