

const c = document.querySelector('#sky'),
    pointsNode = document.querySelector('.points span'),
    welcomeText = document.querySelector('.welcome-text'),
    finalScoreNode = document.querySelector('.final-score');
    W = 1200,
    H = 500,
    ctx = c.getContext('2d'),
    cellSize = 10,
    KEY_CODES = {
        TOP: 87,
        BOTTOM: 83,
        LEFT: 65,
        RIGHT: 68,
        RESTART: 13,
        START: 32
    }
    
let playerSize = 30,
    food = {
        x: 0,
        y: 0
    },
    points = 0,
    player = [],
    interval;

 function init(){
     finalScoreNode.style.display = 'none';
     welcomeText.style.display = 'block';
     c.width = W;
     c.height = H;
     points = 0;
     ctx.fillStyle = "gray";
     ctx.fillRect(0, 0, c.width, c.height);
     player = [];
     player.push(
         {
             x: parseInt(Math.floor(Math.random()*W)/cellSize)*cellSize,
             y: parseInt(Math.floor(Math.random()*H)/cellSize)*cellSize
         }
     )

     for(let i = 1; i < playerSize; i++){
         addPlayerElement()
     }
     setPoints()

     window.addEventListener('keydown', function (e) {
         if(e.keyCode === KEY_CODES.START){
             e.preventDefault();
             startGame()
         }
     }, { once: true });

     createField();
     drawPlayer()
     createFood()
 }
 
    function setPoints() {
        pointsNode.innerHTML = points;
    }

    function createField() {

        for(let i = 0; i <= W; i+=cellSize){
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.moveTo(i, 0);
            ctx.lineTo(i, H);
            ctx.strokeStyle = 'white';
            ctx.stroke();
        }
        for(let i = 0; i <= H; i+=cellSize){
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(W, i);
            ctx.strokeStyle = 'white';
            ctx.stroke();
        }
    }

    function drawPlayer() {
        ctx.beginPath();
        ctx.fillStyle = 'black'
        player.forEach(el => {
            ctx.strokeRect(el.x, el.y, cellSize, cellSize)
            ctx.fillRect(el.x, el.y, cellSize, cellSize)
            ctx.fill()
        })
        ctx.closePath();
    }
    function addPlayerElement(){
        player.push({
            x: player[player.length-1].x - cellSize,
            y: player[player.length-1].y,
        })
    }
    
    function movePlayer(line = 'x', val = 1, newEl){

        player = player.reduceRight((acc, el, i, arr) => {
            i !== 0 ? acc.push(arr[i-1]) : acc.push(newEl)
            return acc
        }, []).reverse()

        drawPlayer()
    }

    function startGame(){
        welcomeText.style.display = 'none'
        run('x', 1);
        window.addEventListener('keydown', initKeyEvents);
    }

    function initRestartKeyEvent(e) {
        e.keyCode === KEY_CODES.RESTART ? init() : null;
    }

    function initKeyEvents(e) {
        if(e.keyCode === KEY_CODES.TOP){
            e.preventDefault();
            run('y', -1)
        }
        if(e.keyCode === KEY_CODES.BOTTOM){
            e.preventDefault();
            run('y', 1)
        }
        if(e.keyCode === KEY_CODES.LEFT){
            e.preventDefault();
            run('x', -1)
        }
        if(e.keyCode === KEY_CODES.RIGHT){
            e.preventDefault();
            run('x', 1)
        }
    }

    function gameOver(){
        ctx.fillStyle = "gray";
        ctx.fillRect(0, 0, c.width, c.height);
        finalScoreNode.style.display = 'block';
        finalScoreNode.querySelector('span').innerHTML = points;
        window.removeEventListener('keydown', initKeyEvents);
        window.addEventListener('keydown', initRestartKeyEvent, {once: true})
    }



    function checkIfCantGo(newEl) {
        return player[1].x === newEl.x && player[1].y === newEl.y
    }
    function checkIfElementInArray(newEl){
        return player.some(el => el.x === newEl.x && el.y === newEl.y);
    }
    function calcNewElement(line, val) {
        const newEl =  {
            x: line === 'x' ? player[0].x + (cellSize*val) : player[0].x,
            y: line === 'y' ? player[0].y + (cellSize*val) : player[0].y,
        }
        newEl.x < 0 ? newEl.x = W : newEl.x > W ? newEl.x = 0 : newEl.x;
        newEl.y < 0 ? newEl.y = H : newEl.y > H ? newEl.y = 0 : newEl.y;

        return newEl;
    }
    function createFood() {
        food = {
            x: parseInt(Math.floor(Math.random()*W)/cellSize)*cellSize,
            y: parseInt(Math.floor(Math.random()*H)/cellSize)*cellSize
        }
        while (checkIfElementInArray(food) === true){
            food = {
                x: parseInt(Math.floor(Math.random()*W)/cellSize)*cellSize,
                y: parseInt(Math.floor(Math.random()*H)/cellSize)*cellSize
            }
        }
        ctx.beginPath();
        ctx.fillStyle = 'red'
        ctx.fillRect(food.x, food.y, cellSize, cellSize)
        ctx.closePath();

    }
    function collusionWithFood() {
        if(checkIfElementInArray(food)){
            points += 20;
            createFood()
            addPlayerElement()
            setPoints()
        }
    }


    function run(line = 'x', val = 1) {

        if(checkIfCantGo(calcNewElement(line, val))){

            return;
        }


        clearInterval(interval)
        interval = setInterval(()=> {
            collusionWithFood()
            if(checkIfElementInArray(calcNewElement(line, val))){
                console.log(1);
                gameOver()
                clearInterval(interval)
                return;
            }
            ctx.beginPath();
            ctx.fillStyle = "gray";

            ctx.fillRect(player[player.length-1].x, player[player.length-1].y, cellSize, cellSize)
            ctx.fill()

            createField()
            movePlayer(line, val, calcNewElement(line, val))

        }, 60)

    }


init()

