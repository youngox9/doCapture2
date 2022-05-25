import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { v4 as uuidv4 } from "uuid";
import store from "@/store";

const isDev = process.env.NODE_ENV === "development";

function useSocket(props) {
  const token = useSelector(state => encodeURIComponent(state?.global?.auth?.token || ''));

  const SOCKET_PROTOCOL = window.location.protocol === 'https:' ? 'wws' : 'ws';
  const SOCKET_PATH = `${isDev ? '10.2.3.125' : window.location.host}/websocket/docaptures/connect?token=${token}`;
  const SOCKET_URL = `${SOCKET_PROTOCOL}://${SOCKET_PATH}`;

  const [lastMsg, setLastMsg] = useState({});
  const dispatch = useDispatch();

  const {
    lastJsonMessage,
    sendJsonMessage,
    getWebSocket,
    sendMessage,
    lastMessage,
    readyState,
  } = useWebSocket(SOCKET_URL, {
    reconnectAttempts: 9999,
    reconnectInterval: 3000,
  });

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  async function send(id, content, user) {
    await waitForSocketConnection();
    const { id: uid, firstName, lastName } = user || store.getState()?.global?.userInfo || {};
    const msg = {
      notifyId: id,
      content: `[${firstName} ${lastName}] ${content}`,
      sendList: user || uid ? [uid] : []
    };
    console.log("[Socket] SEND", msg);
    sendJsonMessage(msg);
  }

  function waitForSocketConnection() {
    let timer;
    return new Promise(resolve => {
      timer = setInterval(
        () => {
          const isUserInfo = store.getState()?.global?.userInfo.firstName;
          if (getWebSocket().readyState === 1 && isUserInfo) {
            resolve(true);
            clearInterval(timer);
          } else if (getWebSocket().readyState === 3) {
            clearInterval(timer);
          }
        }, 1000
      );
    });
  }

  return {
    send,
    // onReconnect: onInitWebsocket,
    lastMessage: lastMsg,
    connectionStatus,
    lastJsonMessage
    // websocket,
  };
}

export default useSocket;
