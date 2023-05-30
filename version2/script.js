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
			
		
			let opener = ''
			console.log(dataPoints)
			console.log(jsonData[character].request)

		}
	
		dialogueShow(dataPoints[1], globalData)
    }


	// focuses on the canvas upon window load
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

	// Load assets
	loadFont("apl386", "fonts/apl386.ttf", { outline: 0, filter: "linear" })

	loadSprite('bg','images/bg.png')
	loadSprite('bg1','images/bg1.png')
	loadSprite('ground', 'images/tile.png')
	loadSprite('ground2', 'images/ground2.png')
	loadSprite('next', 'images/next.png')
	loadSprite('back', 'images/back.png')
	loadSprite('rock', 'images/rock.png')
	loadSprite('patwin', 'images/patwin.png', {
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
	const SPEED = 230

	// Design levels
	const levels = [
		[	
			"                   ",
			"         ,         ",
			" @    *         > ",
			"===================",
		],
		[
			"                  ",
			"         .        ",
			" < @       ¡      ",
			"===================",
		],
		[	
			"                   ",
			"          ,        ",
			"       *      @ > ",
			"===================",
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
				".": () => [
					sprite("bg"),
					anchor("bot"),
					z(-1),
					pos(15, 150),
					"bg",
				],
				",": () => [
					sprite("bg1"),
					anchor("bot"),
					z(-1),
					pos(15, 150),
					"bg1",
				],
				"@": () => [
					sprite("player"),
					area(),
					body(),
					anchor("bot"),
					z(3),
					"player",
				],
				"=": () => [
					sprite("ground"),
					area(),
					body({ isStatic: true }),
					anchor("bot"),
					z(2)
				],
				"-": () => [
					sprite("ground2"),
					area(),
					body({ isStatic: true }),
					anchor("bot"),
				],
				"*": () => [
					sprite('patwin'),
					area(),
					anchor("bot"),
					'patwin',
				],
				">": () =>[
					sprite('next'),
					area(),
					body({ isStatic: true }),
					anchor("bot"),
					"next"
				],
				"<": () =>[
					sprite('back'),
					area(),
					body({ isStatic: true }),
					anchor("bot"),
					"back"
				],
				"&": () =>[
					sprite('rock'),
					area(),
					body({ isStatic: true }),
					anchor("bot"),
					"rock"
				]
			}
		})

		// Get the player object from tag
		const player = level.get("player")[0]
		const patwin = level.get("patwin")[0]
		player.play('idle')

		patwin.hasTalked = false


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

		// 		textbox.hidden = true
		// 		text.hidden = true

		// 		return {
		// 			say(t) {
		// 				text.text = t
		// 				textbox.hidden = false
		// 				text.hidden = false
		// 			},
		// 			dismiss() {
		// 				if (!this.active()) {
		// 					return
		// 				}
		// 				text.text = ""
		// 				textbox.hidden = true
		// 				text.hidden = true
		// 			},
		// 			active() {
		// 				return !textbox.hidden
		// 			},
		// 			destroy() {
		// 				textbox.destroy()
		// 				text.destroy()
		// 			}
		// 		}
		// }

		// const dialog = addDialog()

		// player talks to patwin
		player.onCollide("patwin", () => {


			patwin.hasTalked = true
			console.log(patwin.hasTalked)


	})

		function collide(spriteName, dialogueStatus) {
			if (spriteName.hasTalked === false) {
				spriteName.hasTalked == true
			} 

		}

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
			patwin.play('idle2')
		}

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