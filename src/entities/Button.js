export class Button {
    constructor(scene, rect, text) {
        this.rect = rect;
        this.scene = scene;
        this.config = scene.config;
        this.graphics = scene.add.graphics().setDepth(0);
        //background color
        this.setBackgroundColor(rect, 0xd09683, 0x000000, 1, 4);
        //label (text)
        this.label = scene.add.text(0, 0,text,
            {fontSize: "32px", fontFamily: "myOtherFont", color: "white"}
        ).setOrigin(0).setDepth(11);
        //center text
        const paddingX = (rect.width - this.label.width)/2;
        const paddingY = (rect.height - this.label.height)/2;
        this.label.setPosition(
            rect.x + paddingX,
            rect.y + paddingY
        );
        //interactive
        this.hitArea = scene.add.rectangle(rect.x*devicePixelRatio, rect.y*devicePixelRatio, rect.width*devicePixelRatio, rect.height*devicePixelRatio)
            .setDepth(0).setOrigin(0).setInteractive()
            .on("pointerdown", this.enterActiveState, this)
            .on("pointerover", this.enterHoverState, this)
            .on("pointerout", this.enterRestState, this)
    }
    
    setBackgroundColor(rect, fillColor, borderColor, alpha=1, radius=4, lineWidth){
        this.graphics.clear();
        this.graphics.fillStyle(fillColor, alpha); // color & transparency
        this.graphics.fillRoundedRect(rect.left,
            rect.top,
            rect.width,
            rect.height,
            radius);
           
        if(!lineWidth) return this;
        this.graphics.lineStyle(lineWidth, borderColor, 1); //width, color and transparency
        this.graphics.strokeRoundedRect(rect.left,
            rect.top,
            rect.width,
            rect.height,
            8);
 
        return this; 
    }
    
    changeBG(fillColor, strokeColor){
        this.graphics.clear(); 
        this.graphics.fillStyle(fillColor, 1); // Darker blue on hover
        this.graphics.fillRoundedRect(this.rect.left,
            this.rect.top,
            this.rect.width,
            this.rect.height,
            8);
        if(!strokeColor) return;
        this.graphics.lineStyle(2, strokeColor, 1);
        this.graphics.strokeRoundedRect(this.rect.left,
            this.rect.top,
            this.rect.width,
            this.rect.height,
            8); 
    }
    enterHoverState() {
        const fillColor = 0xff0000;
        const strokeColor = 0x004085;
        this.changeBG(fillColor, strokeColor);
    }

    enterRestState() {
        const fillColor = 0xd09683;
        const strokeColor = 0x0056b3;
        this.changeBG(fillColor);
    }
    enterActiveState() {
        const fillColor = 0xff0000;
        const strokeColor = 0x002752;
        this.changeBG(fillColor, strokeColor); 
    }
    enterInactiveState() {
        const fillColor = 0x202020;
        const strokeColor = 0x004085;
        this.changeBG(fillColor);
    }
 
}