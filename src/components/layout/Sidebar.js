import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams, useLocation } from "react-router-dom";
import { Nav } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import NavLinkCollapse from './NavLinkCollapse';
import SidebarCollapseButton from './SidebarCollapseButton';

const Sidebar = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const global = useSelector(state => state.global);
  const permission = useSelector(state => state?.global?.permission || []);
  const { id: workspaceId } = useParams();
  const { ownedWorkspaces, sharedWorkspaces } = global;

  function checkPermission(path = []) {
    return path.some(p => permission.find(o => o.path === p));
  }

  function checkPath(path = []) {
    return path.some(p => pathname === p);
  }

  return (
    <div className="sidebar">
      <div className="logo" />
      <hr style={{ margin: 0 }} />
      <div className="menu">
        <ul className="nav nav-pills">
          <>
            {/* workspaces */}
            <NavLinkCollapse label={t('workspaces')} icon="fas fa-folder">
              <ul className="nav nav-pills">
                <Nav.Item>
                  <Link
                    component={Nav.Link}
                    to="/file"
                    active={!workspaceId && checkPath(['/', '/meta', '/file', '/meta_classifier'])}
                  >
                    <span>{t('my_space')}</span>
                  </Link>
                </Nav.Item>
                {ownedWorkspaces.map(obj => (
                  <Nav.Item>
                    <Link
                      component={Nav.Link}
                      to={`/file/${obj.id}`}
                      active={workspaceId === obj.id}
                    >
                      <span>{obj.name}</span>
                    </Link>
                  </Nav.Item>
                ))}
              </ul>
            </NavLinkCollapse>

            {/* shared space */}
            <NavLinkCollapse
              label={t('shared_space')}
              icon="fas fa-users"
              show={sharedWorkspaces.length > 0}
            >
              <ul className="nav nav-pills">
                {sharedWorkspaces.map(obj => (
                  <Nav.Item>
                    <Link
                      component={Nav.Link}
                      to={`/file/${obj.id}`}
                      active={workspaceId === obj.id}
                    >
                      <span>{obj.name}</span>
                    </Link>
                  </Nav.Item>
                ))}
              </ul>
            </NavLinkCollapse>
          </>
          {/* setting */}
          <Nav.Item>
            <NavLinkCollapse
              label={t('setting')}
              icon="fas fa-cog"
              show={checkPermission(['/#/workspaces', '/#/classifier'])}
            >
              <ul className="nav nav-pills">
                {
                  checkPermission(['/#/workspaces'])
                  && (
                    <Nav.Item>
                      <Link component={Nav.Link} to="/workspaces" active={pathname === "/workspaces"}>
                        <span>{t('workspaces')}</span>
                      </Link>
                    </Nav.Item>
                  )
                }
                {
                  checkPermission(['/#/classifier'])
                  && (
                    <Nav.Item>
                      <Link component={Nav.Link} to="/classifier" active={pathname === "/classifier"}>
                        <span>{t('classifier')}</span>
                      </Link>
                    </Nav.Item>
                  )
                }
              </ul>
            </NavLinkCollapse>
          </Nav.Item>
        </ul>
      </div>
      <hr style={{ margin: 0 }} />
      <Nav className="menu-bottom">
        <SidebarCollapseButton />
      </Nav>
    </div>
  );
};

export default Sidebar;
