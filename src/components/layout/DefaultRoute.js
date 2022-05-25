import React, { useEffect } from "react";
import { useDispatch, useSelector, } from "react-redux";
import { Route, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import clsx from 'clsx';
import Siderbar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import useAuth from "@/hooks/useAuth";
import axios from "@/utils/axios";
import { setSharedWorkspaces, setOwnedWorkspaces } from "@/reducers/global";
import SidebarBox from './SidebarBox';

/**
 * 頁面主要結構: sidebar/header/main  的組合
 * @param {*} param
 * @returns
 */
function DefaultLayout({
  layout, component: Component, children, ...rest
}) {
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
  useEffect(() => {
    if (uid) {
      getSharedWorkspaces();
      getOwnedWorkspaces();
    }
  }, []);

  async function getSharedWorkspaces() {
    try {
      const { data } = await axios({
        url: `/fore/workspaces/shared`,
        method: "GET"
      });
      dispatch(setSharedWorkspaces(data));
    } catch (e) {
      console.log(">>>>>", e);
    }
  }
  async function getOwnedWorkspaces() {
    try {
      const { data } = await axios({
        url: `/fore/workspaces/owned `,
        method: "GET"
      });
      dispatch(setOwnedWorkspaces(data));
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  return (
    <>
      <Route
        {...rest}
        render={props => (
          <div className="wrapper">
            <SidebarBox className={clsx({ 'is-collapse': isCollapse })}>
              <Siderbar />
            </SidebarBox>
            <div className="container">
              <div className="header">
                <Header />
              </div>
              <Component />
            </div>
          </div>
        )}
      >
        {children}
      </Route>
    </>
  );
}

export default DefaultLayout;
