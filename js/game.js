class Game{
    backgroundSizeRange = [20, 60];
    letterObjects = {};
    app = null;
    running = false;
    gameOver = false;
    dificulty = 1;
    dificultyIncrease = 1;
    everyXPoint = 10;
    letterSpeed = 1;
    spawningSpeed = 1 / (this.letterSpeed * 4);
    totalPoints = 0;
    maxPoints = 50;
    penalty = -2;
    plusPoints = 1;
    timePassed = 0;

    constructor(width, height, letters){
        this.width = width;
        this.height = height
        this.letters = letters
    }

    setApp(){
        const app = new PIXI.Application({ 
            width: this.width, 
            height: this.height,                       
            antialias: true, 
            transparent: false, 
            resolution: 1
          }
        );
        gameScreen.appendChild(app.view);
        this.app = app;
        for(let letter of this.letters){
            this.letterObjects[letter] = []
        }
    }

    showMessage(text){
        let message = new PIXI.Text(text,{fontSize: 30, fill: 'white'});
        message.position.set((this.width - message.width) / 2, (this.height - message.height) / 2);
        this.app.stage.addChild(message);
    }

    gameEnded(message){
        this.running = false;
        this.gameOver = true;
        startButton.innerText = 'Restart';
        this.showMessage(message);
    }

    restartGame(){
        this.app.stage.children = [];
        this.totalPoints = 0;
        this.dificulty = 1;
        this.letterSpeed = 1;
        this.spawningSpeed = 1 / (this.letterSpeed * 4);
        this.timePassed = 0;
        this.gameOver = false;
        startButton.innerText = 'Start/Stop';
        scoreCount.innerText = 'Score: ' + this.totalPoints;
        for(let letter of this.letters){
            this.letterObjects[letter] = []
        }
    }

    randomNumberInRange(max, min){
        return Math.floor(Math.random() * (max - min) + min);
    }

    pickRandomLetter(){
        return this.letters[Math.floor(Math.random() * this.letters.length)];
    }

    drawRectangle(rectangle, x, y, sizeX, sizeY, color){
        rectangle.beginFill(color);
        rectangle.drawRect(x, y, sizeX, sizeY);
        rectangle.endFill();
    }

    createLetter(){
        let newRectangleBackgroundSize = this.randomNumberInRange(this.backgroundSizeRange[1], this.backgroundSizeRange[0]);

        let letter = new Letter(new PIXI.Graphics(), 
                                this.pickRandomLetter(), 
                                this.randomNumberInRange(newRectangleBackgroundSize, this.backgroundSizeRange[0]), 
                                newRectangleBackgroundSize, 
                                this.randomNumberInRange((this.width -newRectangleBackgroundSize), 0));
        return letter;
    }

    spawnNewLetter(){
        let letter = this.createLetter();
        this.letterObjects[letter.letter].push(letter);
        letter.drawLetter(0x66CCFF);
        this.app.stage.addChild(letter.rectangle);
    }

    increaseDificulty(){
        this.dificulty++;
        this.letterSpeed += this.dificultyIncrease;
        this.spawningSpeed = 1 / (this.letterSpeed * 4);
    }

    keyPressed(event){
        if(!this.running){
            return
        }
        if(!(event.key.toUpperCase() in this.letterObjects) || this.letterObjects[event.key.toUpperCase()].length < 2){
            this.totalPoints += this.penalty;
        }
        else{
            this.totalPoints += this.plusPoints;
            for(const letter of this.letterObjects[event.key.toUpperCase()]){
                this.app.stage.children = this.app.stage.children.filter(item => item !== letter.rectangle);
            }
            this.letterObjects[event.key.toUpperCase()] = [];
        }

        scoreCount.innerText = 'Score: ' + this.totalPoints;
        
        if(this.totalPoints == this.maxPoints){
            this.gameEnded('You won!');
        }

        if(this.dificulty <= Math.floor(this.totalPoints / this.everyXPoint)){
            this.increaseDificulty();
        }
    }

    play(){
        this.app.ticker.add((delta) => this.gameLoop(delta));
    }

    gameLoop(delta) {
        if(!this.running){
            return
        }

        this.timePassed += 1;
        if(this.timePassed >= 60 * this.spawningSpeed){
            this.timePassed = 0;
            this.spawnNewLetter();
        }
        for (const [key, value] of Object.entries(this.letterObjects)) {
            for(const letter of value){
                letter.rectangle.vy = this.letterSpeed;
                letter.rectangle.y += letter.rectangle.vy;
                if(letter.rectangle.y == this.height){
                    this.gameEnded('You lost!')
                }
            }
        }
    }
}