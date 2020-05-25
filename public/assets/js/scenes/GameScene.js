import { CST } from "../CST.js"; // importar claves

/* Variables */
var cursors;
var musica_menu;
var player;
var gameStarted;
var dificultad;
var tiempo_inicial;
var asteroides;
var gameOver;
var spawnAsteroide;
var max_x;
var max_y;

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


        // Para que el jugador no salga de los bordes
        player.setCollideWorldBounds(true);

        asteroides = this.physics.add.group();
        this.physics.add.collider(player, asteroides, hitAsteroide, null, this);

        // Keyboard input
        cursors = this.input.keyboard.createCursorKeys();
    
        gameOver = false;
        gameStarted = true;
        dificultad = 1;
        tiempo_inicial = Date.now();
        setInterval( () => {
            score += 10;
            scoreText.setText(scoreString + score);
            dificultad += 0.1;
        },1000);

        max_x = this.cameras.main.width;
        max_y = this.cameras.main.height;
        spawnAsteroide = this.time.addEvent({ delay: 100, callback: onEvent, callbackScope: this });
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

        if (gameOver){

        }
    }
    
}


function onEvent (){
    var ast = createAsteroide();
    setPathAsteroide(ast);
    spawnAsteroide.reset({ delay: Phaser.Math.Between(2000,4000)/dificultad, callback: onEvent, callbackScope: this, repeat: 1});
}

function hitAsteroide (player, asteroides) {
    this.physics.pause();
    player.setTint(0xff0000);
    gameOver = true;
}

function createAsteroide(){
    var random_boolean = Math.random() >= 0.5;
    var x, y;

    // borde superior o inferior
    if (random_boolean){
        x = Phaser.Math.Between(0,max_x);
        
        random_boolean = Math.random() >= 0.5;
        if (random_boolean){      
            y = 0;
            return {ast :asteroides.create(x,y,'asteroide'), tipo: 1}
        }
        else {
            y = max_y;
            return {ast :asteroides.create(x,y,'asteroide'), tipo: 2}
        }
    }

    // borde izquierdo o derecho
    else {
        y = Phaser.Math.Between(0,max_y);

        random_boolean = Math.random() >= 0.5;
        if (random_boolean){
            x = 0;
            return {ast :asteroides.create(x,y,'asteroide'), tipo: 3}
        }
        else {
            x = max_x;
            return {ast :asteroides.create(x,y,'asteroide'), tipo: 4}
        }
    }
}


// Función para establecer una trayectoria aleatoria para el asteroide
function setPathAsteroide(asteroide){
    var random_boolean = Math.random() >= 0.5;
    var vel_x = 0;
    var vel_y = 0;

    // si es del tipo 1, sale del borde superior
    if (asteroide.tipo == 1){
        // velocidad_y siempre positiva (caída)
        vel_y = Phaser.Math.Between(300, 500);

        // puede ir hacia la izq o la dcha
        if (random_boolean){
            vel_x = Phaser.Math.Between(800,1000);
        }
        else {
            vel_x = Phaser.Math.Between(-1000, -800);
        }
    }

    // si es del tipo 2, sale del borde inferior
    else if (asteroide.tipo == 2){
        // velocidad_y siempre negativa (hacia arriba)
        vel_y = Phaser.Math.Between(-500, -300);

        // puede ir hacia la izq o la dcha
        if (random_boolean){
            vel_x = Phaser.Math.Between(800,1000);
        }
        else {
            vel_x = Phaser.Math.Between(-1000, -800);
        }
    }

    // si es del tipo 3, sale del borde izquierdo
    else if (asteroide.tipo == 3){
        // velocidad_x siempre positiva (hacia la derecha)
        vel_x = Phaser.Math.Between(800,1000);

        // puede ir hacia arriba o hacia abajo
        if (random_boolean){
            vel_y = Phaser.Math.Between(300, 500);
        }
        else {
            vel_y = Phaser.Math.Between(-500, -300);
        }
    }


    // si es del tipo 3, sale del borde derecho
    else if (asteroide.tipo == 4){
        // velocidad_x siempre negativa (hacia la izquierda)
        vel_x = Phaser.Math.Between(-1000,-800);

        // puede ir hacia arriba o hacia abajo
        if (random_boolean){
            vel_y = Phaser.Math.Between(300, 500);
        }
        else {
            vel_y = Phaser.Math.Between(-500, -300);
        }
    }

    asteroide.ast.setVelocity(vel_x, vel_y);
}
