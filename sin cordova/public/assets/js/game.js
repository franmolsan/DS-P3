let game;

// importar escenas
import {LoadScene} from "./scenes/LoadScene.js";

let config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 1200, //window.innerWidth * window.devicePixelRatio,
  height: 800, //window.innerHeight * window.devicePixelRatio,
  pixelArt: true,
  scene: [
    LoadScene
  ],
  audio: {
    disableWebAudio: false
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  }
};

game = new Phaser.Game(config);

