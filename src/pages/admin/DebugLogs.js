import React from "react";
import {
  Button, Card
} from "react-bootstrap";
import FileSaver from "file-saver";
import { useTranslation } from "react-i18next";
import axios from "@/utils/axios";
import PageHeader from "@/components/PageHeader";

function DebugLogs() {
  const { t } = useTranslation();

  async function onDownload() {
    try {
      const { data, headers } = await axios({
        url: `/sysadm/logs`,
        method: "GET",
        responseType: "blob",
        params: {}
      });
      const disposition = headers["content-disposition"];
      const fileName = disposition.match(/filename="(.+)"/)[1];
      FileSaver.saveAs(data, fileName);
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  return (
    <>
      <div className="main">
        <PageHeader title={[t('debug_log')]} />
        <Card>
          <Card.Body>
            <Card.Title className="mb-3">{t('debug_logs_title')}</Card.Title>
            <Button onClick={onDownload}>
              {t('debug_logs_btn')}
            </Button>
          </Card.Body>
        </Card>
      </div>

    </>
  );
}

export default DebugLogs;
