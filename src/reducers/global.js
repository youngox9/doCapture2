/* eslint-disable no-case-declarations */
import history from "@/routes/history";

const BROWSER_LANG = navigator.language || navigator.userLanguage;
const GOOGLE_ID = '878471797906-s575409h9e6gu973qdtmhtou8uk514n2.apps.googleusercontent.com';


const SET_SIDEBAR_WIDTH = "SET_SIDEBAR_WIDTH";
const SET_LOADING = "SET_LOADING";
const CLEAR_LOADING = "CLEAR_LOADING";
const SET_AUTH = "SET_AUTH";
const CLEAR_AUTH = "CLEAR_AUTH";
const SET_SHARED_WORKSPACES = "SET_SHARED_WORKSPACES";
const SET_OWNED_WORKSPACES = "SET_OWNED_WORKSPACES";
const SET_USERINFO = "SET_USERINFO";
const SET_COMFIRM_MODAL = "SET_COMFIRM_MODAL";
const OPEN_COMFIRM_MODAL = "OPEN_COMFIRM_MODAL";
const SET_COLORS = "SET_COLORS";
const RESET_COLORS = "RESET_COLORS";
const SET_PIC = "SET_PIC";
const CLEAR_ALL_LOADING = "CLEAR_ALL_LOADING";

const SET_NOTIFYCATIONS_HISTORY = "SET_NOTIFYCATIONS_HISTORY";
const SET_LANGUAGES = "SET_LANGUAGES";
const SET_LANG = "SET_LANG";
const SET_NOTIFYCATION = "SET_NOTIFYCATION";
const SET_NOTIFYCATION_UNREAD = "SET_NOTIFYCATION_UNREAD";
const SET_PERMISSION = "SET_PERMISSION";

const INIT_COLOR_ROOT = {
  '--root': '#e48020',
  '--root-60': '#ffe8d1',
  '--white': '#FFFFFF',
  '--bg-color': '#e4e4e4',
  '--dark': '#3b3b3b',
  '--dark-60': '#b1b1b1',
  // '--gray': '#aaa',
  '--yellow': '#f57f17',
  '--orange': '#ff9800',
  '--blue': '#42a5f5',
  '--cyan': '#00bcd4',
  '--green': '#4caf50',
  '--red': '#f44336',
  "--admin-color": "#3b0101",
  // Font
  "--font-size": '14px',
  "--font-color-dark": '#3b3b3b',
  "--font-color-white": '#FFFFFF'
};

const initialState = {
  colors: INIT_COLOR_ROOT, // theme
  sidebarWidth: 250, // sideber width
  auth: {
    uid: sessionStorage.getItem("uid"),
    token: sessionStorage.getItem("token")
  },
  userInfo: {}, // user info data
  sharedWorkspaces: [], // shared wordspace list in sidebar
  ownedWorkspaces: [], // owned wordspace list in sidebar
  // comfirm modal
  comfirmModal: {
    isOpen: false,
    des: "",
    callback: () => { }
  },
  pic: '', // user profile pic
  loadingQueue: [], // loading query
  lang: sessionStorage.getItem("lang") || BROWSER_LANG, // language: 如果session裡面沒存，就拿瀏覽器的設定來用
  languages: [], // language 下拉選單
  notificationList: [], // 右上角通知列表
  notificationUnread: 0, // 右上角未讀數字
  permission: [], // 權限列表
  googleId: GOOGLE_ID
};

