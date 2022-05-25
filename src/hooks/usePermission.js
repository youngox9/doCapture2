import React, { useEffect, useState } from "react";
import { useStore, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import { toast } from "react-toastify";
import axios from "@/utils/axios";
import { setUserInfo, setPic, clearAllLoading } from "@/reducers/global";

// const temp = [{
//   type: "web", name: "前台頁面", path: "/*", method: "*", id: "e64f157a-efcd-4981-8144-e3644359f048"
// }, {
//   type: "web", name: "前台工作區", path: "/#/workspaces", method: "*", id: "eec89ef2-deba-4967-b7fe-53f84125f73b"
// }, {
//   type: "web", name: "前台分類器設定", path: "/#/classifier", method: "*", id: "6ef6f116-b2ef-4c11-927a-54d4f6ac5b6f"
// }, {
//   type: "web", name: "後台頁面", path: "/#/admin/*", method: "*", id: "3687ed14-469a-41b7-b30c-02126317f424"
// }, {
//   type: "web", name: "後台功能選單", path: "/#/admin/features/", method: "*", id: "01d31451-037f-4892-b230-f4c93cd01b9c"
// }, {
//   type: "web", name: "後台帳號選單", path: "/#/admin/accounts", method: "*", id: "766c6b7e-e990-48a0-924d-cfc7b5f26fc3"
// }, {
//   type: "web", name: "後台角色選單", path: "/#/admin/roles", method: "*", id: "adc086fd-2bcd-4d65-a49f-1fdafe446a94"
// }, {
//   type: "web", name: "後台權限選單", path: "/#/admin/permission", method: "*", id: "cae9021e-cb43-4352-94b3-5dd5a10b3ac4"
// }, {
//   type: "web", name: "後台遠端協助選單", path: "/#/admin/assist", method: "*", id: "e7e49618-dc55-499d-8cb7-bccbe498d37d"
// }, {
//   type: "web", name: "後台工作區選單", path: "/#/admin/workspaces", method: "*", id: "72ccc4b5-cdd2-4fcd-9df5-6be6776e841b"
// }, {
//   type: "web", name: "後台分類器選單", path: "/#/admin/classifier", method: "*", id: "2e251a3c-cbb4-4d92-b8b4-a1d8ed571ef7"
// }, {
//   type: "web", name: "後台系統更新選單", path: "/#/admin/upgrade", method: "*", id: "dfd6eb1b-77c3-4e8c-9ea0-229ae6df0d09"
// }, {
//   type: "web", name: "後台授權更新選單", path: "/#/admin/license", method: "*", id: "0261e235-27d5-481d-ac17-0b338a431750"
// }, {
//   type: "web", name: "後台日誌下載選單", path: "/#/admin/debuglogs", method: "*", id: "08e6a0f3-154b-431e-8208-f85bcd7ff677"
// }, {
//   type: "web", name: "後台服務管理選單", path: "/#/admin/service", method: "*", id: "4569a10d-60c3-4634-bd76-14cef0e7192e"
// }];

const usePermission = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const permission = useSelector(state => state?.global?.permission || []);

  function checkPermission(path) {
    return permission.find(obj => obj.path === path);
  }

  const permissionData = permission.reduce((prev, curr) => {
    return { ...prev, [curr.path]: true };
  }, {});

  // console.log(permission);
  return { permission, permissionData, checkPermission };
};

export default usePermission;
