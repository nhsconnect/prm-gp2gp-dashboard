import React, { FC } from "react";
import { OrganisationSearch } from "../components/OrganisationSearch";
import { Helmet } from "react-helmet";
import homepageContent from "../data/content/homepage.json";

const Index: FC = () => (
  <>
    <Helmet title="GP Registrations Data Platform" />
    <h2>{homepageContent.descriptionTitle}</h2>
    <p>{homepageContent.description}</p>
    <OrganisationSearch />
  </>
);

export default Index;
