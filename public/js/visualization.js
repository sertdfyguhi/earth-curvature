// in km
const EARTH_RADIUS = 6378.14;
const EARTH_RADIUS_SQUARE = EARTH_RADIUS ** 2;

const SCALE = 35;

/** @type {HTMLCanvasElement} */
const vCanvas = document.getElementById('visualizationCanvas');
const context = vCanvas.getContext('2d');

const canvasCenterX = vCanvas.width / 2;
const canvasCenterY = vCanvas.height / 2;
const circleRadius = EARTH_RADIUS / SCALE;

function createRotatedText(text, angle, x, y) {
  context.save();

  context.translate(x, y);
  context.rotate(angle * (Math.PI / 180));
  context.fillText(text, 0, 0);

  context.restore();
}

context.strokeStyle = 'white';
context.fillStyle = 'white';

const font = getComputedStyle(document.documentElement).getPropertyValue(
  '--font'
);
context.font = `50 11px ${font}`;
context.textAlign = 'center';

context.beginPath();

context.arc(canvasCenterX, canvasCenterY, circleRadius, 0, 2 * Math.PI);

context.stroke();

// earth radius
context.beginPath();

context.moveTo(canvasCenterX, canvasCenterY);

context.lineTo(canvasCenterX, canvasCenterY - circleRadius);

context.strokeStyle = '#26FF4D';
context.stroke();

// rotated radius length text
createRotatedText(
  `${EARTH_RADIUS}km`,
  -90,
  canvasCenterX - 3,
  canvasCenterY - circleRadius / 2
);

context.beginPath();

// center dot
context.arc(canvasCenterX, canvasCenterY, 3, 0, 2 * Math.PI);

context.fill();

// let earthImageData;
// const earthImageElement = new Image();
// earthImageElement.src = '/earth.png';

// earthImageElement.addEventListener('load', e => {
//   context.globalCompositeOperation = 'destination-over';

//   const imgWidth =
//     vCanvas.height * (earthImageElement.width / earthImageElement.height) - 50;
//   const imgHeight = vCanvas.height - 50;

//   context.align;
//   context.drawImage(
//     earthImageElement,
//     (vCanvas.width - imgWidth) / 2,
//     (vCanvas.height - imgHeight) / 2,
//     imgWidth,
//     imgHeight
//   );
//   context.globalCompositeOperation = 'source-over';

//   earthImageData = context.getImageData(0, 0, vCanvas.width, vCanvas.height);
// });

const earthImageData = context.getImageData(
  0,
  0,
  vCanvas.width,
  vCanvas.height
);

function updateCanvas(distance, curvature) {
  curvature = Math.round(curvature);

  context.putImageData(earthImageData, 0, 0);
  context.beginPath();

  const y = canvasCenterY - circleRadius;

  context.moveTo(canvasCenterX, y);

  const x = canvasCenterX + distance / SCALE;

  context.lineTo(x, y);
  context.fillText(
    `${distance}km`,
    canvasCenterX + distance / SCALE / 2,
    y - 3
  );

  context.lineTo(x, y + curvature / SCALE);
  createRotatedText(`${curvature}km`, 90, x + 3, y + curvature / SCALE / 2);

  context.stroke();
}
