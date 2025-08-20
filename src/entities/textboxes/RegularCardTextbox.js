export class RegularCardTextbox {
    constructor(scene) {
        this.card = undefined;
        this.scene = scene;
        this.config = scene.config;
        this.currentFontSize = 25;
        this.paddingX = 4;
        this.paddingY = 4;
        //create 3 graphics
        this.backgroundGraphics = this.scene.add.graphics().setDepth(0);
        this.titleGraphics = this.scene.add.graphics().setDepth(0);
        this.attributesGraphics = this.scene.add.graphics().setDepth(0);

        //label (text)
        this.titleLabel = scene.add.text(0, 0, "",
            {fontSize: "30px", fontFamily: "myOtherFont", color: "white"}
        ).setOrigin(0).setDepth(11);
        this.attributeLabel = scene.add.text(0, 0, "",
            {fontSize: "20px", fontFamily: "myOtherOtherFont", color: "white"}
        ).setOrigin(0).setDepth(11);
    }
    setPosition(card){
        this.card = card;
        this.rect = card.getData("rect");
        this.width = this.rect.width*2;
        this.height = this.rect.height/2;
        this.x = this.rect.left - this.rect.width/2;
        this.y = this.rect.top;
        return this;
    } 
    changeText(card){
        this.titleLabel.setDepth( (card.depth+2) );
        this.titleLabel.setText(card.getData("title"))
          //  .setPadding(5,5,5,5)
           // .setBackgroundColor("green")
        this.titleLabel.setPosition(this.rect.centerX - this.titleLabel.width/2 + this.paddingX, this.y+this.paddingY) 
        
        this.attributeLabel.setDepth( (card.depth+2) );
        this.attributeLabel.setText(card.getData("attributes"))
            .setWordWrapWidth(this.width-this.paddingX*2, true)
            .setPosition(this.x+this.paddingX, this.titleLabel.y+this.titleLabel.height+this.paddingY)
            .setAlign("center")
            .setPadding(5,5,5,5)
          //  .setBackgroundColor("white")
         //   .setFill("black")
        
        this.backgroundGraphics.setDepth(card.depth+1);
        this.titleGraphics.setDepth(card.depth+1);
        this.attributesGraphics.setDepth(card.depth+1);
        //bg
        this.setBackgroundColor(this.x, this.y, this.width, this.titleLabel.height+this.attributeLabel.height+this.paddingY*3, 0x000000, this.backgroundGraphics);
        //title
        this.setBackgroundColor(this.titleLabel.x-this.paddingX, this.titleLabel.y+this.paddingY, this.titleLabel.width+this.paddingX*2, this.titleLabel.height+this.paddingY*2, 0x00aa00, this.titleGraphics);
        //attribute
        this.setBackgroundColor(this.x+this.paddingX, this.titleLabel.y+this.titleLabel.height+this.paddingY, this.width-this.paddingX*2, this.attributeLabel.height, 0x0000aa, this.attributesGraphics);
        
        return this;
    }
    align(){
        
        return this;
    } 
    setBackgroundColor(x, y, width, height, color, graphics){
        graphics.clear();
        graphics.fillStyle(color, 1); // color & transparency
        
        graphics.fillRoundedRect(x, y, width, height, 8);
        
        graphics.lineStyle(2, 0x303030, 1); //width, color and transparency
 
        return this; 
    }
    
    updateFontSize(time, delta){
        if(this.label.width < this.card.displayWidth-2){
            this.currentFontSize++;
            this.label.setFontSize(this.currentFontSize);
            this.label.setPosition(this.card.x+this.card.displayWidth/2 - this.label.width/2, this.card.centerY - this.label.height/2);
        }
    }
}