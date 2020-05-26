import { CST } from "../CST.js"; // importar claves

var musica_fin, score_obtenida;


// clase "DeathScene" (Escena de muertee - cuando colisiona con un asteoride)
export class DeathScene extends Phaser.Scene {

    constructor (){
        super({
            key: CST.SCENES.DEATH
        })
    }

    init(s){
        musica_fin = this.sound.add('musica_fin');
        musica_fin.play();
        if (isNaN(s)){
            score_obtenida = 0;
        }
        else {
            score_obtenida = s;
        }

        var x = document.cookie;
        var data = {
            jwt: localStorage.getItem('jwt'),
            email: parseJwt(x).user.email,
            score: score_obtenida
        }
        // petición para enviar la score
        $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/submit-score',
            data: data,
            success: function(data) {
            console.log(data);
            },
            error: function(xhr) {
            console.log(xhr);
            }
        });
    }

    preload(){
    }

    create(){

        /* Cartel de muerte */
        this.add.bitmapText(this.game.renderer.width / 2, this.game.renderer.height / 2 - this.game.renderer.height / 3, 'arcade', `Te han dado`, 60).setTint(0xffffff).setOrigin(0.5);
        this.add.bitmapText(this.game.renderer.width / 2, this.game.renderer.height / 2 - this.game.renderer.height / 4, 'arcade', `Puntacion: ${score_obtenida}`, 30).setTint(0xffffff).setOrigin(0.5);

        /* Botón para volver atrás */ 
        let backButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + this.game.renderer.height / 4, 'back')
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
            musica_fin.stop();
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
            musica_fin.stop();
            this.scene.start(CST.SCENES.GAME)
        })

    }
}

function parseJwt(token) {
    if (!token) { return; }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
}

