// runs kaboom npm
import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs";

(function(){

	'use strict';

	let globalData;


	// focuses on the canvas upon window load
	addEventListener("load", (event) => {
		document.querySelector('#canvas').focus();
	});

	const missionBtn = document.querySelector('#mission');
	missionBtn.addEventListener('click', function() {
		document.querySelector('#overlay').style.display = 'none';
		document.querySelector('#overlayBg').style.display = 'none'
		document.querySelector('#canvas').focus();
	})

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
	loadSprite('ground', 'images/tile.png')
	loadSprite('hunter', 'images/deerMan.png')
	loadSprite('weaver', 'images/weaver.png')
	loadSprite('deer', 'images/deer.png', {
		sliceX: 4,

		anims: {
			"idle": {
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
			"idle": {
				from: 0,
				to: 3,
				speed: 4,
				loop: true,
			}
		}
	})
	loadSprite('greeter', 'images/patwin.png', {
		sliceX: 2,

		anims: {
			"idle": {
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
			"idle": {
				from: 0,
				to: 1,
				speed: 1,
				loop: true,
			}
		},
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
				speed: 10,
				loop: true,
			}, 
			"jump": 2
		}
	})

	// character speed
	const SPEED = 200


	// Define a scene called "game". The callback will be run when we go() to the scene
	// Scenes can accept argument from go()
	scene("game", () => {

		async function getData(){
			const dialogue = await fetch('data/data1.json');
			const data = await dialogue.json();
			globalData = data;
		}

		// jump characteristics
		setGravity(2400)

		// Use the level passed, or first level
		const level = addLevel(
			[	
				"                                                                         ",
				"                                    ,                                    ",
				"  @      *              <  ^               b            {}                ",
				"=========================================================================",
			], {
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
					z(10),
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
				"^": () => [
					sprite('hunter'),
					area(),
					stay(),
					anchor("bot"),
					scale(0.45),
					'hunter',
				],
				"b": () =>[
					sprite('weaver'),
					area(),
					anchor("bot"),
					"weaver"
				],
				"{": () =>[
					sprite('deer'),
					area(),
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
		const hunter = level.get("hunter")[0]
		const weaver = level.get("weaver")[0]
		coyote.play('idle')
		deer.play('idle')
		greeter.play('idle')
		player.play('idle')

		// creating arrays for npcs as consts and strings
		// consts are for updating sprite properties while strings are for function inputs
		const npcs = [hunter, weaver]
		const npcString = ["hunter", "weaver"]
		const items = [deer,coyote]

		// assigning properties to all sprties
		function dialogStatus(sprite) {
			sprite.hasTalked = false;
			sprite.requestComplete = false;

			sprite.dialog = 0;
		}

		// assigning properties to each item collection
		function itemStatus(sprite) {
			sprite.collected = false;
		}

		// iterates through each array to assign all sprites the appropriate properties
		for(let i=0;i<npcs.length;i++) {
			dialogStatus(npcs[i])
		}

		for(let i=0;i<items.length;i++) {
			itemStatus(items[i])
		}

		

		function dialogueShow (data, spriteName, dialogLine) {
			const dataPoints = Object.keys(data);

			for(let i=0; i<dataPoints.length;i++) {
				let character = dataPoints[i]
				let line;

				// checking if character from json file matches sprite input
				if (character === spriteName) {
					if (dialogLine === 0) {
						console.log(data[dataPoints[i]].opener);
						line = data[dataPoints[i]].opener;
					} else if (dialogLine === 1) {
						line = data[dataPoints[i]].request;
					} else if (dialogLine === 2) {
						line = data[dataPoints[i]].closer;
					}

					return line;
				}
			}
			
		}
		
		

		// ------ Movements -----
		player.onGround(() => {
			if (!isKeyDown("left") && !isKeyDown("right")) {
				player.play("idle")
			} else {
				player.play("run")
			}
		})

		onKeyPress("space", () => {
			// if (player.isGrounded()) {
			// 	player.jump(600)
			// 	player.play('jump')
			// }
		})

		onKeyDown("left", () => {
			player.flipX = true
			player.move(-SPEED, 0)
			
		})

		onKeyDown("right", () => {
			player.flipX = false
			player.move(SPEED, 0)
		})

		// camera positioning follows player
		player.onUpdate(() => {
			let currCam = camPos();
			if ( currCam.x < player.pos.x && player.pos.x <= 3250) {
				camPos(player.pos.x, currCam.y);
			} else if (currCam.x > player.pos.x && player.pos.x >= 500) {
				camPos(player.pos.x, currCam.y)
			} 
		})

		// player talks to patwin
		player.onCollideUpdate("greeter", () => {

			// addText(dialogueShow(globalData, "greeter", greeter.dialog))
			addText("Hello, stranger. Welcome to the Patwin village of Topaidihi.")

			onKeyPress("space", () => {
				player.onCollideUpdate("greeter", () => {
					addText("I have not heard of this 'seal' you’re searching for, but perhaps the others in the village have.")
				})
				npcCollide(greeter)
			})

			wait(3, () => {
				npcCollide(greeter)
			})

		})

		// player.onCollideUpdate("hunter", () => {

		// 	// addText(`testing dialog ${hunter.dialog}`)
		// 	addText(dialogueShow(globalData, "hunter", hunter.dialog))

		// 	onKeyPress("space", () => {

		// 		if (hunter.dialog === 1 && hunter.requestComplete === true) {
		// 			hunter.dialog = 3
		// 		} else {
		// 			hunter.dialog = 1
		// 		}

		// 	})
			
		// 	wait(3, () => {
		// 		npcCollide(hunter)
		// 	})

		// })

		player.onCollideUpdate("deer", () => {

			// addText(`testing dialog ${hunter.dialog}`)
			addText("Deers are a common animal in Patwin lifestyles. Let's let the hunter know we found some.")

			hunter.requestComplete = true;

		})

		npcString.forEach(npc => 

			player.onCollideUpdate(`${npc}`, () => {

				let npcNum = npcString.indexOf(npc)
				addText(dialogueShow(globalData, `${npc}`, npcs[npcNum].dialog))

				if (isKeyPressed("space")) {

					onKeyPress("space", () => {

						if (npcs[npcNum].dialog === 1 && npcs[npcNum].requestComplete === true) {
							npcs[npcNum].dialog = 2
						} else {
							npcs[npcNum].dialog = 1
						}
					})
				} else {
						wait(5, () => {
							npcCollide(npcs[npcNum])
						})
				}

			})
		)

		// creates sprite text and textboxs
		function addText(dialog) {
			const textbox = add([
				rect(350, 160, { radius: 21 }),
				anchor("center"),
				pos(575, 300),
				// pos(width()/2, height()/5),
				// pos(player.pos.x, height()/2),
				outline(2),
				fixed()
			])
		
			const yeet = add([
				// pos(575, 350),
				pos(textbox.pos),
				anchor("center"),
				text(`[test]${dialog}[/test]`, {
					size: 18,
					width: 300, // it'll wrap to next line when width exceeds this value
					lineSpacing: 6,
					letterSpacing: -1,
					font: "apl386",

					styles: {
						"test": {
							color: rgb(0, 0, 0)
						}	
					}
				}),
				fixed()
			])

			wait(0.1, () => {
				destroy(yeet)
				destroy(textbox)
			})
		}

		// changes which line of dialogue should be displayed for each sprite
		function npcCollide(spriteName) {

			if (spriteName.dialog === 0) {
				spriteName.hasTalked = true;
				spriteName.dialog = 1;
			} else if (spriteName.hasTalked === true && spriteName.requestComplete === false) {
				return spriteName.dialog;
			} else if (spriteName.requestComplete === true) {
				spriteName.dialog = 2;
			}

			return spriteName.dialog;
		}

		// creates instruction prompt for player movement
		const prompt = add([
			pos(54, 375),
			anchor("left"),
			text("[test]Use arrow keys to move[/test]", {
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

		getData();
	})

	function start() {
		// Start with the "game" scene, with initial parameters
		go("game")
	}

	

	start()


}())