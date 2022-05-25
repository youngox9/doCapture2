import React, { useEffect, useState } from "react";


import { Modal, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useTranslation, Trans } from "react-i18next";
import axios from "@/utils/axios";
import useForm, { FormItem, getRulesData } from "@/hooks/useForm";


/**
 * resend email modal
 * @param {*} props 
 * @returns 
 */
function ResendModal(props) {
  const { t } = useTranslation();
  const [form, setForm] = useState({});

  const rulesData = getRulesData(form);

  const rules = {
    email: rulesData.email,
  };

  const {
    touchedErrors, errors, isTouched, resetErrors, validation, handleChange
  } = useForm({ form, rules, setForm });

  const { isOpen, onClose = () => { } } = props;

  const { email = '' } = form;

  useEffect(() => {
    if (!isOpen) {
      setForm({});
      resetErrors(false);
    }
  }, [isOpen]);



  /**
   * [GET] resend email 
   */
  async function onSubmit() {
    const isValid = await validation();
    if (isValid) {
      try {
        const res = await axios({
          url: "/auth/resendRegistry",
          method: "GET",
          params: { email },
          withToken: false
        });
        toast(t('check_mailbox'), {
          type: "success"
        });
        onClose();
      } catch (e) {
        console.log(">>>>>", e);
      }
    }
  }

  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      scrollable
      centered
      size="md"
    >
      <Modal.Header closeButton>
        <Modal.Title>{t('resend_vertify_email')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form className="form">
          <div className="row">
            <div className="col col-12">
              <FormItem
                type="vertical"
                label={t('enter_resend')}
                error={touchedErrors.email}>
                <Form.Control
                  size="sm"
                  type="text"
                  value={form.email}
                  placeholder=" "
                  onChange={e => handleChange("email", e.target.value)}
                />
              </FormItem>
            </div>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <div className="spacer" justify="end">
          <Button variant="primary" onClick={onSubmit}>
            {t('resend')}
          </Button>
          <Button variant="outline-dark" onClick={onClose}>
            {t('close')}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default ResendModal;
