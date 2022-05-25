import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Modal, Form, Button, Row, Col
} from "react-bootstrap";

import { setColors, resetColors } from "@/reducers/global";
import { useForm, FormItem } from "@/hooks/useForm";


function ThemeModal(props) {
  const dispatch = useDispatch();
  const colors = useSelector(state => state.global.colors || {});

  const { modalInfo = {}, onChange = () => { }, onUpdate = () => { } } = props;

  const { isOpen = false, mode = "create" } = modalInfo;

  function onChangeColor(key, value) {
    // console.log(value);
    const newColors = { ...colors, [key]: value };
    dispatch(setColors(newColors));
  }

  function onClose() {
    onChange({ ...modalInfo, isOpen: false });
  }

  function onReset() {
    dispatch(resetColors());
  }

  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      scrollable
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Theme</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="spacer spacer-full" justify="end">
          <Button size="sm" variant="outline-primary" onClick={onReset}>
            Reset All
          </Button>
        </div>
        <h2>Theme Color</h2>
        <hr />
        <Row>
          <Col sm="6">
            <FormItem label="Main Color">
              <Form.Control
                type="color"
                value={colors['--root']}
                onChange={(e) => onChangeColor('--root', e.target.value)}
              />
            </FormItem>
          </Col>
          <Col sm="6">
            <FormItem label="Background Color">
              <Form.Control
                type="color"
                value={colors['--bg-color']}
                onChange={(e) => onChangeColor('--bg-color', e.target.value)}
              />
            </FormItem>
          </Col>
          <Col sm="6">
            <FormItem label="Dark Color">
              <Form.Control
                type="color"
                value={colors['--dark']}
                onChange={(e) => onChangeColor('--dark', e.target.value)}
              />
            </FormItem>
          </Col>
          <Col sm="6">
            <FormItem label="White Color">
              <Form.Control
                type="color"
                value={colors['--white']}
                onChange={(e) => onChangeColor('--white', e.target.value)}
              />
            </FormItem>
          </Col>
        </Row>
        <br />
        <h2>Font</h2>
        <hr />
        <Row>
          <Col sm="6">
            <FormItem label="Dark Color">
              <Form.Control
                type="color"
                value={colors['--font-color-dark']}
                onChange={(e) => onChangeColor('--font-color-dark', e.target.value)}
              />
            </FormItem>
          </Col>
          <Col sm="6">
            <FormItem label="White Color">
              <Form.Control
                type="color"
                value={colors['--font-color-white']}
                onChange={(e) => onChangeColor('--font-color-white', e.target.value)}
              />
            </FormItem>
          </Col>
          <Col sm="6">
            <FormItem label="Font Size">
              <Form.Range min="10" max="20" value={parseInt(colors['--font-size'])} step="1" onChange={(e) => onChangeColor('--font-size', `${e.target.value}px`)} />
            </FormItem>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-dark" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ThemeModal;
