import React, { FC } from "react";
import OrganisationSearch from "../components/OrganisationSearch";
import HeroBanner from "../components/HeroBanner/";
import { Helmet } from "react-helmet";
import content from "../data/content/homepage.json";
import FeedbackBanner from "../components/FeedbackBanner";

const Index: FC = () => (
  <>
    <Helmet title="GP Registrations Data Platform" />
    <HeroBanner title={content.title} subtitle={content.subtitle} />
    <div className="nhsuk-width-container">
      <main className="nhsuk-main-wrapper">
        <h2 className="nhsuk-heading-l">{content.descriptionTitle}</h2>
        <p>{content.description}</p>
        <OrganisationSearch />
        <FeedbackBanner />
      </main>
    </div>
  </>
);

export default Index;
