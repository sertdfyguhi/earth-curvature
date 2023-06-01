const gradientElement = document.getElementById('gradient');
const distanceElement = document.getElementById('distance');
const curvTextElement = document.getElementById('curvatureText');
const curvHeaderElement = document.getElementById('curvatureHeader');

// hides gradient while animation
setTimeout(() => {
  gradientElement.style.opacity = '0';
  setTimeout(() => (gradientElement.style.display = 'none'), 500);
}, 250);

function createDistString(n) {
  let outArray = [`${n.toFixed(5)}km`];

  if (n < 1) {
    outArray.unshift(`${(n * 1000).toFixed(5)}m`);
  }
  if (n < 0.001) {
    outArray.unshift(`${(n * 1000 * 100).toFixed(5)}cm`);
  }

  return outArray.join('<br>');
}

let firstInputFlag = true;

distanceElement.addEventListener('input', e => {
  if (firstInputFlag) {
    curvHeaderElement.style.display = 'block';
    vCanvas.style.display = 'block';
    firstInputFlag = false;
  }

  const distance = distanceElement.value;

  if (distance == 0) {
    curvTextElement.innerText = '';
  }

  if (Math.abs(distance) > EARTH_RADIUS) {
    console.error('distance larger than the earth');
  } else {
    const curvature =
      EARTH_RADIUS - Math.sqrt(EARTH_RADIUS_SQUARE - distance ** 2);

    updateCanvas(distance, curvature);
    curvTextElement.innerHTML = createDistString(curvature);
  }
});
