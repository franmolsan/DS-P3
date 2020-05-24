import { CST } from "../CST.js"; // importar claves
import { MenuScene } from "./MenuScene.js";
import { HighscoreScene } from "./HighscoreScene.js";
import { GameScene } from "./GameScene.js";


// clase "LoadScene" (Escena de carga)
export class LoadScene extends Phaser.Scene {

    constructor (){
        super({
            key: CST.SCENES.LOAD
        })
    }

    init(){

    }
    
    preload(){
        // cargar tipografia
        this.load.bitmapFont('arcade', 'assets/arcade.png', 'assets/arcade.xml');

        // cargar fondo 
        this.load.image('fondo', 'assets/Strip And GIF/space_game.png');
        
        // cargar imagen para el botón de jugar
        this.load.image ('boton_play','assets/play.png');

        // cargar imagen para el ranking
        this.load.image ('ranking','assets/ranking.png');

        // cargar imagen para el botón de volver atrás
        this.load.image ('back','assets/back.png');
        
        // cargar logo
        this.load.image ('logo','assets/nombre.png');

        // cargar imagen personaje
        this.load.spritesheet('personaje', 'assets/ship.png', {
            frameHeight: 24,
            frameWidth: 16
        });

        // cargar musica
        this.load.audio('musica_menu','assets/menu.wav');

        // barra de carga 
        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff // blanco
            }
        })

        // Eventos de carga:
        // complete: cuando se termina de cargar todo
        // progress: número (decimal) que indica el progreso

        // simular carga grande
        /*
        for(let i=0; i<1000000000; i++){
            this.load.spritesheet('personaje', 'assets/ship.png', {
                frameHeight: 16,
                frameWidth: 16
            });
        }*/

        this.load.on("progress", (percent) =>{
            loadingBar.fillRect(0, this.game.renderer.height/2, this.game.renderer.width * percent, 50);
        })

        this.load.on("complete", ()=>{
            console.log("cargado");
        })


    }

    create(){
        this.scene.add(CST.SCENES.GAME, GameScene, false);
        this.scene.add(CST.SCENES.HIGHSCORE, HighscoreScene, false);
        this.scene.add(CST.SCENES.MENU, MenuScene, false);

        /* Musica */
        this.sound.pauseOnBlur = false; // para que se escuche siempre, sin importar si se tabula o se cambia de pestaña

        var musica_menu = this.sound.add('musica_menu');

        musica_menu.play({
            loop: true
        });


        // pasar a la escena del menú
        this.scene.start(CST.SCENES.MENU, musica_menu); 
    }
}