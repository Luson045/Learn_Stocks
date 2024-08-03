import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import Navbar from './Navbar';
import getEnvironment from "../getenvironment";

const Canvas = () => {
  const apiUrl = getEnvironment();
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [textValue, setTextValue] = useState('Hello Canvas');
  const [fontSize, setFontSize] = useState(20);

  useEffect(() => {
    const canvasInstance = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#f0f0f0',
    });
    setCanvas(canvasInstance);

    canvasInstance.isDrawingMode = false;

    return () => {
      canvasInstance.dispose();
    };
  }, []);

  const addRectangle = () => {
    const rect = new fabric.Rect({
      left: 50,
      top: 50,
      fill: 'blue',
      width: 100,
      height: 100,
      selectable: true,
      hasControls: true,
    });
    canvas.add(rect);
  };

  const addCircle = () => {
    const circle = new fabric.Circle({
      left: 150,
      top: 150,
      fill: 'green',
      radius: 50,
      hasControls: true,
    });
    canvas.add(circle);
  };

  const addText = () => {
    const text = new fabric.Textbox(textValue, {
      left: 200,
      top: 200,
      fill: 'black',
      fontSize: fontSize,
      selectable: true,
      hasControls: true,
    });
    canvas.add(text);
  };

  const handleTextChange = (e) => {
    setTextValue(e.target.value);
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'textbox') {
      activeObject.set({ text: e.target.value });
      canvas.renderAll();
    }
  };

  const handleFontSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setFontSize(newSize);
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'textbox') {
      activeObject.set({ fontSize: newSize });
      canvas.renderAll();
    }
  };

  const changeObjectColor = (color) => {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.set({ fill: color });
      canvas.renderAll();
    }
  };

  const deleteObject = () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
      canvas.discardActiveObject();
    }
  };

  const generateHTMLAndCSS = () => {
    let html = '';
    let css = '';

    canvas.getObjects().forEach((obj, index) => {
      if (obj.type === 'rect') {
        html += `<div id="rect${index}"></div>\n`;
        css += `#rect${index} {
          position: absolute;
          left: ${obj.left}px;
          top: ${obj.top}px;
          width: ${obj.width * obj.scaleX}px;
          height: ${obj.height * obj.scaleY}px;
          background-color: ${obj.fill};
        }\n`;
      } else if (obj.type === 'circle') {
        html += `<div id="circle${index}"></div>\n`;
        css += `#circle${index} {
          position: absolute;
          left: ${obj.left - obj.radius}px;
          top: ${obj.top - obj.radius}px;
          width: ${obj.radius * 2 * obj.scaleX}px;
          height: ${obj.radius * 2 * obj.scaleY}px;
          background-color: ${obj.fill};
          border-radius: 50%;
        }\n`;
      } else if (obj.type === 'textbox') {
        html += `<div id="text${index}">${obj.text}</div>\n`;
        css += `#text${index} {
          position: absolute;
          left: ${obj.left}px;
          top: ${obj.top}px;
          font-size: ${obj.fontSize}px;
          color: ${obj.fill};
        }\n`;
      }
    });

    return { html, css };
  };

  const handleGenerate = async () => {
    const title = prompt('Enter a title for this canvas:');
    if (!title) return;

    const { html, css } = generateHTMLAndCSS();
    const combinedHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { margin: 0; }
          background-color: white;
          ${css}
        </style>
      </head>
      <body>
        ${html}
      </body>
      </html>
    `;

    try {
      const response = await fetch(`${apiUrl}/api/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content: combinedHTML }),
      });

      if (response.ok) {
        alert('Canvas saved successfully!');
      } else {
        alert('Failed to save canvas.');
      }
    } catch (error) {
      console.error('Error saving canvas:', error);
      alert('Error saving canvas.');
    }
  };

  return (
    <>
    <Navbar/>
    <div className="canvas-container">
      <canvas ref={canvasRef} className="canvas-element" />
      <div className="controls-container">
        <button onClick={() => canvas.isDrawingMode = !canvas.isDrawingMode}>
          {canvas?.isDrawingMode ? 'Disable Drawing Mode' : 'Enable Drawing Mode'}
        </button>
        <button onClick={addRectangle}>Add Rectangle</button>
        <button onClick={addCircle}>Add Circle</button>
        <button onClick={addText}>Add Text</button>
        <input type="text" value={textValue} onChange={handleTextChange} placeholder="Enter text" />
        <input type="number" value={fontSize} onChange={handleFontSizeChange} placeholder="Font size" />
        <div className="color-buttons">
          <button onClick={() => changeObjectColor('red')} style={{ backgroundColor: 'red', height: '20px' }} />
          <button onClick={() => changeObjectColor('blue')} style={{ backgroundColor: 'blue', height: '20px'  }} />
          <button onClick={() => changeObjectColor('green')} style={{ backgroundColor: 'green', height: '20px'  }} />
          <button onClick={() => changeObjectColor('yellow')} style={{ backgroundColor: 'yellow', height: '20px'  }} />
          <button onClick={() => changeObjectColor('purple')} style={{ backgroundColor: 'purple', height: '20px'  }} />
        </div>
        <button onClick={deleteObject}>Delete Selected Object</button>
        <button onClick={handleGenerate}>Save Canvas</button>
      </div>
    </div>
    </>
  );
};

export default Canvas;
