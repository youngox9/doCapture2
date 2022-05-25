import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Button
} from "react-bootstrap";
import ThemeModal from "@/components/Modal/ThemeModal";

const ThemeButton = () => {
  const userInfo = useSelector(state => state?.global?.userInfo || {});
  const [modalInfo, setModalInfo] = useState({ isOpen: false });

  function openUserModal() {
    reset();
    setModalInfo({ isOpen: true, record: userInfo, mode: 'edit' });

  }

  function reset() {
    setModalInfo({ isOpen: false });
  }

  return (
    <>
      <Button variant="icon" onClick={openUserModal}>
        <i className="fas fa-palette" />
      </Button>
      {/* theme modal */}
      <ThemeModal modalInfo={modalInfo} onChange={setModalInfo} />
    </>
  );
};

export default ThemeButton;
