export class Scroll{
    constructor(scene, rect){
        this.scene = scene;
        this.config = scene.config;
        this.rect = rect;
    }
    createScroll(){
        this.body = this.scene.add.image(0,0,'scrollBody').setTint(0xff00ff)
            .setOrigin(0,0);
        this.top = this.scene.add.image(0, 0, 'scrollEnd').setTint(0xff00ff)
            .setOrigin(0, 0);
        this.bottom = this.scene.add.image(0,0,'scrollEnd').setTint(0xff00ff)
            .setOrigin(0,0);
        
        this.marginY = 5;
        this.setSize().fit();
        
      return this;
    }
    
    setSize(){
        this.width = this.rect.width*4.5;
        const availableHeight = this.config.height - this.rect.bottom - this.marginY*2;
        this.height = availableHeight;
        this.x = this.rect.left - this.width/2;
        this.y = this.rect.bottom;
        return this;
    }
    fit(){
        //get aspect ratio of scroll sections
        const endAspectRatio = this.top.displayWidth / this.top.displayHeight;
        const bodyAspectRatio = this.body.displayWidth / this.body.displayHeight;
        
        //set new height/width of ends
        this.top.displayWidth = this.bottom.displayWidth = this.width;
        this.top.displayHeight = this.bottom.displayHeight = this.top.displayHeight * (this.top.displayWidth/this.top.width);
        //set new height and width of body
        this.body.displayWidth = this.top.displayWidth * 0.8;
        this.body.displayHeight = this.height - this.top.displayHeight;
        //set ends positions
        this.top.setPosition(this.rect.centerX - this.top.displayWidth/2, this.y + this.marginY);
        //set body position
        this.body.setPosition(this.top.x + this.top.displayWidth*0.1, this.top.y + this.top.displayHeight); 
        this.bottom.setPosition(this.rect.centerX - this.bottom.displayWidth/2, this.body.y + this.body.displayHeight - this.bottom.displayHeight);

    }
    
    setFontSize(){
        if(screen.width < 800){
            this.headlineFontSize = 22+"px";
            this.fontSize = 18+"px";
            this.checkboxWidth = this.checkboxHeight = 16;
        }
        else if(screen.width < 1200){ 
            this.headlineFontSize = 27+"px";
            this.fontSize = 23+"px";
            this.checkboxWidth = this.checkboxHeight = 20;
 
        }
        else{
            this.headlineFontSize = 32+"px";
            this.fontSize = 28+"px"; 
            this.checkboxWidth = this.checkboxHeight = 24;
        } 
    }  
    addObjectives(card){
        this.setFontSize();
        this.textX = this.body.x + this.body.displayWidth*0.1;
        this.textY = this.body.y + 10;
 
        this.texts = [];
        const objectives = card.getData("objectives");
        //headline
        const headline = this.scene.add.text(0,0, "Objectives",
            {fontSize: this.headlineFontSize, fontFamily: "myOtherOtherFont", color: 'green'}
            ).setOrigin(0).setDepth(this.body.depth+1)
        headline.setPosition(this.rect.centerX - headline.displayWidth/2, this.textY);
        //objectives
        for(let i = 0; i < Object.values(objectives).length; ++i){
            const objective = Object.values(objectives)[i];
            
            const text = this.scene.add.text(this.textX, this.textY, "👉🏿"+objective,
                {fontSize: this.fontSize, fontFamily: 'myOtherOtherFont', color: 'black'}
                ).setOrigin(0).setDepth(this.body.depth+1)
                 .setWordWrapWidth(this.body.displayWidth * 0.8);
            this.texts.push(text);
            
            if(i-1 < 0){
                text.setPosition(this.textX, headline.y + headline.displayHeight + 13);
            }
            else{
                text.setPosition(this.textX, this.texts[i-1].y + this.texts[i-1].displayHeight + 10);
            }
        }
        return this;
    }
    
    addCheckboxes(){
        this.checkboxes = [];
        this.checkboxGraphics = [];
        for(let i = 0; i < this.texts.length; ++i){
            const graphics = this.scene.add.graphics({lineStyle: {width: 2, color: 0xffffff}}).setDepth(this.body.depth+1);
            this.checkboxGraphics.push(graphics);
            const rect = new Phaser.Geom.Rectangle(
                this.body.x + this.body.displayWidth*0.9 - 5,
                this.texts[i].y + this.texts[i].displayHeight/2 - this.checkboxHeight/2,
                this.checkboxWidth,
                this.checkboxHeight,
            );
            graphics.strokeRect(rect.x, rect.y, rect.width, rect.height);
            this.checkboxes.push(rect);
            //this.checkBox(i);
        }
        return this;
    }
    checkBox(index){
        this.checkboxGraphics[index].clear();
        this.checkboxGraphics[index].fillStyle(0x000000);
    }
    uncheckBox(box, index){
        this.checkboxGraphics[index].clear();
    }
    addTweens(){
        this.scene.tweens.add({
            targets: this.body,
            displayHeight: 0,
            ease: 'Linear',
            repeat: 0
        })
        this.scene.tweens.add({
            targets: this.bottom,
            y: this.top.y + this.top.displayHeight,
            ease: 'Linear',
            repeat: 0
        })
        
        return this;
    } 
}