import { CST } from "../CST.js"; // importar claves

/* Variables */
var cursors;
var musica_menu;
var player;
var gameStarted;
var dificultad;
var tiempo_inicial;

// score
var score = 0;
var scoreString = "Score: ";
var scoreText;


// clase "GameScene" (Escena del juego)
export class GameScene extends Phaser.Scene {

    constructor (){
        super({
            key: CST.SCENES.GAME
        })
    }

    init(m_menu){
        musica_menu = m_menu;
    }

    preload(){
        // cargar musica
        this.load.audio('musica_juego','assets/game.wav');

        // cargar fondo 
        this.load.image('fondo_juego', 'assets/Strip And GIF/space_battle.png');
    }

    create(){
        musica_menu.stop();

        /* Musica */
        this.sound.pauseOnBlur = false; // para que se escuche siempre, sin importar si se tabula o se cambia de pestaña

        var musica_juego = this.sound.add('musica_juego');

        musica_juego.play({
            loop: true
        });

        /* fondo */
        
        let image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'fondo_juego')
        let scaleX = this.cameras.main.width / image.width
        let scaleY = this.cameras.main.height / image.height
        let scale = Math.max(scaleX, scaleY) 
        image.setScale(scale).setScrollFactor(0) // para que ocupe toda la pantalla del juego
        
        scoreText = this.add.text(32, 24, scoreString + score);

        // Create player
        player = this.physics.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, "personaje");
        player.setScale(4);
        player.setFrame(2);
        
        // Create animations for player
        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("personaje", { start: 2, end: 0 }),
            repeat: 0
        });

        // Create animations for player
        this.anims.create({
            key: "finish-left",
            frames: this.anims.generateFrameNumbers("personaje", { start: 0, end: 2 }),
            repeat: 0
        });
        
        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("personaje", { start: 2, end: 4 })
        });

        this.anims.create({
            key: "finish-right",
            frames: this.anims.generateFrameNumbers("personaje", { start: 4, end: 2 })
        });

        this.anims.create({
            key: "down",
            frames: this.anims.generateFrameNumbers("personaje", { start: 7, end: 2 }),
        });

        this.anims.create({
            key: "up",
            frames: this.anims.generateFrameNumbers("personaje", { start: 2, end: 7 })
        });

        /*
        var frames_idle = this.anims.generateFrameNumbers("personaje", { start: 2, end: 2 })
        frames_idle.push(this.anims.generateFrameNumbers("personaje", { start: 7, end: 7 }))
        console.log();
        this.anims.create({
            key: "idle",
            frames: [{key: "personaje", frames: 2}, {key: "personaje", frames: 4}],
            repeat: -1
        });
        */


        // Player should collide with edges of the screen
        player.setCollideWorldBounds(true);

        // Keyboard input
        cursors = this.input.keyboard.createCursorKeys();
    
        gameStarted = true;
        tiempo_inicial = Date.now();
        setInterval( () => {score += 10;
            scoreText.setText(scoreString + score);
        },1000);
    }

    update (){
        // Update objects & variables
        player.setVelocity(0, 0);

        if (gameStarted) {


            if (cursors.up.isDown) {
                //  Move up
                player.setVelocityY(-300);
                player.anims.play("up");
                
            } 
            else if (cursors.down.isDown) {
                //  Move down
                player.setVelocityY(300);
                player.anims.play("down");
               
            }

            if (cursors.left.isDown) {
                //  Move to the left
                player.anims.play("left");
                player.setVelocityX(-300);
                player.anims.play("finish-left");
                
            } 
            else if (cursors.right.isDown) {
                //  Move to the right
                player.anims.play("right");
                player.setVelocityX(300);
                player.anims.play("finish-right");
                
            }
        }
    }
    
}