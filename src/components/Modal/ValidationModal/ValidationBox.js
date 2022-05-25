import React, { useRef } from "react";
import _ from "lodash";
import clsx from "clsx";
import { Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Popper from '@/components/Popper';

function ValidationBox(props, ref) {
  const {
    fieldKey, style, value, name, active, onMouseEnter, onMouseLeave, onChange = () => { }
  } = props;


  const popperEl = useRef(null);

  console.log(popperEl);
  const { t } = useTranslation();


  const togglePopperOpen = popperEl?.current?.setShowPopover || (() => { });

  return (
    <>
      <Popper
        ref={popperEl}
        width={300}
        onMouseEnter={(e) => { onMouseEnter(e); togglePopperOpen(true); }}
        // onMouseLeave={(e) => { onMouseLeave(e); closePopper(); }}
        component={() => (
          <div>
            <h2 className="text-center">{name}</h2>
            <Form.Control
              className="text-center"
              size="lg"
              type="text"
              value={value}
              onChange={e => onChange(e.target.value)}
            />
          </div>
        )}
      >
        <div
          className={clsx('box', `${fieldKey}-box`, { active })}
          id={`${fieldKey}-box`}
          style={style}
          ref={ref}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
      </Popper>
    </>
  );
}

export default React.forwardRef(ValidationBox);
