import React, { useEffect, useState, useRef } from "react";
import { connect, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";

function Status(props) {
  const { type = "green", children, label = '', count } = props;
  if (count === undefined) return null;
  return (
    <div className={`status status-${type}`}>
      <p className="status-label">{label}</p>
      <p>{count}</p>
    </div>
  );
}

export default Status;
