import React, { FC, ReactNode, useState, useEffect } from "react";
import "react-responsive-modal/styles.css";
import Modal from "react-responsive-modal";
import noScroll from "no-scroll";
import PlaceholderIcon from "../../../assets/placeholderIcon.svg";
import "./index.scss";

type HelpModalProps = {
  content: ReactNode;
};

export const HelpModal: FC<HelpModalProps> = ({ content }) => {
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
        <PlaceholderIcon />
      </button>
      <Modal
        open={isModalOpen}
        onClose={closeModal}
        classNames={{ modal: "gp2gp-modal" }}
        showCloseIcon={false}
        animationDuration={0}
        center
      >
        <div>
          <button onClick={closeModal}>Close</button>
          {content}
        </div>
      </Modal>
    </>
  );
};
