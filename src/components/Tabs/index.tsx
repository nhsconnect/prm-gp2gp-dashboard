import React, { FC, ReactNode, useState } from "react";
import classNames from "classnames";
import "./index.scss";

type Tab = { title: string; content: ReactNode };

type TabsProps = {
  tabs: Tab[];
};

export const Tabs: FC<TabsProps> = ({ tabs }) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  return (
    <div className="gp2gp-tabs">
      <div className="gp2gp-tabs__tab-titles">
        {tabs.map((tab, index) => (
          <button
            onClick={() => {
              setSelectedTabIndex(index);
            }}
            key={tab.title}
            className={classNames(
              "gp2gp-tabs__tab-title",
              selectedTabIndex === index && "gp2gp-tabs__tab-title--active"
            )}
          >
            <span className="nhsuk-u-visually-hidden">
              Click to display content
            </span>
            {tab.title}
          </button>
        ))}
      </div>
      <div>{tabs[selectedTabIndex].content}</div>
    </div>
  );
};
