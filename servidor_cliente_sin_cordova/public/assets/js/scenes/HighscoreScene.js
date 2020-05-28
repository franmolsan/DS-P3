import { CST } from "../CST.js"; // importar claves
import { MenuScene } from "./MenuScene.js";

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
          url: '/scores',
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
      //this.game.renderer.width / 2
      this.add.bitmapText(this.game.renderer.width / 4, 60, 'arcade', 'POSICION').setTint(0xffffff).setOrigin(0.5);
      this.add.bitmapText(this.game.renderer.width / 2,  60, 'arcade', 'SCORE').setTint(0xffffff).setOrigin(0.5);
      this.add.bitmapText(3 * this.game.renderer.width / 4, 60, 'arcade', 'NOMBRE').setTint(0xffffff).setOrigin(0.5);
  
      // obtener los 10 primeros highscores
      // y formatearlos
      for (let i = 1; i < 11; i++) {

        this.add.bitmapText(this.game.renderer.width / 4, 80 + 50 * i, 'arcade', `${i}`).setTint(0xffffff).setOrigin(0.5);
        if (scores[i-1]) {
          this.add.bitmapText(this.game.renderer.width / 2,  80 + 50 * i, 'arcade', `${scores[i-1].highScore}`).setTint(0xffffff).setOrigin(0.5);
          this.add.bitmapText(3 * this.game.renderer.width / 4, 80 + 50 * i, 'arcade', `${scores[i-1].name}`).setTint(0xffffff).setOrigin(0.5);
        } 
        else {
          this.add.bitmapText(this.game.renderer.width / 2,  80 + 50 * i, 'arcade', `0`).setTint(0xffffff).setOrigin(0.5);
          this.add.bitmapText(3 * this.game.renderer.width / 4, 80 + 50 * i, 'arcade', `----`).setTint(0xffffff).setOrigin(0.5);
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