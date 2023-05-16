kaboom({
    width: 800,
    height: 600,
    // canvas: document.querySelector('#myCanvas'),
    background: [ 255, 255, 255, ]
})

layers(['game', 'ui'], 'game');

loadSprite('bg', "images/Banner-1.png")
loadSprite('ground', 'images/ground.png')
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
        jump: 8
	}
})

const levels = [
    "@  ",
	"=======",
]





scene("main", () => {

    // const bean = add([
    //     sprite("bean"),
    //     pos(80, 40),
    //     area(),
    //     body(),
    //     z(1)
    // ])

    const level = addLevel(levels[0], {
        width: 32,
        height: 32,
        pos: vec2(100, 200),
    
        "=": () => [
            sprite("ground"),
            area(),
            solid(),
        ],
        "@": () => [
            sprite("bean"),
            area(),
            body(),
            origin("bot"),
            "bean",
        ]
    })

    const bean = get("bean")[0]

    const bg = add ([
        layer('ui'),
        sprite("bg"),
        pos(width() / 2, height() / 2),
        origin("center"),
        // Allow the background to be scaled
        scale(0.1),
        // Keep the background position fixed even when the camera moves
        fixed()
      // Scale the background to cover the screen
    ])

    add([
        rect(width(), 48),
        pos(0, height() - 48),
        outline(4),
        area(),
        solid(),
        color(255, 255, 255),
        outline(5, 255,255,255)
    ])

    bean.play("idle");

    onKeyPress("space", () => {
        // bean.jump();
        if (bean.isGrounded()) {
            bean.jump(800);
        }
    })

    const SPEED = 240

    onKeyDown("right", () => {
        bean.move(SPEED, 0)
        bean.flipX(false)
    })

    onKeyDown("left", () => {
        bean.move(-SPEED, 0)
        bean.flipX(true)
    })

    if(bean.pos.x > width()) {
        go('next')
        console.log(width())

        console.log(bean.pos.x)
    }

    
    
})

scene('next', () => {
    add([
        text("Press arrow keys", { width: width() / 2 }),
	pos(12, 12),
    ])


})


go('main')








// bg.scaleTo(Math.max(
//     width() / bgImage.tex.width,
//     height() / bgImage.tex.height ))






