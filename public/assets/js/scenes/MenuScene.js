import { CST } from "../CST.js"; // importar claves
import { HighscoreScene } from "./HighscoreScene.js";

// clase "MenuScene" (Escena del menú)
export class MenuScene extends Phaser.Scene {
    
    constructor (){
        super({
            key: CST.SCENES.MENU
        })
    }

    init(data){
        console.log(data);
        console.log("I GOT IT");
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
            this.scene.add(CST.SCENES.HIGHSCORE, HighscoreScene, false);
            this.scene.start(CST.SCENES.HIGHSCORE,"se lo paso a highscore")
        })

        /* Logo */
        this.add.bitmapText(this.game.renderer.width / 2, this.game.renderer.height / 2 - this.game.renderer.height / 4, 'arcade', `AW-435`, 60).setTint(0xffffff).setOrigin(0.5);
    
        /* Musica */
        this.sound.pauseOnBlur = false; // para que se escuche siempre, sin importar si se tabula o se cambia de pestaña

        this.sound.play ('musica_menu', { loop : true });

    }
}