(function(){

    'use script';

    let globalData;

    async function getData(){
        const cereal = await fetch('data/data.json');
        const data = await cereal.json();
        globalData = data;

        // document.querySelector('#receiptContents').innerHTML = outputHTML(data);

        document.querySelector('nav ul').innerHTML = createButtons(data);

        createEvents(data);
    }


    function createButtons(data){
        let html = '';
        const dataPoints = Object.keys(data);
       
        dataPoints.forEach(function(eachPoint){

            let month = eachPoint.toUpperCase();
            html += `<li><button id="${eachPoint}">${month}</button></li>`;
        })
        return html;
    }

    function createEvents(data){
        const buttons = document.querySelectorAll('button');

        const dataPoints = Object.keys(data);

        for(let i = 0; i < dataPoints.length; i++){

            let month = dataPoints[i];

            const button = document.getElementById(`${month}`)

            let num = randNum(-12,12);

            button.style.transform = `rotate(${num}deg)`;
        }

        for (const button of buttons) {
            button.addEventListener('click', function(event){
                const buttonMonth = event.target.id;
            
                document.querySelector('#cerealList').innerHTML = '';

                updateInterface(buttonMonth, globalData);
            })
        }


    }

    function updateInterface(month, jsonData) {

        // updates purchase date in header
        let date = '';
        date += `${jsonData[month].month}`.toUpperCase();
  
        document.querySelector('#dateUpdate').innerHTML = date;
        document.querySelector('#calendar h4').innerHTML = date;

        // updates grocery item list
        let cerealNum = '';
        let cerealType = '';
        if (jsonData[month].total !== 0) {
            for (i=0; i < jsonData[month].cerealType.length;i++){

                    cerealNum += `<p class="num${i}">${jsonData[month].typeNum[i]}</p>`;

                    cerealType += `<p class="type${i}">${jsonData[month].cerealType[i]} </p>`;
            }
        } else {
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
        if (jsonData[month].hasOwnProperty('brandLogo')){

                    itemDescrip += "New Item!"

                    brand += `<img src="${jsonData[month].brandLogo}" width="${jsonData[month].imageWidth}" height="${jsonData[month].imageHeight}" alt="${jsonData[month].imageAlt}">`

        } else {
            itemDescrip += "No new items this month"; 
            brand = '';
        }

        document.querySelector('#itemDescrip').innerHTML = itemDescrip;
        document.querySelector('#cerealBrand').innerHTML = brand;
        document.querySelector('#bowl').src = jsonData[month].bowl;


    }

    function randNum(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    
    getData();

}())