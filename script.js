(function() {
    'use strict';

    const button = document.querySelector('button');
    const body = document.querySelector('body');
    const banner = document.querySelector('#banner');
    const desk = document.querySelector('#desk');
    const lamp = document.querySelector('#lamp')
    const lampSwitch = document.querySelector('#lampSwitchArea')
    const lampHead = document.querySelector('#lampHead');
    const light = document.querySelector('#light');
    const sections = document.querySelectorAll('section')
    let mode = 'dark';

    lampSwitch.addEventListener('click', function() {
        if (mode === 'dark') {
            const onSound = new Audio('sounds/on.mp3');
            onSound.play();

            body.className = 'switch';
            banner.className = 'switch';
            // button.className = 'switch';
            for (const section of sections) {
                section.className = 'switch';
            }
            desk.src = "images/deskDark.png";
            lamp.src = "images/lampDark.png";
            lampHead.src = "images/lampHeadDark.png";
            lampHead.removeAttribute('class');
            light.className = 'flicker';
            mode = 'light';
        } else {
            const offSound = new Audio('sounds/off.mp3');
            offSound.play();

            body.removeAttribute('class');
            banner.removeAttribute('class');
            // button.removeAttribute('class');
            for (const section of sections) {
                section.removeAttribute('class');
            }
            desk.src = "images/desk.png";
            lamp.src = "images/lamp.png";
            lampHead.src = "images/lampHead.png";
            lampHead.className = 'swivel';
            light.removeAttribute('class');
            mode = 'dark'
        }
    })

})()