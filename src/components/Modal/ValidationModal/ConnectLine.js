import React, { useState, useEffect } from "react";
import _ from "lodash";
import { PathLine } from 'react-svg-pathline';


const ConnectElement = ({ nodeA, nodeB }) => {
  const [rectA, setRectA] = useState({})
  const [rectB, setRectB] = useState({})
  let timer;

  useEffect(() => {
    if (nodeA && nodeB) {
      timer = setInterval(() => {
        const ra = nodeA?.getBoundingClientRect() || {};
        const rb = nodeB?.getBoundingClientRect() || {};
        if (JSON.stringify(rectA) !== JSON.stringify(ra)) {
          setRectA(ra);
        }
        if (JSON.stringify(rectB) !== JSON.stringify(rb)) {
          setRectB(rb);
        }
      }, 10);
    } else {
      clearInterval(timer);
    }
    return () => {
      clearInterval(timer);
    }
  }, [nodeA, nodeB]);

  if (!nodeA && !nodeB) return null;

  // const rectA = nodeA?.getBoundingClientRect() || {};
  // const rectB = nodeB?.getBoundingClientRect() || {};
  const { right: x1 = 0, top: y1 = 0, height: h1 = 0 } = rectA;
  const { x: x2 = 0, y: y2 = 0, height: h2 = 0 } = rectB;

  const xa = x1;
  const ya = y1 + h1 / 2;
  const xb = x2;
  const yb = y2 + h2 / 2;


  return (
    <div className="lines">
      <svg>
        <PathLine
          style={{ color: 'red' }}
          points={[{ x: xa, y: ya }, { x: xa + 200, y: ya }, { x: xb - 4, y: yb }]}
          fill="none"
          r={20}
        />
      </svg>
    </div>
  );

};

export default ConnectElement;
