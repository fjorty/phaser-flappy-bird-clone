import Phaser from 'phaser';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: {
        y: 0
      }
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

const INITIAL_BIRD_POSITION = {
  x: config.width / 10,
  y: config.height / 2
};
const BIRD_GRAVITY = 300;
const FLAP_VELOCITY = 250;
const PIPE_VERTICAL_DISTANCE_RANGE = [150, 250];
const PIPE_HORIZONTAL_DISTANCE_RANGE = [380, 430];

const PIPES_TO_RENDER = 4;

let bird = null;
let pipeHorizontalDistance = 0;

function preload() {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('bird', 'assets/bird.png');
  this.load.image('pipe', 'assets/pipe.png');
}

function create() {
  this.add.image(0, 0, 'sky').setOrigin(0);

  bird = this.physics.add.sprite(INITIAL_BIRD_POSITION.x, INITIAL_BIRD_POSITION.y, 'bird').setOrigin(0);
  bird.body.gravity.y = BIRD_GRAVITY;

  this.input.on('pointerdown', flap);
  this.input.keyboard.on('keydown_SPACE', flap);  

  for (let i = 0; i < PIPES_TO_RENDER; i++) {
    const upperPipe = this.physics.add.sprite(0, 0, 'pipe').setOrigin(0, 1);
    const lowerPipe = this.physics.add.sprite(0, 0, 'pipe').setOrigin(0);
    
    placePipe(upperPipe, lowerPipe);
  }
}

function update(time, delta) {
  if (bird.body.position.y >= (config.height - bird.body.height) || bird.body.position.y <= 0) {
    restartBirdPosition();
  }
}

function placePipe(upperPipe, lowerPipe) {
  pipeHorizontalDistance += Phaser.Math.Between(...PIPE_HORIZONTAL_DISTANCE_RANGE);
  const pipeVerticalDistance = Phaser.Math.Between(...PIPE_VERTICAL_DISTANCE_RANGE);
  const pipeVerticalPosition = Phaser.Math.Between(0 + 20, config.height - 20 - pipeVerticalDistance);

  upperPipe.x = pipeHorizontalDistance;
  upperPipe.y = pipeVerticalPosition;

  lowerPipe.x = upperPipe.x;
  lowerPipe.y = upperPipe.y + pipeVerticalDistance;

  upperPipe.body.velocity.x = -200;
  lowerPipe.body.velocity.x = -200;
}

function flap() {
  bird.body.velocity.y = -FLAP_VELOCITY;
}

function restartBirdPosition() {
  bird.body.position.x = INITIAL_BIRD_POSITION.x;
  bird.body.position.y = INITIAL_BIRD_POSITION.y;
  bird.body.velocity.y = 0;
}

new Phaser.Game(config);
