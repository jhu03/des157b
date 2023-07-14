// runs kaboom npm
import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs";

(function(){

	'use strict';

	let globalDataNpc;
	let globalDataItems;


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

	// load background and images
	loadSprite('bg','images/bg.png')
	loadSprite('ground', 'images/tile.png')
	loadSprite('water', 'images/water.png')

	// load npc sprites
	loadSprite('hunter', 'images/deerMan.png')
	loadSprite('weaver', 'images/weaver.png')
	loadSprite('gatherer', 'images/gatherer.png')
	loadSprite('fisher', 'images/fisher.png')

	// load sprite animations
	loadSprite('fire', 'images/fire.png', {
		sliceX: 3,
		
		anims: {
			"flames": {
				from: 0,
				to: 2,
				speed: 7,
				loop: true,
			}
		}
	})
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

		anims: {
			"idle": {
				from: 0,
				to: 2,
				speed: 5,
				loop: true,
			},
			"run": {
				from: 3,
				to: 7,
				speed: 10,
				loop: true,
			}, 
			"jump": 2
		}
	})

	// character speed
	// const SPEED = 200
	const SPEED = 400


	// Define a scene called "game". The callback will be run when we go() to the scene
	// Scenes can accept argument from go()
	scene("game", () => {

		async function getData(){
			const dialogue = await fetch('data/data.json');
			const dataNpc = await dialogue.json();

			const items = await fetch('data/itemData.json');
			const dataItems = await items.json();

			globalDataNpc = dataNpc;
			globalDataItems = dataItems;
		}

		// jump characteristics
		setGravity(2400)

		// Use the level passed, or first level
		const level = addLevel(
			[	
				"                                                                                                ",
				"                                                 ,                                              ",
				"  @      *              <  ^  {             b                       g  fffff         >          ",
				"=======================================================================================~~~~~~~~~",
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
					scale(2.6),
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
				"~": () => [
					sprite("water"),
					area(),
					body({ isStatic: true }),
					anchor("bot"),
					z(2)
				],
				"f": () => [
					sprite("fire"),
					area(),
					anchor("bot"),
					z(2),
					"fire"
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
				"g": () =>[
					sprite('gatherer'),
					area(),
					anchor("bot"),
					"gatherer"
				],
				">": () =>[
					sprite('fisher'),
					area(),
					anchor("bot"),
					"fisher"
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
		const gatherer = level.get("gatherer")[0]
		const fisher = level.get("fisher")[0]
		const fire = level.get("fire")

		coyote.play('idle')
		deer.play('idle')
		greeter.play('idle')
		player.play('idle')

		// needed to get all fire sprites to play animation
		for(let i=0; i<fire.length; i++) {
			fire[i].play('flames')
		} 
		

		// creating arrays for npcs as consts and strings
		// consts are for updating sprite properties while strings are for function inputs
		const npcs = [hunter, weaver, gatherer, fisher]
		const npcString = ["hunter", "weaver", "gatherer", "fisher"]
		const items = [deer, coyote]
		const itemString = ["deer", "coyote"]

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

		
		let textboxColor = [255,255,255];
		function dialogueShow (data, spriteName, dialogLine) {
			const dataPoints = Object.keys(data);

			for(let i=0; i<dataPoints.length;i++) {
				let character = dataPoints[i]
				let line;

				// checking if character from json file matches sprite input
				if (character === spriteName) {
					if (dialogLine === 0) {
						line = data[dataPoints[i]].opener;
						textboxColor = [255,255,255];
					} else if (dialogLine === 1) {
						line = data[dataPoints[i]].request;
						textboxColor = [206, 249, 255];
					} else if (dialogLine === 2) {
						line = data[dataPoints[i]].closer;
						textboxColor = [217,243,186];
					} else if (dialogLine === 3) {
						line = data[dataPoints[i]].seal;
					}
					return line;
				}
			}
			return textboxColor;
			
		}

		function itemCollection (data, itemName, spriteName) {
			const dataPoints = Object.keys(data);

			for(let i=0; i<dataPoints.length;i++) {
				let character = dataPoints[i]
				let item = data[dataPoints[i]].item
				
				// checking if character from json file matches sprite input
				if (item === itemName) {
					spriteName.requestComplete = true;
					// console.log(character)
					// console.log(character.requestComplete)
				}
			}
		}
		
		

		// ------ MOVEMENTS ----- 
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
			if ( currCam.x < player.pos.x && player.pos.x <= 4600) {
				camPos(player.pos.x, currCam.y);
			} else if (currCam.x > player.pos.x && player.pos.x >= 500) {
				camPos(player.pos.x, currCam.y)
			} 
		})


		// ------ COLLISIONS ----- 

		// player talks to patwin, unique function since Patwin does not have requests 
		player.onCollideUpdate("greeter", () => {

			// addText(dialogueShow(globalDataNpc, "greeter", greeter.dialog))
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

		// player.onCollideUpdate("deer", () => {

		// 	// addText(`testing dialog ${hunter.dialog}`)
		// 	addText("Deers are a common animal in Patwin lifestyles. Let's let the hunter know we found some.")

		// 	hunter.requestComplete = true;

		// })

		// controls all collisions for npc sprites
		npcString.forEach(npc => 
			player.onCollideUpdate(`${npc}`, () => {
				let npcNum = npcString.indexOf(npc)
				addText(dialogueShow(globalDataNpc, npc, npcs[npcNum].dialog))

				// advances dialog if space is pressed
				if (isKeyPressed("space")) {
					if (npcs[npcNum].dialog === 1 && npcs[npcNum].requestComplete === true) {
						npcs[npcNum].dialog = 2
					} else if (npcs[npcNum].dialog === 2 ) {
						npcs[npcNum].dialog = 3;
					} else {
						npcs[npcNum].dialog = 1
					}
				} else {
					wait(8, () => {
						npcCollide(npcs[npcNum])
					})
				}

				itemString.forEach(item =>
					player.onCollideUpdate(`${item}`, () => {
						itemCollection(globalDataNpc, item, npcs[npcNum])
					})
				)

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
				color(textboxColor),
				fixed()
			])
		
			const dialogText = add([
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
				destroy(dialogText)
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
			} else if (spriteName.dialog === 2) {
				spriteName.dialog = 3;
			// need a ensure sprite dialog stays at 3 once dialog line 2 is printed
			} else if (spriteName.dialog === 1 && spriteName.requestComplete === true) {
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