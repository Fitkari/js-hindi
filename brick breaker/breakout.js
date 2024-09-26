let board;
let boardwidth = 500;
let boardheight = 500;
let context;

let playerwidth = 80;
let playerheight = 10;
let playervelocityX=10;
let player={
    x: boardwidth/2 - playerwidth/2,
    y: boardheight - playerheight-5,
    width: playerwidth,
    height : playerheight,
    velocityX: playervelocityX
}

let ballwidth=10;
let ballheight = 10;
let ballvelocityX =3;
let ballvelocityY =2;

let ball={
    x: boardwidth/2,
    y: boardheight/2,
    width : ballwidth,
    height : ballheight,
    velocityX : ballvelocityX,
    velocityY : ballvelocityY
}
//blocks 
let blockarray = [];
let blockwidth = 50;
let blockheight = 10;
let blockcolumns = 8;
let blockrows = 3;
let blockMaxrows = 10;
let blockcount =0;

let blockX = 15;
let blockY = 45;
let score = 0;
let gameover = false;


 window.onload= function(){
    board =document.getElementById("board");
    board.height=boardheight;
    board.width=boardwidth;
    context = board.getContext("2d"); // used for drawing on the board

    // player
    context.fillStyle="lightgreen";
    context.fillRect(player.x,player.y,player.width,player.height); 
   

    requestAnimationFrame(update);
    document.addEventListener("keydown",moveplayer);

    createblocks();
}
function update(){
    requestAnimationFrame(update);
    if(gameover){
        return;
    }
    context.clearRect(0,0,board.width,board.height)
    context.fillStyle="lightgreen";
    context.fillRect(player.x,player.y,player.width,player.height);
 
    context.fillStyle= "white";
    ball.x += ball.velocityX;  
    ball.y += ball.velocityY;
    context.fillRect(ball.x,ball.y,ball.width,ball.height);
// bounce of balls
    if(ball.y<=0){

        ball.velocityY *= -1;
    }
    else if(ball.x<=0 || (ball.x+ball.width)>= boardwidth){
        ball.velocityX *= -1;
    }
    else if (ball.y+ ball.height>= boardheight){
// game over 
// if ball touches the bottom
context.font = "20px sans-serif";
context.fillText("Game over : fill 'space' to restart",80,400)
gameover = true;
    }
    // bounce theball over paddle
    if(topcollison(ball,player) || bottomcollison(ball,player) ){
        ball.velocityY *= -1;
     }
    else if (leftcollison(ball,player) || rightcollison(ball,player)){
        ball.velocityX *=-1;
    }
    context.fillStyle = " skyblue"; 
    for(let i=0;i< blockarray.length ; i++){
        let block = blockarray[i];
        if(!block.break){
        if(topcollison(ball,block) || bottomcollison(ball,block) ){
            block.break = true;
            ball.velocityY *=-1;
            blockcount -= 1;
            score += 100;

        }
        else if ( leftcollison(ball,block) || rightcollison(ball,block)){
            block.break = true;
            ball.velocityX *= -1;
            blockcount -= 1;
            score +=100;

        }
            context.fillRect(block.x,block.y,block.width,block.height)
        }
    }
    //NEXT LEVEL
    if (blockcount ==0){
        score += 100*blockrows*blockcolumns;
        blockrows = Math.min(blockrows+1,blockMaxrows)
        createrows()
    }
    context.font = "20 px sans-serif";
context.fillText(score,10,25);

}

function outofbounds(xposition){
    return(xposition<0 || xposition+playerwidth>boardwidth);
}

function moveplayer(e){
    if (gameover){
        if (e.code=="Space"){
         resetGame();
        }
     }
    if(e.code == "ArrowLeft"){
        let nextplayer = player.x-player.velocityX;
        if(!outofbounds(nextplayer)){
            player.x=nextplayer;
        }
    }
    else if( e.code == "ArrowRight"){
        let nextplayer=player.x +player.velocityX;
        if(!outofbounds(nextplayer)){
            player.x=nextplayer;
        }
    }
}

function detectcollison(a,b){
    return a.x<b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;

}
function topcollison(ball,block){
     return detectcollison( ball,block) && (ball.y + ball.height)>= block.y; 
}
function bottomcollison(ball,block){
    return detectcollison( ball,block) && (block.y + block.height)>= ball.y;
}
function leftcollison(ball,block){
    return detectcollison( ball,block) && (ball.x + ball.width)>= block.x;
}
function rightcollison(ball,block){
    return detectcollison( ball,block) && (block.x+ block.width)>= ball.x;
}
function createblocks(){
    blockarray = [];
    for(let c=0;c<blockcolumns; c++){
        for(let r=0;r< blockrows;r++){
            let block = {
                x: blockX + c*blockwidth + c*10,
                y: blockY + r*blockheight + r*10,
                width : blockwidth,
                height : blockheight,
                break : false

            }
            blockarray.push(block);
        }
    }
    blockcount = blockarray.length;
} 
function resetGame(){
    gameover = false;
    player={
        x: boardwidth/2 - playerwidth/2,
        y: boardheight - playerheight-5,
        width: playerwidth,
        height : playerheight,
        velocityX: playervelocityX
    }
     ball={
        x: boardwidth/2,
        y: boardheight/2,
        width : ballwidth,
        height : ballheight,
        velocityX : ballvelocityX,
        velocityY : ballvelocityY
    }
    blockarray=[];
    score =0;
    createblocks();
}