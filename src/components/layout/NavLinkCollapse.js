import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Collapse, Nav
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Popper from "@/components/Popper";

const NavLinkCollapse = (props) => {
  const sidebarWidth = useSelector(state => state?.global?.sidebarWidth || 0);
  const {
    children, label, icon, showArrow = true, show = true
  } = props;

  const [isOpen, setIsOpen] = useState(true);
  // const permission = useSelector(state => state?.global?.permission || []);
  const isCollapse = sidebarWidth < 100;

  if (!show) {
    return null;
  }

  if (isCollapse) {
    if (showArrow) {
      return (
        <Popper
          color="dark"
          placement="right"
          component={() => {
            return <>{children}</>;
          }}>
          <Nav.Item>
            <Nav.Link className="nav-link">
              <i className={icon} />
            </Nav.Link>
          </Nav.Item>
        </Popper>
      );
    }
    return (
      <></>
    );
  }
  return (
    <Nav.Item>
      <Nav.Link className="nav-link" onClick={() => setIsOpen(!isOpen)}>
        <i className={icon} />
        <span>{label}</span>
        {
          !!showArrow
          && (
            <div className={`caret ${isOpen ? "active" : ""}`}>
              <FontAwesomeIcon icon={["fa", "caret-left"]} />
            </div>
          )
        }
      </Nav.Link>
      {
        showArrow
          ? (
            <Collapse in={isOpen}>
              {children}
            </Collapse>
          )
          : <>{children}</>
      }
    </Nav.Item>
  );
};

export default NavLinkCollapse;
