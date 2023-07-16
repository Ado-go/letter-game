let startButton = document.getElementById("play");
let scoreCount = document.getElementById("score");
let gameScreen = document.getElementById("gameScreen");
let game = new Game(400, 400, ['A', 'B', 'C', 'D']);

document.addEventListener("keypress", keyPressedHandler);

startButton.addEventListener("click", toggleGame);

function keyPressedHandler(event){
    game.keyPressed(event);
}

function toggleGame(){
    if(!game.gameOver){
        game.running = !game.running;
    }
    else{
        game.restartGame();
    }
}

game.setApp();
game.play();