import React, { FC } from "react";
import "./index.scss";

type EmphasisBoxProps = {
  title?: string;
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
