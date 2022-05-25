import React, { useEffect, useState } from "react";
import {
  Nav,
  Button,
  Row,
  Col,
  ListGroup
} from "react-bootstrap";
import { Skeleton } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from "react-redux";
import clsx from 'clsx';
import { useTranslation } from "react-i18next";
import axios from "@/utils/axios";
import { setNotifycation, setNotifycationUnread } from "@/reducers/global";
import useSocket from '@/hooks/useSocket';
import Empty from '@/components/Empty';

const levelTypes = ['Info', 'Warning', 'Error'];

function NotifycationContainer() {
  const dispatch = useDispatch();
  const [level, setLevel] = useState(levelTypes[0]);
  const [params, setParams] = useState({ pageSize: 20 });

  const notificationList = useSelector(state => state?.global?.notificationList || []);
  const notificationUnread = useSelector(state => state?.global?.notificationUnread || 0);
  const [statics, setStatics] = useState({});

  const {
    lastMessage,
  } = useSocket();

  const { t } = useTranslation();

  const {
    pageNo = 1,
    pageSize = 0,
    pageCounts = 0,
    totalPages = 0,
    totalCounts = 0
  } = params;

  useEffect(() => {
    getList();
    return () => {
      dispatch(setNotifycation([]));
    };
  }, [level]);

  useEffect(() => {
    getStatics();
  }, [JSON.stringify(lastMessage)]);

  const hasMore = pageNo < totalPages;

  async function onRefresh() {
    getList();
    getUnRead();
    getStatics();
  }
  async function getList() {
    try {
      const { data, ...p } = await axios({
        url: `/fore/notifications`,
        method: "GET",
        withLoading: false,
        withError: false,
        params: {
          level,
          pageNo: 1,
          pageSize: 10
        }
      });
      setParams({ ...p });
      dispatch(setNotifycation(data));
    } catch (e) {
      console.log(">>>>>", e);
    }
    return [];
  }

  /**
   * [GET] 取得更多 notifycation
   */
  async function getMore() {
    try {
      const { data, ...p } = await axios({
        url: `/fore/notifications`,
        method: "GET",
        withLoading: false,
        withError: false,
        params: {
          ...params,
          level,
          pageNo: params.pageNo + 1
        }
      });
      setParams({ ...p });
      dispatch(setNotifycation([...notificationList, ...data]));
    } catch (e) {
      console.log(">>>>>", e);
    }
    return [];
  }


  /**
   * [PUT] 取得更多 notifycation
   */
  async function onReadAll() {
    try {
      const { data } = await axios({
        url: `/fore/notifications/readall`,
        method: "PUT",
        withError: false,
      });
      onRefresh();
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  /**
   * 取得未讀數量
   */
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

  /**
  * 取得未讀數量
  */
  async function getStatics() {
    try {
      const { data } = await axios({
        url: `/fore/notifications/unreadstatics`,
        method: "GET",
        withError: false,
        withLoading: false,
      });
      // console.log(data);
      setStatics(data);
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  return (
    <div style={{ width: '100%' }}>
      <div className="spacer spacer-full mb-3" justify="end">
        <Button variant="outline-dark" size="sm" onClick={onReadAll}>
          {t('read_all')}
        </Button>
      </div>
      <hr />
      <Nav className="table-tabs" variant="tabs" activeKey="files" fill>
        <Nav.Item>
          <Nav.Link active={level === levelTypes[0]} onClick={() => setLevel(levelTypes[0])}>
            <span>{t('notify_info')} ({statics.Info || 0})</span>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link active={level === levelTypes[1]} onClick={() => setLevel(levelTypes[1])}>
            <span>{t('notify_warning')} ({statics.Warning || 0})</span>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link active={level === levelTypes[2]} onClick={() => setLevel(levelTypes[2])}>
            <span>{t('notify_error')} ({statics.Error || 0})</span>
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <div className="notify-container" id="notifycation-container">
        <InfiniteScroll
          onScroll={() => { console.log('on scroll'); }}
          dataLength={notificationList.length}
          next={getMore}
          hasMore={hasMore}
          loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
          // endMessage={<Empty />}
          scrollableTarget={document.getElementById('notifycation-container')}
          hasChildren
        // scrollableTarget="notifycation-container"
        >
          {
            notificationList.length > 0
              ? (
                <ListGroup variant="flush">
                  {
                    notificationList.map(item => (
                      <ListGroup.Item action className={clsx({ disabled: item.readFlag })}>
                        <Row>
                          <Col sm="auto">
                            <i className={`fas fa-exclamation-circle ${level}`} />
                          </Col>
                          <Col sm="6">
                            <h4>{item.category}</h4>
                            <p>{item.content}</p>
                          </Col>
                          <Col sm="4" className="text-right">
                            {item.createTime}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))
                  }
                </ListGroup>
              ) : <Empty />
          }
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default NotifycationContainer;
