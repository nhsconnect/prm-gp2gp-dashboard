import React, { FC, ReactNode, useState } from "react";
import classNames from "classnames";

type Tab = { title: string; content: ReactNode };

type TabsProps = {
  tabs: Tab[];
};

export const Tabs: FC<TabsProps> = ({ tabs }) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  return (
    <>
      {tabs.map((tab, index) => (
        <button
          onClick={() => {
            setSelectedTabIndex(index);
          }}
          key={tab.title}
          className={classNames(
            "gp2gp-tab",
            selectedTabIndex === index && "gp2gp-active-tab"
          )}
        >
          {tab.title}
        </button>
      ))}
      {tabs[selectedTabIndex].content}
    </>
  );
};
