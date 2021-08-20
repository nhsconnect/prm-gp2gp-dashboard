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
      <div className="gp2gp-tabs--tab-titles">
        {tabs.map((tab, index) => (
          <button
            onClick={() => {
              setSelectedTabIndex(index);
            }}
            key={tab.title}
            className={classNames(
              "gp2gp-tabs--tab-title",
              selectedTabIndex === index && "gp2gp-tabs--tab-title__active"
            )}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div className="gp2gp-tabs--tab-content">
        {tabs[selectedTabIndex].content}
      </div>
    </div>
  );
};
