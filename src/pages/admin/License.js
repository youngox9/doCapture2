import React, { useEffect, useState } from "react";
import {
  Button, Card, ListGroup, Row, Col
} from "react-bootstrap";
import { Upload } from 'antd';
import { useTranslation } from "react-i18next";
import axios from "@/utils/axios";
import PageHeader from "@/components/PageHeader";

function Service() {
  const { t } = useTranslation();
  const [data, setData] = useState({});

  useEffect(() => {
    getList();
  }, []);

  async function getList() {
    try {
      const { data } = await axios({
        url: `/sysadm/license`,
        method: "GET"
      });
      setData(data);

    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  const uploadImage = async options => {
    const {
      onSuccess, onError, file, onProgress
    } = options;
    const formData = new FormData();
    formData.append("uploadFile", file);

    try {
      const { data } = await axios({
        url: `/sysadm/license`,
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
      const msg = e?.response?.data?.message || "Network Error";
      console.log(msg);
      onError({ err: e });
    }
  };

  const {
    machineId, expireDate, appName, expireFlag
  } = data;

  return (
    <>
      <div className="main">
        <PageHeader title={["License"]} onClick={getList} />
        <Card>
          <Card.Body>
            <Card.Title className="mb-3">{t('information')}</Card.Title>
            <ListGroup>
              <ListGroup.Item>
                <Row>
                  <Col sm="2">{t('machine_id')}</Col>
                  <Col>{machineId}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col sm="2">{t('expire_date')}{expireFlag ? 'expired' : ''}</Col>
                  <Col>{expireDate}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col sm="2">App Name</Col>
                  <Col>{appName}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col sm="2">{t('upload_file')}</Col>
                  <Col>
                    <Upload
                      maxCount={1}
                      // accept="image/*"
                      customRequest={uploadImage}
                    // onChange={handleOnChange}
                    // listType="picture-card"
                    // defaultFileList={defaultFileList}
                    // className="image-upload-grid"
                    >
                      <Button
                        variant="primary"
                        size="sm"
                      >
                        <i className="fas fa-upload" />
                        {t('upload_file')}
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
      </div>

    </>
  );
}

export default Service;
