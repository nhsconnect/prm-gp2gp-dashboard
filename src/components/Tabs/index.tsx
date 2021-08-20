import React, { FC, ReactNode, useState } from "react";

type Tab = { title: string; content: ReactNode };

type TabsProps = {
  tabs: Tab[];
};

export const Tabs: FC<TabsProps> = ({ tabs }) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  return (
    <>
      {tabs.map((tab, i) => (
        <button
          onClick={() => {
            setSelectedTabIndex(i);
          }}
          key={tab.title}
          className={`tab-index-${i}`}
        >
          {tab.title}
        </button>
      ))}
      {tabs[selectedTabIndex].content}
    </>
  );
};
