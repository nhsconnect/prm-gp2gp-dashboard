import React, { FC } from "react";
import OrganisationSearch from "../components/OrganisationSearch";
import { Helmet } from "react-helmet";

const Index: FC = () => (
  <>
    <Helmet title="GP Registrations Data Platform" />
    <OrganisationSearch />
  </>
);

export default Index;
