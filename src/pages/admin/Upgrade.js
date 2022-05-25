import React, { useEffect, useState } from "react";
import {
  Button, Card, ListGroup, Row, Col
} from "react-bootstrap";
import { Upload } from 'antd';
import { useTranslation } from "react-i18next";
import axios from "@/utils/axios";
import PageHeader from "@/components/PageHeader";

function Service() {
  const [data, setData] = useState({});
  const { t } = useTranslation();

  useEffect(() => {
    getList();
  }, []);

  async function getList() {
    try {
      const { data } = await axios({
        url: `/sysadm/webapp/version`,
        method: "GET"
      });

      setData(data);

    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  const { appVer, buildDate } = data;

  const uploadService = async options => {
    const {
      onSuccess, onError, file, onProgress
    } = options;
    const formData = new FormData();
    formData.append("uploadFile", file);

    try {
      const { data } = await axios({
        url: `/sysadm/webapp/upgrade`,
        method: "POST",
        data: formData,
        withLoading: false,
        withError: false,
        onUploadProgress(progressEvent) {
          const { loaded, total } = progressEvent;
          onProgress(parseFloat((total / loaded) * 100));
        }
      });
      onSuccess("Ok");
    } catch (e) {
      onError({ err: e });
    }
  };

  const uploadIFDA = async options => {
    const {
      onSuccess, onError, file, onProgress
    } = options;
    const formData = new FormData();
    formData.append("uploadFile", file);

    try {
      const { data } = await axios({
        url: `/back/update/ifda`,
        method: "POST",
        data: formData,
        withLoading: false,
        withError: false,
        onUploadProgress(progressEvent) {
          const { loaded, total } = progressEvent;
          onProgress(parseFloat((total / loaded) * 100));
        }
      });
      onSuccess("Ok");
    } catch (e) {
      onError({ err: e });
    }
  };

  const uploadClassifier = async options => {
    const {
      onSuccess, onError, file, onProgress
    } = options;
    const formData = new FormData();
    formData.append("uploadFile", file);

    try {
      const { data } = await axios({
        url: `/back/update/classifier`,
        method: "POST",
        data: formData,
        withLoading: false,
        withError: false,
        onUploadProgress(progressEvent) {
          const { loaded, total } = progressEvent;
          onProgress(parseFloat((total / loaded) * 100));
        }
      });
      onSuccess("Ok");
    } catch (e) {
      onError({ err: e });
    }
  };

  const uploadSmartzone = async options => {
    const {
      onSuccess, onError, file, onProgress
    } = options;
    const formData = new FormData();
    formData.append("uploadFile", file);

    try {
      const { data } = await axios({
        url: `/back/update/smartzone`,
        method: "POST",
        data: formData,
        withLoading: false,
        withError: false,
        onUploadProgress(progressEvent) {
          const { loaded, total } = progressEvent;
          onProgress(parseFloat((total / loaded) * 100));
        }
      });
      onSuccess("Ok");
    } catch (e) {
      onError({ err: e });
    }
  };

  const uploadSzruntime = async options => {
    const {
      onSuccess, onError, file, onProgress
    } = options;
    const formData = new FormData();
    formData.append("uploadFile", file);

    try {
      const { data } = await axios({
        url: `/back/update/szruntime`,
        method: "POST",
        data: formData,
        withLoading: false,
        withError: false,
        onUploadProgress(progressEvent) {
          const { loaded, total } = progressEvent;
          onProgress(parseFloat((total / loaded) * 100));
        }
      });
      onSuccess("Ok");
    } catch (e) {
      onError({ err: e });
    }
  };

  return (
    <>
      <div className="main">
        <PageHeader title={[t('upgrade')]} onClick={getList} />
        <Card className="mb-3">
          <Card.Body>
            <Card.Title className="mb-3">{t('upgrade_title')}</Card.Title>
            <ListGroup>
              <ListGroup.Item>
                <Row>
                  <Col sm="2">Version</Col>
                  <Col>{appVer}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col sm="2">Build Date</Col>
                  <Col>{buildDate}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col sm="2">Update</Col>
                  <Col>
                    <Upload
                      maxCount={1}
                      customRequest={uploadService}
                    >
                      <Button
                        variant="primary"
                        size="sm"
                      >
                        <i className="fas fa-upload" />
                        <span>{t('upload_file')}</span>
                      </Button>
                    </Upload>
                  </Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
            {/* <Card.Text>

            </Card.Text> */}
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title className="mb-3">{t('upgrade_other_service')}</Card.Title>
            <ListGroup>
              <ListGroup.Item>
                <Row>
                  <Col sm="2">IFDA</Col>
                  <Col>
                    <Upload
                      maxCount={1}
                      customRequest={uploadIFDA}
                    >
                      <Button
                        variant="primary"
                        size="sm"
                      >
                        <i className="fas fa-upload" />
                        <span>{t('upload_file')}</span>
                      </Button>
                    </Upload>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col sm="2">Classifiers</Col>
                  <Col>
                    <Upload
                      maxCount={1}
                      customRequest={uploadClassifier}
                    >
                      <Button
                        variant="primary"
                        size="sm"
                      >
                        <i className="fas fa-upload" />
                        <span>{t('upload_file')}</span>
                      </Button>
                    </Upload>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col sm="2">SmartZone</Col>
                  <Col>
                    <Upload
                      maxCount={1}
                      customRequest={uploadSmartzone}
                    >
                      <Button
                        variant="primary"
                        size="sm"
                      >
                        <i className="fas fa-upload" />
                        <span>{t('upload_file')}</span>
                      </Button>
                    </Upload>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col sm="2">Szruntime</Col>
                  <Col>
                    <Upload
                      maxCount={1}
                      customRequest={uploadSzruntime}
                    >
                      <Button
                        variant="primary"
                        size="sm"
                      >
                        <i className="fas fa-upload" />
                        <span>{t('upload_file')}</span>
                      </Button>
                    </Upload>
                  </Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      </div>

    </>
  );
}

export default Service;
