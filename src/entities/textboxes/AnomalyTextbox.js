export class AnomalyTextbox {
    constructor(scene) {
        this.card = undefined;
        this.scene = scene;
        this.config = scene.config;
        this.paddingX = 5;
        this.paddingY = 5;
        //create 3 graphics
        this.backgroundGraphics = this.scene.add.graphics().setDepth(0);
        this.titleGraphics = this.scene.add.graphics().setDepth(0);
        this.attributeGraphics = this.scene.add.graphics().setDepth(0);
        this.categoryGraphics = this.scene.add.graphics().setDepth(0);
        this.rewardGraphics = this.scene.add.graphics().setDepth(0);

        //label (text)
        this.setFontSize();
        this.titleLabel = scene.add.text(0, 0, "",
            {fontSize: this.titleFontSize, fontFamily: "myFont", color: "white"}
        ).setOrigin(0).setDepth(10);
        this.categoryLabel = scene.add.text(0, 0, "",
            {fontSize: this.titleFontSize, fontFamily: "myOtherOtherFont", color: "white"}
        ).setOrigin(0).setDepth(10);
        this.attributeLabel = scene.add.text(0, 0, "",
            {fontSize: this.attributeFontSize, fontFamily: "myOtherOtherFont", color: "white"}
        ).setOrigin(0).setDepth(10);
        this.rewardLabel = scene.add.text(0, 0, "",
            {fontSize: this.rewardFontSize, fontFamily: "myOtherOtherFont", color: "white"}
        ).setOrigin(0).setDepth(10); 
        //timer for display
        this.infoDisplayTimer = this.infoDisplayInterval = 5500;
    }
    setFontSize(){
        if(screen.width < 800){
            this.titleFontSize = 25+"px";
            this.categoryFontSize = 28+"px";
            this.attributeFontSize = 20+"px";
            this.rewardFontSize = 25+"px";
        }
        else if(screen.width < 1200){
            this.titleFontSize = 30+"px";
            this.categoryFontSize = 30+"px";
            this.attributeFontSize = 25+"px";
            this.rewardFontSize = 30+"px";
        }
        else{
            this.titleFontSize = 35+"px";
            this.categoryFontSize = 32+"px";
            this.attributeFontSize = 30+"px";
            this.rewardFontSize = 35+"px";
        } 
    }
    setPosition(card){
        this.card = card;
        this.rect = card.getData("rect");
        this.width = this.rect.width*3.5;
        this.height = this.rect.height;
        this.x = this.rect.centerX - this.width/2;
        this.y = this.rect.top - this.height;
        this.infoDisplayTimer = 0;
        return this;
    }
    
    show(card){
        this.setPosition(card).changeText(card);
    }
    hide(){
        this.backgroundGraphics.clear();
        this.titleGraphics.clear();
        this.categoryGraphics.clear();
        this.attributeGraphics.clear();
        this.rewardGraphics.clear();
        this.titleLabel.setVisible(false).setActive(false);
        this.categoryLabel.setVisible(false).setActive(false);
        this.attributeLabel.setVisible(false).setActive(false);
        this.rewardLabel.setVisible(false).setActive(false);

        return this;
    }
    changeText(card){
        this.titleLabel.setVisible(true).setActive(true);
        this.categoryLabel.setVisible(true).setActive(true);
        this.attributeLabel.setVisible(true).setActive(true);
        this.rewardLabel.setVisible(true).setActive(true);

        this.titleLabel.setDepth( (card.depth+2) );
        this.titleLabel.setText(card.getData("title")+", "+ card.getData("level")); // .setBackgroundColor("green")
        this.titleLabel.setPosition(this.rect.centerX - this.titleLabel.width/2 + this.paddingX, this.y+this.paddingY) 
        
        this.categoryLabel.setText("Category: "+card.getData("category"))
        this.categoryLabel.setPosition(this.rect.centerX - this.categoryLabel.width/2 + this.paddingX, this.titleLabel.y+this.titleLabel.height+this.paddingY*3)
            .setFill('black')
 
        this.attributeLabel.setDepth( (card.depth+2) );
        this.attributeLabel.setText(card.getData("attributes"))
            .setWordWrapWidth(this.width-this.paddingX*2, true)
            .setPosition(this.rect.centerX - this.attributeLabel.width/2 + this.paddingX, this.categoryLabel.y+this.categoryLabel.height+this.paddingY*3)
            .setAlign("center")
           // .setPadding(5,5,5,5)
          //  .setBackgroundColor("white")
            .setFill('black')
        
        this.rewardLabel.setText("Reward: "+card.getData("reward"))
        this.rewardLabel.setPosition(this.rect.centerX - this.rewardLabel.width/2 + this.paddingX, this.attributeLabel.y+this.attributeLabel.height+this.paddingY*3) 
 
        this.backgroundGraphics.setDepth(card.depth+1);
        this.titleGraphics.setDepth(card.depth+1);
        this.attributeGraphics.setDepth(card.depth+1);
        this.categoryGraphics.setDepth(card.depth+1);
        this.rewardGraphics.setDepth(card.depth+1);

        //bg
        this.setBackgroundColor(
            this.x,
            this.y - this.paddingY,
            this.width,
            this.titleLabel.height + this.categoryLabel.height + this.attributeLabel.height + this.rewardLabel.height + this.paddingY*14,
            0x000000, this.backgroundGraphics);
        //title
        this.setBackgroundColor(
            this.titleLabel.x-this.paddingX,
            this.titleLabel.y, 
            this.titleLabel.width+this.paddingX*2, 
            this.titleLabel.height+this.paddingY*2, 
            0x000000, this.titleGraphics);
        //category
        this.setBackgroundColor(
            this.x+this.paddingX, 
            this.categoryLabel.y,
            this.width-this.paddingX*2, 
            this.categoryLabel.height+ this.paddingY*2, 
            0xffffff, this.categoryGraphics);
        //attribute
        this.setBackgroundColor(
            this.x+this.paddingX,
            this.attributeLabel.y,
            this.width-this.paddingX*2,
            this.attributeLabel.height + this.paddingY*2, 
            0xffffff, this.attributeGraphics);
        //reward
        this.setBackgroundColor(
            this.rewardLabel.x-this.paddingX,
            this.rewardLabel.y, 
            this.rewardLabel.width+this.paddingX*2,
            this.rewardLabel.height+this.paddingY*2,
            0x00aa00, this.rewardGraphics);
 
        return this;
    }
    
    setBackgroundColor(x, y, width, height, color, graphics){
        graphics.clear();
        graphics.fillStyle(color, 1); // color & transparency
        
        graphics.fillRoundedRect(x, y, width, height, 8);
        
        graphics.lineStyle(2, 0x303030, 1); //width, color and transparency
 
        return this; 
    }
    
    
    displayCardInfo(delta){
        if(this.infoDisplayTimer < this.infoDisplayInterval){
            this.infoDisplayTimer+= delta;
        }
        else{
            this.infoDisplayTimer = this.infoDisplayInterval;
            this.hide();
        }
    } 
    updateFontSize(time, delta){
        if(this.label.width < this.card.displayWidth-2){
            this.currentFontSize++;
            this.label.setFontSize(this.currentFontSize);
            this.label.setPosition(this.card.x+this.card.displayWidth/2 - this.label.width/2, this.card.centerY - this.label.height/2);
        }
    }
}