import React, { FC } from "react";
import { OrganisationSearch } from "../components/OrganisationSearch";
import { Helmet } from "react-helmet";
import { ICBDirectory } from "../components/IcbDirectory";

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
        <h2>About</h2>
        <p>
          This site provides monthly data about GP2GP transfers requested by
          practices in England. The data can be viewed for individual practices
          or grouped by Integrated Care Board (ICB).
        </p>
      </div>
      <OrganisationSearch />
      <div className="nhsuk-u-reading-width nhsuk-u-padding-bottom-2">
        <h2 className="nhsuk-u-padding-top-4">What you can find out</h2>
        <p>
          This site <strong>provides</strong> data about
        </p>
        <ul>
          <li>
            GP2GP transfers for registering practices
            <ul>
              <li>
                percentage of transfers that were successfully received via
                GP2GP
              </li>
              <li>percentage of transfers that failed for technical reasons</li>
              <li>integration times for received transfers</li>
            </ul>
          </li>
          <li>GP2GP transfers between practices in England only</li>
        </ul>
        <h2>What this data can’t tell you</h2>
        <p>
          This site <strong>does not provide</strong> data about
        </p>
        <ul>
          <li>GP2GP transfers for deducting practices </li>
          <li>
            registrations that are not eligible for GP2GP. For example:
            <ul>
              <li>the previous practice was in Wales or Scotland</li>
              <li>registrations to and from the armed forces</li>
              <li>there is no previous practice registered, for any reason</li>
            </ul>
          </li>
          <li>
            registrations that had a technical issue before GP2GP was triggered
          </li>
          <li>transfers between SystmOne practices that do not go via GP2GP</li>
        </ul>
      </div>
      <noscript>
        <ICBDirectory headingPriority={2} />
      </noscript>
    </>
  );
};

export default Index;
