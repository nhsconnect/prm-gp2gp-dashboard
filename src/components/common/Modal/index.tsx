import React, { FC, ReactNode, useState } from "react";
import AriaModal from "react-aria-modal";
import PlaceholderIcon from "../../../assets/placeholderIcon.svg";
import "./index.scss";

type ModalProps = {
  titleText: string;
  content: ReactNode;
};

export const Modal: FC<ModalProps> = ({ titleText, content }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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

      {isModalOpen && (
        <AriaModal
          titleText={titleText}
          initialFocus="#close-modal"
          onExit={closeModal}
        >
          <div className="gp2gp-modal">
            <button id="close-modal" onClick={closeModal}>
              Close
            </button>
            {content}
          </div>
        </AriaModal>
      )}
    </>
  );
};
