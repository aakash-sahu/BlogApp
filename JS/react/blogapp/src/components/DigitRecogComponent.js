import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, CardHeader, CardText, CardGroup } from 'reactstrap';
import { baseUrl2 } from '../shared/baseUrl';
import { TickerLoading } from './LoadingComponent';
import { HorizontalBar , Bar} from 'react-chartjs-2';

function toPixelIntensities(imageData) {
  const pixelIntensities = Array(imageData.length / 4); //RGBA

  for (let i=0; i < imageData.length; i=i+4) {
    pixelIntensities[i/4] = imageData[i+3];
  }
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
};

function Board() {
    const canvasRef = React.useRef(null);
    const [ctx, setCtx] = useState({});
    const [drawing, setDrawing] = useState(false);
    const [position, setPosition] = useState(null);
    const [predictions, setPredictions] = useState([0,0,0,0,0,0,0,0,0,0]);

    useEffect( () => {
        let canv = canvasRef.current;

        let canvCtx = canv.getContext("2d");
        // canvCtx.lineJoin = "round";
        // canvCtx.lineCap = "round"
        // canvCtx.lineWidth = 5;
        setCtx(canvCtx);

    }, [ctx]);

    function handleMouseDown(e) {
        setDrawing(true);
        setPosition(getCursorPosition(e));
      };

    function handleMouseUp() {
        const imageData= ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data;
        console.log(imageData.length);
        const imagePixels = toPixelIntensities(imageData);
        const rescaledImage = rescaleImagePixels(imagePixels, 28);
        // console.log("Image data: ",rescaledImage);
        fetch(baseUrl2 + 'digit_recog', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(rescaledImage)
        })
        .then(response => response.json())
        .then(response => {
            // console.log(response.pred);
            const output = response.pred.map((pred) => parseFloat(pred.toFixed(4)));
            setPredictions(output);
        })
        .catch(err => console.log("Error digit:", err))
        setDrawing(false);
      };

    function handleMouseMove(e) {

        if (drawing) {

            const previousPosition = position;
            const currentPosition = getCursorPosition(e);
        
            drawLine(previousPosition, currentPosition);
        };
        setPosition({position:getCursorPosition(e)});
      };

      function clearCanvas() {
        console.log('Clearing canvas..');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        setPredictions([0,0,0,0,0,0,0,0,0,0]);
      };

      function getCursorPosition(e) {
        let xPos, yPos;
        if (e.touches !== undefined) {
          xPos = e.touches[0].clientX;
          yPos = e.touches[0].clientY
        } else {
          xPos = e.clientX;
          yPos = e.clientY;
        }
        const {top, left} = ctx.canvas.getBoundingClientRect();
        return {
          x: xPos - left,
          y: yPos - top
        };
      };
    
    function drawLine(start, end) {
        ctx.save();
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.lineWidth = 16;
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      };

      const chartData = {
        labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        datasets: [
          {
            backgroundColor: '#EC932F',
            borderColor: '#EC932F',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,0.4)',
            data: predictions
          }
        ]
      };
      const chartOptions = {
        maintainAspectRatio:false,
        tooltips: {
          mode: 'label'
        },
        scales: {
          xAxes: [
            {
              display: true,
              gridLines: {
                display: true
              },
            //   labels: [0, 20,40,60,80,100],
              scaleLabel :{
                  display:true,
                  labelString: 'Predict Probability'
              },
              ticks: {
                  min:0,
                  max:100,
                  stepSize: 20
              }
            }],
          yAxes: [
            {
              gridLines: {
                display: true
              },
              scaleLabel :{
                  display:true,
                  labelString: 'Digit'
              }
            }]
        }
      };

    return (
        <div className= "container">
            <div className="row mb-4">
                <div className="col-12">
                    <Card>
                        <CardHeader className="bg-secondary text-white"><h3>Digit Recognition with CNN</h3></CardHeader>
                        <CardText className="pt-2 pl-2 pr-2">Using the MNIST data, and PyTorch, a Convolutional Neural Network with 2 convolutional layers and 2 fully connected layers
                        build and trained to recognize the image of a digit.
                        </CardText>
                        <CardText className="pb-2 pl-2 pr-2">
                        Each digit is scaled to a 28x28 resolution and fed into the CNN.</CardText>
                    </Card>
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-md-6">
                    <Card>
                        <CardHeader className="text-center"><h4>Draw single digit</h4></CardHeader>
                    </Card>
                    <div className="row">
                        <div className="board "> 
                                <canvas ref={canvasRef} 
                                    onMouseDown={handleMouseDown}
                                    onMouseUp={handleMouseUp}
                                    onMouseMove={handleMouseMove}
                                    // onMouseOut={handleMouseUp}
                                    width={224}
                                    height={224}
                                />
                            </div>
                    </div>
                    <div className="text-center mt-3">
                        <Button onClick={clearCanvas} >Clear</Button>
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <Card>
                        <CardHeader className="text-center"><h4>Prediction</h4></CardHeader>
                        <CardBody>
                            <div className="row">
                                <div className="col-6"> 
                                    <HorizontalBar data={chartData} width={20} height={250} 
                                         legend={{display:false}} options={chartOptions}/>
                                </div>
                                <div className="col-6"> 
                                    {predictions.find((pred) => pred>0)? <p className="text-center pred-num">{predictions.indexOf(Math.max(...predictions))}</p>:<p className="text-center">Draw a digit to predict</p>}
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div> 
            </div>
        </div>
    )
}

export default Board;