import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import axios from "@/utils/axios";
import { setPic } from "@/reducers/global";
import useSocket from '@/hooks/useSocket';

function ProfilePic(props) {
  const {
    size = "80px"
  } = props;


  const {
    send
  } = useSocket();

  const dispatch = useDispatch();
  const pic = useSelector(state => state?.global?.pic || '');

  async function onUpload(file) {
    const formData = new FormData();
    formData.append("uploadFile", file);

    try {
      const { data } = await axios({
        url: `/fore/users/profile/photo`,
        method: "POST",
        data: formData,
        withLoading: true,
      });
      getUserPic();
      send('UPI001', 'Upload profile image');
    } catch (e) {
      console.log(e);
    }
  }

  async function getUserPic() {
    try {
      const { data: blob } = await axios({
        url: `/fore/users/profile/photo`,
        method: "GET",
        withError: false,
        responseType: 'blob'
      });
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function () {
        // const base64data = reader.result;
        const base64data = reader.result;
        dispatch(setPic(base64data));
      };
      // dispatch(setUserInfo(data));
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  const onDrop = useCallback(files => {
    const file = files[0];
    if (files && file) {
      onUpload(file);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="profile-pic" {...getRootProps()} style={{ width: size }}>
      <div className="pic" style={{ backgroundImage: `url(${pic})` }}>
        <i className="fas fa-camera" />
        <input {...getInputProps()} />
      </div>
    </div>
  );
}

export default ProfilePic;
