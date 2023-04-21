(function(){

    'use strict';

    // loading screen variables
    const loading = document.querySelector('#load');
    const star1 = document.querySelector('#star1');
    const star2 = document.querySelector('#star2');
    const star3 = document.querySelector('#star3');

    // text variables
    const h1 = document.querySelector('h1');
    const line1 = document.querySelector('#line1');
    const line2 = document.querySelector('#line2');
    const line3 = document.querySelector('#line3');
    const line4 = document.querySelector('#line4');
    const bottomText = document.querySelector('#bottomText');
    const sourcesLink = document.querySelector('#sourcesLink')

    // overlay variables
    const exit = document.querySelector('.fa-xmark');
    const bg = document.querySelector('#overlay'); 

    // video and hover variables
    const hoverSpace = document.querySelector('#hoverSpace');
    const talkingVideo = document.querySelector('#talkingVideo');
    const chaosVideo = document.querySelector('#chaosVideo');
 

    // loading screen disappears after video loads
    talkingVideo.addEventListener('playing', function() {
        loading.style.display = 'none';
    });

    // applies animation class to the stars on loading screen
    const stars = [star1, star2, star3];
    for (let i=0; i<stars.length; i++) {
        stars[i].addEventListener('animationstart', function(){
            if (i === stars.length-1) {
                console.log('nice')
            } else {
                stars[i+1].className = "bounce";
            }
        })
    }

    // fadein effect applies to each line of the text after one line appears
    const text = [line1, line2, line3, line4, h1, sourcesLink];
    setTimeout(function(){
        line1.className = 'fadeIn';
    }, 1500);

    for (let i=0; i<text.length; i++) {
        text[i].addEventListener('animationend', function(){
            if (i === text.length-1) {
                hoverSpace.style.display = "block";
            } else {
                text[i+1].className = "fadeIn";
            }
        })
    }

    // video changes when user hovers over div
    hoverSpace.addEventListener('mouseover', function(){
        h1.style.background = 'black';
        h1.style.color = 'white';
        h1.style.mixBlendMode = 'darken';

        talkingVideo.className = 'hide';
        chaosVideo.classList.remove('hide');
        bottomText.classList.remove('hide');
    })

    // video changes back to normal when user is off div
    hoverSpace.addEventListener('mouseout', function(){
        h1.style.backgroundColor = 'transparent';
        h1.style.color = ' rgb(235, 235, 235);';
        h1.style.mixBlendMode = 'overlay'

        talkingVideo.classList.remove('hide');
        chaosVideo.className = 'hide';
        bottomText.className = 'hide';
    })

    // opens the video sources overlay
    sourcesLink.addEventListener('click', function(){
        bg.style.display = 'block';
    })

    // exists the video sources overlay
    exit.addEventListener('click', function(){
        bg.style.display = 'none';
    })

}())