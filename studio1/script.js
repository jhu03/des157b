(function(){

    'use strict';

    const h1 = document.querySelector('h1');
    const hoverSpace = document.querySelector('#hoverSpace');

    hoverSpace.addEventListener('mouseover', function(){
        h1.style.backgroundColor = 'black';
        h1.style.color = 'white';
    })

    hoverSpace.addEventListener('mouseout', function(){
        h1.style.backgroundColor = 'transparent';
        h1.style.color = 'black';
    })

}())