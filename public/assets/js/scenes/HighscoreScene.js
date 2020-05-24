import { CST } from "../CST.js"; // importar claves

let game, scores;

export class HighscoreScene extends Phaser.Scene {

    constructor() {
      super({
        key: CST.SCENES.HIGHSCORE
      });
       
      this.scores = [];
    }


    init(data){
        console.log(data);
        console.log("Soy highscore y lo pillo");
    }
  
    preload() { // cargar tipografía
      
    }
  
    create() {
      let image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'fondo')
      let scaleX = this.cameras.main.width / image.width
      let scaleY = this.cameras.main.height / image.height
      let scale = Math.max(scaleX, scaleY)
      image.setScale(scale).setScrollFactor(0)
      //this.add.image(0, 0, 'fondo').setOrigin(0).setScale(scale).setScrollFactor(0);
      //this.add.image(0, 0, 'fondo').SetOrigin(0, 0);
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

  // petición para obtener las highscores
  $.ajax({
    type: 'GET',
    url: '/scores',
    success: function(data) {
      scores = data;
    },
    error: function(xhr) {
      console.log(xhr);
    }
  });