import React, { FC, ReactNode, useState, useEffect } from "react";
import "react-responsive-modal/styles.css";
import Modal from "react-responsive-modal";
import noScroll from "no-scroll";
import QuestionMark from "../../../assets/questionMark.svg";
import "./index.scss";

type HelpModalProps = {
  ariaLabelledBy: string;
  iconHiddenDescription: string;
  content: ReactNode;
};

export const HelpModal: FC<HelpModalProps> = ({
  ariaLabelledBy,
  iconHiddenDescription,
  content,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      noScroll.on();
    }

    return () => noScroll.off();
  }, [isModalOpen]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button onClick={openModal} className="gp2gp-open-modal">
        <QuestionMark />
        <span className="nhsuk-u-visually-hidden">{iconHiddenDescription}</span>
      </button>
      <Modal
        open={isModalOpen}
        onClose={closeModal}
        classNames={{ modal: "gp2gp-modal" }}
        ariaLabelledby={ariaLabelledBy}
        showCloseIcon={false}
        animationDuration={0}
        center
      >
        <div className="gp2gp-modal__close-btn-container">
          <button onClick={closeModal} className="gp2gp-modal__close-btn">
            Close
          </button>
        </div>
        <div className="gp2gp-modal__content">{content}</div>
      </Modal>
    </>
  );
};
