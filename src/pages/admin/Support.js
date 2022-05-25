import React, { useEffect, useState, useRef } from "react";
import { connect, useStore, useSelector } from "react-redux";
import { Button, Nav, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import axios from "@/utils/axios";
import PageHeader from "@/components/PageHeader";

function Support() {
  const { id: workspaceId } = useParams();

  const [data, setData] = useState([]);
  const [assistCode, setAssistCode] = useState([]);
  const { t } = useTranslation();


  useEffect(() => {
    getList();
  }, []);


  function getList() {
    getAssist();
    getAssistCode();
  }
  async function getAssist() {
    try {
      const { data } = await axios({
        url: `/sysadm/assist`,
        method: "GET"
      });
      setData(data);

    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  async function getAssistCode() {
    try {
      const { data } = await axios({
        url: `/sysadm/assist/code`,
        method: "GET"
      });
      setAssistCode(data.code);
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  async function postOperation(operation) {
    try {
      const { data } = await axios({
        url: `/sysadm/assist/${operation}`,
        method: "POST"
      });
      getList();
    } catch (e) {
      console.log(">>>>>", e);
    }
  }


  const state = data?.state;

  return (
    <>
      <div className="main">
        <PageHeader title={[t('support')]} onClick={getList} />
        <Card style={{ width: '100%' }}>
          {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
          <Card.Body>
            <Card.Title>{data.name || 'Empty'}</Card.Title>
            <Card.Text>
              code: {assistCode || 'null'}
            </Card.Text>
            <hr />
            <div className="spacer">
              <Button variant="outline-success" size="sm" onClick={() => postOperation('start')} disabled={state && state !== 'running'}>
                <i className="fas fa-play" />
              </Button>
              <Button variant="outline-danger" size="sm" onClick={() => postOperation('stop')} disabled={state && state === 'running'}>
                <i className="fas fa-stop" />
              </Button>
              <Button variant="outline-dark" size="sm" onClick={() => postOperation('restart')}>
                <i className="fas fa-redo" />
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>

    </>
  );
}

export default Support;
