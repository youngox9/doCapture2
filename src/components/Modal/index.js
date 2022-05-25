import React from "react";

import { Modal } from "react-bootstrap";

const CustomModal = props => {
  return (
    <Modal {...props}>
      {props.show ? props.children : null}
    </Modal>
  );
};

// console.log(CustomModal);
// CustomModal.Body = Modal.Body;

export default {
  Modal: CustomModal,
  Body: Modal.Body,
  Dialog: Modal.Dialog,
  Title: Modal.Title,
  Footer: Modal.Footer,
  Header: Modal.Header
};

// default: CustomModal,
// Body: Modal.Body,
// Dialog: Modal.Dialog,
// Title: Modal.Title,
// Footer: Modal.Footer
