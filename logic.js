const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const c = canvas.getContext("2d");

// for rocket player
class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0,
    };
    const image = new Image();
    image.src = "./spaceship.png";
    image.onload = () => {
      this.image = image;
      this.width = image.width *0.1;
      this.height = image.height * 0.1;
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 30,
      };
    };
  }

  draw() {
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
  update() {
    if (this.image) {
      this.draw();
      this.position.x += this.velocity.x;
    }
  }
}

// for invader/enemy
class Invader {
  constructor({ position }) {
    this.velocity = {
      x: 0,
      y: 0,
    };
    const image = new Image();
    image.src = "./invader.png";
    image.onload = () => {
      this.image = image;
      this.width = image.width * 0.07;
      this.height = image.height * 0.07;
      // console.log(this.width, this.height)
      this.position = {
        x: position.x,
        y: position.y,
      };
    };
  }

  draw() {
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
  update({ velocity }) {
    if (this.image) {
      this.draw();
      this.position.x += velocity.x;
    }
  }
}

// for the bullet particles
class Projectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 3;
  }
  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = "red";
    c.fill();
    c.closePath();
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

// for Invader grid
class EnemyGrid {
  constructor() {
    this.position = {
      x: 0,
      y: 0,
    };
    this.velocity = {
      x: 3,
      y: 0,
    };
    this.invaders = [];

    const row = Math.floor(Math.random() * 5 + 5);
    const col = Math.floor(Math.random() * 5 + 3);
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < col; j++) {
        this.invaders.push(
          new Invader({
            position: {
              x: i * 52.64,
              y: j * 50.4,
            },
          })
        );
      }
    }
  }
  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

// object creation
const player = new Player();
const projectiles = [];
const grids = [new EnemyGrid()];

// key tracker
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
};

// animation starter function
function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  grids.forEach((grid) => {
    grid.invaders.forEach((invader) => {
      invader.update({
        velocity: {
          x: grid.velocity.x,
        },
      });
    });
  });
  player.update();
  projectiles.forEach((projectile, index) => {
    // when a bullet hits uppor bound, that 'projectiles' array element is deleted from array
    if (projectile.position.y + projectile.radius <= 0) {
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0);
    } else {
      projectile.update();
    }
  });

  // rocket player position changing
  if ((keys.a.pressed || keys.ArrowLeft.pressed) && player.position.x >= 0) {
    player.velocity.x = -5;
  } else if (
    (keys.d.pressed || keys.ArrowRight.pressed) &&
    player.position.x + player.width <= canvas.width
  ) {
    player.velocity.x = 5;
  } else player.velocity.x = 0;
}
animate();

// to track key pressed
addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "a":
      keys.a.pressed = true;
      break;
    case "d":
      keys.d.pressed = true;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      break;
    case " ":
      keys.space.pressed = true;

      // when space is pressed a new object is created and pushed to 'projectiles' array
      projectiles.push(
        new Projectile({
          position: {
            x: player.position.x + player.width / 2,
            y: player.position.y,
          },
          velocity: {
            x: 0,
            y: -13,
          },
        })
      );
      // console.log(projectiles)
      break;
  }
});

// to track key released
addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case " ":
      keys.space.pressed = false;
  }
});
