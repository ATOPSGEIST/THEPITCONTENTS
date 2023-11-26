let gridSize = 50;
let cameraX = 0;
let cameraY = 0;
let cameraZ = 200;
let speed = 5;
let cameraSpeed= 10
let sprintSpeed = 20;
let bobAmount = 2;
let movingForward = false;
let movingBackward = false;
let movingLeft = false;
let movingRight = false;
let sprinting = false;
let pitchLimit;
let noiseOffset = 0;
let fadeSpeed = 2;
let img;
let cam;
let camX = 0;
let camY = 0;
let camZ = 0;
let bobAmplitude = 0.5; // Adjust the amplitude for the bobbing effect
let bobSpeed = 100; // Adjust the speed of the bobbing effect
let mouseXPrev;
let text3D;
let textClicked = false;
let font;
let verticalImagesFront = [];
let verticalImagesBack = [];
let currentAngle = 1.57545;
let targetAngle = 0;
let rotationSpeedf = 0.05; // Adjust this value for the animation speed
let frontTexture;
let frontTexture2;
let frontTexture3;
let frontTexture4;
let backTexture;






// Variables for the abstract forms
let rotationAngle = 0;
let rotationSpeed = 0.02;
let formScale = 1000;
let formAmplitude = 100;

let lookAtX = 0;
let lookAtY = -200;
let lookAtZ = 0;

function preload() {
  img = loadImage('IMG-2277.JPG');
  font = loadFont('Txt Regular.ttf');
   for (let i = 0; i < 5; i++) {
    verticalImagesBack.push(loadImage('IMG-2277.JPG'));
  }
  frontTexture = loadImage('IMG_7722.JPG');
  frontTexture2 = loadImage('ME.jpg'); 
  frontTexture3 = loadImage('2TASTDHWHOLEWB@.jpg');// Replace 'front_texture.jpg' with your front texture image file
  frontTexture4 = createVideo('FIUNAL SHORT SHORT.mp4');
  backTexture = loadImage('hippie-flowers-jeff-hobrath.jpg'); // Replace 'back_texture.jpg' with your back texture image file

}



function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  cam = createCamera();
  camZ = 200;// Set the pitch limit to 60 degrees
    cam.setPosition(camX, -200, camZ);
  cam.lookAt(0, -200, 0);
  mouseXPrev = mouseX;
    for (let i = 0; i < 5; i++) {
    verticalImagesFront.push(loadImage('hippie-flowers-jeff-hobrath.jpg'));
  }

}

function draw() {
  background(0);
  handleCameraMovement();
  drawGrid();
  drawAbstractForms();
  drawVerticalImages(currentAngle);


}

function handleCameraMovement() {

  // Move the camera to simulate player movement
  let currentSpeed = sprinting ? sprintSpeed : cameraSpeed;

  // Calculate the forward vector
  let forward = createVector(lookAtX - camX, lookAtY - camY, lookAtZ - camZ).normalize().mult(currentSpeed);

  // Calculate the right vector
  let right = forward.copy().cross(createVector(0, 1, 0)).normalize().mult(currentSpeed);

  // Calculate the up vector for bobbing
  let up = sin(frameCount * 100);

  if (keyIsDown(87)) { // W key (forward)
    camX += forward.x;
    camY += bobAmplitude * sin(frameCount * bobSpeed);
    camZ += forward.z;
    lookAtX += forward.x;
    lookAtZ += forward.z;
    camera.eye += bobAmplitude * sin(frameCount * bobSpeed);
  }
  if (keyIsDown(83)) { // S key (backward)
    camX -= forward.x;
    camZ -= forward.z;
    camY += bobAmplitude * sin(frameCount * bobSpeed);
    lookAtX -= forward.x;
    lookAtZ -= forward.z;
    cam.eyeY += up.y;
  }
  if (keyIsDown(65)) { // A key (left)
    camX -= right.x;
    camZ -= right.z;
    camY += bobAmplitude * sin(frameCount * bobSpeed);
    lookAtX -= right.x;
    lookAtZ -= right.z;
    cam.eyeY += up.y;
  }
  if (keyIsDown(68)) { // D key (right)
    camX += right.x;
    camZ += right.z;
    camY += bobAmplitude * sin(frameCount * bobSpeed);
    lookAtX += right.x;
    lookAtZ += right.z;
    cam.eyeY += up.y;
  }
  if (keyIsDown(16)) { // Shift key (sprinting)
    sprinting = true;
  } else {
    sprinting = false;
  }

  cam.setPosition(camX, camY - 200, camZ);
  cam.lookAt(lookAtX, lookAtY, lookAtZ);
}

function mousePressed() {
  // Check if the mouse clicked on the 3D text
  if (text3D.contains(mouseX, mouseY)) {
    textClicked = !textClicked; // Toggle the visibility of the text
  }
}

class ClickableText {
  constructor(text, x, y, z) {
    this.text = text;
    this.position = createVector(x, y, z);
    this.textSize = 30;
    textFont(font);
  }

  display() {
    push();
    translate(this.position);
    rotateX(-HALF_PI)
    rotateX(radians(90)); // Rotate text to face the camera
    textSize(this.textSize);
    fill(255);
    text(this.text, 0, 0);
    pop();
  }

