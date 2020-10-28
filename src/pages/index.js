import React from "react";
import PracticeSearch from "../components/PracticeSearch";
import { Helmet } from "react-helmet";

const Index = () => (
  <>
    <Helmet title="GP2GP Service Dashboard" />
    <PracticeSearch />
  </>
);

export default Index;
