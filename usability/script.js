// runs kaboom npm
import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs";

(function(){

	'use strict';

	let globalData;


    async function getData(){
        const dialogue = await fetch('data/data.json');
        const data = await dialogue.json();
        globalData = data;

		const dataPoints = Object.keys(data);
	
function dialogueShow (character, jsonData) {
			
		
		console.log(dataPoints)
		console.log(jsonData[character][0].opener)

		return dataPoints

	}
	console.log(dialogueShow)



		dialogueShow(dataPoints[1], data)
    }

	


	// focuses on the canvas upon window load
	addEventListener("load", (event) => {
		document.querySelector('#canvas').focus();

		alert('You are a 4th grader from Davis currently learning about California history and the Patwin tribe. Your teacher assigned you a worksheet about the patwin lifestyle and environment, and they gave you this link to help you complete it. Try to learn as much as you can from this link to complete your worksheet.')
	});

	// Start game
	kaboom({
		width: 1000,
		height: 550,
		canvas: document.querySelector('#canvas'),
		background: [ 243, 251, 255, ]
	})

	// Load assets
	loadFont("apl386", "fonts/apl386.ttf", { outline: 1, filter: "linear" })

	loadSprite('bg','images/bg.png')
	loadSprite('bg1','images/bg1.png')
	loadSprite('ground', 'images/tile.png')
	loadSprite('deer', 'images/deer.png', {
		sliceX: 4,

		anims: {
			"idle3": {
				from: 0,
				to: 3,
				speed: 3,
				loop: true,
			}
		}
	})
	loadSprite('coyote', 'images/coyote.png', {
		sliceX: 4,

		anims: {
			"idle4": {
				from: 0,
				to: 3,
				speed: 2,
				loop: true,
			}
		}
	})
	loadSprite('greeter', 'images/patwin.png', {
		sliceX: 2,

		anims: {
			"idle3": {
				from: 0,
				to: 1,
				speed: 1,
				loop: true,
			}
		}
	})
	loadSprite('greeter', 'images/patwin.png', {
		sliceX: 2,

		anims: {
			"idle2": {
				from: 0,
				to: 1,
				speed: 1,
				loop: true,
			}
		}
	})
	loadSprite("player", "images/bro.png", {
		sliceX: 8,
		// Define animations
		anims: {
			"idle": {
				from: 0,
				to: 2,
				speed: 5,
				loop: true,
			},
			"run": {
				// Starts from frame 0, ends at frame 3
				from: 3,
				to: 7,
				// Frame per second
				speed: 5,
				loop: true,
			}, 
			"jump": 2
		}
	})

	// character speed
	const SPEED = 200

	// Design levels
	const levels = [
		[	
			"                                                                         ",
			"                                    ,                                    ",
			"  @   *                 <                               {}                ",
			"=========================================================================",
		]
	]


	// Define a scene called "game". The callback will be run when we go() to the scene
	// Scenes can accept argument from go()
	scene("game", ({ levelIdx }) => {

		// jump characteristics
		setGravity(2400)

		// Use the level passed, or first level
		const level = addLevel(levels[levelIdx], {
			tileWidth: 54,
			tileHeight: 48,
			pos: vec2(0, 410),
			tiles: {
				"<": () => [
					sprite("coyote"),
					anchor("bot"),
					"coyote",
				],
				",": () => [
					sprite("bg"),
					anchor("bot"),
					z(-1),
					pos(0, 50),
					scale(2),
					"bg1",
				],
				"@": () => [
					sprite("player"),
					area(),
					body(),
					anchor("bot"),
					z(3),
					stay(),
					"player",
				],
				"=": () => [
					sprite("ground"),
					area(),
					body({ isStatic: true }),
					anchor("bot"),
					z(2)
				],
				"*": () => [
					sprite('greeter'),
					area(),
					stay(),
					anchor("bot"),
					'greeter',
				],
				"{": () =>[
					sprite('deer'),
					area(),
					body({ isStatic: true }),
					anchor("bot"),
					"deer"
				]
			}
		})

		// Get the player object from tag
		const player = level.get("player")[0]
		const greeter = level.get("greeter")[0]
		const deer = level.get("deer")[0]
		const coyote = level.get("coyote")[0]
		coyote.play('idle4')
		deer.play('idle3')
		player.play('idle')

		player.onUpdate(() => {
			var currCam = camPos();
			if ( currCam.x < player.pos.x && player.pos.x <= 3250) {
			  camPos(player.pos.x, currCam.y);
			} else if (currCam.x > player.pos.x && player.pos.x >= 500) {
				camPos(player.pos.x, currCam.y)
			} 
		})
		


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
				player.jump(600)
				player.play('jump')
			}
		})

		onKeyDown("left", () => {
			player.flipX = true
			player.move(-SPEED, 0)
			
		})

		onKeyDown("right", () => {
			player.flipX = false
			player.move(SPEED, 0)
		})

		// function addDialog() {
		// 		const textbox = add([
		// 			rect(350, 120, { radius: 16 }),
		// 			anchor("center"),
		// 			pos(575, 350),
		// 			outline(2),
		// 		])
			
		// 		const text = add([
		// 			pos(575, 350),
		// 			anchor("center"),
		// 			text("[text]hello! i lost my pet rock. can you help me find it?[/text]", {
		// 				size: 21,
		// 				width: 300, // it'll wrap to next line when width exceeds this value
		// 				lineSpacing: 3,
		// 				letterSpacing: -1,
		// 				font: "apl386", // there're 4 built-in fonts: "apl386", "apl386o", "sink", and "sinko"
	
		// 				styles: {
		// 					"text": {
		// 						color: rgb(0, 0, 0)
		// 					}	
		// 				}
		// 			}),
		// 		])
		// }

		// const dialog = addDialog()


		// player talks to patwin
		player.onCollideUpdate("greeter", () => {


			greeter.hasTalked = true
			console.log(greeter.hasTalked)

			
			const textbox = add([
				rect(350, 160, { radius: 21 }),
				anchor("center"),
				pos(575, 350),
				outline(2),
			])
		
			const yeet = add([
				pos(575, 350),
				anchor("center"),
				text("[test]welcome to my village. feel free to look around. bring me back some acorn bread if you can[/test]", {
					size: 21,
					width: 300, // it'll wrap to next line when width exceeds this value
					lineSpacing: 6,
					letterSpacing: -1,
					font: "apl386", // there're 4 built-in fonts: "apl386", "apl386o", "sink", and "sinko"

					styles: {
						"test": {
							color: rgb(0, 0, 0)
						}	
					}
				}),
			])

			wait(3, () => {
				destroy(yeet)
				destroy(textbox)
			})


	})


		// function collide(spriteName, dialogueStatus) {
		// 	if (spriteName.hasTalked === false) {
		// 		spriteName.hasTalked == true
		// 	} 

		// }

		const prompt = add([
			pos(54, 350),
			anchor("left"),
			text("[test]Use arrow keys to move and spacebar to jump[/test]", {
				size: 21,
				width: 300, // it'll wrap to next line when width exceeds this value
				lineSpacing: 6,
				letterSpacing: -1,
				font: "apl386", // there're 4 built-in fonts: "apl386", "apl386o", "sink", and "sinko"

				styles: {
					"test": {
						color: rgb(0, 0, 0)
					}	
				}
			}),
		])

		onKeyPress(() => {
			prompt.destroy()
		})

	})

	function start() {
		// Start with the "game" scene, with initial parameters
		go("game", {
			levelIdx: 0,
		})
	}

	
	getData();
	start()


}())