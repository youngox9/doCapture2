import React, { useEffect, useState } from "react";
import {
  useHistory
} from "react-router-dom";


import Logo from '@/static/logo.png';


function NotFound() {

  const [seconds, setSeconds] = useState(5);

  const history = useHistory();

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (seconds <= 0) {
      toLoginPage();
    }
  }, [seconds]);

  function toLoginPage() {
    history.push('/login');
  }

  return (
    <>
      <div className="full-page-container">
        <div className="full-page-inner">
          <img className="logo" src={Logo} />
          <div className="full-page-box">
            <h3 className="text-center my-5">Page Not Found</h3>
            <p className="text-center my-2">Re-direct after {seconds} seconds.. or <a href onClick={toLoginPage}>Click here</a></p>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotFound;
