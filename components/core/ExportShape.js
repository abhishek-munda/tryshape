import React, { useState, useEffect } from "react";

// dynamic from Next.js
import dynamic from "next/dynamic";

// Bootstrap
import Modal from "react-bootstrap/Modal";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'

// Styled Component
import styled from "styled-components";

// Clip-Path
const Shape = dynamic(import("react-clip-path"), { ssr: false });

const ShapeContainer = styled.section`
    border: solid 1px var(--color-neutral-30);
    padding: 1rem;
`;

// Toast
import toast from "react-hot-toast";

// html-to-image
import { toPng, toJpeg, toSvg, toCanvas } from "html-to-image";

// downloadjs
import download from "downloadjs";

// misc utilities
import { getShapeId } from "../../utils/misc";

// Radios
import { Radios } from "..";

// Component
const ExportShape = ({ show, setShow, shape }) => {
  console.log({ shape });

  // state object to hold the export data
  const [exportData, setExportData] = useState();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setExportData({
      'name': shape.name,
      'type': 'png',
      'width': '240',
      'height': '240',
      'backgroundColor': shape.backgroundColor
    });
    setLoaded(true);
  }, [show])

  // Handles the input changes and update
  // the state object
  const handleChange = (evt) => {
    evt.preventDefault();

    const name = evt.target.name;
    let value =
        evt.target.type === "number" 
            ? evt.target.valueAsNumber 
            : evt.target.value;

    if (value < 0) {
        return;
    }

    if (Number.isNaN(value)) {
        value = "";
    }

    setExportData({
      ...exportData,
      [name]: value
    });
    
    console.log({exportData});
  };

  // Export method
  const doExport = (id, name) => {
    console.log(`Save as ${exportData.type}`);
    switch (exportData.type) {
      case "png":
        exportAsPNG(id, name);
        break;
      case "jpeg":
        exportAsJPEG(id, name);
        break;
      case "svg":
        exportAsSVG(id, name);
        break;
      default:
        exportAsPNG(id, name);
        break;
    }
  };

  const exportAsPNG = (id, name) => {
    toPng(document.getElementById(id)).then(function (dataUrl) {
      console.log(dataUrl);
      download(dataUrl, `${name}.png`);
      toast.success(`${name}.png has been exported sucessfully!`);
    });
  };

  const exportAsJPEG = (id, name) => {
    toJpeg(document.getElementById(id), { quality: 0.95 }).then(function (
      dataUrl
    ) {
      console.log(dataUrl);
      download(dataUrl, `${name}.jpeg`);
      toast.success(`${name}.jpeg has been exported sucessfully!`);
    });
  };
  const exportAsSVG = (id, name) => {
    toSvg(document.getElementById(id)).then(function (dataUrl) {
      console.log(dataUrl);
      download(dataUrl, `${name}.svg`);
      toast.success(`${name}.svg has been exported sucessfully!`);
    });
  };
  return (
    <>
      {loaded && (
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          show={show}
          onHide={() => setShow(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Export {exportData.name} </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container fluid>
              <Row>
                <Col>
                  <Form>
                    <Form.Group className="mb-3" controlId="export-name">
                      <Form.Label>Name</Form.Label>
                      <Form.Control type="text" name="name" value={exportData.name} onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="exampleColorInput">Color picker</Form.Label>
                      <Form.Control
                        type="color" 
                        name="backgroundColor" 
                        id="export-color" 
                        value={exportData.backgroundColor} 
                        onChange={handleChange} 
                        className="form-control-color"
                      />
                    </Form.Group>
                    <Row>
                      <Form.Group as={Col} controlId="export-width">
                        <Form.Label>Set a width(in px)</Form.Label>
                        <Form.Control
                          type="range" 
                          min="100" 
                          max="700" 
                          value={exportData.width} 
                          id="export-width"
                          name="width"
                          onChange={handleChange}/>
                      </Form.Group>
                      <Form.Group as={Col} controlId="export-height">
                        <Form.Label>Set a height(in px)</Form.Label>
                        <Form.Control
                          type="range" 
                          min="100" 
                          max="700" 
                          value={exportData.height} 
                          id="export-height"
                          name="height"
                          onChange={handleChange}/>
                      </Form.Group>
                    </Row>
                    
                    {/* <div>
                      <label htmlFor="export-name">Name</label>
                      <input 
                        type="text" 
                        name="name" 
                        id="export-name" 
                        value={exportData.name} 
                        onChange={handleChange} />
                    </div> */}

                    {/* <div>
                      <label htmlFor="export-color">Color</label>
                      <input 
                        type="color" 
                        name="backgroundColor" 
                        id="export-color" 
                        value={exportData.backgroundColor} 
                        onChange={handleChange} />
                    </div> */}

                    {/* <div>
                      <label htmlFor="export-width">Set a width(in px)</label>
                      <input 
                        type="range" 
                        min="100" 
                        max="700" 
                        value={exportData.width} 
                        id="export-width"
                        name="width"
                        onChange={handleChange} />

                      <label htmlFor="export-height">Set a height(in px)</label>
                      <input 
                        type="range" 
                        min="100" 
                        max="700" 
                        value={exportData.height} 
                        id="export-height"
                        name="height"
                        onChange={handleChange} />
                    </div> */}

                    <div>
                    <Form.Group>
                      <Form.Label>File Format</Form.Label>
                      <div>
                        <ToggleButtonGroup type="radio" name="options" defaultValue={1} variant="outline-dark" size="sm" defaultValue={'png'}>
                          <ToggleButton id="tbg-radio-1" value={'png'} variant="outline-dark">
                              PNG
                          </ToggleButton>
                          <ToggleButton id="tbg-radio-2" value={'jpeg'} variant="outline-dark">
                              JPEG
                          </ToggleButton>
                          <ToggleButton id="tbg-radio-3" value={'svg'} variant="outline-dark">
                              SVG
                          </ToggleButton>
                        </ToggleButtonGroup>
                      </div>
                    </Form.Group>
                      <Radios
                        groupName="type"
                        heading="Export as:"
                        options={[
                          { value: "png", displayValue: "PNG" },
                          { value: "jpeg", displayValue: "JPEG" },
                          { value: "svg", displayValue: "SVG" },
                        ]}
                        selectedOption={exportData.type}
                        onValueChange={handleChange}
                      />
                    </div>
                    
                  </Form>
                </Col>
                <Col>
                    <ShapeContainer>
                      <Shape
                        name={exportData.name}
                        formula={shape.formula}
                        width={`${exportData.width}px`}
                        height={`${exportData.height}px`}
                        backgroundColor={exportData.backgroundColor}
                        id={getShapeId(exportData.name, true)}
                      />
                  </ShapeContainer>
                </Col>
              </Row>
            </Container>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="outline-info">
              Cancel
            </Button>
            <Button variant="secondary"
              onClick={() => doExport(getShapeId(exportData.name, true), exportData.name)}
            >
              Export
            </Button>
            
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default ExportShape;
