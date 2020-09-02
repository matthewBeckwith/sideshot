var  game = new Phaser.Game(826,500, Phaser.AUTO, 'Side Shot', {preload: preload, create: create, update: update, render: render});

var player,
	mathBookEnemies,
	rulerEnemies,
	mathBookEnemiesTimer,
	rulerEnemiesTimer,
	bg,
	cursors,
	bank,
	playerBullets,
	enemyBullets,
	fireButton,
	explosions,
	gameOver,
	scoreText,
	bgAudio,
	timer;

var RUNNING = true,
	ACCELERATION = 600,
	DRAG = 400,
	MAX_SPEED = 400,
	BULLET_TIMER = 0,
	SCORE = 0,
	WAVE = 1;

function preload() {
    game.load.image('background', 'res/assets/sub_background.png');
	game.load.audio('bgTrack', 'res/audio/BackgroundTrack.wav');
	game.load.audio('shoot', 'res/audio/shoot.wav');
	game.load.audio('explode', 'res/audio/explode.wav');
	game.load.audio('eyeBallHit', 'res/audio/eyeBallHit.wav');
	game.load.audio('playerDmg', 'res/audio/playerDamage.wav');
    game.load.spritesheet('ship', 'res/assets/SpriteSheet_Player.png',150,69,12);
	game.load.spritesheet('playerBullet','res/assets/SpriteSheet_PlayerBullet.png',72,35,2);
	game.load.spritesheet('mathBook', 'res/assets/SpriteSheet_mathBook.png',150,139,2);
	game.load.spritesheet('explosion', 'res/assets/SpriteSheet_Explosion.png',709,676,4);
	game.load.spritesheet('enemyBullet', 'res/assets/SpriteSheet_EnemyBullet.png',400,420,5);
	game.load.spritesheet('enemyRuler', 'res/assets/SpriteSheet_Ruler.png',150,150,4);
}

