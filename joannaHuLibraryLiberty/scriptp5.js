
    let broAni;

    // function preload() {
    // bro = loadImage('images/bro.png');
    // }

    function setup() {
        // loadImage('images/bro.png', bro => {
        //     image(bro, 0, 0)
        // })
        let myCanvas = createCanvas(500, 500);
        myCanvas.parent('myContainer');

        background(255, 204, 0)
        // broAni = new Sprite(250, 80, 120)
        broAni = loadAni('images/bro.png', { frameSize: [120, 120], frames: 8 });

    }

    function draw() {
        clear();
        animation(broAni, 100, 100);

        scale(0.6);
        // image(broAni.spriteSheet, 320, 80, 500, 154)

        // if (kb.pressing('left')) {
        //     broAni = 'walk'
        //     broAni.vel.x = -2;
        //     broAni.mirror.x = true;
        // } else (kb.pressing('right'))
        //     broAni = 'walk'
        //     broAni.vel.x = 2;  
        //     broAni.mirror.x = false;

    }


      setup()

    // let sketch = function(p) {
    //     let broAni;
    //     let velocity = p.createVector(0,0);


    //     // p.preload = function() {
    //     //     bro = loadImage('images/bro.png');
    //     // }

      
    //     p.setup = function() {


    //         // loadImage('images/bro.png', bro => {
    //         //     image(bro, 0, 0)
    //         // })

    //         let myCanvas = p.createCanvas(500, 500);
    //         myCanvas.parent('myContainer');


    //         p.background(255, 204, 0);

    //         broAni = p.createSprite(250, 80, 120, 100);
    //         broAni.visible = false;

    //         // broAni = new Sprite(250, 80, 120);\
    //         broAni = p.loadAni('images/bro.png', { frameSize: [120, 120], frames: 8 });

    //     };
      
    //     p.draw = function() {
    //         p.background(0);
    //         p.fill(255);


    //         p.clear();
    //         p.animation(broAni, 100, 100);

    //         p.scale(0.6);

    //         if (p.kb.pressing('left')) {
    //             broAni = 'walk'
    //             velocity = -2;
    //             broAni.vel.x = -2;
    //             broAni.mirror.x = true;
    //         } 
    //         if (p.kb.pressing('right')) {
    //             broAni = 'walk'
    //             broAni.vel.x = 2;  
    //             velocity = 2;

    //             broAni.mirror.x = false;
    //         }
    //     };


    //   };
      
    //   let myp5 = new p5(sketch);