const reducers = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        loadingQueue: [...state.loadingQueue, action.data]
      };
    case CLEAR_LOADING:
      const { key } = action;
      const temp = state.loadingQueue.filter(obj => {
        // if (obj.key === key) {
        //   obj.source.cancel();
        // }
        return obj.key !== key;
      });
      return {
        ...state,
        loadingQueue: temp
      };
    case CLEAR_ALL_LOADING:
      // state.loadingQueue.forEach(obj => {
      //   obj.source.cancel();
      // });
      return {
        ...state,
        loadingQueue: []
      };
    case SET_AUTH:
      const { uid, token } = action.auth;
      sessionStorage.setItem("uid", uid);
      sessionStorage.setItem("token", token);
      // history.push('/');
      return { ...state, auth: { uid, token } };
    case CLEAR_AUTH:
      sessionStorage.setItem("uid", "");
      sessionStorage.setItem("token", "");
      return {
        ...initialState,
        languages: state.languages,
        lang: state.lang,
        auth: { uid: '', token: '' }
      };
    case SET_SHARED_WORKSPACES:
      return { ...state, sharedWorkspaces: action.data };
    case SET_OWNED_WORKSPACES:
      return { ...state, ownedWorkspaces: action.data };
    case SET_USERINFO:
      return { ...state, userInfo: action.data };
    case SET_COMFIRM_MODAL:
      return { ...state, comfirmModal: action.data };
    case OPEN_COMFIRM_MODAL:
      return { ...state, comfirmModal: action.data };
    case SET_COLORS:
      return { ...state, colors: action.data };
    case RESET_COLORS:
      return { ...state, colors: initialState.colors };
    case SET_PIC:
      return { ...state, pic: action.data };
    case SET_LANGUAGES:
      return { ...state, languages: action.data };
    case SET_LANG:
      sessionStorage.setItem("lang", action.data);
      return { ...state, lang: action.data };
    case SET_NOTIFYCATION:
      return {
        ...state,
        notificationList: action.data
      };
    case SET_NOTIFYCATION_UNREAD:
      return {
        ...state,
        notificationUnread: action.data
      };
    case SET_SIDEBAR_WIDTH:
      return {
        ...state,
        sidebarWidth: action.data
      };
    case SET_PERMISSION:
      return {
        ...state,
        permission: action.data
      };
    default:
      return state;
  }
};

export function setLoading(loadingData) {
  return {
    type: SET_LOADING,
    data: loadingData,
  };
}

export function clearLoading(key) {
  return {
    type: CLEAR_LOADING,
    key
  };
}

export function clearAllLoading() {
  return {
    type: CLEAR_ALL_LOADING,
  };
}

export function setAuth(auth) {
  return {
    type: SET_AUTH,
    auth
  };
}

export function clearAuth() {
  return {
    type: CLEAR_AUTH
  };
}

export function setSharedWorkspaces(data) {
  return {
    type: SET_SHARED_WORKSPACES,
    data
  };
}

export function setOwnedWorkspaces(data) {
  return {
    type: SET_OWNED_WORKSPACES,
    data
  };
}

export function setUserInfo(data) {
  return {
    type: SET_USERINFO,
    data
  };
}

export function setComfirm(config) {
  return {
    type: OPEN_COMFIRM_MODAL,
    data: {
      ...config
    }
  };
}

export function setColors(colors) {
  return {
    type: SET_COLORS,
    data: colors
  };
}

export function resetColors() {
  return {
    type: RESET_COLORS,
  };
}

export function setPic(pic) {
  return {
    type: SET_PIC,
    data: pic
  };
}

export function setNotifycations(data) {
  return {
    type: SET_NOTIFYCATIONS_HISTORY,
    data
  };
}
export function setLanguages(data) {
  return {
    type: SET_LANGUAGES,
    data
  };
}

export function setLang(data) {
  return {
    type: SET_LANG,
    data
  };
}


export function setNotifycation(data) {
  return {
    type: SET_NOTIFYCATION,
    data
  };
}

export function setNotifycationUnread(data) {
  return {
    type: SET_NOTIFYCATION_UNREAD,
    data
  };
}

export function setSidebarWidth(data) {
  return {
    type: SET_SIDEBAR_WIDTH,
    data
  };
}

export function setPermission(data) {
  return {
    type: SET_PERMISSION,
    data
  };
}


export default reducers;
