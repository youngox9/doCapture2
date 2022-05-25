import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Nav,
  Button
} from "react-bootstrap";
import { Badge } from 'antd';
import Popper from '@/components/Popper';
import NotifycationContainer from './NotifycationContainer';
import useSocket from "@/hooks/useSocket";
import axios from "@/utils/axios";
import { setNotifycation, setNotifycationUnread } from "@/reducers/global";

const NotifyButton = (props) => {
  const dispatch = useDispatch();
  const notificationUnread = useSelector(state => state?.global?.notificationUnread || 0);

  const {
    lastMessage,
  } = useSocket();

  useEffect(() => {
    getUnRead();
  }, [JSON.stringify(lastMessage)]);

  async function getUnRead() {
    try {
      const { data } = await axios({
        url: `/fore/notifications/unreadCount`,
        method: "GET",
        withError: false,
        withLoading: false,
      });
      dispatch(setNotifycationUnread(data.count));
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  return (
    <Badge size="small" count={notificationUnread}>
      <Popper
        width={600}
        trigger="click"
        component={() => (
          <NotifycationContainer />
        )}
      >
        <Button variant="icon">
          {/* <span>{unreadCount}</span> */}
          <i className="fas fa-bell" />
        </Button>
      </Popper>
    </Badge>
  );
};

export default NotifyButton;
