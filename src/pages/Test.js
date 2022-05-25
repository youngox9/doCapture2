import React, {
  useState,
  useEffect,
} from "react";
import {
  Button, InputGroup, FormControl, Form, Overlay, Tooltip, Popover
} from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import _ from 'lodash';

function Test(props) {
  const [list, setList] = useState([{ id: uuidv4() }]);

  function addItem() {
    setList([...list, { id: uuidv4() }]);
  }
  return (
    <div className="main">
      {
        list.map(obj => (
          <div className="mb-5">
            <p className="mb-2">{obj.id}</p>
            <input id={obj.id} value="" placeholder={obj.id} style={{ width: '100%' }} />
            {/* <hr /> */}
          </div>
        ))
      }
      <Button variant="primary" onClick={addItem}>Add Item</Button>
    </div>
  );
}

export default Test;
