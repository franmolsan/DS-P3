let game, scores;

// importar escenas
import {LoadScene} from "./scenes/LoadScene.js";
import {MenuScene} from "./scenes/MenuScene.js";
import {HighscoreScene} from "./scenes/HighscoreScene.js";

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
  }
};

game = new Phaser.Game(config);