function  create() {
	//-------------->	Background Image
    bg = game.add.image(0, 0, 'background');
	
	//-------------->	Set up Audio
	bgAudio = game.add.audio('bgTrack');
	shootAudio = game.add.audio('shoot');
	exPlo = game.add.audio('explode')
	eyeHit = game.add.audio('eyeBallHit');
	playerDmg = game.add.audio('playerDmg');
	//-------------->	Play and Loop Background Music
	bgAudio.play();
	bgAudio.onStop.add(function(){bgAudio.play();},this);
	
	//-------------->	Score
	scoreText = game.add.text(765,20,'',{font:'20px Arial',fill:'#fff'});
	scoreText.render = function(){scoreText.text = SCORE;};
	scoreText.render();
	
	//-------------->	Wave Timer
	timer = game.time.create(false);
	timer.loop(5000, increaseWave, this);
	timer.start();
	
	//-------------->	Explosion Group
	explosions = game.add.group();
	explosions.enableBody = true;
	explosions.physicsBodyType = Phaser.Physics.ARCADE;
	explosions.createMultiple(30, 'explosion');
	explosions.setAll('anchor.x', 0.5);
	explosions.setAll('anchor.y', 0.5);
	explosions.setAll('scale.x', 0.15);
	explosions.setAll('scale.y', 0.15);
	explosions.forEach(function(explosion){
		explosion.animations.add('explosion');
	});
	
    //-------------->	Hero
    player = game.add.sprite(150, 200, 'ship');
	player.health = 100;
    player.anchor.setTo(0.8, 0.5);
	game.physics.enable(player, Phaser.Physics.ARCADE);
	player.enableRotation = false;
	player.body.maxVelocity.setTo(MAX_SPEED,MAX_SPEED);
	player.body.drag.setTo(DRAG,DRAG);
	player.body.collideWorldBounds = true;
	player.body.setSize((player.body.width / 2),player.body.height)
	player.animations.add('fly',[0,1,2,3,4,5],10,true);
	player.animations.add('shoot',[6,7,8,9,10,11],10);
	//-------------->	Player Bullet Group
	playerBullets = game.add.group();
	playerBullets.enableBody = true;
	playerBullets.physicsBodyType = Phaser.Physics.ARCADE;
	playerBullets.createMultiple(30, 'playerBullet');
	playerBullets.setAll('anchor.x', 0.5);
	playerBullets.setAll('anchor.y', 1);
	playerBullets.setAll('outOfBoundsKill', true);
	playerBullets.setAll('checkWorldBounds', true);
	playerBullets.forEach(function(pBullet){
		pBullet.animations.add('fly',[0,1],4,true);
	});
	
	//-------------->	enemies
	mathBookEnemies = game.add.group();
	mathBookEnemies.enableBody = true;
	mathBookEnemies.physicsBodyType = Phaser.Physics.ARCADE;
	mathBookEnemies.createMultiple(30, 'mathBook');
	mathBookEnemies.setAll('anchor.x', 0.5);
	mathBookEnemies.setAll('anchor.y', 0.5);
	mathBookEnemies.setAll('scale.x', 0.5);
    mathBookEnemies.setAll('scale.y', 0.5);
    mathBookEnemies.setAll('angle', 180);
	mathBookEnemies.setAll('outOfBoundsKill', true);
	mathBookEnemies.setAll('checkWorldBounds', true);
	mathBookEnemies.forEach(function(enemy){
		enemy.body.setSize(enemy.width * 3 / 4,enemy.height * 3 / 4);
		enemy.damageAmount = 20;
	});
	//-------------->	enemy Bullets
	mathBookEnemyBullets = game.add.group();
	mathBookEnemyBullets.enableBody = true;
	mathBookEnemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
	mathBookEnemyBullets.createMultiple(30, 'enemyBullet');
	mathBookEnemyBullets.setAll('anchor.x', 0.5);
	mathBookEnemyBullets.setAll('anchor.y', 0.5);
	mathBookEnemyBullets.setAll('outOfBoundsKill', true);
	mathBookEnemyBullets.setAll('checkWorldBounds', true);
	mathBookEnemyBullets.forEach(function(){
		//enemy.body.setSize(20,20);
	});
	game.time.events.add(1000,launchMathBookEnemy);
	
	rulerEnemies = game.add.group();
	rulerEnemies.enableBody = true;
	rulerEnemies.physicsBodyType = Phaser.Physics.ARCADE;
	rulerEnemies.createMultiple(30 * WAVE, 'enemyRuler');
	rulerEnemies.setAll('anchor.x', 0.5);
	rulerEnemies.setAll('anchor.y', 0.5);
	rulerEnemies.setAll('scale.x', 0.5);
    rulerEnemies.setAll('scale.y', 0.5);
    rulerEnemies.setAll('angle', 180);
	rulerEnemies.setAll('outOfBoundsKill', true);
	rulerEnemies.setAll('checkWorldBounds', true);
	rulerEnemies.forEach(function(enemy){
		enemy.body.setSize(enemy.width * 3 / 4,enemy.height * 3 / 4);
		enemy.damageAmount = 40;
		enemy.bullets = 1;
		enemy.lastShot = 0;
	});
	game.time.events.add(1000,launchRulerEnemy);
	
	//-------------->	Controls
	cursors = game.input.keyboard.createCursorKeys();
	fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	
	//-------------->	Game over text
    gameOver = game.add.text(game.world.centerX, game.world.centerY, 'GAME OVER!', { font: '84px Arial', fill: '#000' });
    gameOver.anchor.setTo(0.5, 0.5);
	gameOver.alpha = 0;
    gameOver.visible = false;
}

