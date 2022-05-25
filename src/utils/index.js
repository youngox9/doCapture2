// import { dispatch } from "react-redux";
import { setComfirm } from "@/reducers/global";
import { useTranslation } from "react-i18next";
import store from "@/store";

export const dispatch = store.dispatch;

export const comfirm = (config) => {
  dispatch(setComfirm({ ...config, isOpen: true }));
};

export const STATE_ARRAY = () => {
  return [
    { label: 'Pending', value: 'pending' },
    { label: 'Processing', value: 'progress' },
    { label: 'verifying', value: 'verifying' },
    { label: 'Unclassified', value: 'unclassified' },
    { label: 'Done', value: 'done' }
  ];
};

export function parseUrl(s) {
  const str = s.substring(1);
  return str.split('&').reduce((prev, curr) => {
    const key = curr.slice(0, curr.indexOf('='));
    const value = curr.slice(curr.indexOf('=') + 1);
    return {
      ...prev,
      [key]: value
    };
  }, {});
}

// export const searchParams = Object.fromEntries(
//   new URLSearchParams(location.search)
// );
