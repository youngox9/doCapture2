import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Modal, Form, Button, Row, Col
} from "react-bootstrap";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import axios from "@/utils/axios";
import UserSelect from "@/components/UserSelect";
import InviteUserModal from "@/components/Modal/InviteUserModal";
import useForm, { getRulesData, FormItem } from "@/hooks/useForm";

/**
 * User Workspace create/edit modal
 * @param {*} props 
 * @returns 
 */
function WorkspaceModal(props) {
  const { t } = useTranslation();
  const userInfo = useSelector(state => state?.global?.userInfo || {});
  const { modalInfo = {}, onChange = () => { }, onUpdate = () => { } } = props;
  const { isOpen = false, mode = "create", record = {} } = modalInfo;

  const [ownerValue, setOwnerValue] = useState({});
  const [membersValue, setMembersValue] = useState([]);

  const [form, setForm] = useState({
    ownerId: '',
    name: '',
    remark: '',
    memberIds: []
  });

  const [inviteModalInfo, setInviteModalInfo] = useState({ isOpen: false });
  const rulesData = getRulesData(form);
  const rules = {
    name: rulesData.isRequire
  };
  const {
    touchedErrors, resetErrors, validation, handleChange
  } = useForm({ form, rules, setForm });

  const {
    owner = userInfo.firstName,
    ownerId,
    id: workspaceId,
    members = []
  } = record;

  useEffect(() => {
    if (isOpen) {
      setForm({ ...record });
      const newMembers = members.map(obj => ({ label: obj.name, value: obj.id }));
      setOwnerValue({ label: owner, value: ownerId });
      setMembersValue(newMembers);
    } else {
      resetErrors(false);
      setForm({});
      setOwnerValue({});
      setMembersValue([]);
    }
  }, [isOpen, JSON.stringify(record)]);


  /**
   * [POST] craete workspace
   */
  async function onCreate() {
    const isValid = await validation();
    if (isValid) {
      try {
        const memberIds = membersValue.map(obj => obj.value);
        const { data } = await axios({
          url: `/fore/workspaces`,
          method: "POST",
          data: {
            ownerId: ownerValue.value || '',
            name: form.name || '',
            remark: form.remark || '',
            memberIds: memberIds || []
          }
        });
        toast(t('alert_create_success'), {
          type: "success"
        });
        console.log("data >>>>", data);
        onClose();
      } catch (e) {
        console.log(">>>>>", e);
      }
    }
  }

  /**
   * [PUT] edit workspace
   */
  async function onEdit() {
    const isValid = await validation();
    if (isValid) {
      try {
        const memberIds = membersValue.map(obj => obj.value);
        const { data } = await axios({
          url: `/fore/workspaces/${workspaceId}`,
          method: "PUT",
          data: {
            ownerId: ownerValue.value || '',
            name: form.name,
            remark: form.remark,
            memberIds
          }
        });

        toast(t('alert_update_success'), {
          type: "success"
        });
        console.log("data >>>>", data);
        onClose();
      } catch (e) {
        console.log(">>>>>", e);
      }
    }
  }


  /**
   * close workspace modal
   */
  function onClose() {
    onChange({ ...modalInfo, isOpen: false });
    onUpdate();
  }

  const ownerName = owner || `${userInfo.firstName} ${userInfo.lastName}`;
  return (
    <>
      <Modal
        show={modalInfo.isOpen}
        onHide={onClose}
        scrollable
        centered
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title>{t(mode)} {t('workspaces')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <Form className="form">
              <FormItem label={t('name')} error={touchedErrors.name} isRequire>
                <Form.Control
                  size="sm"
                  value={form.name}
                  onChange={e => handleChange("name", e.target.value)}
                />
              </FormItem>
              <FormItem label={t('owner')}>
                <p>{ownerName}</p>
              </FormItem>
              <FormItem
                label={t('members')}
                error={touchedErrors.method}
              >
                <Row no-gutter>
                  <Col>
                    <UserSelect
                      isMulti
                      value={membersValue}
                      onChange={setMembersValue}
                      showDefault={false}
                      style={{ width: '100%' }}
                    />
                  </Col>
                  {mode === 'edit'
                    && (
                      <Col sm="auto">
                        <Button variant="icon" onClick={() => setInviteModalInfo({ isOpen: true, record })}>
                          <i className="fas fa-user-plus" />
                        </Button>
                      </Col>
                    )}
                </Row>

              </FormItem>
              <FormItem label={t('remark')} error={touchedErrors.remark}>
                <Form.Control
                  size="sm"
                  as="textarea"
                  value={form.remark}
                  onChange={e => handleChange("remark", e.target.value)}
                />
              </FormItem>
            </Form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {mode === "create" && (
            <Button variant="primary" onClick={onCreate}>
              {t('create')}
            </Button>
          )}
          {mode === "edit" && (
            <Button variant="primary" onClick={onEdit}>
              {t('edit')}
            </Button>
          )}
          <Button variant="outline-dark" onClick={onClose}>
            {t('close')}
          </Button>
        </Modal.Footer>
      </Modal>
      <InviteUserModal modalInfo={inviteModalInfo} onChange={setInviteModalInfo} />
    </>
  );
}

export default WorkspaceModal;
