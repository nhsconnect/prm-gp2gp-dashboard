import React, { FC, ReactNode } from "react";
import "./index.scss";

type EmphasisBoxProps = {
  title?: string;
  children?: ReactNode;
};

const EmphasisBox: FC<EmphasisBoxProps> = ({ title, children }) => {
  return (
    <div className="gp2gp-emphasis-box">
      {!!title && (
        <strong role="heading" className="gp2gp-emphasis-box__heading">
          {title}
        </strong>
      )}
      <div>{children}</div>
    </div>
  );
};

export default EmphasisBox;
