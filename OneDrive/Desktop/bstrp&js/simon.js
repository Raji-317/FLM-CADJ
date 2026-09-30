let level=0;
let started=false;
let seq=[];
let usrseq=[];
let colors=["yellow", "green", "red", "purple"];
let h3=document.querySelector("h3");

h3.addEventListener("keypress",function(event){
    if(started==false && event.key===" "){
        console.log("game is started")
        started=true;
        levelup();
    }
});

function flash(btn){
    btn.classList.add("flash");
    setTimeout(function(){
        btn.classList.remove("flash");
    },250);
}

function getRandomColor(){
    let randindx = Math.floor(Math.random() * colors.length);
    return colors[randindx];
}

// Game flash - flashes the computer-generated sequence
function gameFlash(){
    let i=0;
    let ints = setInterval(function(){
        let color = seq[i];
        let btn = document.querySelector("." + color);
        flash(btn);
        i++;
        if(i>=seq.length){
            clearInterval(ints);
        }
    }, 600);
}

function levelup(){
    usrseq=[];
    level++;
    h3.innerText=`level ${level}`;
    let randcolor = getRandomColor();
    let btn = document.querySelector("." + randcolor);
    seq.push(randcolor);
    setTimeout(gameFlash, 1000);
}

// User flash - when user clicks a button
function btnpress(color){
    usrseq.push(color);
    let btn = document.querySelector("." + color);
    flash(btn);
    
    // Check if user's sequence matches
    let idx = usrseq.length - 1;
    if(usrseq[idx] === seq[idx]){
        if(usrseq.length === seq.length){
            setTimeout(levelup, 1000);
        }
    } else {
        h3.innerText = `Game Over! Your level was ${level}. Press space to restart`;
        started = false;
        level = 0;
        seq = [];
        usrseq = [];
    }
}

let allBtns = document.querySelectorAll(".btn");
for(let btn of allBtns){
    btn.addEventListener("click", function(){
        if(started){
            let color = this.classList[1];
            btnpress(color);
        }
    });
}