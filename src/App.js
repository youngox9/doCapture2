import React, { Suspense } from "react";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import { dom, library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";

import { toast, Slide } from 'react-toastify';
import store from "@/store";
import Routes from "@/routes";

import LoadingMask from "@/components/LoadingMask";
import ComfirmModal from "@/components/Modal/ComfirmModal";
import ThemeProvider from "@/components/ThemeProvider";

import "@/styles/style.scss";

library.add(fab);
library.add(far);
library.add(fas);

dom.watch();

// 右下角通知視窗基本設定
toast.configure({
  limit: 1,
  transition: Slide,
  hideProgressBar: true,
  position: 'bottom-right',
  autoClose: 2500,
  theme: "colored",
  closeButton: false,
  pauseOnHover: false
});

/**
 * 最root層
 * @returns
 */
function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <Suspense fallback={() => <></>}>
          <ThemeProvider />
          {/* loading 遮罩 */}
          <LoadingMask />
          {/* 確認視窗 Modal */}
          <ComfirmModal />
          {/* routes */}
          <Routes />
        </Suspense>
      </HashRouter>
    </Provider>
  );
}

export default App;
