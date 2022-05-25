import React, {
  useState, useEffect, useRef, useImperativeHandle
} from "react";
import {
  Button
} from "react-bootstrap";
import _ from "lodash";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styled from 'styled-components';
import axios from "@/utils/axios";
import ValidationBox from './ValidationBox';

const GridDiv = styled.div`
  background-color: var(--dark);
  background-size: ${({ scale }) => `${20 * scale}px ${20 * scale}px`};
  background-position: 0.25rem 0.25rem;
  background-image:
      linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
`;

function ValidationPreview(props, ref = () => { }) {
  const {
    dpSetting = {},
    setActiveKey,
    activeKey, id,
    form = {},
    locations = {},
    onChange = () => { }
  } = props;

  const [boxLocations, setBoxLocations] = useState([]);
  const [imageSrc, setImageSrc] = useState('');
  const [scale, setScale] = useState(0.5);
  const panEl = useRef(null);

  useImperativeHandle(ref, () => ({
    pan: panEl?.current,
  }));

  useEffect(() => {
    if (id) {
      getLocations();
    }
  }, [id, JSON.stringify(locations)]);

  async function getLocations(src) {
    const { width, height } = await getImage(src);
    const locs = Object.keys(locations).map(k => {
      const obj = locations[k];
      const fieldValue = form[k];

      // console.log(obj);
      return {
        key: k,
        value: fieldValue,
        left: `${(obj.left / width) * 100}%`,
        top: `${(obj.top / height) * 100}%`,
        height: `${(obj.height / height) * 100}%`,
        width: `${(obj.width / width) * 100}%`,
      };
    });
    setBoxLocations(locs);
  }

  async function getImage() {
    try {
      const { data: blob } = await axios({
        url: `/fore/metadata/${id}/image`,
        method: "GET",
        responseType: "blob"
      });
      const src = URL.createObjectURL(blob);
      const imageObj = await onImageLoad(src);
      panEl.current.centerView();
      setImageSrc(src);
      return imageObj;
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  function onImageLoad(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = function () {
        resolve(image);
        // if (panEl.current) {
        //   panEl.current.centerView();
        // }
      };
      image.onerror = (e) => {
        reject(e);
      };
      image.src = src;
    });
  }

  function zoomIn() {
    if (panEl?.current) {
      panEl.current.zoomIn();
    }
  }

  function zoomOut() {
    if (panEl?.current) {
      panEl.current.zoomOut();
    }
  }

  function reset() {
    if (panEl?.current) {
      panEl.current.resetTransform();
    }
  }

  return (
    <div className="validation-wrap">
      <GridDiv className="preview-container" scale={scale}>
        <TransformWrapper
          onZoom={(r, e) => { setScale(r.state.scale); }}
          centerOnInit
          zoomAnimation={{ disabled: true }}
          ref={panEl}
          minScale={0.5}
          initialScale={scale}
          panning={{ excluded: ["input", '.box'] }}
          wheel={{ excluded: ["input", '.box'] }}
          pinch={{ excluded: ["input", '.box'] }}
          doubleClick={{ excluded: ["input", '.box'] }}
        >
          <>
            <div className="preview-tools">
              <div className="spacer" justify="end">
                <Button
                  variant="icon white"
                  onClick={zoomIn}
                >
                  <i className="fas fa-search-plus" />
                </Button>
                <Button
                  variant="icon white"
                  onClick={zoomOut}
                >
                  <i className="fas fa-search-minus" />
                </Button>
                <Button
                  variant="icon white"
                  onClick={reset}
                >
                  <i className="fas fa-redo" />
                </Button>
              </div>
            </div>
            <TransformComponent>
              <div className="preview">
                <div className="preview-pic">
                  <img className="pic" src={imageSrc} />
                  {
                    boxLocations.map((obj, idx) => {
                      const { key } = obj;
                      const value = form?.[key];
                      return (
                        <ValidationBox
                          key={key}
                          fieldKey={key}
                          name={dpSetting[key] || key}
                          active={activeKey === key}
                          style={obj}
                          value={value}
                          onMouseEnter={() => setActiveKey(key)}
                          onMouseLeave={() => setActiveKey('')}
                          onChange={(val) => onChange(key, val)}
                        />
                      );
                    })
                  }
                </div>
              </div>
            </TransformComponent>
          </>
        </TransformWrapper>
      </GridDiv>
    </div>
  );
}

export default React.forwardRef(ValidationPreview);
