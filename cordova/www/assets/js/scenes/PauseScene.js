import { CST } from "../CST.js"; // importar claves
import { GameScene } from "./GameScene.js";

/* Variables */
var musica_juego;

// clase "Pause" (Escena de pausa)
export class PauseScene extends Phaser.Scene {

    constructor (){
        super({
            key: CST.SCENES.PAUSE
        })
    }

    init(m_juego){
        musica_juego = m_juego;
    }

    preload(){
    }

    create(){

        /* Cartel de pausa */
        this.add.bitmapText(this.game.renderer.width / 2, this.game.renderer.height / 2 - this.game.renderer.height / 4, 'arcade', `PAUSA`, 60).setTint(0xffffff).setOrigin(0.5);

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
            musica_juego.stop();
            this.scene.start(CST.SCENES.MENU)
        })

        /* Botón para jugar */
        /* Botón de play */
        let playButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, 'boton_play')
        playButton.setScale(5).setScrollFactor(0);

        playButton.setInteractive();

        playButton.on("pointerover", () => {
            playButton.setScale(6).setScrollFactor(0);
        })

        playButton.on("pointerout", () => {
            playButton.setScale(5).setScrollFactor(0);
        })

        playButton.on("pointerdown", () => {
            this.scene.stop(CST.SCENES.PAUSE)
            this.scene.resume(CST.SCENES.GAME)
        })

    }
}