import { CST } from "../CST.js"; // importar claves
import { HighscoreScene } from "./HighscoreScene.js";
var musica_menu;
// clase "MenuScene" (Escena del menú)
export class MenuScene extends Phaser.Scene {
    
    constructor (){
        super({
            key: CST.SCENES.MENU
        })
    }

    init(m_menu){
        musica_menu = m_menu;
        musica_menu.play({
            loop: true
        });
    }

    create(){

        /* fondo */
        let image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'fondo')
        let scaleX = this.cameras.main.width / image.width
        let scaleY = this.cameras.main.height / image.height
        let scale = Math.max(scaleX, scaleY) 
        image.setScale(scale).setScrollFactor(0) // para que ocupe toda la pantalla del juego


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
            musica_menu.stop();
            this.scene.start(CST.SCENES.GAME)
        })


        /* Botón de ranking */ 
        let rankingButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + this.game.renderer.height / 4, 'ranking')
        rankingButton.setScale(5).setScrollFactor(0);

        rankingButton.setInteractive();

        /* Eventos de puntero */
        /*  pointerover: hover (pasar por encima el ratón)
            pointerout: fuera (no hover)
            pointerup: click y soltar
            pointerdown: solo click
        */

        rankingButton.on("pointerover", () => {
            rankingButton.setScale(6).setScrollFactor(0);
        })

        rankingButton.on("pointerout", () => {
            rankingButton.setScale(5).setScrollFactor(0);
        })

        rankingButton.on("pointerdown", () => {
            musica_menu.stop();
            this.scene.start(CST.SCENES.HIGHSCORE)
        })

        /* Logo */
        this.add.bitmapText(this.game.renderer.width / 2, this.game.renderer.height / 2 - this.game.renderer.height / 4, 'arcade', `AW-435`, 75).setTint(0xffffff).setOrigin(0.5);
   
    }
}