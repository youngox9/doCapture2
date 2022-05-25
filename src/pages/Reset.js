import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import {
  useHistory, useLocation
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "@/utils/axios";

import useForm, { FormItem, getRulesData } from "@/hooks/useForm";
import { comfirm, parseUrl } from "@/utils";
import Logo from '@/static/logo.png';

function Reset() {
  const { t } = useTranslation();
  const location = useLocation();
  const { code } = parseUrl(location.search);

  console.log('>>>> code', code);

  const [form, setForm] = useState({
    password: "",
    password2: ""
  });
  const history = useHistory();

  const rulesData = getRulesData(form);
  const rules = {
    password: rulesData.password,
    password2: rulesData.password2,
  };

  const {
    touchedErrors,
    validation,
    handleChange
  } = useForm({ form, rules, setForm });


  useEffect(() => {
    if (!code) {
      history.push('/login');
    }
  }, []);


  /**
   * [POST] reset password
   * @returns 
   */
  async function onSubmit() {
    const isValid = await validation();
    if (isValid) {
      try {
        const { data } = await axios({
          url: "/auth/resetPassword",
          method: "POST",
          data: {
            password: form.password,
            code
          },
          withToken: false
        });
        // 成功後跳出comfirm視窗，確認後導回首頁
        comfirm({
          type: 'success',
          title: t('alert_reset_success'),
          des: t('alert_login_again'),
          showClose: false,
          callback: () => {
            history.push('/login');
          }
        });
      } catch (e) {
        console.log('e >>>>', e);
      }
    }
  }

  return (
    <>
      <div className="full-page-container">
        <div className="full-page-inner" type="sm">
          <img className="logo" src={Logo} />
          <div className="full-page-box" type="sm">
            <Form>
              <h4 className="text-center mb-4">{t('reset_password')}</h4>
              <FormItem label={t('password')} error={touchedErrors.password} type="vertical" isRequire>
                <Form.Control
                  size="sm"
                  type="password"
                  value={form.password}
                  onChange={e => handleChange("password", e.target.value)}
                />
              </FormItem>
              <FormItem label={t('comfirm_password')} error={touchedErrors.password2} type="vertical" isRequire>
                <Form.Control
                  size="sm"
                  type="password"
                  value={form.password2}
                  onChange={e => handleChange("password2", e.target.value)}
                />
              </FormItem>
            </Form>
            <div className="spacer mt-3" justify="center">
              <Button variant="primary" className="btn-full" onClick={onSubmit}>
                {t('reset')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Reset;
