let game;

// importar escenas
// import {LoadScene} from "./scenes/LoadScene.js";
const CST =  {
  SCENES : {
      HIGHSCORE: "HIGHSCORE",
      LOAD: "LOAD",
      MENU: "MENU",
      GAME: "GAME",
      PAUSE: "PAUSE",
      DEATH: "DEATH"
  }
}

var musica_menu;
// clase "MenuScene" (Escena del menú)
class MenuScene extends Phaser.Scene {
    
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
      //window.addEventListener('resize', resize);
      //resize();

        /* fondo */
        let image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'fondo')
        let scaleX = this.cameras.main.width / image.width
        let scaleY = this.cameras.main.height / image.height
        let scale = Math.max(scaleX, scaleY) 
        image.setScale(scale).setScrollFactor(0) // para que ocupe toda la pantalla del juego


        /* Botón de play */
        let playButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, 'boton_play')
        playButton.setScale(10).setScrollFactor(0);

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
        rankingButton.setScale(10).setScrollFactor(0);

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
        this.add.bitmapText(this.game.renderer.width / 2, this.game.renderer.height / 2 - this.game.renderer.height / 4, 'arcade', `AW-435`, 100).setTint(0xffffff).setOrigin(0.5);
   
    }
}

var musica_ranking;
var scores = []

