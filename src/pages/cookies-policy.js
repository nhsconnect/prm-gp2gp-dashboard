import React from "react";
import { Helmet } from "react-helmet";
import Details from "../components/Details";
import cookiesPolicyContent from "../data/content/cookiesPolicy.json";

const CookiesPolicy = () => {
  const { title, section1, section2, details } = cookiesPolicyContent;

  return (
    <>
      <Helmet title="Cookies policy - GP2GP Service Dashboard" />
      <section>
        <h1>{title}</h1>
        <h2>{section1.heading}</h2>
        <p>{section1.text1}</p>
        <p>{section1.text2}</p>
        <p>{section1.text3}</p>
        <h2>{section2.heading}</h2>
        <p>{section2.text1}</p>
        <ul>
          <li>{section2.list.item1}</li>
          <li>{section2.list.item2}</li>
        </ul>
        <p>{section2.text2}</p>
        <p>{section2.text3}</p>
        <Details
          summary={details.summary}
          headers={details.table.headers}
          rows={details.table.rows}
        />
      </section>
    </>
  );
};

export default CookiesPolicy;
