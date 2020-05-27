import { CST } from "../CST.js"; // importar claves


var musica_ranking, musica_menu;
var scores = []

export class HighscoreScene extends Phaser.Scene {

    constructor() {
      super({
        key: CST.SCENES.HIGHSCORE
      });
       
      this.scores = [];
    }


    init(){
        musica_ranking = this.sound.add('musica_ranking');
        musica_ranking.play({
            loop: true
        });
        // petición para obtener las highscores
        $.ajax({
          type: 'GET',
          url: 'http://192.168.100.8:3000/scores',
          data: {
            jwt: localStorage.getItem('jwt')
          },
          success: function(data) {
            scores = data;
            console.log(scores);
          },
          error: function(xhr) {
            console.log(xhr);
          },
          async : false // para que obtenga las puntaciones antes de mostrarlas
        });
    }
  
    create() {
      let image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'fondo')
      let scaleX = this.cameras.main.width / image.width
      let scaleY = this.cameras.main.height / image.height
      let scale = Math.max(scaleX, scaleY)
      image.setScale(scale).setScrollFactor(0)
      this.add.bitmapText(60, 60, 'arcade', 'POSICION PUNTUACION NOMBRE').setTint(0xffffff);
  
      // obtener los 10 primeros highscores
      // y formatearlos
      for (let i = 1; i < 11; i++) {
        if (i!= 10){
          if (scores[i-1]) {
            this.add.bitmapText(150, 80 + 50 * i, 'arcade', ` ${i}         ${scores[i-1].highScore}      ${scores[i-1].name}`).setTint(0xffffff);
          } 
          else {
            this.add.bitmapText(150, 80 + 50 * i, 'arcade', ` ${i}         0      ---`).setTint(0xffffff);
          }
        }
        else {
          if (scores[i-1]) {
            this.add.bitmapText(150, 80 + 50 * i, 'arcade', `${i}         ${scores[i-1].highScore}      ${scores[i-1].name}`).setTint(0xffffff);
          } 
          else {
            this.add.bitmapText(150, 80 + 50 * i, 'arcade', `${i}         0      ---`).setTint(0xffffff);
          }
        }
      }

      /* Botón para volver atrás */ 
      let backButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + this.game.renderer.height / 2.8, 'back')
      backButton.setScale(0.7).setScrollFactor(0);

      backButton.setInteractive();

      /* Eventos de puntero */
      /*  pointerover: hover (pasar por encima el ratón)
          pointerout: fuera (no hover)
          pointerup: click y soltar
          pointerdown: solo click
      */

      backButton.on("pointerover", () => {
        backButton.setScale(0.8).setScrollFactor(0);
      })

      backButton.on("pointerout", () => {
        backButton.setScale(0.7).setScrollFactor(0);
      })

      backButton.on("pointerdown", () => {
        musica_ranking.stop();
        this.scene.start(CST.SCENES.MENU)
      })

    }


  }