function update() {
	//-------------->	Reset Player Velocity and Check for KeyPress
	player.body.acceleration.x = 0;
	player.body.acceleration.y = 0;
	
	if(! player.alive && gameOver.visible === false){
		
		gameOver.visible = true;
		var fadeInGameOver = game.add.tween(gameOver);
			fadeInGameOver.to({alpha:1},1000, Phaser.Easing.Quintic.Out);
			fadeInGameOver.onComplete.add(setResetHandlers);
			fadeInGameOver.start();
			
		function setResetHandlers() {
			tapRestart = game.input.onTap.addOnce(_restart,this);
			spaceRestart = fireButton.onDown.addOnce(_restart,this);
			function _restart() {
				tapRestart.detach();
				spaceRestart.detach();
				restart();
			}
		}
	}else{
		if(game.physics.arcade.distanceToPointer(player) > 100){
			game.physics.arcade.moveToPointer(player, ACCELERATION);
		}else{
			player.velocity = 0;
		}

		if(fireButton.isDown || game.input.pointer1.isDown){
			fireBullet();
			player.animations.play('shoot');
		}else{
			player.animations.play('fly');
		}
		if(cursors.left.isDown){
			player.body.acceleration.x = -ACCELERATION;
		}else if(cursors.right.isDown){
			player.body.acceleration.x = ACCELERATION;
		}else if(cursors.up.isDown){		// && player.y > 100
			player.body.acceleration.y = -ACCELERATION;
		}else if(cursors.down.isDown){		// && player.y < 525
			player.body.acceleration.y = ACCELERATION;
		}

		//-------------->	Squish and rotate ship for illusion of "banking"
		bank = player.body.velocity.y / MAX_SPEED;
		player.scale.y = 1 - Math.abs(bank) / 2;
		player.angle = bank * 20;

		//-------------->	collisions
		game.physics.arcade.overlap(player, mathBookEnemies, shipCollide, null, this);
		game.physics.arcade.overlap(mathBookEnemies, playerBullets, hitEnemy, null, this);
		game.physics.arcade.overlap(player, rulerEnemies, shipCollide, null, this);
		game.physics.arcade.overlap(rulerEnemies, playerBullets, hitEnemy, null, this);
		
		var enemyBulletSpeed = 400;
		var enemyFireDelay = 2000;
		
		//-------------->	Fire
		enemyBullet = mathBookEnemyBullets.getFirstExists(false);
		
		if (enemyBullet &&
			this.alive &&
			this.bullets &&
			this.y > game.width / 8 &&
			game.time.now > enemyFireDelay + this.lastShot) {
				this.lastShot = game.time.now;
				this.bullets--;
				enemyBullet.reset(this.x, this.y + this.height / 2);
				enemyBullet.damageAmount = this.damageAmount;
				var angle = game.physics.arcade.moveToObject(enemyBullet, player, enemyBulletSpeed);
				enemyBullet.angle = game.math.radToDeg(angle);
				console.log("Enemy Fire!");
			}
	}
}

function render() {
	/* for(var i = 0; i < mathBookEnemies.length; i++){
		game.debug.body(mathBookEnemies.children[i]);
	}
	game.debug.body(player); */
	
	/* game.debug.text(' MathBooks Living: ' + mathBookEnemies.countLiving() + '/' + mathBookEnemies.length, 32, 32);
	game.debug.text(' Rulers Living: ' + rulerEnemies.countLiving() + '/' + rulerEnemies.length, 32, 50); */
}

function fireBullet(){
	if(game.time.now > BULLET_TIMER){
		var bulletSpeed = 400;
		var bulletSpacing = 250;
		//-------------->	Grab the first Bullet from the Group
		var bullet = playerBullets.getFirstExists(false);
		if(bullet){
			var bulletOffset = 20 * Math.sin(game.math.degToRad(player.angle));
				bullet.reset((player.x + bulletOffset)+100,player.y + 50);
				bullet.angle = player.angle;
				game.physics.arcade.velocityFromAngle(bullet.angle, bulletSpeed, bullet.body.velocity);
				bullet.body.velocity.y += player.body.velocity.y;
				BULLET_TIMER = game.time.now + bulletSpacing;
				bullet.animations.play('fly');
				shootAudio.play();
		}
	}
}

function enemyShotPlayer(player, bullet) {
    var explode = explosions.getFirstExists(false);
    explode.reset(player.body.x + player.body.halfWidth, player.body.y + player.body.halfHeight);
    explode.alpha = 0.7;
    explode.play('explosion', 30, false, true);
    bullet.kill();
    player.damage(bullet.damageAmount);
}

