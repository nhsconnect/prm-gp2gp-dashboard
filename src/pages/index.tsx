import React, { FC } from "react";
import { OrganisationSearch } from "../components/OrganisationSearch";
import { Helmet } from "react-helmet";
import homepageContent from "../data/content/homepage.json";
import { CcgDirectory } from "../components/CcgDirectory";

const Index: FC = () => {
  return (
    <>
      <Helmet>
        <title>GP Registrations Data</title>
        <meta
          name="description"
          content="Search for monthly data about GP2GP transfers for practices in England"
        />
        <noscript>
          {`<style>.gp2gp-practice-search {display: none}</style>`}
        </noscript>
      </Helmet>
      <div className="nhsuk-u-reading-width">
        <h2>{homepageContent.descriptionTitle}</h2>
        <p>{homepageContent.description}</p>
      </div>
      <noscript>
        <CcgDirectory headingPriority={2} />
      </noscript>
      <OrganisationSearch />
    </>
  );
};

export default Index;
