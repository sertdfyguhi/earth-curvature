// in km
const EARTH_RADIUS = 6378.14;
const EARTH_RADIUS_SQUARE = EARTH_RADIUS ** 2;

const RIGHT_ANGLE = 90 * (Math.PI / 180);

const UPSCALE = 2;
const SCALE = 35 / UPSCALE;
const FONT_SIZE = 10 * UPSCALE;
const LINE_WIDTH = 1 * UPSCALE;

/** @type {HTMLCanvasElement} */
const vCanvas = document.getElementById('visualizationCanvas');
const context = vCanvas.getContext('2d');

// double canvas resolution
const computedStyle = getComputedStyle(vCanvas);
vCanvas.width = parseInt(computedStyle.width) * UPSCALE;
vCanvas.height = parseInt(computedStyle.height) * UPSCALE;

const canvasCenterX = vCanvas.width / 2;
const canvasCenterY = vCanvas.height / 2;
const circleRadius = EARTH_RADIUS / SCALE;

function createRotatedText(text, angle, x, y) {
  context.save();

  context.translate(x, y);
  context.rotate(angle);
  context.fillText(text, 0, 0);

  context.restore();
}

function calculateMiddle(x, y, x1, y1) {
  return { x: (x + x1) / 2, y: (y + y1) / 2 };
}

context.lineWidth = LINE_WIDTH;
context.strokeStyle = 'white';
context.fillStyle = 'white';

const font = getComputedStyle(document.documentElement).getPropertyValue(
  '--font'
);
context.font = `50 ${FONT_SIZE}px ${font}`;
context.textAlign = 'center';

// circle
context.beginPath();
context.arc(canvasCenterX, canvasCenterY, circleRadius, 0, 2 * Math.PI);
context.stroke();

// center dot
context.beginPath();
context.arc(canvasCenterX, canvasCenterY, 3, 0, 2 * Math.PI);
context.fill();

// earth radius
context.beginPath();
context.moveTo(canvasCenterX, canvasCenterY);
context.lineTo(canvasCenterX, canvasCenterY - circleRadius);

context.stroke();

// rotated radius length text
createRotatedText(
  `${EARTH_RADIUS}km`,
  -RIGHT_ANGLE,
  canvasCenterX - 3,
  canvasCenterY - circleRadius / 2
);

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

const baseImageData = context.getImageData(0, 0, vCanvas.width, vCanvas.height);

function updateCanvas(distance, curvature) {
  // curvature = Math.round(curvature);
  const scaledDistance = distance / SCALE;
  const scaledCurvature = curvature / SCALE;

  context.putImageData(baseImageData, 0, 0);
  context.beginPath();

  let x = canvasCenterX + scaledDistance;
  let y = canvasCenterY - circleRadius;

  // distance line
  context.moveTo(canvasCenterX, y);
  context.lineTo(x, y);
  context.fillText(`${distance}km`, canvasCenterX + scaledDistance / 2, y - 4);

  // curvature line
  context.lineTo(x, y + scaledCurvature);
  createRotatedText(
    `${curvature.toFixed(2)}km`,
    RIGHT_ANGLE,
    x + 4,
    y + scaledCurvature / 2
  );
  y = y + scaledCurvature;

  context.strokeStyle = 'lime';
  context.stroke();

  // calculation visualization
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(canvasCenterX, canvasCenterY);

  const middle = calculateMiddle(canvasCenterX, canvasCenterY, x, y);
  createRotatedText(
    `r (${EARTH_RADIUS}km)`,
    -RIGHT_ANGLE - Math.atan2(canvasCenterX - x, canvasCenterY - y),
    middle.x,
    EARTH_RADIUS - curvature <= 500 ? middle.y + 18 : middle.y - 4
  );

  // base line
  context.moveTo(x, y);
  context.lineTo(canvasCenterX, y);
  context.fillText(
    `d (${distance}km)`,
    canvasCenterX + scaledDistance / 2,
    y - 3
  );

  // perpendicular line
  context.lineTo(canvasCenterX, canvasCenterY);

  context.strokeStyle = 'blue';
  context.stroke();

  createRotatedText(
    `r - √r² - d² = ${curvature.toFixed(2)}km`,
    RIGHT_ANGLE,
    canvasCenterX + 4,
    canvasCenterY - (circleRadius - scaledCurvature) / 2
  );
}
