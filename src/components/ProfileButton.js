import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { clearAuth } from "@/reducers/global";
import ProfileModal from "@/components/Modal/ProfileModal";
import PasswordModal from "@/components/Modal/PasswordModal";
import PasswordSetModal from "@/components/Modal/PasswordSetModal";
import ProfilePic from "@/components/ProfilePic";
import Popper from '@/components/Popper';
import useSocket from '@/hooks/useSocket';
import usePermission from '@/hooks/usePermission';


/**
 * navbar 個人資料按鈕
 */
const ProfileButton = () => {
  const { t } = useTranslation();
  const [modalInfo, setModalInfo] = useState({ isOpen: false });
  const [pwdModalInfo, setPwdModalInfo] = useState({ isOpen: false });
  const [pwdSetModalInfo, setPwdSetModalInfo] = useState({ isOpen: false });

  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const authType = location.pathname.includes('/admin') ? 'back' : 'fore';
  const userInfo = useSelector(state => state?.global?.userInfo || {});
  const pic = useSelector(state => state?.global?.pic || '');
  const uid = useSelector(state => state?.global?.ayth?.uid || '');

  const {
    hasPassword = true, email = '', firstName = '', lastName = ''
  } = userInfo;

  const { permissionData } = usePermission();

  const {
    send,
  } = useSocket();

  async function onSignout() {
    send('LO001', 'Log out', uid);
    dispatch(clearAuth());
    history.push("/login");
  }

  function openUserModal() {
    reset();
    setModalInfo({ isOpen: true, record: userInfo, mode: 'edit' });

  }
  function openPasswordModal() {
    reset();
    setPwdModalInfo({ isOpen: true });
  }

  function openSetPasswordModal() {
    reset();
    setPwdSetModalInfo({ isOpen: true });
  }

  function reset() {
    setModalInfo({ isOpen: false });
    setPwdModalInfo({ isOpen: false });
    setPwdModalInfo({ isOpen: false });
  }

  return (
    <>
      <Popper
        width={350}
        component={({ setOpen }) => (
          <div className="profile-menu">
            <div className="profile">
              <ProfilePic />
              <p className="tit">{email}</p>
              <p className="des">
                {firstName} {lastName}
              </p>
            </div>
            <div className="devider" />
            <div className="spacer" vertical="true">
              <Button variant="dark" className="btn-full" size="md" onClick={() => { openUserModal(); setOpen(false); }}>
                {t('profile')}
              </Button>
              {
                hasPassword
                  ? (
                    <Button variant="dark" className="btn-full" size="md" onClick={() => { openPasswordModal(); setOpen(false); }}>
                      {t('change_password')}
                    </Button>
                  )
                  : (
                    <Button variant="dark" className="btn-full" size="md" onClick={() => { openSetPasswordModal(); setOpen(false); }}>
                      {t('set_password')}
                    </Button>
                  )
              }
            </div>
            <div className="devider" />
            <div className="spacer" vertical="true">
              {authType === 'back'
                && (
                  <Link
                    component={Button}
                    variant="outline-dark"
                    className="btn-full"
                    size="md"
                    to="/"
                  >
                    {t('user_page')}
                  </Link>
                )}
              {
                authType === 'fore' && permissionData['/#/admin/*']
                && (
                  <Link
                    component={Button}
                    variant="outline-danger"
                    className="btn-full"
                    size="md"
                    to="/admin"
                  >
                    {t('admin_page')}
                  </Link>
                )
              }
              <Button
                className="btn-full"
                variant="outline-dark"
                size="md"
                onClick={onSignout}
              >
                {t('sign_out')}
              </Button>
            </div>
          </div>
        )}
      >
        <div className="spacer">
          <hr vertical="true" white="true" />
          <Button variant="icon">
            <div className="profile-icon" style={{ backgroundImage: `url(${pic})` }} />
            <span style={{ color: 'white' }}>{`${firstName} ${lastName}`}</span>
          </Button>
        </div>
      </Popper>
      <ProfileModal modalInfo={modalInfo} onChange={setModalInfo} />
      <PasswordModal modalInfo={pwdModalInfo} onChange={setPwdModalInfo} />
      <PasswordSetModal modalInfo={pwdSetModalInfo} onChange={setPwdSetModalInfo} />
    </>
  );
};

export default ProfileButton;
