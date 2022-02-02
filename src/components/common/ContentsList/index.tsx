import React, { FC } from "react";
import "./index.scss";

type ContentsItemsType = { text: string; href?: string };

type ContentsListProps = {
  items?: ContentsItemsType[];
};

const ContentsLink = ({ text, href }: ContentsItemsType) => (
  <li className="nhsuk-contents-list__item">
    <a className="nhsuk-contents-list__link" href={href}>
      {text}
    </a>
  </li>
);

const ContentsCurrent = ({ text }: { text: string }) => (
  <li className="nhsuk-contents-list__item" aria-current="page">
    <span className="nhsuk-contents-list__current">{text}</span>
  </li>
);

export const ContentsList: FC<ContentsListProps> = ({ items }) => (
  <nav
    className="nhsuk-contents-list"
    role="navigation"
    aria-label="List of links to pages"
  >
    <h2>Contents</h2>
    <ol className="nhsuk-contents-list__list">
      {items?.map(({ text, href }, i) => {
        return href ? (
          <ContentsLink text={text} href={href} key={`contents-list-${i}`} />
        ) : (
          <ContentsCurrent text={text} key={`contents-list-${i}`} />
        );
      })}
    </ol>
  </nav>
);
