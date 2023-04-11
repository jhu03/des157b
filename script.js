(function() {
    'use strict';

    const body = document.querySelector('body');
    const banner = document.querySelector('header');
    const textPrompt = document.querySelector('.textPrompt');
    const desk = document.querySelector('#desk');
    const desktop = document.querySelector('.desktop');
    const desktopDark = document.querySelector('#desktopScreenSaver');
    const laptop = document.querySelector('#laptop');
    const lamp = document.querySelector('#lamp');
    const lampSwitch = document.querySelector('#lampSwitchArea');
    const lampSwitchGlow = document.querySelector('#lampSwitchGlow');
    const lampHead = document.querySelector('#lampHead');
    const light = document.querySelector('#light');
    const sections = document.querySelectorAll('section');
    let mode = 'dark';

    lampSwitch.addEventListener('mouseover', function(){
        lampSwitchGlow.classList.remove('hidden');
        lampSwitchGlow.className = 'pulse';
    })

    lampSwitch.addEventListener('mouseout', function(){
        lampSwitchGlow.classList.remove('pulse');
        lampSwitchGlow.className = 'hidden';
    })

    // textPrompt.addEventListener('animationend', function(){
    //     lampSwitchGlow.className = 'pulse';
    // })

    lampSwitch.addEventListener('click', function() {
        if (mode === 'dark') {
            // sound for switching on lamp
            const onSound = new Audio('sounds/on.mp3');
            onSound.play();

            // changing overall color scheme to dark
            body.className = 'switch';
            banner.className = 'switch';
            for (const section of sections) {
                section.className = 'switch';
            }

            // hides prompt after user discovers button interaction
            textPrompt.className = 'hidden';

            // changing desk images to dark
            desk.src = "images/deskDark.png";

            // swapping out monitor image to screensaver
            desktop.classList.add('hidden');
            desktopDark.classList.remove('hidden');
            desktopDark.classList.add('screenSaver');

            laptop.classList.remove('hidden');
            laptop.classList.add('screenSaver');

            // turning on lamp
            lamp.src = "images/lampDark.png";
            lampHead.src = "images/lampHeadDark.png";
            lampHead.removeAttribute('class');
            light.className = 'flicker';

            mode = 'light';


        } else {
            //sound for turning lamp off
            const offSound = new Audio('sounds/off.mp3');
            offSound.play();

            // changing overall color scheme to light
            body.removeAttribute('class');
            banner.removeAttribute('class');
            for (const section of sections) {
                section.removeAttribute('class');
            }

            // changing desk images to light
            desk.src = "images/desk.png";

            // turning on monitors to work mode
            desktop.classList.remove('hidden');
            desktopDark.classList.add('hidden');
            desktopDark.classList.remove('screenSaver');

            laptop.classList.add('hidden');
            laptop.classList.remove('screenSaver');

            // turning off lamp
            lamp.src = "images/lamp.png";
            lampHead.src = "images/lampHead.png";
            lampHead.className = 'swivel';
            light.removeAttribute('class');

            mode = 'dark'
        }
    })

})()