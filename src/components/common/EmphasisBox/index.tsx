import React, { FC, ReactNode } from "react";
import "./index.scss";

type EmphasisBoxProps = {
  title?: string;
  children?: ReactNode;
};

export const EmphasisBox: FC<EmphasisBoxProps> = ({ title, children }) => {
  return (
    <div className="gp2gp-emphasis-box">
      {!!title && <h3 className="gp2gp-emphasis-box__heading">{title}</h3>}
      <div>{children}</div>
    </div>
  );
};
