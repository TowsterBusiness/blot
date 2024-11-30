/*
 @title: Generative wood using hermite splines
 @author: Towster
 @snapshot: image.png
*/

const width = 125;
const height = 125;



// Changeable Variables
const blindHeight = 10; 
const blindGapHeight = 4;
const blindLength = 100;






const blindStart = ( width - blindLength ) / 2
const blindEnd = width - ( width - blindLength ) / 2

setDocDimensions(width, height);

for (let rowIndex = -(blindHeight + blindGapHeight); rowIndex < height; rowIndex += blindHeight + blindGapHeight) {
  drawLines([[[blindStart, rowIndex], [blindStart, rowIndex + blindHeight]]]);
  drawLines([[[blindEnd, rowIndex], [blindEnd, rowIndex + blindHeight]]]);

  const eyeStartAngle = bt.randInRange(0, -50)
  const eyeEndAngle = bt.randInRange(0, 50)
  const eyeStartPos = bt.randInRange(blindStart + 10, blindEnd - 30)
  const eyeEndPos = eyeStartPos + bt.randInRange(5, 20)
  const strength = 10; 
  drawLines([drawHermite([[blindStart, rowIndex + blindHeight], [eyeStartPos, rowIndex + blindHeight], [0, 0], [eyeStartAngle, strength]], 0.01)]);
  drawLines([drawHermite([[eyeStartPos, rowIndex + blindHeight], [eyeEndPos, rowIndex + blindHeight], [eyeStartAngle, strength], [eyeEndAngle, strength]], 0.01)]);
  drawLines([drawHermite([[eyeEndPos, rowIndex + blindHeight], [blindEnd, rowIndex + blindHeight], [eyeEndAngle, strength], [0, 0]], 0.01)]);

  drawLines([drawHermite([[blindStart, rowIndex + blindHeight + blindGapHeight], [eyeStartPos, rowIndex + blindHeight + blindGapHeight], [0, 0], [-eyeStartAngle, strength]], 0.01)]);
  drawLines([drawHermite([[eyeStartPos, rowIndex + blindHeight + blindGapHeight], [eyeEndPos, rowIndex + blindHeight + blindGapHeight], [-eyeStartAngle, strength], [-eyeEndAngle, strength]], 0.01)]);
  drawLines([drawHermite([[eyeEndPos, rowIndex + blindHeight + blindGapHeight], [blindEnd, rowIndex + blindHeight + blindGapHeight], [-eyeEndAngle, strength], [0, 0]], 0.01)]);


  drawLines([drawHermite([[eyeStartPos, rowIndex + blindHeight + blindGapHeight / 2], [eyeEndPos, rowIndex + blindHeight + blindGapHeight / 2], [eyeStartAngle, strength * 1.5], [eyeEndAngle, strength * 1.5]], 0.01)]);
  drawLines([drawHermite([[eyeStartPos, rowIndex + blindHeight + blindGapHeight / 2], [eyeEndPos, rowIndex + blindHeight + blindGapHeight / 2], [-eyeStartAngle, strength * 1.5], [-eyeEndAngle, strength * 1.5]], 0.01)]);

  let strengthMult = 1;
  for (let rivets = rowIndex + blindHeight + blindGapHeight + 1; rivets <= rowIndex + blindGapHeight + blindHeight + blindHeight/2; rivets += 1) {
    strengthMult -= 0.2; 
    drawLines([drawHermite([[blindStart, rivets], [eyeStartPos, rivets], [0, 0], [-eyeStartAngle, strength * strengthMult]], 0.01)]);
    drawLines([drawHermite([[eyeStartPos, rivets], [eyeEndPos, rivets], [-eyeStartAngle, strength * strengthMult], [-eyeEndAngle, strength * strengthMult]], 0.01)]);
    drawLines([drawHermite([[eyeEndPos, rivets], [blindEnd, rivets], [-eyeEndAngle, strength * strengthMult], [0, 0]], 0.01)]);
  }

  strengthMult = 1;
  for (let rivets = rowIndex + blindHeight - 1 ; rivets >= rowIndex + blindHeight - blindHeight/2; rivets -= 1) {
    strengthMult -= 0.2; 
    drawLines([drawHermite([[blindStart, rivets], [eyeStartPos, rivets], [0, 0], [eyeStartAngle, strength * strengthMult]], 0.01)]);
    drawLines([drawHermite([[eyeStartPos, rivets], [eyeEndPos, rivets], [eyeStartAngle, strength * strengthMult], [eyeEndAngle, strength * strengthMult]], 0.01)]);
    drawLines([drawHermite([[eyeEndPos, rivets], [blindEnd, rivets], [eyeEndAngle, strength * strengthMult], [0, 0]], 0.01)]);
  }
 
}




/*
controlPoints - [p0, p1, v0, v1]
 "v" s are angle and magnitude based [angle (angle), magnitude]
t (range) - (0 ~ 1)
*/

function hermiteCurve(controlPoints, t) {
  const pos1 = controlPoints[0]
  const pos2 = controlPoints[1]
  const vel1Angle = degreesToRadians(controlPoints[2][0])
  const vel2Angle = degreesToRadians(controlPoints[3][0])
  const vel1 = [Math.cos(vel1Angle) * controlPoints[2][1], Math.sin(vel1Angle) * controlPoints[2][1]]
  const vel2 = [Math.cos(vel2Angle) * controlPoints[3][1], Math.sin(vel2Angle) * controlPoints[3][1]]
  
  const t2 = t * t
  const t3 = t * t * t

  const x = (2 * t3 - 3 * t2 + 1) * pos1[0] + (t3 - 2 * t2 + t) * vel1[0] + (-2 * t3 + 3 * t2) * pos2[0] + (t3 - t2) * vel2[0]
  const y = (2 * t3 - 3 * t2 + 1) * pos1[1] + (t3 - 2 * t2 + t) * vel1[1] + (-2 * t3 + 3 * t2) * pos2[1] + (t3 - t2) * vel2[1]
  return [x, y]
}

function drawHermite(controlPoints, dt) {
  let polyLine = []
  for (let i = 0; i <= 1; i+= dt) {
    polyLine.push(hermiteCurve(controlPoints, i));
  }
  return polyLine
}

function degreesToRadians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}