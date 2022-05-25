import React, { useState, useEffect } from "react";

import {
  Modal, Form, Button, Col, Row
} from "react-bootstrap";
import { DatePicker } from 'antd';
import moment from 'moment';
import { useStore, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import GoogleLogin from 'react-google-login';
import { useTranslation } from "react-i18next";
import axios from "@/utils/axios";
import useForm, { getRulesData, FormItem } from "@/hooks/useForm";
import ProfilePic from "@/components/ProfilePic";
import { setUserInfo } from "@/reducers/global";

/**
 * navbar/profile modal
 */

function ProfileModal(props) {
  const dispatch = useDispatch();
  const [roleTypeOptions, setRoleTypeOptions] = useState([]);
  const [form, setForm] = useState({});
  const rulesData = getRulesData({ ...form });

  const rules = {
    firstName: rulesData.isRequire,
    lastName: rulesData.isRequire,
  };

  const {
    touchedErrors, resetErrors, validation, handleChange
  } = useForm({ form, rules, setForm });

  const { modalInfo = {}, onChange = () => { }, onUpdate = () => { } } = props;

  const { isOpen = false, record = {} } = modalInfo;

  const { t } = useTranslation();

  const googleId = useSelector(state => state?.global?.googleId || '');

  useEffect(() => {
    if (isOpen) {
      getUserInfo();
    } else {
      setForm({});
      resetErrors();
    }
  }, [isOpen]);

  useEffect(() => {
    getRoleList();
  }, []);

  /** 取得role type 下拉選單 */
  async function getRoleList() {
    try {
      const { data } = await axios({
        url: `/back/roles`,
        method: "GET",
        params: {},
        withError: false
      });
      const options = data.map(obj => ({
        label: obj.name,
        value: obj.id
      }));
      setRoleTypeOptions(options);
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  /** 取得user data */
  async function getUserInfo() {
    try {
      const { data } = await axios({
        url: `/fore/users/profile`,
        method: "GET",
      });
      dispatch(setUserInfo(data));
      setForm(data);
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  /** 編輯 profile data */
  async function onEdit() {
    const isValid = await validation();
    if (isValid) {
      try {
        const data = {
          firstName: form.firstName || '',
          lastName: form.lastName || '',
          // roleId: form.roleType || '',
          birthday: form.birthday || '',
          country: form.country || '',
          city: form.city || '',
          phone: form.phone || '',
          company: form.company || '',
          department: form.department || '',
          jobTitle: form.jobTitle || ''
        };
        const res = await axios({
          url: `/fore/users/profile`,
          method: "PUT",
          data
        });
        toast(t('alert_update_success'), {
          type: "success"
        });
        onClose();
      } catch (e) {
        console.log(">>>>>", e);
      }
    }
  }

  /** 關閉 modal */
  function onClose() {
    onUpdate();
    getUserInfo();
    onChange({ ...modalInfo, isOpen: false });
  }

  /**
   * 綁定google
   * @param {*} response 由google server端回應的user data
   */
  async function onBindGoogle(response) {
    const { accessToken } = response;
    try {
      const { data } = await axios({
        url: "/fore/auth/binding",
        method: "POST",
        data: {
          accessToken,
          loginType: "google"
        },
      });
      getUserInfo();
    } catch (e) {
      console.log(e);
    }
  }

  /**
 * 解除綁定google
 */
  async function onUnBindGoogle() {
    try {
      const { data } = await axios({
        url: "/fore/auth/binding",
        method: "DELETE",
        data: {
          loginType: "google"
        },
      });
      getUserInfo();
    } catch (e) {
      console.log(e);
    }
  }



  // const roleTypeOpt = roleTypeOptions.find(
  //   o => o.value === form?.roleId
  // ) || { label: form.roleName, value: form.roleId };


  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      scrollable
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>{t('profile')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form className="form">
          <div className="container">
            <Row className="row">
              <Col sm="12" md="4" className="float-profile">
                <ProfilePic size="50%" />
              </Col>
              <Col sm="12" md="8">
                <FormItem label={t('firstName')} error={touchedErrors.firstName} isRequire>
                  <Form.Control
                    size="sm"
                    value={form.firstName}
                    onChange={e => handleChange("firstName", e.target.value)}
                  />
                </FormItem>
                <FormItem label={t('lastName')} error={touchedErrors.lastName} isRequire>
                  <Form.Control
                    size="sm"
                    value={form.lastName}
                    onChange={e => handleChange("lastName", e.target.value)}
                  />
                </FormItem>
                {/* <FormItem label={t('role_type')} error={touchedErrors.roleId} isRequire>
                  <Select
                    options={roleTypeOptions}
                    value={roleTypeOpt}
                    onChange={opt => handleChange("roleId", opt.value)}
                  />
                </FormItem> */}
                {/* <FormItem label="Email" error={touchedErrors.email} isRequire>
                  <Form.Control
                    size="sm"
                    value={form.email}
                    onChange={e => handleChange("email", e.target.value)}
                  />
                </FormItem> */}
                <FormItem label={t('birthday')} error={touchedErrors.birthday}>
                  <DatePicker
                    format="YYYY/MM/DD"
                    onChange={(m, value) => handleChange("birthday", value)}
                    value={form.birthday ? moment(form.birthday) : undefined}
                  />
                </FormItem>
                <FormItem label={t('phone')} error={touchedErrors.phone}>
                  <Form.Control
                    size="sm"
                    value={form.phone}
                    onChange={e => handleChange("phone", e.target.value)}
                  />
                </FormItem>
              </Col>
              <Col sm="12">
                <Row>
                  <Col sm="12" md="6">
                    <FormItem label={t('country')}>
                      <Form.Control
                        size="sm"
                        value={form.country}
                        onChange={e => handleChange("country", e.target.value)}
                      />
                    </FormItem>
                  </Col>
                  <Col sm="12" md="6">
                    <FormItem label={t('city')}>
                      <Form.Control
                        size="sm"
                        value={form.city}
                        onChange={e => handleChange("city", e.target.value)}
                      />
                    </FormItem>
                  </Col>
                </Row>
                <FormItem label={t('company')}>
                  <Form.Control
                    size="sm"
                    value={form.company}
                    onChange={e => handleChange("company", e.target.value)}
                  />
                </FormItem>
                <FormItem label={t('department')}>
                  <Form.Control
                    size="sm"
                    value={form.department}
                    onChange={e => handleChange("department", e.target.value)}
                  />
                </FormItem>
                <FormItem label={t('job')}>
                  <Form.Control
                    size="sm"
                    value={form.jobTitle}
                    onChange={e => handleChange("jobTitle", e.target.value)}
                  />
                </FormItem>
                <FormItem label={" "}>
                  <div className="spacer">
                    <GoogleLogin
                      clientId={googleId}
                      buttonText={t('google_bind')}
                      onSuccess={onBindGoogle}
                      // onFailure={responseGoogle}
                      // cookiePolicy="single_host_origin"
                      disabled={form.googleId}
                    />
                    {form.googleId && (
                      <>
                        <hr vertical="true" />
                        <Button variant="outline-dark" onClick={onUnBindGoogle} size="sm">
                          {t('google_unbind')}
                        </Button>
                      </>
                    )}
                  </div>
                </FormItem>
              </Col>
            </Row>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onEdit}>
          {t('edit')}
        </Button>
        <Button variant="outline-dark" onClick={onClose}>
          {t('close')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ProfileModal;
