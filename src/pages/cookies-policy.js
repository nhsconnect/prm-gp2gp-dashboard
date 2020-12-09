import React from "react";
import Details from "../components/Details";
import cookiesPolicyContent from "../data/content/cookiesPolicy.json";

const CookiesPolicy = () => {
  return (
    <section>
      <h1>{cookiesPolicyContent.title}</h1>
      <h2>{cookiesPolicyContent.section1.heading}</h2>
      <p>{cookiesPolicyContent.section1.text1}</p>
      <p>{cookiesPolicyContent.section1.text2}</p>
      <p>{cookiesPolicyContent.section1.text3}</p>
      <h2>{cookiesPolicyContent.section2.heading}</h2>
      <p>{cookiesPolicyContent.section2.text1}</p>
      <ul>
        <li>{cookiesPolicyContent.section2.list.item1}</li>
        <li>{cookiesPolicyContent.section2.list.item2}</li>
      </ul>
      <p>{cookiesPolicyContent.section2.text2}</p>
      <p>{cookiesPolicyContent.section2.text3}</p>
      <Details
        summary={cookiesPolicyContent.details.summary}
        headers={cookiesPolicyContent.details.table.headers}
        rows={cookiesPolicyContent.details.table.rows}
      />
    </section>
  );
};

export default CookiesPolicy;
