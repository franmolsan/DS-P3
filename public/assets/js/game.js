let game, scores;

class Highscore extends Phaser.Scene {

  constructor() {
    super({
      key: 'Highscore',
      active: true
    });
     
    this.scores = [];
  }

  preload() { // cargar tipografía
    this.load.bitmapFont('arcade', 'assets/arcade.png', 'assets/arcade.xml');
  }

  create() {
    this.add.bitmapText(70, 110, 'arcade', 'POSICION PUNTUACION NOMBRE').setTint(0xffffff);

    // obtener los 10 primeros highscores
    // y formatearlos
    for (let i = 1; i < 11; i++) {
      if (i!= 10){
        if (scores[i-1]) {
          this.add.bitmapText(150, 160 + 50 * i, 'arcade', ` ${i}         ${scores[i-1].highScore}      ${scores[i-1].name}`).setTint(0xffffff);
        } 
        else {
          this.add.bitmapText(150, 160 + 50 * i, 'arcade', ` ${i}         0      ---`).setTint(0xffffff);
        }
      }
      else {
        if (scores[i-1]) {
          this.add.bitmapText(150, 160 + 50 * i, 'arcade', `${i}         ${scores[i-1].highScore}      ${scores[i-1].name}`).setTint(0xffffff);
        } 
        else {
          this.add.bitmapText(150, 160 + 50 * i, 'arcade', `${i}         0      ---`).setTint(0xffffff);
        }
      }
    }
  }
}

let config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: window.innerWidth * window.devicePixelRatio,
  height: window.innerHeight * window.devicePixelRatio,
  pixelArt: true,
  scene: [Highscore]
};

$.ajax({
  type: 'GET',
  url: '/scores',
  success: function(data) {
    game = new Phaser.Game(config);
    scores = data;
  },
  error: function(xhr) {
    console.log(xhr);
  }
});