class HighscoreScene extends Phaser.Scene {

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
          url: 'http://192.168.100.8:3000/scores',
          data: {
            jwt: localStorage.getItem('jwt')
          },
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
      //window.addEventListener('resize', resize);
      //resize();
      let image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'fondo')
      let scaleX = this.cameras.main.width / image.width
      let scaleY = this.cameras.main.height / image.height
      let scale = Math.max(scaleX, scaleY)
      image.setScale(scale).setScrollFactor(0)
      var base_x = this.game.renderer.width / 2;
      var base_y = this.game.renderer.height / 2 - this.game.renderer.height / 3;
      this.add.bitmapText(base_x+300, base_y, 'arcade', 'SCORE',50).setTint(0xffffff).setOrigin(0.5);
      this.add.bitmapText(base_x-300, base_y, 'arcade', 'NOMBRE',50).setTint(0xffffff).setOrigin(0.5);
      // obtener los 10 primeros highscores
      // y formatearlos
      for (let i = 1; i < 11; i++) {
          if (scores[i-1]) {
            this.add.bitmapText(base_x+300 , base_y + 80 * i, 'arcade', `${scores[i-1].highScore}`, 50).setTint(0xffffff).setOrigin(0.5);
            this.add.bitmapText(base_x-300 , base_y + 80 * i, 'arcade', ` ${scores[i-1].name}`, 50).setTint(0xffffff).setOrigin(0.5);
          } 
          else {
            this.add.bitmapText(base_x+300 , base_y + 80 * i, 'arcade', `0`, 50).setTint(0xffffff).setOrigin(0.5);
            this.add.bitmapText(base_x-300 , base_y + 80 * i, 'arcade', `----`, 50).setTint(0xffffff).setOrigin(0.5);
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

  class BotonCruceta extends Phaser.GameObjects.Image
  {
    constructor(scene, x, y, texture, frame = null)
      {
          super(scene, x, y, texture, frame);

          this.setInteractive();
          this.isDown = false;

          this.onPressed = null;
          this.onReleased = null;

          this.on('pointerdown', () => { this.isDown = true; });
          this.on('pointerup', () => { this.pointerUp(); });
          this.on('pointerout', () => { this.pointerUp(); });
      }

      pointerUp()
      {
          this.isDown = false;
          if(this.onReleased != null) this.onReleased();
      }

      update()
      {
          if(this.isDown && this.onPressed != null) this.onPressed();
      }
  }

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
var zona_arriba, zona_abajo, zona_izq, zona_dcha;
var boton_arriba, boton_abajo, boton_izq, boton_dcha, boton_hab;

// score
var score;
var scoreString = "Score: ";
var scoreText;

var musica_juego;

// clase "GameScene" (Escena del juego)
class GameScene extends Phaser.Scene {

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
        window.addEventListener('resize', resize);
        resize();
       
        /* fondo */
        
        let image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'fondo_juego')
        let scaleX = this.cameras.main.width / image.width
        let scaleY = this.cameras.main.height / image.height
        let scale = Math.max(scaleX, scaleY) 
        max_x = this.cameras.main.width;
        max_y = this.cameras.main.height;
        image.setScale(scale).setScrollFactor(0) // para que ocupe toda la pantalla del juego
        
        cooldownText = this.add.bitmapText(32, max_y - 200, 'arcade', scoreString + score, 30);
        scoreText = this.add.bitmapText (32, 40, 'arcade', scoreString + score, 30);
        pauseButton = this.add.image(75, 200, 'pause');
        pauseButton.setScale(3);

        pauseButton.setInteractive();

        /* Eventos de puntero */
        /*  pointerover: hover (pasar por encima el ratón)
            pointerout: fuera (no hover)
            pointerup: click y soltar
            pointerdown: solo click
        */

        pauseButton.on("pointerdown", () => {
            this.scene.pause(CST.SCENES.GAME)
            this.scene.launch(CST.SCENES.PAUSE, musica_juego)
        })

        // this.cameras.main.height
        // this.cameras.main.width
        boton_arriba = new BotonCruceta(this, max_x - 300,  max_y - 500, 'cr-arriba'); 
        boton_abajo = new BotonCruceta(this, max_x  - 300, max_y - 300, 'cr-abajo')
        boton_izq = new BotonCruceta(this, max_x  - 400,  max_y- 400, 'cr-izq')
        boton_dcha = new BotonCruceta(this, max_x  - 200, max_y - 400, 'cr-dcha')
        this.add.existing(boton_arriba);
        this.add.existing(boton_abajo);
        this.add.existing(boton_izq);
        this.add.existing(boton_dcha);

        boton_hab = this.add.image( 200, max_y - 400, 'hab')

        boton_hab.setInteractive();

        boton_arriba.onPressed = () => {
          player.setVelocityY(-400);
          player.anims.play("up");

        }

        boton_arriba.onReleased = () => {
          player.setVelocityY(0);
        }

        boton_abajo.onPressed = () => {
          player.setVelocityY(400);
          player.anims.play("down");
        }

        boton_abajo.onReleased = () => {
          player.setVelocityY(0);
        }

        boton_izq.onPressed = () => {
          //player.anims.play("left");
          player.setFrame(1)
          player.setVelocityX(-400);
        }

        boton_izq.onReleased = () => {
          player.setVelocityX(0);
          player.setFrame(2)
        }

        boton_dcha.onPressed = () => {
          player.setFrame(3)
          player.setVelocityX(400);
        }

        boton_dcha.onReleased = () => {
          player.setVelocityX(0);
          player.setFrame(2)
        }

        boton_hab.on("pointerdown", () => {
          if (!invulnerable && valor_cooldown === 0){
            choques.active = false;
            invulnerable = true;
            player.setTint(0x808080);
            this.time.addEvent({ delay: 1000, callback: setInvulnerableEvent, callbackScope: this, repeat : 1 });
            cooldown = this.time.addEvent({ delay: 5000 });  
            check_cooldown = true;         
         }
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

        spawnAsteroide = this.time.addEvent({ delay: 100, callback: spawnAsteroideEvent, callbackScope: this });
    }

    update (){
        // Update objects & variables
        player.setVelocity(0, 0);

        if (gameStarted) {

          boton_arriba.update();
          boton_abajo.update();
          boton_izq.update();
          boton_dcha.update();


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

/* Variables */
var musica_juego;

// clase "Pause" (Escena de pausa)
class PauseScene extends Phaser.Scene {

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
      //window.addEventListener('resize', resize);
      //resize();

        /* Cartel de pausa */
        this.add.bitmapText(this.game.renderer.width / 2, this.game.renderer.height / 2 - this.game.renderer.height / 4, 'arcade', `PAUSA`, 60).setTint(0xffffff).setOrigin(0.5);

        /* Botón para volver atrás */ 
        let backButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + this.game.renderer.height / 4, 'back')
        backButton.setScale(1).setScrollFactor(0);

        backButton.setInteractive();

        /* Eventos de puntero */
        /*  pointerover: hover (pasar por encima el ratón)
            pointerout: fuera (no hover)
            pointerup: click y soltar
            pointerdown: solo click
        */

        backButton.on("pointerout", () => {
            backButton.setScale(1.2).setScrollFactor(0);
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

function parseJwt(token) {
  if (!token) { return; }
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
}



var musica_fin, score_obtenida;


// clase "DeathScene" (Escena de muertee - cuando colisiona con un asteoride)
class DeathScene extends Phaser.Scene {

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

        var x = localStorage.getItem('jwt');
        var data = {
            jwt: localStorage.getItem('jwt'),
            email: parseJwt(x).user.email,
            score: score_obtenida
        }
        // petición para enviar la score
        $.ajax({
            type: 'POST',
            url: 'http://192.168.100.8:3000/submit-score',
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
      //window.addEventListener('resize', resize);
      //resize();

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

class LoadScene extends Phaser.Scene {

  constructor (){
      super({
          key: CST.SCENES.LOAD
      })
  }

  init(){
    game.scale.startFullscreen();
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

      // cargar imagenes cruceta
      this.load.image('cr-arriba','assets/cruceta_arriba.png')
      this.load.image('cr-abajo','assets/cruceta_abajo.png')
      this.load.image('cr-izq','assets/cruceta_izq.png')
      this.load.image('cr-dcha','assets/cruceta_dcha.png')
      this.load.image('hab','assets/habilidad.png' )
      
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
    
    window.addEventListener('resize', resize);
    resize();

    

      this.scene.add(CST.SCENES.GAME, GameScene, false);
      this.scene.add(CST.SCENES.HIGHSCORE, HighscoreScene, false);
      this.scene.add(CST.SCENES.MENU, MenuScene, false);
      this.scene.add(CST.SCENES.PAUSE, PauseScene, false);
      this.scene.add(CST.SCENES.DEATH, DeathScene, false);

      var musica_menu = this.sound.add('musica_menu');

      // pasar a la escena del menú
      this.scene.start(CST.SCENES.MENU, musica_menu); 
  }
}

function resize() {
    
    var canvas = game.canvas, width = window.innerWidth , height = window.innerHeight ;
    var wratio = width / height, ratio = canvas.width / canvas.height;
 
    if (wratio < ratio) {
        canvas.style.width = width + "px";
        canvas.style.height = (width / ratio) + "px";
    } else {
        canvas.style.width = (height * ratio) + "px";
        canvas.style.height = height + "px";
    }
    
}

let config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: window.innerWidth * window.devicePixelRatio,
  height: window.innerHeight * window.devicePixelRatio,
  pixelArt: true,
  scene: [
    LoadScene
  ],
  audio: {
    disableWebAudio: false
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  }
};

console.log("lanzo game")
game = new Phaser.Game(config);

