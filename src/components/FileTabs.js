import React from "react";
import { connect, useSelector } from "react-redux";
import { Nav } from "react-bootstrap";
import { useLocation, useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function FileTabs() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { id: workspaceId } = useParams();

  return (
    <Nav className="table-tabs" variant="tabs" activeKey="files">
      <Nav.Item>
        <Link
          active={pathname.includes("/file") || pathname === "/"}
          component={Nav.Link}
          to={`/file${workspaceId ? `/${workspaceId}` : ""}`}
        >
          {t('files')}
        </Link>
      </Nav.Item>
      <Nav.Item>
        <Link
          active={pathname.includes("/meta") || pathname.includes("/meta_classifier")}
          component={Nav.Link}
          to={`/meta${workspaceId ? `/${workspaceId}` : ""}`}
        >
          {t('meta')}
        </Link>
      </Nav.Item>
    </Nav>
  );
}

export default FileTabs;
