import React, { FC } from "react";
import { OrganisationSearch } from "../components/OrganisationSearch";
import { Helmet } from "react-helmet";
import homepageContent from "../data/content/homepage.json";
import { useJavascriptEnabled } from "../library/hooks/useJavascriptEnabled";
import { CcgDirectory } from "../components/CcgDirectory";

const Index: FC = () => {
  const { hasJavascriptEnabled } = useJavascriptEnabled();

  return (
    <>
      <Helmet>
        <title>GP Registrations Data</title>
        <meta
          name="description"
          content="Search for monthly data about GP2GP transfers for practices in England"
        />
      </Helmet>
      <h2>{homepageContent.descriptionTitle}</h2>
      <p>{homepageContent.description}</p>
      {hasJavascriptEnabled ? (
        <OrganisationSearch />
      ) : (
        <CcgDirectory headingPriority={2} />
      )}
    </>
  );
};

export default Index;