function launchMathBookEnemy() {
    var enemy = mathBookEnemies.getFirstExists(false);
    if (enemy) {
        enemy.reset(game.width + 20, game.rnd.integerInRange(0, game.height - 100));
        enemy.body.velocity.x = -300;
        enemy.body.velocity.y = game.rnd.integerInRange(100, 200);
        enemy.body.drag.y = 100;
		enemy.animations.add('fly',[0,1],10,true);
		enemy.animations.play('fly');
		enemy.update = function(){
			enemy.angle = game.math.radToDeg(Math.atan2(enemy.body.velocity.x,enemy.body.velocity.y));
		}
    }
    //-------------->	Send another enemy soon
    mathBookEnemiesTimer = game.time.events.add(3000 / WAVE, launchMathBookEnemy);
}

function launchRulerEnemy(){
	var startingY = game.rnd.integerInRange(0, game.height - 100);
    var horizontalSpeed = 200;
    var spread = 10;
    var frequency = 70;
    var verticalSpacing = 70;
    var numEnemiesInWave = 5;
    var timeBetweenWaves = 5000;
    //-------------->	Launch WAVE
    for (var i =0; i < numEnemiesInWave; i++) {
        var enemy2 = rulerEnemies.getFirstExists(false);
		if (enemy2) {
			enemy2.startingY = startingY;
			enemy2.reset(game.width, verticalSpacing * i);
			enemy2.body.acceleration.x = -horizontalSpeed;
			enemy2.animations.add('fly',[0,1,2,3],24,true);
			enemy2.animations.play('fly');
			enemy2.update = function(){
				//-------------->	Wave movement
				if(this.body.y >= 400){
					this.body.acceleration.y = -1000;
				}else{
					this.body.acceleration.y = this.startingY + Math.sin((this.y) / frequency) * -spread;
				}
				//-------------->	Kill enemies once they go off screen
				if (this.y < game.x) {
					this.kill();
				}
			};
		}
    }
    //-------------->	Send another WAVE soon
    rulerEnemiesTimer = game.time.events.add(timeBetweenWaves / WAVE, launchRulerEnemy);
}

function hitEnemy(enemy,bullet){
	var explode = explosions.getFirstExists(false);
		explode.reset(bullet.body.x + bullet.body.halfWidth, bullet.body.y + bullet.body.halfHeight);
		explode.body.velocity.y = enemy.body.velocity.y;
		explode.alpha = 0.7;
		explode.play('explosion', 30, false, true);
		enemy.kill();
		bullet.kill();
		eyeHit.play();
		game.time.events.add(200, function(){
			exPlo.play();
		}, this);
		SCORE += enemy.damageAmount * 10;
		scoreText.render();
}

function shipCollide(player, enemy){
	var explode = explosions.getFirstExists(false);
		explode.reset(enemy.body.x + enemy.body.halfWidth, enemy.body.y + enemy.body.halfHeight);
		explode.body.velocity.y = enemy.body.velocity.y;
		explode.alpha = 0.7;
		explode.play('explosion', 30, false, true);
		enemy.kill();
		player.damage(enemy.damageAmount);
		exPlo.play();
		game.time.events.add(200, function(){
			playerDmg.play();
		}, this);
}

function increaseWave(){
	WAVE++;
}

function restart() {
    //-------------->	Reset the enemies
	mathBookEnemies.callAll('kill');
    game.time.events.remove(mathBookEnemiesTimer);
    game.time.events.add(1000, launchMathBookEnemy);
    mathBookEnemyBullets.callAll('kill');
    rulerEnemies.callAll('kill');
    game.time.events.remove(rulerEnemiesTimer);
    game.time.events.add(1000, launchRulerEnemy);
    game.time.events.remove(timer);
    //-------------->	Revive the player
    player.revive();
    player.health = 100;
    SCORE = 0;
	WAVE = 1;
    scoreText.render();
    //-------------->	Hide the text
    gameOver.visible = false;
}