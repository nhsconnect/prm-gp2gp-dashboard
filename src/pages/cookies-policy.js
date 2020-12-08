import React from "react";
import cookiesPolicyContent from "../data/content/cookiesPolicy.json";
import "./cookies-policy.scss";
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
      <details class="nhsuk-details">
        <summary class="nhsuk-details__summary">
          <span class="nhsuk-details__summary-text">
            {cookiesPolicyContent.details.summary}
          </span>
        </summary>
        <div class="nhsuk-details__text">
          <div class="nhsuk-table-responsive">
            <table>
              <thead>
                <tr>
                  <th scope="col">
                    {cookiesPolicyContent.details.table.column1}
                  </th>
                  <th scope="col">
                    {cookiesPolicyContent.details.table.column2}
                  </th>
                  <th scope="col">
                    {cookiesPolicyContent.details.table.column3}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{cookiesPolicyContent.details.table.rows[0][0]}</td>
                  <td>{cookiesPolicyContent.details.table.rows[0][1]}</td>
                  <td>{cookiesPolicyContent.details.table.rows[0][2]}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </details>
    </section>
  );
};

export default CookiesPolicy;
