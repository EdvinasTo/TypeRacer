let main = document.getElementById("main1");
let button = document.getElementById("button");
let p = document.getElementById("p1");
let h1 = document.getElementById("h1");
let timer;
let p1 = document.createElement('p');
let p2 = document.createElement('p');
let textArea = document.createElement('textArea');
textArea.id = "text";
textArea.disabled = true;
let wordsTyped = 0;
let timeStart;
const button1 = document.createElement('button');
button1.id = 'button1';
button1.innerText = "Start Again";
button1.addEventListener('click', start);
let timeEnd;

function start() {
    p1.innerHTML = "0:00";
    p2.innerText = `WPM: 0.00`;
    timeEnd = 0;
    timeStart = 0;
    wordsTyped = 0;
    textArea.value = "";
    fetchData();
    timers();
    main.style.width = '70%';
    main.style.height = '30%';
    p.style.paddingTop = '5%';
    p.style.marginLeft = '5%';
    p.style.marginRight = '10%';
    h1.style.paddingTop = 0;
    p1.style.textAlign = 'right';
    p1.style.marginRight = '3%';
    textArea.addEventListener('input', function () {
        check(textArea.value, p.innerText);
    });
    button.remove();
    button1.remove();
    let article = document.createElement('article');
    article.appendChild(p);
    article.appendChild(textArea);
    
    main.prepend(p1);
    main.append(article);
    main.append(p2);
}

function check(input, originalText) {
    let feedback = "";
    let colored = "";
    let previous = true;
    for (let i = 0; i < input.length; i++) {
        if (input.length > originalText.length) {return;}
        if (input[i] === originalText[i] && previous) {
            colored += `<span style="color: lime;">${originalText[i]}</span>`;
            feedback += originalText[i];
            calculateWPM();
            previous = true;
            if (input[input.length-1] === " "){
                wordsTyped = feedback.split(" ").length;
            }
            if (feedback === originalText) {
                h1.innerText = "Finished!!!";
                clearInterval(timer);
                textArea.disabled = true;
                main.append(button1);
                break;
            }
        } else {
            colored += `<span style="background-color:red;">${originalText[i]}</span>`;
            previous = false;
        }
    }
    p.innerHTML = colored + originalText.slice(input.length);
}

function timers() {
    let i = 5;
    let countdown = setInterval(function(){
        h1.innerHTML = "Race starts in " + i + " seconds.";

        if (i <= 0) {
            textArea.disabled = false;
            h1.innerHTML = "GO GO GO!!!";
            clearInterval(countdown);

            timeStart = Date.now();
            let j = 1;
            let min = 0
            let s = 0;
            timer = setInterval(function() {
                calculateWPM();
                p1.innerHTML = min + ":" + (s.toString().length === 1 ? s.toString().padStart(2,'0'):s);
                s = j % 60  
                if (s%60 === 0){
                    min++;
                }
                j++;
            
                if (s+min*60 === p.innerText.split(' ').length*10)
                {
                    h1.innerHTML = "Too Slow!";
                    clearInterval(timer);
                    textArea.disabled = true;
                    main.append(button1);
                }
            },1000)
        }
        i--;
    },1000);
}

function calculateWPM() {
    timeEnd = Date.now();
    let timeTakenInSeconds = (timeEnd - timeStart) / 1000;
    let timeTakenInMinutes = timeTakenInSeconds / 60;

    let wpm = (wordsTyped / timeTakenInMinutes).toFixed(2);
    p2.innerText = `WPM: ${wpm}`;
}

function fetchData() {
    const random = Math.floor(Math.random() * 10) + 1;
    fetch('./data.json')
        .then(res => res.json())
        .then(data => {
            const result = data.find(item => item.textid === random);
            p.innerHTML = result.text;
        });
}