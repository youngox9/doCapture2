import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setSidebarWidth } from '@/reducers/global';

const Sidebar = ({ children }) => {
  const dispatch = useDispatch();
  const global = useSelector(state => state.global);
  const sidebarWidth = useSelector(state => state?.global?.sidebarWidth || 0);
  const isCollapse = sidebarWidth < 100;

  function toggleCollapse() {
    if (sidebarWidth < 100) {
      dispatch(setSidebarWidth(250));
    } else {
      dispatch(setSidebarWidth(60));
    }
  }

  return (
    <Nav.Item>
      <Nav.Link className="disable-hover">
        <div className="spacer spacer-full" justify={isCollapse ? 'center' : 'end'}>
          <Button variant="icon white " onClick={toggleCollapse}>
            <FontAwesomeIcon icon={["fa", isCollapse ? "angle-double-right" : "angle-double-left"]} />
          </Button>
        </div>
      </Nav.Link>
    </Nav.Item>
  );
};

export default Sidebar;
