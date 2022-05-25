import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import axios from "@/utils/axios";
import useSocket from "@/hooks/useSocket";

import Status from "@/components/Status";

function StatusBar(props) {
  const { type = 'metadata' } = props;
  const { id: workspaceId = '' } = useParams();
  const [statics, setStatics] = useState({});
  const location = useLocation();
  const { classifierName } = Object.fromEntries(
    new URLSearchParams(location.search)
  );

  const { t } = useTranslation();

  useEffect(() => {
    getStatics();
  }, []);

  const {
    lastMessage,
  } = useSocket();

  useEffect(() => {
    getStatics();
  }, [JSON.stringify(lastMessage)]);

  async function getStatics() {
    let apiURL = '';
    let apiParams = {};
    switch (type) {
      case 'classifier':
        apiURL = '/fore/metadata/classifier/statics';
        apiParams = {
          workspaceId,
          classifierName
        };
        break;
      default:
        apiURL = `/fore/${type}/statics/${workspaceId}`;
        break;

    }
    try {
      const { data, } = await axios({
        url: apiURL,
        method: "GET",
        withError: false,
        withLoading: false,
        params: apiParams
      });
      setStatics(data);
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  const {
    pending, processing, verifying, unclassified, done
  } = statics;

  return (
    <div className="spacer mb-4">
      <Status type="gray" label={t('pending')} count={pending} />
      <Status type="blue" label={t('processing')} count={processing} />
      <Status type="cyan" label={t('verifying')} count={verifying} />
      <Status type="orange" label={t('unclassified')} count={unclassified} />
      <Status type="green" label={t('done')} count={done} />
    </div>
  );
}

export default StatusBar;
