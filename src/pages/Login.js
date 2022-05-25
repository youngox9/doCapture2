import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, FloatingLabel } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import GoogleLogin, { useGoogleLogout } from 'react-google-login';

import axios from "@/utils/axios";
import SignupModal from "@/components/Modal/SignupModal";
import ForgetModal from "@/components/Modal/ForgetModal";
import ResendModal from "@/components/Modal/ResendModal";
import GlobalButton from "@/components/GlobalButton";

import useForm from "@/hooks/useForm";
import { setAuth } from "@/reducers/global";
import useSocket from "@/hooks/useSocket";
import Logo from '@/static/logo.png';

/**
 * /login  login page
 */
function Login() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const history = useHistory();

  const { send } = useSocket();

  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isForgetModalOpen, setIsForgetModalOpen] = useState(false);
  const [isResendModalOpen, setIsResendModalOpen] = useState(false);

  const [form, setForm] = useState({
    // email: "plustek.notify@msa.hinet.net",
    // password: "123456",
  });

  const googleId = useSelector(state => state?.global?.googleId || '');

  const { signOut } = useGoogleLogout({ clientId: googleId });

  const {
    touchedErrors, errors, isTouched, resetErrors, validation, handleChange
  } = useForm({ form, setForm });

  // clear all notifycation in query
  useEffect(() => {
    toast.dismiss();
    toast.clearWaitingQueue();
  }, []);

  // set form data from cookie
  useEffect(() => {
    setForm({
      remember: Cookies.get("remember") || true,
      email: Cookies.get("email") || '',
      password: Cookies.get("password") || ''
    });
  }, []);

  /**
   * remember account info in cookie
   */
  function rememberAccount() {
    if (form?.remember) {
      Cookies.set("email", form.email, { expires: 7 });
      Cookies.set("password", form.password, { expires: 7 });
    } else {
      clearRemembarAccount();
    }
    Cookies.set("remember", form.password, { expires: 7 });
  }

  /**
 * clear remembered account info in cookie
 */
  function clearRemembarAccount() {
    Cookies.remove("email");
    Cookies.remove("password");
  }

  /**
   * [POST] login api
   * @returns 
   */
  async function onLogin() {
    send("LI001", `log in.`);
    const isValid = await validation();
    if (isValid) {
      try {
        const { data } = await axios({
          url: "/auth/login",
          method: "POST",
          data: {
            ...form
          },
          withToken: false
        });
        // set auth data to redux
        dispatch(setAuth(data));
        // remember account when login 
        rememberAccount();
        history.push('/');
        return data;
      } catch (e) {
        console.log(e);
        clearRemembarAccount();
      }
    }

    return false;
  }

  /**
   * responese by google login
   * @param {*} response google oAuth user data
   */
  async function responseGoogle(response) {
    const { accessToken } = response;
    try {
      const { data } = await axios({
        url: "/auth/loginOAuth",
        method: "POST",
        data: {
          accessToken,
          loginType: "google"
        },
        withToken: false
      });
      signOut();
      dispatch(setAuth(data));
      history.push('/');
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <GlobalButton className="global-btn" size="lg" />
      <div className="full-page-container">
        <div className="full-page-inner">
          <img className="logo" src={Logo} />
          <div className="full-page-box">
            <Form>
              <h4 className="text-center mb-4">{t('welcome_title')}</h4>
              <Form.Group className="mb-3">
                <div className="spacer spacer-full" vertical="true">
                  <FloatingLabel label={t('email')}>
                    <Form.Control
                      type="email"
                      placeholder=" "
                      value={form.email}
                      onChange={e => handleChange("email", e.target.value)}
                      isInvalid={isTouched && !!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {touchedErrors.email}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                  <FloatingLabel label={t('password')}>
                    <Form.Control
                      size="sm"
                      type="password"
                      placeholder=" "
                      value={form.password}
                      onChange={e => handleChange("password", e.target.value)}
                      isInvalid={isTouched && !!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {touchedErrors.password}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                  <div className="spacer spacer-full" justify="space-between">
                    <Form.Check
                      id="remember_me"
                      type="checkbox"
                      label={t('remember_me')}
                      checked={form.remember}
                      onChange={() => handleChange('remember', !form.remember)}
                    />
                    <a
                      className="text-right"
                      onClick={() => setIsForgetModalOpen(true)}
                    >
                      {t('forget_password')}
                    </a>
                  </div>
                  <Button variant="primary" size="lg" className="btn-full" onClick={onLogin}>
                    {t('signin')}
                  </Button>
                  <div className="spacer spacer-full" justify="space-between">
                    <p className="text-center">
                      {t('dont_have_account')}{" "}
                      <a onClick={() => setIsSignupOpen(true)}>{t('signup')}</a>
                    </p>
                    <a
                      className="text-right"
                      onClick={() => setIsResendModalOpen(true)}
                    >
                      {t('resend_vertify_email')}
                    </a>
                  </div>
                </div>
              </Form.Group>
              <div className="devider"><span>{t('or_login_with')}</span></div>
              <div className="row">
                <div className="col">
                  <div className="spacer">
                    <GoogleLogin
                      clientId={googleId}
                      // buttonText="Login By Google"
                      onSuccess={responseGoogle}
                      // onFailure={responseGoogle}
                      cookiePolicy="single_host_origin"
                      isSignedIn
                    />
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
      />
      <ForgetModal
        isOpen={isForgetModalOpen}
        onClose={() => setIsForgetModalOpen(false)}
      />
      <ResendModal
        isOpen={isResendModalOpen}
        onClose={() => setIsResendModalOpen(false)}
      />
    </>
  );
}

export default Login;
