(function(){

	'use strict';


addEventListener("load", (event) => {

	document.querySelector('#canvas').focus();
});

// Start game
kaboom({
    width: 1000,
    height: 550,
    canvas: document.querySelector('#canvas'),
    background: [ 243, 251, 255, ]
})

const mockCanvas = document.querySelector('#mockCanvas');

// Load assets
loadSprite('bg','images/bg.png')
loadSprite('bg1','images/bg1.png')
loadSprite('ground', 'images/tile.png')
loadSprite('ground2', 'images/ground2.png')
loadSprite('next', 'images/next.png')
loadSprite('back', 'images/back.png')
loadSprite('rock', 'images/rock.png')
loadSprite('cat', 'images/cat.png')
loadSprite('patwin', 'images/patwin.png', {
    sliceX: 2,

    anims: {
        idle2: {
            from: 0,
            to: 1,
            speed: 1,
            loop: true,
        }
    }
})
loadSprite("bean", "images/bro.png", {
    sliceX: 8,
	// Define animations
	anims: {
        idle: {
            from: 0,
            to: 2,
            speed: 5,
			loop: true,
        },
		run: {
			// Starts from frame 0, ends at frame 3
			from: 3,
			to: 7,
			// Frame per second
			speed: 5,
			loop: true,
		}, 
        jump: 2
	}
})

// character speed
const SPEED = 240

// Design levels
const LEVELS = [
	[	
			"|                  ",
			"|        ,         ",
			"|@     *         > ",
			"===================",
	],
	[
			"|                 |",
			"|        .        |",
			"|< @              |",
			"===================",
	],
[	
			"|                  |",
			"|         ,        |",
			"|       *      @ > |",
			"===================",
	]



]



// Define a scene called "game". The callback will be run when we go() to the scene
// Scenes can accept argument from go()
scene("game", ({ levelIdx, score }) => {

	// jump characteristics
	gravity(2400)

	// Use the level passed, or first level
	const level = addLevel(LEVELS[levelIdx], {
		width: 54,
		height: 48,
		pos: vec2(0, 410),
		".": () => [
			sprite("bg"),
			origin("bot"),
            z(-1),
			pos(15, 100),
			"bg",
		],
		",": () => [
			sprite("bg1"),
			origin("bot"),
            z(-1),
			pos(15, 150),
			"bg1",
		],
		"@": () => [
			sprite("bean"),
			area(),
			body(),
			origin("bot"),
            z(1),
			"player",
		],
		"=": () => [
			sprite("ground"),
			area(),
			solid(),
			origin("bot"),
			z(2)
		],
		"-": () => [
			sprite("ground2"),
			area(),
			solid(),
			origin("bot"),
		],
        "*": () => [
            sprite('patwin'),
            area(),
            origin("bot"),
            'patwin',
        ],
        ">": () =>[
            sprite('next'),
            area(),
			body(),
			origin("bot"),
            "next"
        ],
        "<": () =>[
            sprite('back'),
            area(),
			body(),
			origin("bot"),
            "back"
        ],
        "&": () =>[
            sprite('rock'),
            area(),
			body(),
			origin("bot"),
            "rock"
        ],
        "|": () =>[
			rect(1, 40) ,
			color(200,200,200,0),
            area(),
			body(),
			origin("bot"),
            "cat"
        ]
	})

	// Get the player object from tag
	const player = get("player")[0]
    const spud = get("patwin")[0]
    player.play('idle')


	// Movements
    player.onGround(() => {
        if (!isKeyDown("left") && !isKeyDown("right")) {
            player.play("idle")
        } else {
            player.play("run")
        }
    })

	onKeyPress("space", () => {
		if (player.isGrounded()) {
            player.play('jump')
			player.jump()
		}
	})

	onKeyDown("left", () => {
        player.flipX(true)
		player.move(-SPEED, 0)
        
	})

	onKeyDown("right", () => {
        player.flipX(false)
		player.move(SPEED, 0)
	})


    // player talks to spud
    player.onCollide("spud", () => {

        add([
            pos(width()/2, height()/2),
            text("[hello! i lost my pet rock. can you help me find it?].full", {
                size: 24,
                width: 300, // it'll wrap to next line when width exceeds this value
                font: "apl386", // there're 4 built-in fonts: "apl386", "apl386o", "sink", and "sinko"

                styles: {
                    "full":{
                        color: rgb(0, 0, 0)
                    }
                   
                }
            }),
        ])

})

	player.onCollide("next", () => {
		// goes to next level
		go("game", {
			levelIdx: 1,
		})


	})

	player.onCollide("back", () => {
		// goes to prev level
		go("game", {
			levelIdx: 2,
		})
	})

	if (levelIdx == 0 || levelIdx == 2) {
		spud.play('idle2');
	}

})

function start() {
	// Start with the "game" scene, with initial parameters
	go("game", {
		levelIdx: 0,
	})
}

start()


}())