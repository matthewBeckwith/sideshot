//		GLOBALS
//-------------		CONSTANTS
var	RUNNING = true,
	ACCELERATION = 600,
	DRAG = 400,
	MAX_SPEED = 400,
	SCORE = 0,
	WAVE = 1,
	ENEMY_BULLET_SPEED = 400,
	ENEMY_FIRE_DELAY = 2000,
	PLAYER_BULLET_SPEED = 400,
	PLAYER_BULLET_SPACING = 250,
	MIN_ENEMY_SPACING = 300,
	MAX_ENEMY_SPACING = 3000,
	ENEMY_SPEED = 300,
	VERTICLE_SPEED = 200,
	SPREAD = 60,
	FREQUENCY = 70,
	VERTICLE_SPACING = 70,
	TIME_BETWEEN_WAVES = 3000;
	
var game,
	cursors,
	fireButton,
	explosions,
	gameOver,
	scoreText,
	bgAudio,
	timer,

//-------------		IMAGES	
	Images = {
		BG:"res/assets/sub_background.png",
		HEALTHBAR:"res/assets/healthbar.png",
		SHEILDBAR:"res/assets/sheildbar.png",
		FG:"res/assets/background.png",
		SHIP:"res/assets/SpriteSheet_Player.png",
		PLAYER_BULLET:"res/assets/SpriteSheet_PlayerBullet.png",
		MATHBOOK:"res/assets/SpriteSheet_mathBook.png",
		MATHBOOK_BULLET:"res/assets/SpriteSheet_EnemyBullet.png",
		RULER:"res/assets/SpriteSheet_Ruler.png",
		RULER_BULLET:"",
		EXPLOSION:"res/assets/SpriteSheet_Explosion.png"
	},

//-------------		AUDIO	
	Audio = {
		SRC:[
			["bgTrack","res/audio/BackgroundTrack.wav"],
			["shoot","res/audio/shoot.wav"],
			["playerDmg","res/audio/playerDamage.wav"],
			["explode","res/audio/explode.wav"],
			["eyeBallHit","res/audio/eyeBallHit.wav"]
		],
		LOAD:function(){
			for(var i = 0; i < this.SRC.length; i++){
				game.load.audio(this.SRC[i][0],this.SRC[i][1]);
			};
		},
		ADD:function(){
			for(var i = 0; i < this.SRC.length; i++){
				game.add.audio(this.SRC[i][0]);
			};
		}
	},
/* 	
//-------------		PLAYER
	Player = {
		ACCELERATION:,
		DRAG:,
		BANK:,
		TIMER:,
		HEALTH:,
		SHEILD:,
		MAX_SPEED:
	},

//-------------		ENEMIES
	Enemies = {
		mathbook = {
			ACCELERATION:,
			DRAG:,
			BANK:,
			TIMER:,
			HEALTH:,
			SHEILD:,
			MIN_SPEED:,
			MAX_SPEED:,
			MIN_SPACING:,
			MAX_SPACING:
		},
		ruler = {
			ACCELERATION:,
			DRAG:,
			BANK:,
			TIMER:,
			HEALTH:,
			SHEILD:,
			MIN_SPEED:,
			MAX_SPEED:,
			MIN_SPACING:,
			MAX_SPACING:
		}
	},
	
//-------------		BULLETS
	Bullet = {
		player:,
		mathbook:,
		ruler:
	},
	 */
//-------------		TIMERS
	CustomTimer = {
		MATHBOOK : {},
		RULER : {},
		BULLET : 0
	};