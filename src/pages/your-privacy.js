import { Link } from "gatsby";
import React from "react";
import { Helmet } from "react-helmet";
import privacyContent from "../data/content/privacyContent.json";

const YourPrivacy = () => {
  const {
    title,
    subheading,
    text1,
    list,
    section1,
    section2,
    section3,
    section4,
  } = privacyContent;

  return (
    <>
      <Helmet title="Your Privacy - GP2GP Service Dashboard" />
      <section>
        <h1>{title}</h1>
        <p className="nhsuk-lede-text">{subheading}</p>
        <p>{text1}</p>
        <ul>
          <li>{list.item1}</li>
          <li>{list.item2}</li>
          <li>{list.item3}</li>
          <li>{list.item4}</li>
        </ul>
        <h2>{section1.heading}</h2>
        <p>{section1.text1}</p>
        <h3>{section1.subsection1.heading}</h3>
        <p>{section1.subsection1.text1}</p>
        <p>{section1.subsection1.text2}</p>
        <p>{section1.subsection1.text3}</p>
        <p>
          <Link to="/cookies-policy">{section1.subsection1.cookieLink}</Link>{" "}
          {section1.subsection1.text4}
        </p>
        <p>{section1.subsection1.text5}</p>
        <h2>{section2.heading}</h2>
        <p>{section2.text1}</p>
        <p>{section2.text2}</p>
        <h2>{section3.heading}</h2>
        <p>{section3.text1}</p>
        <h3>{section3.subsection1.heading}</h3>
        <p>{section3.subsection1.text1}</p>
        <p>{section3.subsection1.text2}</p>
        <p>{section3.subsection1.text3}</p>
        <h2>{section4.heading}</h2>
        <p>{section4.text1}</p>
        <ul>
          <li>
            {section4.list.item1}{" "}
            <a href="mailto:gp2gp@nhs.net">{section4.list.email}</a>
          </li>
          <li>
            {section4.list.item2.text1}
            <a href="https://ico.org.uk/">{section4.list.item2.link}</a>
            {section4.list.item2.text2}
          </li>
        </ul>
        <p>{section4.text2}</p>
      </section>
    </>
  );
};

export default YourPrivacy;
