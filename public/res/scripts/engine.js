game = new Phaser.Game(826,500, Phaser.AUTO, 'Side Shot', {preload: preload, create: create, update: update, render: render});

function preload() {
    game.load.image('background', Images.BG);
	
    game.load.spritesheet('ship', Images.SHIP,150,69,12);
	game.load.spritesheet('playerBullet',Images.PLAYER_BULLET,72,35,2);
	game.load.spritesheet('mathBook', Images.MATHBOOK,150,139,2);
	game.load.spritesheet('explosion', Images.EXPLOSION,709,676,4);
	game.load.spritesheet('enemyBullet', Images.MATHBOOK_BULLET,400,420,5);
	game.load.spritesheet('enemyRuler', Images.RULER,150,150,4);
	
	Audio.LOAD();
}

function create() {
	
	Audio.ADD();
	
	game.play.audio('bgTrack');
	
    bg = game.add.image(0, 0, 'background');
	
}

function update(){}

function render(){}