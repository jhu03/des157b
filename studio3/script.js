(function(){

	'use strict';


// Start game
kaboom({
    width: 1000,
    height: 600,
    canvas: document.querySelector('#canvas'),
    background: [ 255, 255, 255, ]
})

const mockCanvas = document.querySelector('#mockCanvas');

// Load assets
loadSprite('ground', 'images/ground.png')
loadSprite('ground2', 'images/ground2.png')
loadSprite('next', 'images/next.png')
loadSprite('back', 'images/back.png')
loadSprite('rock', 'images/rock.png')
loadSprite('cat', 'images/cat.png')
loadSprite('spud', 'images/spud.png', {
    sliceX: 4,

    anims: {
        idle2: {
            from: 0,
            to: 3,
            speed: 5,
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
		"                ",
		"                ",
		" @     *       >",
		"================",
	],
	[
		"              & ",
		"            ====",
		"< @   #  ===----",
		"================",
	],
    [	
		"                ",
		"                ",
		"       *     @ >",
		"================",
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
		height: 50,
		pos: vec2(100, 400),
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
		],
		"-": () => [
			sprite("ground2"),
			area(),
			solid(),
			origin("bot"),
		],
        "*": () => [
            sprite('spud'),
            area(),
            origin("bot"),
            'spud',
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
        "#": () =>[
            sprite('cat'),
            area(),
			body(),
			origin("bot"),
            "cat"
        ]
	})

	// Get the player object from tag
	const player = get("player")[0]
    const spud = get("spud")[0]
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

	// player.onCollide("danger", () => {
	// 	player.pos = level.getPos(0, 0)
	// 	// Go to "lose" scene when we hit a "danger"
	// 	go("lose")
	// })

	// player.onCollide("coin", (coin) => {
	// 	destroy(coin)
	// 	play("score")
	// 	score++
	// 	scoreLabel.text = score
	// })

	// Fall death
	// player.onUpdate(() => {
	// 	if (player.pos.y >= height()) {
	// 		go("lose")
	// 	}
	// })

	// Enter the next level on portal


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

		// reveals the gradient rock
		mockCanvas.removeAttribute('class');
	})

	player.onCollide("back", () => {
		// goes to prev level
		go("game", {
			levelIdx: 2,
		})
		mockCanvas.className = 'hide';
	})

})

function start() {
	// Start with the "game" scene, with initial parameters
	go("game", {
		levelIdx: 0,
	})
}

start()

// animated gradients library
var granimInstance = new Granim({
    element: '#rock',
    direction: 'left-right',
    states : {
        "default-state": {
            gradients: [
                ['#EB3349', '#F45C43'],
                ['#FF8008', '#FFC837'],
                ['#4CB8C4', '#3CD3AD'],
                ['#24C6DC', '#514A9D'],
                ['#FF512F', '#DD2476'],
                ['#DA22FF', '#9733EE']
            ],
            transitionSpeed: 2000
        }
    }
});

}())