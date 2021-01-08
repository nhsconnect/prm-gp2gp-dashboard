import React, { FC } from "react";
import OrganisationSearch from "../components/OrganisationSearch";
import { Helmet } from "react-helmet";

const Index: FC = () => (
  <>
    <Helmet title="GP2GP Service Dashboard" />
    <OrganisationSearch />
  </>
);

export default Index;
