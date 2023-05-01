(function(){

    'use script';

    let globalData;

    async function getData(){
        const cereal = await fetch('data/data.json');
        const data = await cereal.json();
        globalData = data;

        document.querySelector('nav ul').innerHTML = createButtons(data);

        createEvents(data);
    }


    // making buttons for each key in the json file
    function createButtons(data){
        let html = '';
        const dataPoints = Object.keys(data);
       
        dataPoints.forEach(function(eachPoint){
            let month = eachPoint.toUpperCase();
            html += `<li><button id="${eachPoint}">${month}</button></li>`;
        })
        return html;
    }


    // adding event listeners to each button made
    function createEvents(data){
        const buttons = document.querySelectorAll('button');
        const dataPoints = Object.keys(data); // creates an array of all keys

        // adding random tilt to each button
        for(let i = 0; i < dataPoints.length; i++){

            let month = dataPoints[i]; // retrieves one button out of the key rray
            const button = document.getElementById(`${month}`);
            let num = randNum(-12,12); // randomizes tilt degree

            button.style.transform = `rotate(${num}deg)`;
        }

        // adding event listeners to change data on click
        for (const button of buttons) {
            button.addEventListener('click', function(event){
                const buttonMonth = event.target.id;
            
                document.querySelector('#cerealList').innerHTML = '';

                updateInterface(buttonMonth, globalData); // calls function to change UI
            })
        }
    }


    // function for changing UI to match data after button click  
    function updateInterface(month, jsonData) {

        // updates purchase date in header
        let date = '';
        date += `${jsonData[month].month}`.toUpperCase();
  
        document.querySelector('#dateUpdate').innerHTML = date; // updates receipt date
        document.querySelector('#calendar h4').innerHTML = date; // updates mini calendar date

        // updates grocery item list
        let cerealNum = '';
        let cerealType = '';

        // checks if any cereal was bought that month
        if (jsonData[month].total !== 0) {

            // loops through cerealType array to output all cereal bought that month
            for (i=0; i < jsonData[month].cerealType.length;i++){

                    cerealNum += `<p class="num${i}">${jsonData[month].typeNum[i]}</p>`; // updates number of cereal bought for each type

                    cerealType += `<p class="type${i}">${jsonData[month].cerealType[i]} </p>`; // updates names of each cereal bought
            }
        } else {
            // output for if no cereal was bought
            cerealType += `<p class="typeNone">No cereal purchased :( <br> Check your pantry and come again soon!</p>`;
        }

        document.querySelector('#cerealList').innerHTML += cerealNum;
        document.querySelector('#cerealList').innerHTML += cerealType;

        // updates total number of items
        let total = '';
        total += `${jsonData[month].total}`;
        document.querySelector('#totalUpdate').innerHTML = total;

        // updates cereal brand image in mini calendar
        let brand = '';
        let bowl = ''
        let itemDescrip = '';

        // checking if json file has brand image, indicating a new cereal was bought
        if (jsonData[month].hasOwnProperty('brandLogo')){

            itemDescrip += "New Item!";

            brand += `<img src="${jsonData[month].brandLogo}" width="${jsonData[month].imageWidth}" height="${jsonData[month].imageHeight}" alt="${jsonData[month].imageAlt}">`;

        } else {
            itemDescrip += "No new items this month"; 
            brand = '';
        }

        document.querySelector('#itemDescrip').innerHTML = itemDescrip;
        document.querySelector('#cerealBrand').innerHTML = brand;
        document.querySelector('#bowl').src = jsonData[month].bowl;
    }


    // for generating tilt random number 
    function randNum(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    
    getData();

}())