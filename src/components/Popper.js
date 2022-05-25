import React, {
  useImperativeHandle, useState, useRef, useEffect
} from 'react';
import styled from 'styled-components';

import { Popover, ArrowContainer } from 'react-tiny-popover';

const PropperDiv = styled.div`
  width: ${({ width = 200 }) => `${width}px`};
  max-height: ${({ height = 600 }) => `${height}px`};
  padding: 1rem;
  border-radius: 4px;
  background-color: white;
  box-shadow: 0px 1px 10px #5f5f5f;
  overflow: hidden;
  overflow-y: auto;
  max-height: 80vh;
  /* z-index: 999999; */
  /* border: 1px solid black; */
`;

/**
 * check dom element b in a
 * @param {*} a out
 * @param {*} b in
 * @returns Boolean
 */
function checkContains(a, b) {
  try {
    if (a.contains(b)) { return true; }

  } catch (e) { }
  return false;
}

let timer;
function Popper(props, ref) {
  const {
    children,
    component = () => { },
    className,
    width,
  } = props;

  const [showPopover, setShowPopover] = useState(false);
  const popperNode = useRef(null);

  const displayChild = React.Children.map(children, child => React.cloneElement(child, {
    onClick: () => {
      setShowPopover(true);
    },
  }))[0];

  useImperativeHandle(ref, () => ({
    setShowPopover
  }));

  return (
    <Popover
      padding={0}
      onClickOutside={e => {
        setShowPopover(false);
      }}
      isOpen={showPopover}
      positions={['bottom', 'left']}
      content={({ position, childRect, popoverRect }) => (
        <ArrowContainer
          position={position}
          childRect={childRect}
          popoverRect={popoverRect}
          arrowColor="white"
          arrowSize={6}
          // arrowStyle={{ opacity: 0.7 }}
          className="popover-arrow-container"
          arrowClassName="popover-arrow"
        >
          {
            showPopover
            && (
              <PropperDiv className="popper-container" style={{ width: props.width }} ref={popperNode}>
                {component({ setOpen: setShowPopover })}
              </PropperDiv>
            )
          }

        </ArrowContainer>
      )}
    >
      {displayChild}
      {/* <div onClick={() => { setShowPopover(true); }}>

      </div> */}
    </Popover>
  );
}

export default React.forwardRef(Popper);
