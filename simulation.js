const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight - 100;

const predatorCount = 10;
const preyCount = 100;

let predators = [];
let preys = [];

class Predator {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = Math.random() * 2 - 1;
      this.vy = Math.random() * 2 - 1;
      this.size = 10;
      this.vision = 85;
      this.speed = 2;
      this.health = 10;
      this.healthDecrease = 0.015;
      this.color = 'red';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      // Check for boundary collision
      if (this.x + this.size > width || this.x - this.size < 0) {
        this.vx = -this.vx;
      }
      if (this.y + this.size > height || this.y - this.size < 0) {
        this.vy = -this.vy;
      }
        // Check for health
        if (this.health <= 0) {
            predators.splice(predators.indexOf(this), 1);
        }
        // Decrease health
        this.health -= this.healthDecrease;


    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }
  
  class Prey {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.speed = 2;
      this.size = 5;
      this.vx = Math.random() * this.speed - 1;
      this.vy = Math.random() * this.speed - 1;
      this.color = 'green';
      this.framesUntilNewVelocity = 60; // Change this value to control how often the prey's velocity changes
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        // Check for boundary collision
        if (this.x + this.size > width || this.x - this.size < 0) {
            this.vx = -this.vx;
        }
        if (this.y + this.size > height || this.y - this.size < 0) {
            this.vy = -this.vy;
        }
      }
  
      
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  // Create predators
for (let i = 0; i < predatorCount; i++) {
    let predator = new Predator(Math.random() * width, Math.random() * height);
    predators.push(predator);
  }
  
  // Create preys
  for (let i = 0; i < preyCount; i++) {
    let prey = new Prey(Math.random() * width, Math.random() * height);
    preys.push(prey);
  }
  
  // Draw predators and preys
  function draw() {
    ctx.clearRect(0, 0, width, height);
    predators.forEach((predator) => {
      predator.draw();
    });
    preys.forEach((prey) => {
      prey.draw();
    });
  }
  
  draw();

// Update predators and preys
function update() {
    predators.forEach(predator => predator.update());
    preys.forEach(prey => prey.update());
    // Check for prey collision with predators
    predators.forEach((predator) => {
        preys.forEach((prey) => {
            eatingDistance = prey.size + predator.size;
            if (Math.hypot(prey.x - predator.x, prey.y - predator.y) < eatingDistance) {
                // Remove prey from preys array
                preys.splice(preys.indexOf(prey), 1);
                // Increase predator's health
                predator.health += 1;
            }
        });
    });
    // Change the predator's movement direction if it is close to a prey to the direction of the prey
    predators.forEach((predator) => {
        preys.forEach((prey) => {
            if (Math.hypot(prey.x - predator.x, prey.y - predator.y) < predator.vision) {
                // Calculate the components of the velocity vector


                predator.vx = (prey.x - predator.x) / Math.abs(prey.x - predator.x) * predator.speed;
                predator.vy = (prey.y - predator.y) / Math.abs(prey.y - predator.y) * predator.speed;
            }
        });
        
    })

    // Make the prey duplicate itself randomly
    preys.forEach((prey) => {
        if (Math.random() < 0.0010) {
            let newPrey = new Prey(prey.x, prey.y);
            preys.push(newPrey);
        }
    });
    // Make the predator duplicate itself if it has enough health
    predators.forEach((predator) => {
        if (predator.health > 20) {
            // Create a new predator with slightly different position that is randomly chosen
            let newPredator = new Predator(predator.x + Math.random() * 40 - 5, predator.y + Math.random() * 40 - 5);
            predators.push(newPredator);
            predator.health -= 10;
        }
    });


  }
  
    let paused = false;

  // Call update() and draw() repeatedly to animate the simulation
  function loop() {
    if (paused) return;
    update();
    draw();
    requestAnimationFrame(loop);
  }
  
  loop();

  let animationId;

function start() {
    paused = false;
  animationId = requestAnimationFrame(loop);
}

function pause() {
    paused = true;
}

function reset() {
  predators = [];
  preys = [];
  // Create predators
  for (let i = 0; i < predatorCount; i++) {
    let predator = new Predator(Math.random() * width, Math.random() * height);
    predators.push(predator);
  }
  // Create preys
  for (let i = 0; i < preyCount; i++) {
    let prey = new Prey(Math.random() * width, Math.random() * height);
    preys.push(prey);
  }
}

document.getElementById('start').addEventListener('click', start);
document.getElementById('pause').addEventListener('click', pause);
document.getElementById('reset').addEventListener('click', reset);
