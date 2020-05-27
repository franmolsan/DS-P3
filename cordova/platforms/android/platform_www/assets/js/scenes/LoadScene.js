import { CST } from "../CST.js"; // importar claves
import { MenuScene } from "./MenuScene.js";
import { HighscoreScene } from "./HighscoreScene.js";
import { GameScene } from "./GameScene.js";
import { PauseScene } from "./PauseScene.js";
import { DeathScene } from "./DeathScene.js";

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

        // cargar imagen para el botón de pausa
        this.load.image('pause','assets/pause.png')
        
        // cargar logo
        this.load.image ('logo','assets/nombre.png');

        // cargar imagen personaje
        this.load.image('asteroide', 'assets/pixel_asteroid.png');

        // cargar imagen personaje
        this.load.spritesheet('personaje', 'assets/ship.png', {
            frameHeight: 24,
            frameWidth: 16
        });

        // cargar musica
        this.load.audio('musica_menu','assets/menu.wav');
        this.load.audio('musica_ranking', 'assets/game.wav')
        this.load.audio('musica_juego','assets/battle.wav');
        this.load.audio('musica_fin','assets/death.mp3');

        // cargar fondo de la partida
        this.load.image('fondo_juego', 'assets/Strip And GIF/space_battle.png');

        // barra de carga 
        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff // blanco
            }
        })

        // Eventos de carga:
        // complete: cuando se termina de cargar todo
        // progress: número (decimal) que indica el progreso

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
        this.scene.add(CST.SCENES.PAUSE, PauseScene, false);
        this.scene.add(CST.SCENES.DEATH, DeathScene, false);

        /* Musica */
        this.sound.pauseOnBlur = false; // para que se escuche siempre, sin importar si se tabula o se cambia de pestaña

        var musica_menu = this.sound.add('musica_menu');

        // pasar a la escena del menú
        this.scene.start(CST.SCENES.MENU, musica_menu); 
    }
}