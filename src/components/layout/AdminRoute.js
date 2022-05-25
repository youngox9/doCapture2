import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Route, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import clsx from 'clsx';
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminHeader from "@/components/layout/AdminHeader";
import useAuth from "@/hooks/useAuth";
import SidebarBox from './SidebarBox';

/**
 * admin 頁面主要結構: sidebar/header/main  的組合
 * @param {*} param
 * @returns
 */
function AdminRoute({ layout, component: Component, ...rest }) {
  useAuth();
  const history = useHistory();
  const dispatch = useDispatch();

  const { uid } = useSelector(state => state?.global?.auth || {});
  const sidebarWidth = useSelector(state => state?.global?.sidebarWidth || 0);
  const isCollapse = sidebarWidth < 100;

  // if (!uid) {
  //   toast.dismiss();
  //   toast.clearWaitingQueue();
  //   history.push('/login');
  //   return null;
  // }
  // useAuth();
  return (
    <Route
      {...rest}
      render={props => (
        <div className="wrapper">
          <SidebarBox className={clsx("admin", { 'is-collapse': isCollapse })}>
            <AdminSidebar />
          </SidebarBox>
          <div className="container">
            <div className="header admin">
              <AdminHeader />
            </div>
            <Component />
          </div>
        </div>
      )}
    />
  );
}

export default AdminRoute;