  contains(x, y) {
    // Check if the mouse coordinates are within the clickable text area
    let textX = width / 2 + this.position.x - textWidth(this.text) / 2;
    let textY = height / 2 + this.position.y - this.textSize / 2;
    return x >= textX && x <= textX + textWidth(this.text) && y >= textY && y <= textY + this.textSize;
  }
}


function mouseDragged() {
  // Calculate the change in mouse position
  let dx = mouseX - pmouseX;
  let dy = mouseY - pmouseY;
  


  // Adjust the camera's look-at position based on mouse movement
  lookAtX += dx * 1; // Adjust the sensitivity as needed for horizontal movement
  lookAtY += dy * 1; // Adjust the sensitivity as needed for vertical movement

  // Ensure that the camera's lookAtY stays within a reasonable range
  lookAtY = constrain(lookAtY, -800, 800);

  // Update the camera's position to match the new look-at position
  cam.lookAt(lookAtX, lookAtY, lookAtZ);

  // Prevent default behavior to avoid selecting text or other elements
   console.log(lookAtX)
  return false;
 
}

function drawGrid() {
  push(); // Save the current transformation matrix
  rotateX(PI / 2);
  
  // Draw the grid on the X-Z plane
  let maxRadius = 50 * gridSize;
  for (let x = -maxRadius; x < maxRadius; x += gridSize) {
    for (let z = -maxRadius; z < maxRadius; z += gridSize) {
      let d = dist(x, z, 0, 0);
      let alpha = map(d, 0, maxRadius, 255, 0);
      fill(200, alpha);
      rect(x, z, gridSize, gridSize);
    }
  }
  
  pop(); // Restore the previous transformation matrix
}

