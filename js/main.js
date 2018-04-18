var game = new Phaser.Game(480,320,Phaser.AUTO, '',{
	preload: preload,
	create: create,
	update: update
});

var ball;
var paddle;

var bricks;
var newBrick;
var brickInfo;

var score = 0;
var scoreText;

function preload(){
	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	game.scale.pageAlignHorizontally = true;
	game.scale.pageAlignVertically = true;

	game.stage.backgroundColor = '#eee';

	game.load.image('ball', 'assets/ball.png');
	game.load.image('paddle','assets/paddle.png');
	game.load.image('brick','assets/brick.png');

}

function create(){
	ball = game.add.sprite(50,50,'ball');
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.physics.enable(ball, Phaser.Physics.ARCADE);

	scoreText = game.add.text(5,5,'Points: 0',{
		font: '18px Arial', 
		fill: '#0095DD'
	});

	ball.anchor.set(0.5);

	ball.body.velocity.set(150,-150);

	ball.body.collideWorldBounds = true;
	ball.body.bounce.set(1);

	paddle = game.add.sprite(game.world.width * 0.5, game.world.height - 50, 'paddle');
	paddle.anchor.set(0.5);

	game.physics.enable(paddle, Phaser.Physics.ARCADE);

	game.physics.arcade.checkCollision.down = false;

	ball.checkWorldBounds = true;
	ball.events.onOutOfBounds.add(function(){
		alert('Game Over!');
		location.reload();
	}, this);

	initBricks();

}

function initBricks(){
	brickInfo = {
		width: 50,
		height: 20,
		count: {
			row: 7,
			col: 3
		},
		offset: {
			top: 50,
			left: 60
		},
		padding: 10		
	};
	bricks = game.add.group();

	for(c=0; c<brickInfo.count.col; c++) {
        for(r=0; r<brickInfo.count.row; r++) {
            var brickX = (r*(brickInfo.width+brickInfo.padding))+brickInfo.offset.left;
            var brickY = (c*(brickInfo.height+brickInfo.padding))+brickInfo.offset.top;

            newBrick = game.add.sprite(brickX, brickY, 'brick');

            game.physics.enable(newBrick, Phaser.Physics.ARCADE);

            newBrick.body.immovable = true;

            newBrick.anchor.set(0.5);

            bricks.add(newBrick);
        }
    }
}

function ballHitBrick(ball, brick){
	brick.kill();
	score += 10;
	scoreText.setText('Points: '+score);

	var count_alive = 0;
	for (i=0; i < bricks.children.length; i++){
		if (bricks.children[i].alive == true){
			count_alive++;
		}
	}

	if (count_alive == 0){
		alert('You Win!');
		location.reload();
	}
}

function update(){
	game.physics.arcade.collide(ball, paddle);

	game.physics.arcade.collide(ball, bricks, ballHitBrick);

	paddle.body.immovable = true;

	paddle.x = game.input.x;

}