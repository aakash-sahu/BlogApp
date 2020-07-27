import React, { useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import { baseUrl2 } from '../shared/baseUrl';
import { TickerLoading } from './LoadingComponent';

function toPixelIntensities(imageData) {
  const pixelIntensities = Array(imageData.length / 4); //RGBA

  for (let i=0; i < imageData.length; i=i+4) {
    pixelIntensities[i/4] = imageData[i+3];
  }
  console.log(pixelIntensities);
  return pixelIntensities
}

function rescaleImagePixels(pixelIntensities, toSize) {
  const fromSize = parseInt(Math.sqrt(pixelIntensities.length));
  const scale = fromSize / toSize;

  const rescaledPixelIntensities = Array(toSize**2);

  for (let i=0; i < rescaledPixelIntensities.length; i++) {
    let xStart = (i%toSize)*scale;
    let xEnd = xStart + scale;
    let yStart = parseInt(i/toSize) * scale;
    let yEnd = yStart + scale;

    let pixelSum = 0;
    for (let x=xStart; x < xEnd; x++) {
      for (let y=yStart; y < yEnd; y++) {
        pixelSum += pixelIntensities[x + y*fromSize]
      }
    }
    rescaledPixelIntensities[i] = pixelSum / (255.0 * scale**2);
  }
  console.log(rescaledPixelIntensities.length);
  return rescaledPixelIntensities
}

function Board() {
    const canvasRef = React.useRef(null);
    const [ctx, setCtx] = useState({});
    const parentRef = React.useRef(null);
    const [drawing, setDrawing] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });

    useEffect( () => {
        let canv = canvasRef.current;
        canv.width = parentRef.current.offsetWidth;
        canv.height = parentRef.current.offsetHeight;

        let canvCtx = canv.getContext("2d");
        canvCtx.lineJoin = "round";
        canvCtx.lineCap = "round"
        canvCtx.lineWidth = 5;
        // canvCtx.width= 28;
        // canvCtx.height=28;
        setCtx(canvCtx);

        let offset = canv.getBoundingClientRect();
        setCanvasOffset({ x: parseInt(offset.left), y: parseInt(offset.top) });
    }, [ctx]);

    function handleMouseDown(e) {
        setDrawing(true);
        setPosition({
            x: parseInt(e.clientX - canvasOffset.x),
            y: parseInt(e.clientY - canvasOffset.y),
          });
      };

    function handleMouseUp() {
        const imageData= ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data;
        console.log(imageData.length);
        const imagePixels = toPixelIntensities(imageData);
        const rescaledImage = rescaleImagePixels(imagePixels, 28);
        console.log("Image data: ",rescaledImage);
        fetch(baseUrl2 + 'digit_recog', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(rescaledImage)
        })
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.log("Error digit:", err))
        setDrawing(false);
      };

    function handleMouseMove(e) {
        let mousex = e.clientX - canvasOffset.x;
        let mousey = e.clientY - canvasOffset.y;
        if (drawing) {
          ctx.strokeStyle = "#000000";
          ctx.beginPath();
          ctx.moveTo(position.x, position.y);
          ctx.lineTo(mousex, mousey);
          ctx.stroke();
        }
        setPosition({ x: mousex, y: mousey });
      };

      function clearCanvas() {
        console.log('Clearing canvas..');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      }

    return (
        <div className= "container">
              <div className="row">
                 <div className="col-12 col-md-4">
                    <h3>Digit Recog</h3>
                    <div className="board"  ref={parentRef}> 
                    {/* ref={parentRef} */}
                        <canvas ref={canvasRef} 
                            onMouseDown={handleMouseDown}
                            onMouseUp={handleMouseUp}
                            onMouseMove={handleMouseMove}
                            width={200}
                            height={200}
                        />
                    </div>
                    <Button onClick={clearCanvas}>Clear</Button>
             </div>
          </div> 
        </div>
    )
}

export default Board;