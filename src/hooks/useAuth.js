import React, { useEffect, useState } from "react";
import { useStore, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import _ from "lodash";
import { toast } from "react-toastify";
import axios from "@/utils/axios";
import { setUserInfo, setPic, setPermission } from "@/reducers/global";


/**
 * hook 用來更新權限至redux
 * 1. 檢查權限
 * 
 * @returns 
 */
const useAuth = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const { uid } = useSelector(state => state?.global?.auth || {});

  useEffect(() => {
    if (uid) {
      getUserInfo();
      getUserPic();
    }
  }, [uid]);

  useEffect(() => {
    if (uid) {
      getPermission();
    }
  }, [pathname, uid]);

  if (!uid) {
    console.log("[NOT LOGIN] kick off");
    toast.dismiss();
    toast.clearWaitingQueue();
    if (pathname !== '/login') {
      history.push("/login");
    }
    return null;
  }

  /**
 * 取得使用者資訊
 */
  async function getUserInfo() {
    try {
      const { data } = await axios({
        url: `/fore/users/profile`,
        method: "GET",
        withError: false,
        withLoading: false,
      });
      dispatch(setUserInfo(data));
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  /**
   * 取得使用者照片
   */
  async function getUserPic() {
    try {
      const { data: blob } = await axios({
        url: `/fore/users/profile/photo`,
        method: "GET",
        withError: false,
        withLoading: false,
        responseType: 'blob'
      });
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function () {
        const base64data = reader.result;
        dispatch(setPic(base64data));
      };
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  /**
 * 取得permission權限, 並存入redux
 */
  async function getPermission() {
    const {
      data,
    } = await axios({
      url: `/auth/web/features`,
      method: "GET",
    });
    dispatch(setPermission(data));
  }

};

export default useAuth;