function drawAbstractForms() {
  push();
  translate(0, map(noise(noiseOffset + -3000 * 0.1), -2000, 1, -2000, -2000), map(noise(noiseOffset + -5000 * 0.1), -2000, 1, -3000, -3000)); // Position the abstract forms in the distance

  // Rotate and animate the forms
  rotateY(rotationAngle);
  rotationAngle += rotationSpeed;

  // Draw animated abstract forms
  for (let i = 0; i < 5; i++) {
    let yOffset = map(noise(noiseOffset + i * 0.1), 0, 1, -formAmplitude, formAmplitude);
    let xOffset = map(noise(noiseOffset + 100 + i * 0.1), 0, 1, -formAmplitude, formAmplitude);
    let sizeFactor = map(noise(noiseOffset + 200 + i * 0.1), 0, 1, 0.5, 1.5);
    let rotationX = map(noise(noiseOffset + 300 + i * 0.1), 0, 1, 0, TWO_PI);
    let rotationY = map(noise(noiseOffset + 400 + i * 0.1), 0, 1, 0, TWO_PI);
    let rotationZ = map(noise(noiseOffset + 500 + i * 0.1), 0, 1, 0, TWO_PI);

    // Use Perlin noise to create fading in and out effects
    let alpha = map(noise(noiseOffset + 600 + i * 0.1), 0, 1, 0, 255);

    // Smoothly interpolate alpha to create fading effect
    let targetAlpha = 255; // Fully visible
    alpha = lerp(alpha, targetAlpha, fadeSpeed * 0.01);

    translate(xOffset, yOffset, 0);
    rotateX(rotationX);
    rotateY(rotationY);
    rotateZ(rotationZ);

    noStroke(); // Set stroke color with interpolated alpha
    fill(map(noise(noiseOffset + 220 * 0.1), 0, 1, 220, 0), alpha);   // Set fill color with interpolated alpha

    let boxSize = formScale * sizeFactor;
    box(boxSize);
  }

  noiseOffset += 0.01; // Increment the noise offset for the next frame
  pop();
  
  
  
   push();
  translate(map(noise(noiseOffset + -5000 * 0.1), -2000, 1, -3000, -3000), map(noise(noiseOffset + 3000 * 0.1), 2000, 1, 2000, 2000), map(noise(noiseOffset + -5000 * 0.1), -2000, 1, -3000, -3000)); // Position the abstract forms in the distance

  // Rotate and animate the forms
  rotateY(rotationAngle);
  rotationAngle += rotationSpeed;

  // Draw animated abstract forms
  for (let i = 0; i < 5; i++) {
    let yOffset = map(noise(noiseOffset + i * 0.2), 0, 1, -formAmplitude, formAmplitude);
    let xOffset = map(noise(noiseOffset + 50000 + i * 0.1), 0, 5000, -formAmplitude, formAmplitude);
    let sizeFactor = map(noise(noiseOffset + 200 + i * 0.1), 0, 1, 0.5, 1.5);
    let rotationX = map(noise(noiseOffset + 300 + i * 0.1), 0, 1, 0, TWO_PI);
    let rotationY = map(noise(noiseOffset + 400 + i * 0.1), 0, 1, 0, TWO_PI);
    let rotationZ = map(noise(noiseOffset + 500 + i * 0.1), 0, 1, 0, TWO_PI);

    // Use Perlin noise to create fading in and out effects
    let alpha = map(noise(noiseOffset + 600 + i * 0.1), 0, 1, 0, 100);

    // Smoothly interpolate alpha to create fading effect
    let targetAlpha = 255; // Fully visible
    alpha = lerp(alpha, targetAlpha, fadeSpeed * 0.01);

    translate(xOffset, yOffset, 0);
    rotateX(rotationX);
    rotateY(rotationY);
    rotateZ(rotationZ);

    noStroke(); // Set stroke color with interpolated alpha
    fill(map(noise(noiseOffset + 220 * 0.1), 0, 1, 220, 0), alpha);   // Set fill color with interpolated alpha

    let boxSize = formScale * sizeFactor;
    sphere(map(noise(noiseOffset + -600 * 0.1), -600, 1, -1200, -1200));
  }

  noiseOffset += 0.01; // Increment the noise offset for the next frame
  pop();
  push();
  translate(4800, map(noise(noiseOffset + -3000 * 0.01), -5000, 1, -4000, -2000), map(noise(noiseOffset + -5000 * 0.01), 000, 1, 1000, -2000)); // Position the abstract forms in the distance

  // Rotate and animate the forms
  rotateY(rotationAngle);
  rotationAngle += rotationSpeed;

  // Draw animated abstract forms
  for (let i = 0; i < 5; i++) {
    let yOffset = map(noise(noiseOffset + i * 0.1), 0, 1, -formAmplitude, formAmplitude);
    let xOffset = map(noise(noiseOffset + 100 + i * 0.1), 0, 1, -formAmplitude, formAmplitude);
    let sizeFactor = map(noise(noiseOffset + 200 + i * 0.1), 0, 1, 0.5, 1.5);
    let rotationX = map(noise(noiseOffset + 300 + i * 0.01), 0, 1, 0, TWO_PI);
    let rotationY = map(noise(noiseOffset + 400 + i * 0.01), 0, 1, 0, TWO_PI);
    let rotationZ = map(noise(noiseOffset + 500 + i * 0.01), 0, 1, 0, TWO_PI);

    // Use Perlin noise to create fading in and out effects
    let alpha = map(noise(noiseOffset + 600 + i * 0.1), 0, 1, 0, 255);

    // Smoothly interpolate alpha to create fading effect
    let targetAlpha = 255; // Fully visible
    alpha = lerp(alpha, targetAlpha, fadeSpeed * 0.01);

    translate(xOffset, yOffset, 0);
    rotateX(rotationX);
    rotateY(rotationY);
    rotateZ(rotationZ);

    noStroke(); // Set stroke color with interpolated alpha
    fill(map(noise(noiseOffset + 220 * 0.1), 0, 1, 220, 0), alpha);   // Set fill color with interpolated alpha

    let boxSize = formScale * sizeFactor;
    cone(boxSize);
  }

  noiseOffset += 0.001; // Increment the noise offset for the next frame
  pop();
}
function drawVerticalImages(angle) {
 push();
  noStroke()
  translate(-200, -200, -200);

  // Apply the rotation
  rotateY(angle);

  // Front plane with front texture
  beginShape();
  texture(frontTexture);
  plane(frontTexture.width/20, frontTexture.height/20)
  endShape(CLOSE);

  // Back plane with back texture
  translate(0, 0, -1); // Move the back plane slightly behind the front plane
  beginShape();
  texture(backTexture);
  plane(frontTexture.width/20, frontTexture.height/20)
  endShape(CLOSE);

  pop();
  
  push();
  noStroke()
  translate(200, -200, -200);

  // Apply the rotation
  rotateY(-1.575);

  // Front plane with front texture
  beginShape();
  texture(frontTexture2);
  plane(frontTexture2.width/17, frontTexture2.height/17)
  endShape(CLOSE);

  // Back plane with back texture
  translate(0, 0, -1); // Move the back plane slightly behind the front plane
  beginShape();
  texture(backTexture);
  plane(frontTexture2.width/17, frontTexture2.height/17)
  endShape(CLOSE);

  pop();
  
  push();
  noStroke()
  translate(-200, -200, -600);

  // Apply the rotation
  rotateY(angle);

  // Front plane with front texture
  beginShape();
  texture(frontTexture3);
  plane(frontTexture3.width/17, frontTexture3.height/17)
  endShape(CLOSE);

  // Back plane with back texture
  translate(0, 0, -1); // Move the back plane slightly behind the front plane
  beginShape();
  texture(backTexture);
  plane(frontTexture3.width/17, frontTexture3.height/17)
  endShape(CLOSE);

  pop();
  
  push();
  noStroke()
  translate(200, -200, -600);

  // Apply the rotation
  rotateY(-1.575);

  // Front plane with front texture
  texture(frontTexture4);
  plane(frontTexture4.width/17, frontTexture4.height/17)
  endShape(CLOSE);

  // Back plane with back texture
  translate(0, 0, -1); // Move the back plane slightly behind the front plane
  texture(backTexture);
  plane(frontTexture4.width/17, frontTexture4.height/17)
  endShape(CLOSE);

  pop();
}

