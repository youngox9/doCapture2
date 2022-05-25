import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Ratio } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { Upload, message } from 'antd';
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";
import axios from "@/utils/axios";
import useSocket from '@/hooks/useSocket';

const { Dragger } = Upload;

function Step2(props) {
  const { id: workspaceId } = useParams();
  const { extractionName = '' } = props;
  const { t } = useTranslation();

  const {
    send
  } = useSocket();

  const uploadImage = async options => {
    const {
      onSuccess, onError, file, onProgress
    } = options;

    const formData = new FormData();
    if (workspaceId) {
      formData.append("workspaceId", workspaceId);
    }
    formData.append("uploadFile", file);
    formData.append("extractionName", extractionName);

    try {
      const { data } = await axios({
        url: `/fore/files`,
        method: "POST",
        data: formData,
        withLoading: false,
        withError: false,
        onUploadProgress(progressEvent) {
          const { loaded, total } = progressEvent;
          onProgress(parseFloat((total / loaded) * 100));
        }
      });
      onSuccess("Ok", file);
      send('UF001', 'Upload file');
    } catch (e) {
      const msg = e?.response?.data?.message || "Network Error";
      onError({ err: e });
      send('UF002', 'Failed to upload file');
    }
  };
  return (
    <div className="upload-container">
      <Dragger
        multiple
        accept="image/*, application/pdf"
        customRequest={uploadImage}
      >
        <p className="ant-upload-drag-icon">
          <i className="fas fa-file-upload" />
        </p>
        <p className="ant-upload-text">
          {t('upload_drag_des')}
        </p>
      </Dragger>
      <div className="devider">
        <span>{t('upload_drag_des_2')}</span>
      </div>
      <div className="upload-type-content">
        <div className="spacer" justify="center">
          <Button variant="outline-dark" className="btn-upload">
            <div className="inner">
              <div className="text">
                <i className="fas fa-print" />
                <span>{t('scan')}</span>
              </div>
            </div>
          </Button>
          <Button variant="outline-dark" className="btn-upload">
            <div className="inner">
              <div className="text">
                <i className="fab fa-dropbox" />
                <span>{t('dropbox')}</span>
              </div>
            </div>
          </Button>
          <Button variant="outline-dark" className="btn-upload">
            <div className="inner">
              <div className="text">
                <i className="fab fa-google-drive" />
                <span>{t('google_drive')}</span>
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Step2;
