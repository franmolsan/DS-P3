import { CST } from "../CST.js"; // importar claves

/* Variables */
var cursors;
var spaceBar;
var player;
var gameStarted;
var dificultad;
var asteroides;
var gameOver;
var spawnAsteroide;
var updateScore;
var max_x;
var max_y;
var pauseButton;

// habilidad
var choques;
var invulnerable;
var cooldown;
var valor_cooldown;
var check_cooldown;
var cooldownText;

// score
var score;
var scoreString = "Score: ";
var scoreText;

var musica_juego;

// clase "GameScene" (Escena del juego)
export class GameScene extends Phaser.Scene {

    constructor (){
        super({
            key: CST.SCENES.GAME
        })
    }

    init(){
        score = 0;

        musica_juego = this.sound.add('musica_juego');

        musica_juego.play({
            loop: true
        });

        score = 0;
        dificultad = 1;
        invulnerable = false;
        check_cooldown = false;
        valor_cooldown = 0;
    }

    preload(){
       
    }

    create(){

        /* Musica */
        this.sound.pauseOnBlur = false; // para que se escuche siempre, sin importar si se tabula o se cambia de pestaña


        /* fondo */
        
        let image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'fondo_juego')
        let scaleX = this.cameras.main.width / image.width
        let scaleY = this.cameras.main.height / image.height
        let scale = Math.max(scaleX, scaleY) 
        image.setScale(scale).setScrollFactor(0) // para que ocupe toda la pantalla del juego
        
        cooldownText = this.add.bitmapText(32, this.cameras.main.height - 40, 'arcade', scoreString + score, 15);
        scoreText = this.add.bitmapText (32, 40, 'arcade', scoreString + score, 15);
        pauseButton = this.add.image(75, 100, 'pause');

        pauseButton.setInteractive();

        /* Eventos de puntero */
        /*  pointerover: hover (pasar por encima el ratón)
            pointerout: fuera (no hover)
            pointerup: click y soltar
            pointerdown: solo click
        */

        pauseButton.on("pointerover", () => {
            pauseButton.setScale(1.2).setScrollFactor(0);
        })

        pauseButton.on("pointerout", () => {
            pauseButton.setScale(1).setScrollFactor(0);
        })

        pauseButton.on("pointerdown", () => {
            this.scene.pause(CST.SCENES.GAME)
            this.scene.launch(CST.SCENES.PAUSE, musica_juego)
        })
        

        // Create player
        player = this.physics.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, "personaje");
        player.setScale(4);
        player.setFrame(2);
        
        createAnimations(this);


        // Para que el jugador no salga de los bordes
        player.setCollideWorldBounds(true);
        asteroides = this.physics.add.group();
        choques = this.physics.add.collider(player, asteroides, hitAsteroide, null, this);

        // Keyboard input
        cursors = this.input.keyboard.createCursorKeys();
        spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        gameOver = false;
        gameStarted = true;
        dificultad = 1;
   
        updateScore = this.time.addEvent({ delay: 1000, callback: updateScoreEvent, callbackScope: this });

        max_x = this.cameras.main.width;
        max_y = this.cameras.main.height;
        spawnAsteroide = this.time.addEvent({ delay: 100, callback: spawnAsteroideEvent, callbackScope: this });
    }

    update (){
        // Update objects & variables
        player.setVelocity(0, 0);

        if (gameStarted) {

            /* Movimiento del personaje */
            if (cursors.up.isDown) {
                //  Move up
                player.setVelocityY(-400);
                player.anims.play("up");
                
            } 
            else if (cursors.down.isDown) {
                //  Move down
                player.setVelocityY(400);
                player.anims.play("down");
               
            }

            if (cursors.left.isDown) {
                //  Move to the left
                player.anims.play("left");
                player.setVelocityX(-400);
                player.anims.play("finish-left");
                
            } 
            else if (cursors.right.isDown) {
                //  Move to the right
                player.anims.play("right");
                player.setVelocityX(400);
                player.anims.play("finish-right");
                
            }

            /* Habilidad */
            if (spaceBar.isDown && !invulnerable && valor_cooldown === 0){
                choques.active = false;
                invulnerable = true;
                player.setTint(0x808080);
                this.time.addEvent({ delay: 1000, callback: setInvulnerableEvent, callbackScope: this, repeat : 1 });
                cooldown = this.time.addEvent({ delay: 5000 });  
                check_cooldown = true;         
            }

            if (check_cooldown){
                valor_cooldown = 5 - 5 * cooldown.getProgress().toString().substr(0, 4);
            }
    
            if (valor_cooldown === 0){
                cooldownText.setText("Habilidad lista");
                check_cooldown = false;
            }
           else{
                cooldownText.setText("Habilidad lista en " + valor_cooldown.toString().substr(0,1));
            }

        }

        if(gameOver){
            finishGame(this);
        }
    }
    
}

// Crear animaciones para el jugador
function createAnimations(that){
    
    that.anims.create({
        key: "left",
        frames: that.anims.generateFrameNumbers("personaje", { start: 2, end: 0 }),
        repeat: 0
    });

    that.anims.create({
        key: "finish-left",
        frames: that.anims.generateFrameNumbers("personaje", { start: 0, end: 2 }),
        repeat: 0
    });
    
    that.anims.create({
        key: "right",
        frames: that.anims.generateFrameNumbers("personaje", { start: 2, end: 4 })
    });

    that.anims.create({
        key: "finish-right",
        frames: that.anims.generateFrameNumbers("personaje", { start: 4, end: 2 })
    });

    that.anims.create({
        key: "down",
        frames: that.anims.generateFrameNumbers("personaje", { start: 7, end: 2 }),
    });

    that.anims.create({
        key: "up",
        frames: that.anims.generateFrameNumbers("personaje", { start: 2, end: 7 })
    });

}

function updateScoreEvent (){
    if (!gameOver){
        score += 10;
        scoreText.setText(scoreString + score);
        dificultad += 0.1;
        updateScore.reset({ delay: 1000, callback: updateScoreEvent, callbackScope: this, repeat: 1 })
    }
        
}

function spawnAsteroideEvent (){
    if (!gameOver){
        var ast = createAsteroide();
        setPathAsteroide(ast);
        spawnAsteroide.reset({ delay: Phaser.Math.Between(2000,4000)/dificultad, callback: spawnAsteroideEvent, callbackScope: this, repeat: 1});
    }
}


function hitAsteroide (player, asteroides) {
    this.physics.pause();
    player.setTint(0xff0000);
    gameOver = true;
}

function finishGame(that){
    musica_juego.stop();
    that.scene.start(CST.SCENES.DEATH, score);
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


    // si es del tipo 4, sale del borde derecho
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

function setInvulnerableEvent(){
    player.setTint(0xffffff);
    choques.active = true;
    invulnerable = false;
}
