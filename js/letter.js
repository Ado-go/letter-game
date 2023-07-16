class Letter{
    constructor(rectangle, letter, fontSize, backgorundSize, xStartingPosition){
        this.rectangle = rectangle;
        this.letter = letter;
        this.fontSize = fontSize;
        this.backgorundSize = backgorundSize;
        this.xStartingPosition = xStartingPosition;
    }

    drawLetter(color){
        this.rectangle.beginFill(color);
        this.rectangle.drawRect(this.xStartingPosition, -this.backgorundSize, this.backgorundSize, this.backgorundSize);
        this.rectangle.endFill();

        let message = new PIXI.Text(this.letter,{fontSize: this.fontSize});
        
        this.rectangle.addChild(message);
        
        message.position.set(this.xStartingPosition + ((this.backgorundSize - message.width) / 2),
                            (-this.rectangle.height) / 2);
    }
}