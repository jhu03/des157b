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
	const overlayBg = document.querySelector('#overlayBg')
	missionBtn.addEventListener('click', function() {
		document.querySelector('#overlay').style.display = 'none';
		overlayBg.style.display = 'none'
		document.querySelector('#canvas').focus();
	})

	// Start game
	kaboom({
		width: 1000,
		height: 550,
		canvas: document.querySelector('#canvas'),
		background: [243, 251, 255]
	})

	// Load assets
	loadFont("apl386", "fonts/apl386.ttf", { outline: 1, filter: "linear" })

	// load background and images
	loadSprite('bg','images/bg.png')
	loadSprite('houseBg','images/houseBg.png')
	loadSprite('ground', 'images/tile.png')
	loadSprite('water', 'images/water.png')
	loadSprite('net', 'images/net.png')
	loadSprite('redbud', 'images/redbud.png')
	loadSprite('backpack', 'images/backpack.png', {sliceX: 2})

	// load npc sprites
	loadSprite('hunter', 'images/deerMan.png')
	loadSprite('weaver', 'images/weaver.png')
	loadSprite('gatherer', 'images/gatherer.png')
	loadSprite('fisher', 'images/fisher.png')

	// load sprite animations
	loadSprite('rye', 'images/rye.png', {

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
	loadSprite('chief', 'images/chief.png', {
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
	loadSprite('builder', 'images/builder.png', {
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
	const speed = 400


	const levelSelect = [
		[	
			"                                                                                                   ",
			"                                                 ,                                                 ",
			"  @   d   *                 ^  {   b          w          n   <          g  rrffrff         >         ",
			"==========================================================================================~~~~~~~~~",
		],
		[
			"                                                                                                   ",
			"                      2                                                                            ",
			"  d  @                   c                                                               *^{bdw'n<gf>",
			"================================================================================================"
		]
	]


	// Define a scene called "game". The callback will be run when we go() to the scene
	// Scenes can accept argument from go()
	scene("game", ({levelIdx}) => {

		async function getData(){
			const dialogue = await fetch('data/data.json');
			const dataNpc = await dialogue.json();

			globalDataNpc = dataNpc;

			const items = await fetch('data/itemData.json');
			const dataItems = await items.json();

			globalDataItems = dataItems;

			createButtons(dataItems);
		}

		// jump characteristics
		setGravity(2400)

		// Use the level passed, or first level
		const level = addLevel(levelSelect[levelIdx], {
			tileWidth: 54,
			tileHeight: 48,
			pos: vec2(0, 410),
			tiles: {
				"<": () => [
					sprite("coyote"),
					anchor("bot"),
					area(),
					offscreen({ hide: true }),
					"lvl1", "coyote"
				],
				",": () => [
					sprite("bg"),
					anchor("bot"),
					z(-1),
					pos(0, 50),
					scale(2.6),
					// offscreen({ hide: true }),
					"bg1",
				],
				"2": () => [
					sprite("houseBg"),
					anchor("bot"),
					z(-1),
					pos(-300, 50),
					scale(1.1),
					"bg2",
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
					offscreen({ hide: true }),
					z(2)
				],
				"~": () => [
					sprite("water"),
					area(),
					body({ isStatic: true }),
					anchor("bot"),
					offscreen({ hide: true }),
					z(2)
				],
				"f": () => [
					sprite("rye"),
					area(),
					anchor("bot"),
					scale(0.6),
					z(2),
					offscreen({ hide: true }),
					"lvl1", "rye"
				],
				"r": () => [
					sprite("redbud"),
					area(),
					anchor("bot"),
					scale(1.2),
					z(2),
					offscreen({ hide: true }),
					"lvl1", "redbud"
				],
				"*": () => [
					sprite('greeter'),
					area(),
					stay(),
					anchor("bot"),
					offscreen({ hide: true }),
					'greeter', "lvl1"
				],
				"c": () => [
					sprite('chief'),
					area(),
					stay(),
					anchor("bot"),
					offscreen({ hide: true }),
					'chief', 
				],
				"^": () => [
					sprite('hunter'),
					area(),
					stay(),
					anchor("bot"),
					scale(1.7),
					offscreen({ hide: true }),
					'hunter', "lvl1"
				],
				"w": () =>[
					sprite('weaver'),
					area(),
					anchor("bot"),
					offscreen({ hide: true }),
					"weaver", "lvl1"
				],
				"g": () =>[
					sprite('gatherer'),
					area(),
					anchor("bot"),
					offscreen({ hide: true }),
					"gatherer", "lvl1"
				],
				">": () =>[
					sprite('fisher'),
					area(),
					anchor("bot"),
					offscreen({ hide: true }),
					"fisher", "lvl1"
				],
				"b": () =>[
					sprite('builder'),
					area(),
					anchor("bot"),
					scale(2.3),
					offscreen({ hide: true }),
					"builder", "lvl1"
				],
				"{": () =>[
					sprite('deer'),
					area(),
					anchor("bot"),
					offscreen({ hide: true }),
					"deer", "lvl1"
				],
				"n": () =>[
					sprite('net'),
					area(),
					anchor("bot"),
					offscreen({ hide: true }),
					"net", "lvl1"
				],
				"d": () =>[
					rect(40, 60),
					outline(4),
					anchor("bot"),
					area(),
					offscreen({ hide: true }),
					"door", "lvl1"
				],
			}
		})

		// Get the player object from tag
		const bg = level.get("bg")[0]
		const player = level.get("player")[0]
		const greeter = level.get("greeter")[0]
		const chief = level.get("chief")[0]
		const deer = level.get("deer")[0]
		const coyote = level.get("coyote")[0]
		const hunter = level.get("hunter")[0]
		const weaver = level.get("weaver")[0]
		const gatherer = level.get("gatherer")[0]
		const fisher = level.get("fisher")[0]
		const builder = level.get("builder")[0]
		const rye = level.get("rye")
		const redbud = level.get("redbud")
		const net = level.get("net")[0]
		const door = level.get("door")[0]
		const backpack = add([
			sprite('backpack'),
			pos(925, 25),
			scale(0.7),
			fixed(),
			area(),
		])

		add([
			pos(945, 90),
			anchor("center"),
			text(`[test]inventory[/test]`, {
				size: 14,
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

		
		coyote.play('idle')
		deer.play('idle')
		greeter.play('idle')
		// chief.play('idle')     can't animate things that are not in level or loaded
		builder.play('idle')
		player.play('idle')

		// needed to get all fire sprites to play animation
		// for(let i=0; i<fire.length; i++) {
		// 	fire[i].play('flames')
		// } 

		const lvl1 = level.get("lvl1")[0]
		console.log(lvl1)


		// creating arrays for npcs as consts and strings
		// consts are for updating sprite properties while strings are for function inputs
		const npcs = [hunter, weaver, gatherer, fisher, builder]
		const npcString = ["hunter", "weaver", "gatherer", "fisher", "builder"]
		const items = [deer, coyote, net]
		const itemString = ["deer", "coyote", "net"]

		// arrays for npc quests that are completed by interacting with other npcs
		const npcRequests = [weaver, gatherer, fisher];
		const npcRequestsString = ["weaver", "gatherer", "fisher"]


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




		// ----- LEVEL 2 ------


		player.onCollideUpdate("door", () => {

			const doorPrompt = add([
				pos(door.pos.x, 400),
				anchor("center"),
				text(`[test]Press spacebar to enter[/test]`, {
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
				destroy(doorPrompt)
			})

			if (isKeyPressed("space")) {
				if (levelIdx === 0) {

						setBackground(211, 177, 89)

						go("game", {
							levelIdx: 1,
						})
				} else if (levelIdx === 1) {
					setBackground(243, 251, 255)

						go("game", {
							levelIdx: 0,
						})
				}
				
				}
						

			})

		
		let textboxColor = [255,255,255]; // default textbox color to white
		function dialogueShow (data, spriteName, dialogLine) {
			const dataPoints = Object.keys(data);

			for(let i=0; i<dataPoints.length;i++) {
				let character = dataPoints[i]
				let line;

				// checking if character from json file matches function sprite input
				if (character === spriteName) {
					if (dialogLine === 0) {
						line = data[character].opener;
						textboxColor = [255,255,255];
					} else if (dialogLine === 1) {
						line = data[character].request;
						textboxColor = [206, 249, 255];
					} else if (dialogLine === 2) {
						line = data[character].closer;
						textboxColor = [217,243,186];
					} else if (dialogLine === 3) {
						line = data[character].seal;
					}
					return line;
				}
			}
			return textboxColor;	
		}

		function itemCollection (data, itemName, spriteIndex, spriteName) {
			const dataPoints = Object.keys(data);

			let item = data[dataPoints[spriteIndex]].item

			// for(let i=0; i<dataPoints.length; i++) {
			// 	let character = dataPoints[i]
			// 	let item = data[dataPoints[i]].item

			// 	// checking if character from json file matches sprite input
				if (item === itemName) {
					spriteName.requestComplete = true;
				}

			if (spriteName === fisher) {

				wait(15, () => {
					gatherer.requestComplete = true;
					weaver.requestComplete = true;
				})
				
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

		onKeyDown("left", () => {
			player.flipX = true
			player.move(-speed, 0)
			
		})

		onKeyDown("right", () => {
			player.flipX = false
			player.move(speed, 0)
		})

		// camera positioning follows player
		player.onUpdate(() => {
			let currCam = camPos();
			if (levelIdx === 0 && currCam.x < player.pos.x && player.pos.x <= 4600) {
				camPos(player.pos.x, currCam.y);
				// camera movement for outside
			} else if (levelIdx === 1 && currCam.x < player.pos.x && player.pos.x <= 1280) {
				camPos(player.pos.x, currCam.y);
				// camera movement for inside house
			}
			else if (currCam.x > player.pos.x && player.pos.x >= 500) {
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
						itemCollection(globalDataNpc, item, npcNum, npcs[npcNum])
		
					})
				)
			})
		)

		if (builder.requestComplete === true) {
			if(isKeyPressed("space")) {
				
			}
		}

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
				wait(10, () => {
					spriteName.dialog = 3;
				})
				// spriteName.dialog = 3;
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
			text("[textStyle]Use arrow keys to move[/textStyle]", {
				size: 21,
				width: 350, // it'll wrap to next line when width exceeds this value
				lineSpacing: 6,
				letterSpacing: -1,
				font: "apl386", // there're 4 built-in fonts: "apl386", "apl386o", "sink", and "sinko"

				styles: {
					"textStyle": {
						color: rgb(0, 0, 0)
					}	
				}
			}),
		])

		onKeyPress(() => {
			prompt.destroy()
		})


		// ------ INVENTORY SYSTEM ----- 

		// backpack openning animation
		backpack.onHoverUpdate(() => {
			backpack.frame = 1
			setCursor("pointer")
		})

		backpack.onHoverEnd(() => {
			backpack.frame = 0
			setCursor("default")
		})

		backpack.onClick(() => {
			const inventory = document.querySelector('#inventory')
			overlayBg.style.display = 'block'
			inventory.className = 'show'
		})

		// functions for changing inventory info
		function createButtons(data) {
			const dataPoints = Object.keys(data);

			for(let i=0; i<dataPoints.length; i++){
				const button = document.querySelector('#itemList div').innerHTML += `<button id='${dataPoints[i]}'>${dataPoints[i]}</button>`
			}
			createEvents(data)

		}

		function createEvents(data) {
			const dataPoints = Object.keys(data);

			const buttons = document.querySelectorAll('#itemList button')

			for (const button of buttons) {
				button.addEventListener('click', function(event){
					const buttonItem = event.target.id;
	
					updateInterface(buttonItem, data); // calls function to change UI
				})
			}	
		}

		function updateInterface(item, data) {
			document.querySelector('#itemName').innerHTML = `${data[item].item}`;
			document.querySelector('#itemDescrip').innerHTML = `${data[item].info}`

			document.querySelector(`${item}`).style.background
		}


		// closes overlay
		document.querySelector('#close').addEventListener('click',()=>{
			overlayBg.style.display = 'none'
			inventory.className = 'hide'
			document.querySelector('#canvas').focus();
		})


	
		getData();

	})

	function start() {
		// Start with the "game" scene, with initial parameters
		go("game", {
			levelIdx: 0,
		})
	}

	
	start()


}())