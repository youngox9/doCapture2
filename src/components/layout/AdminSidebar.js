import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Link, useParams, useLocation
} from "react-router-dom";
import {
  Nav
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import useAuth from "@/hooks/useAuth";
import NavLinkCollapse from './NavLinkCollapse';
import SidebarCollapseButton from './SidebarCollapseButton';

const Sidebar = ({ children }) => {
  useAuth();
  const { pathname = '' } = useLocation();
  const global = useSelector(state => state.global);
  const permission = useSelector(state => state?.global?.permission || []);
  const { t } = useTranslation();

  function checkPermission(path = []) {
    return path.some(p => permission.find(o => o.path === p));
  }

  function checkPath(path = []) {
    return path.some(p => pathname.includes(p));
  }

  return (
    <div className="sidebar">
      <div className="logo" />
      <div className="menu">
        <ul className="nav nav-pills">
          {
            checkPermission(['/#/admin/accounts'])
            && (
              <Nav.Item>
                <Link
                  component={Nav.Link}
                  to="/admin/accounts"
                  active={checkPath(["/accounts"])}
                >
                  <i className="fas fa-users" />
                  <span>{t('accounts')}</span>
                </Link>
              </Nav.Item>
            )
          }
          <NavLinkCollapse
            label={t('authority')}
            icon="fas fa-unlock"
            show={checkPermission(['/#/admin/roles', '/#/admin/features/', '/#/admin/permission'])}
          >
            <ul className="nav nav-pills">
              {checkPermission(['/#/admin/roles'])
                && (
                  <Nav.Item>
                    <Link
                      component={Nav.Link}
                      to="/admin/roles"
                      active={checkPath(["/roles"])}
                    >
                      <span>{t('roles')}</span>
                    </Link>
                  </Nav.Item>
                )}
              {checkPermission(['/#/admin/features/'])
                && (
                  <Nav.Item>
                    <Link
                      component={Nav.Link}
                      to="/admin/features"
                      active={checkPath(["/admin/features"])}
                    >
                      <span>{t('features')}</span>
                    </Link>
                  </Nav.Item>
                )}
              {checkPermission(['/#/admin/permission'])
                && (
                  <Nav.Item>
                    <Link
                      component={Nav.Link}
                      to="/admin/permission"
                      active={checkPath(["/admin/permission"])}
                    >
                      <span>{t('permission')}</span>
                    </Link>
                  </Nav.Item>
                )}
            </ul>
          </NavLinkCollapse>
          <NavLinkCollapse
            label={t('setting')}
            icon="fas fa-cog"
            show={checkPermission(['/#/admin/classifier', '/#/admin/workspaces'])}
          >
            <ul className="nav nav-pills">
              {checkPermission(['/#/admin/classifier'])
                && (
                  <Nav.Item>
                    <Link
                      component={Nav.Link}
                      to="/admin/classifier"
                      active={checkPath(["/admin/classifier"])}
                    >

                      <span>{t('classifier')}</span>
                    </Link>
                  </Nav.Item>
                )}
              {checkPermission(['/#/admin/workspaces'])
                && (
                  <Nav.Item>
                    <Link
                      component={Nav.Link}
                      to="/admin/workspaces"
                      active={checkPath(["/admin/workspaces"])}
                    >

                      <span>{t('workspaces')}</span>
                    </Link>
                  </Nav.Item>
                )}
            </ul>
          </NavLinkCollapse>

          <Nav.Item>
            <NavLinkCollapse
              label={t('system')}
              icon="fas fa-wrench"
              show={checkPermission(['/#/admin/upgrade', '/#/admin/license', '/#/admin/service'])}
            >
              <ul className="nav nav-pills">
                {checkPermission(['/#/admin/upgrade'])
                  && (
                    <Nav.Item>
                      <Link
                        component={Nav.Link}
                        to="/admin/upgrade"
                        active={pathname === "/admin/upgrade"}
                      >
                        <span>{t('upgrade')}</span>
                      </Link>
                    </Nav.Item>
                  )}
                {checkPermission(['/#/admin/license'])
                  && (
                    <Nav.Item>
                      <Link
                        component={Nav.Link}
                        to="/admin/license"
                        active={pathname === "/admin/license"}
                      >
                        <span>{t('license')}</span>
                      </Link>
                    </Nav.Item>
                  )}
                {checkPermission(['/#/admin/service'])
                  && (
                    <Nav.Item>
                      <Link
                        component={Nav.Link}
                        to="/admin/service"
                        active={pathname === "/admin/service"}
                      >
                        <span>{t('service')}</span>
                      </Link>
                    </Nav.Item>
                  )}
              </ul>
            </NavLinkCollapse>
          </Nav.Item>
          {checkPermission(['/#/admin/debuglogs']) && (
            <Nav.Item>
              <Link
                component={Nav.Link}
                to="/admin/debuglogs"
                active={checkPath(["/admin/debuglogs"])}
              >
                <i className="fas fa-file-alt" />
                <span>{t('debuglogs')}</span>
              </Link>
            </Nav.Item>
          )}
          <Nav.Item>
            <Link
              component={Nav.Link}
              to="/admin/logs"
              active={checkPath(["/admin/logs"])}
            >
              <i className="fas fa-file-alt" />
              <span>{t('logs')}</span>
            </Link>
          </Nav.Item>
        </ul>
      </div>
      <hr style={{ margin: 0 }} />
      <div className="menu-bottom">
        <ul className="nav nav-pills">
          <Nav.Item>
            <Link
              component={Nav.Link}
              to="/admin/support"
              active={checkPath(["/admin/support"])}
            >
              <i className="fas fa-question-circle" />
              <span>{t('support_requests')}</span>
            </Link>
          </Nav.Item>
          <SidebarCollapseButton />
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
