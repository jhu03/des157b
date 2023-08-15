// runs kaboom npm
import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs";

(function(){

	'use strict';

	let globalDataNpc;
	let globalDataItems;


	// focuses on the canvas upon window load
	addEventListener("load", (event) => {
		document.querySelector('#canvas').focus();

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
			prompt.destroy();
		})
	});


	// opens and cloess opening overlays
	const missionBtn = document.querySelector('#missionBtn');
	const overlayBg = document.querySelector('#overlayBg')
	missionBtn.addEventListener('click', function() {
		document.querySelector('#overlay').style.display = 'none';
		document.querySelector('#instructions').classList.remove('hide');
		document.querySelector('#canvas').focus();
	})

	const startBtn = document.querySelector('#startBtn');
	startBtn.addEventListener('click', function() {
		document.querySelector('#instructions').style.display = 'none';
		document.querySelector('#seal').style.display = 'none';
		overlayBg.style.display = 'none'
		document.querySelector('#canvas').focus();
	})

	// Start game
	kaboom({
		width: 1000,
		height: 550,
		canvas: document.querySelector('#canvas'),
		background: [243, 251, 255]
	});

	// Load assets
	loadFont("apl386", "fonts/apl386.ttf", { outline: 1, filter: "linear" });

	// load background and images
	loadSprite('bg','images/bg.png');
	loadSprite('houseBg','images/houseBg.png');
	loadSprite('ground', 'images/tile.png');
	loadSprite('water', 'images/water.png');
	loadSprite('net', 'images/net.png');
	loadSprite('redbud', 'images/redbud.png');
	loadSprite('triBasket', 'images/triBasket.png');
	loadSprite('vines', 'images/vines.png');
	loadSprite('shells', 'images/shellPic.png');
	loadSprite('door', 'images/door.png');
	loadSprite('doorOut', 'images/doorOut.png');
	loadSprite('backpack', 'images/backpack.png', {sliceX: 2});

	// load npc sprites
	loadSprite('hunter', 'images/deerMan.png');
	loadSprite('weaver', 'images/weaver.png');
	loadSprite('gatherer', 'images/gatherer.png');
	loadSprite('fisher', 'images/fisher.png');

	// load sprite animations
	loadSprite('deerGrass', 'images/deerGrass.png', {

	});
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
	});
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
	});
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
	});
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
	});
	loadSprite("player", "images/player.png", {
		sliceX: 8,

		anims: {
			"idle": {
				from: 0,
				to: 1,
				speed: 3,
				loop: true,
			},
			"run": {
				from: 2,
				to: 7,
				speed: 5,
				loop: true,
			}
		}
	});

	// character speed
	const speed = 400;

	// creating levels and loading sprites into levels
	const levelSelect = [
		[	
			"                                                                                                         ",
			"   @                                             ,                                                       ",
			"        *                 ^     d b  t      < w    n  t         {ff    gt frrffrff   v       >        cs",
			"===============================================================================================~~~~~~~~~~",
		],
		[
			"                                                               ",
			"     @               2                                         ",
			"    o                   c                        *^{bdwn<sgf>rvt",
			"==============================================================="
		]
	];


	// Define a scene called "game". The callback will be run when we go() to the scene
	// Scenes can accept argument from go()
	scene("game", ({levelIdx}) => {

		// linking json files 
		async function getData(){
			const dialogue = await fetch('data/data.json');
			const dataNpc = await dialogue.json();

			globalDataNpc = dataNpc;

			const items = await fetch('data/itemData.json');
			const dataItems = await items.json();

			globalDataItems = dataItems;
			createButtons(dataItems);
		};

		// grounds all sprites to level floor
		setGravity(2400);

		// defining the levels and loading the spirites and sprite properties
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
					pos(0, 48),
					scale(2.6),
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
					sprite("deerGrass"),
					area(),
					anchor("bot"),
					scale(0.4),
					z(2),
					offscreen({ hide: true }),
					"lvl1", "deerGrass"
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
				"t": () =>[
					sprite('triBasket'),
					area(),
					anchor("bot"),
					scale(0.8),
					offscreen({ hide: true }),
					"triBasket", "lvl1"
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
				"v": () =>[
					sprite('vines'),
					area(),
					anchor("bot"),
					offscreen({ hide: true }),
					"vines", "lvl1"
				],
				"d": () =>[
					sprite('door'),
					anchor("bot"),
					scale(0.8),
					area(),
					offscreen({ hide: true }),
					"door", "lvl1"
				],
				"o": () =>[
					sprite('doorOut'),
					anchor("bot"),
					scale(1),
					area(),
					offscreen({ hide: true }),
					"doorOut", "lvl1"
				],
				"s": () =>[
					sprite('shells'),
					anchor("bot"),
					area(),
					scale(0.8),
					offscreen({ hide: true }),
					"shells", "lvl1"
				]

			}
		});

		// Get the player object from tag/level
		const bg = level.get("bg")[0];
		const player = level.get("player")[0];
		const greeter = level.get("greeter")[0];
		const chief = level.get("chief")[0];
		const deer = level.get("deer")[0];
		const coyote = level.get("coyote")[0];
		const hunter = level.get("hunter")[0];
		const weaver = level.get("weaver")[0];
		const vines = level.get("vines")[0];
		const gatherer = level.get("gatherer")[0];
		const fisher = level.get("fisher")[0];
		const builder = level.get("builder")[0];
		const deerGrass = level.get("deerGrass");
		const redbud = level.get("redbud");
		const net = level.get("net")[0];
		const shells = level.get("shells")[0];
		const backpack = add([
			sprite('backpack'),
			pos(925, 25),
			scale(0.7),
			fixed(),
			area(),
		]);

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
		]);

		// loading the sprite animations
		coyote.play('idle');
		deer.play('idle');
		greeter.play('idle');
		chief.play('idle');
		builder.play('idle');
		player.play('run');


		// creating arrays for npcs as consts and strings
		// consts are for updating sprite properties while strings are for function inputs
		const npcs = [hunter, weaver, gatherer, fisher, builder];
		const npcString = ["hunter", "weaver", "gatherer", "fisher", "builder"];
		const items = [deer, deerGrass, shells, net, vines];
		const itemString = ["deer", "deerGrass", "shells", "net", "vines"];


		// function for assigning properties to all sprties
		function dialogStatus(sprite) {
			sprite.hasTalked = false;
			sprite.requestComplete = false;

			sprite.dialog = 0;
		};

		// function for assigning properties to each item collection
		function itemStatus(item) {
			item.collected = false;
			item.collectionIdx = 0;
		};

		// iterates through each array to assign all sprites the appropriate properties
		for(let i=0;i<npcs.length;i++) {
			dialogStatus(npcs[i])
		};

		for(let i=0;i<items.length;i++) {
			itemStatus(items[i])
		};



		// ----- LEVEL 2 ------

		// door collision event to go to level 2
		player.onCollideUpdate("door", () => {

			if(isKeyPressed("space")) {
				// door only works once the builder's quest is done
				if (builder.dialog === 3) {
					const doorPrompt = add([
						pos(1736, 375),
						anchor("center"),
						text(`[test]Press spacebar to enter[/test]`, {
							size: 18,
							lineSpacing: 6,
							letterSpacing: -1,
							font: "apl386",
	
							styles: {
								"test": {color: rgb(0, 0, 0)}	
							}
						}),
						fixed()
					]);

					// destroys door prompt once player walks away
					wait(0.1, () => {
						destroy(doorPrompt); 
					});

					// player presses space to go in/out of door
					if (isKeyPressed("space")) {
						setBackground(211, 177, 89)
						go("game", {
							levelIdx: 1,
						});
					}
					}
			}

		})


		// player collision for exiting dome
		player.onCollideUpdate("doorOut", () => {
			const doorPrompt = add([
				pos(225, 375),
				anchor("center"),
				text(`[test]Press spacebar to exit[/test]`, {
					size: 18,
					lineSpacing: 6,
					letterSpacing: -1,
					font: "apl386",

					styles: {
						"test": {color: rgb(0, 0, 0)}	
					}
				}),
				fixed(),
				z(8)
			]);

			if (isKeyPressed("space")) {
				setBackground(243, 251, 255)
						go("game", {
							levelIdx: 0,
						});
			}

			wait(0.1, () => {
				destroy(doorPrompt); 
			});
		})
		

		// ------ MOVEMENTS ----- 

		player.onGround(() => {
			if (!isKeyDown("left") && !isKeyDown("right")) {
				player.play("idle");
			} else {
				player.play("run");
			}
		})

		onKeyDown("left", () => {
			player.flipX = true;
			player.move(-speed, 0);
			
			if (player.isGrounded() && player.curAnim() !== "run") {
				player.play("run")
			}
		})

		onKeyDown("right", () => {
			player.flipX = false;
			player.move(speed, 0);

			if (player.isGrounded() && player.curAnim() !== "run") {
				player.play("run");
			}
		})

		;["left", "right"].forEach((key) => {
			onKeyRelease(key, () => {
			// Only reset to "idle" if player is not holding any of these keys
				if (player.isGrounded() && !isKeyDown("left") && !isKeyDown("right")) {
					player.play("idle");
				};
			})
		})

		// camera positioning follows player
		player.onUpdate(() => {
			let currCam = camPos();
			if (levelIdx === 0 && currCam.x < player.pos.x && player.pos.x <= 4800) {
				camPos(player.pos.x, currCam.y);
				// camera movement for outside
			} else if (levelIdx === 1 && currCam.x < player.pos.x && player.pos.x <= 1240) {
				camPos(player.pos.x, currCam.y);
				// camera movement for inside house
			}
			else if (currCam.x > player.pos.x && player.pos.x >= 500) {
				camPos(player.pos.x, currCam.y);
			} 
		})


		// ------ COLLISIONS ----- 

		// player talks to patwin, unique function since Patwin does not have requests 
		player.onCollideUpdate("greeter", () => {

			addText("Hello, stranger. Welcome to our Patwin village.");

			onKeyPress("space", () => {
				player.onCollideUpdate("greeter", () => {
					addText("I have not heard of this 'seal' you’re searching for, but perhaps the others in the village have.");
				})
				npcCollide(greeter);
			})

			wait(3, () => {
				npcCollide(greeter);
			})

		})

		// chief dialog is different format from other villagers, so it's put in an array instead of the json file
		const chiefDialogue = [
			"Welcome to my home! I was just taking a rest.",
			"I heard you've been helping the village out, and for that, I am grateful.",
			"As a reward, take this. It was brought to me this morning, but I'm not sure what it is. I want you to have it.",
			"Oh? Leaving so soon? Well, feel free to visit and help out again any time!"
		];
		let chiefDialogueIndex = 0;

		// collision interactions with the chief's dialog
		player.onCollideUpdate("chief", () => {

			if (isKeyPressed("space") && chiefDialogueIndex < 3) {
				chiefDialogueIndex++;
			}

			addText(`${chiefDialogue[chiefDialogueIndex]}`);

			// end of game overlay appears once chief is done talking
			if (chiefDialogueIndex === 2) {
				
				wait (3, () => {
					document.querySelector('#seal').classList.remove('hide');
					document.querySelector('#seal').style.display = 'grid';
					document.querySelector('#seal').style.zIndex = '4';
					overlayBg.style.display = 'block';
					
					chiefDialogueIndex === 3
				});
			}
		})

		// controls all collisions for npc sprites
		npcString.forEach(npc => 
			player.onCollideUpdate(`${npc}`, () => {
				let npcNum = npcString.indexOf(npc);

				addText(dialogueShow(globalDataNpc, npc, npcs[npcNum].dialog));

				// advances dialog if space is pressed
				if (isKeyPressed("space")) {
					if (npcs[npcNum].dialog === 1 && npcs[npcNum].requestComplete === true) {
						npcs[npcNum].dialog = 2;
					} else if (npcs[npcNum].dialog === 2 ) {
						npcs[npcNum].dialog = 3;
					} else if (npcs[npcNum].dialog === 0) {
						npcs[npcNum].dialog = 1;
					} else {
						return npcs[npcNum].dialog;
					}
				} else {
					wait(8, () => {
						npcCollide(npcs[npcNum]);
					})
				}

				// function for changing the items' collection property
				itemString.forEach(item =>
					player.onCollideUpdate(`${item}`, () => {
						
						if (npcs[npcNum].dialog === 1 && isKeyPressed("space") && item != "deerGrass" && item !="shells") {
							itemCollection(globalDataNpc, item, npcNum, npcs[npcNum]);
							addItemText('Item Collected')
						} 
					})
				)
			})
		)

		// custom collide for builder to ensure their quest is done last/after weaver quest
		player.onCollideUpdate('builder', () => {
			if (weaver.requestComplete === false) {
					addText('I’m a bit busy right now, you can help the other villagers first.')
			} else {
				addText(dialogueShow(globalDataNpc, "builder", builder.dialog));

				if (isKeyPressed("space")) {
					if (builder.dialog === 1 && builder.requestComplete === true) {
						builder.dialog = 2;
					} else if (builder.dialog === 2 ) {
						builder.dialog = 3;
					} else if (builder.dialog === 0) {
						wait(15, () => {
							builder.dialog = 1;
						})
					} else {
						return builder.dialog;
					}
				} else {
					wait(8, () => {
						npcCollide(builder);
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
						textboxColor = [217,243,186];
					}
					return line;
				}
			}
			return textboxColor;	
		};

		
		function itemCollection (data, itemName, spriteIndex, spriteName) {
			const dataPoints = Object.keys(data);

			let item = data[dataPoints[spriteIndex]].item;
			let itemNum = itemString.indexOf(itemName);

			// 	// checking if character from json file matches sprite input
			if (item === itemName) {
				spriteName.requestComplete = true;
				items[itemNum].collectionIdx = 1;
			}

			// pauses on gatherer and weaver quest completion to account for time to read fisher's dialog			
			if (spriteName === fisher) {
				wait(15, () => {
					shells.collectionIdx = 1;
					gatherer.requestComplete = true;

					deerGrass.collectionIdx = 1;
					weaver.requestComplete = true;
				})
				
			}
		};


		// creates sprite text and textboxs
		function addText(dialog) {
			const textbox = add([
				rect(350, 160, { radius: 21 }),
				anchor("center"),
				pos(575, 300),
				outline(2),
				color(textboxColor),
				fixed()
			])
		
			const dialogText = add([
				pos(textbox.pos),
				anchor("center"),

				// pulls text from json file
				text(`[test]${dialog}[/test]`, {
					size: 18,
					width: 300, // it'll wrap to next line when width exceeds this value
					lineSpacing: 6,
					letterSpacing: -1,
					font: "apl386",

					styles: {
						"test": {color: rgb(0, 0, 0)}	
					}
				}),
				fixed()
			])

			wait(0.1, () => {
				destroy(dialogText);
				destroy(textbox);
			})
		}

		function addItemText(prompt) {
			const textbox = add([
				rect(300, 60, { radius: 10 }),
				anchor("center"),
				pos(575, 350),
				outline(2),
				fixed()
			])

			const itemPrompt = add([
				pos(textbox.pos),
				anchor("center"),
				text(`[test]${prompt}[/test]`, {
					size: 18,
					lineSpacing: 6,
					letterSpacing: -1,
					font: "apl386",

					styles: {
						"test": {color: rgb(0, 0, 0)}	
}
				}),
				fixed()
			])

			wait(0.3, () => {
				destroy(itemPrompt);
				destroy(textbox);
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

			// need a ensure sprite dialog stays at 3 once dialog line 2 is printed
			} else if (spriteName.dialog === 1 && spriteName.requestComplete === true) {
				spriteName.dialog = 2;
			}
			return spriteName.dialog;
		}



		// ------ INVENTORY SYSTEM ----- 

		// backpack openning animation
		backpack.onHoverUpdate(() => {
			backpack.frame = 1;
			setCursor("pointer");
		})

		backpack.onHoverEnd(() => {
			backpack.frame = 0;
			setCursor("default");
		})

		backpack.onClick(() => {
			const inventory = document.querySelector('#inventory');
			overlayBg.style.display = 'block';
			inventory.className = 'show';
			inventory.style.zIndex = "3";
		})

		// functions for changing inventory info
		function createButtons(data) {
			const dataPoints = Object.values(data); // creates the text from key value so text is capitalized 
			const dataPointsObj = Object.keys(data); // creates the id from json keys

			//clears button list every time inventory is open so buttons don't repeat
			document.querySelector('#itemList div').innerHTML = ''; 

			for(let i=0; i<dataPoints.length; i++){
				const button = document.querySelector('#itemList div').innerHTML += `<button id='${dataPointsObj[i]}'>${dataPoints[i].item}</button>`;
			}
			createEvents(data);

		}

		function createEvents(data) {
			const buttons = document.querySelectorAll('#itemList button');

			for (const button of buttons) {
				button.addEventListener('click', function(event){
					const buttonItem = event.target.id;
	
					updateInterface(buttonItem, data); // calls function to change UI
				})
			}	
		}

		function updateInterface(item, data) {

			// calling index of item status in json file
			let itemNum = itemString.indexOf(item);

			document.querySelector('#itemName').innerHTML = `${data[item].item}`;
			document.querySelector('#itemDescrip').innerHTML = `${data[item].info}`;
			document.querySelector('#itemImg').src = `${data[item].image}`;

			document.querySelector('#status').innerHTML = `${data[item].itemStatus[items[itemNum].collectionIdx]}`;

			// changes color of item status
			if (items[itemNum].collectionIdx == 1) {
				document.querySelector('#status').style.color = 'green';
			} else {
				document.querySelector('#status').style.color = 'red';
			}
		
		}

		// closes overlay
		document.querySelector('#close').addEventListener('click',() => {
			overlayBg.style.display = 'none';
			inventory.className = 'hide';
			document.querySelector('#canvas').focus();

		})


		// ------ END GAME ----- 
		const endBtn = document.querySelector('#endBtn');
		endBtn.addEventListener('click', function() {
			document.querySelector('#seal').style.zIndex = '-5';
			document.querySelector('#seal').style.zIndex = '-5';
			

			document.querySelector('#credits').classList.remove('hide');
			document.querySelector('#credits').style.display = 'grid';
			document.querySelector('#credits').style.zIndex = '6';
		})

		const creditsBtn = document.querySelector('#creditsBtn');
		creditsBtn.addEventListener('click', function() {
			overlayBg.style.display = 'none';
			document.querySelector('#credits').style.display = 'none';

			document.querySelector('#canvas').focus();
		})


		// ------ MAKES SURE PLAYER DOESN'T FLY OFF MAP ----- 

		onUpdate(() => {
			// numbers to enable run animation to work since sprite goes between these y positions during run animation
			const playerPosY = [92.60, 92.97];
			const randInx = randi(0,1);

			player.pos.y = playerPosY[randInx];
		})

	
		// calls async function
		getData();

	})

	function start() {
		// Start with the "game" scene, with initial parameters
		go("game", {
			levelIdx: 0,
		})
	}

	start();

}())