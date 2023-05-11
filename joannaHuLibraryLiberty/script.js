kaboom({
    global: true
});

loadSprite("bean", "images/bro.png")
loadSprite("bean", "images/bro.png", {
    sliceX: 8,
	// Define animations
	anims: {
		run: {
			// Starts from frame 0, ends at frame 3
			from: 0,
			to: 8,
			// Frame per second
			speed: 5,
			loop: true,
		}
	}
})

const bean = add([
    sprite("bean"),
    pos(80, 40),
    area(),
    body(),
])

bean.play("run");

onKeyPress("space", () => {
    if (bean.isGrounded()) {
        bean.jump();
    }
})

add([
    rect(width(), 48),
    pos(0, height() - 48),
    outline(4),
    area(),
    solid(),
    color(127, 200, 255),
])

