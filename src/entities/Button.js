export class Button {
    constructor(scene, rect, text) {
        this.rect = rect;
        this.scene = scene;
        this.id = text;
        const { PreloadScene } = this.scene.game.scene.keys;
        this.preloadScene = PreloadScene;
        
        this.config = scene.config;
        this.graphics = scene.add.graphics().setDepth(0);
        this.currentFontSize = 10;
        this.active = false;
        
        //label (text)
        this.label = scene.add.text(0, 0,text,
            {fontSize: this.currentFontSize+"px", fontFamily: "myOtherFont", color: "white"}
        ).setOrigin(0).setDepth(1);
        //center text
        const paddingX = (rect.width - this.label.width)/2;
        const paddingY = (rect.height - this.label.height)/2;
        this.label.setPosition(
            rect.x + paddingX,
            rect.y + paddingY
        );
        //interactive
        this.hitArea = scene.add.rectangle(rect.x, rect.y, rect.width, rect.height)
            .setDepth(0).setOrigin(0).setInteractive()
            .on("pointerdown", this.enterActiveState, this)
            .on("pointerover", this.enterHoverState, this)
            .on("pointerup", this.enterRestState, this)
            .on("pointerout", this.enterRestState, this)
        //display button
        this.show(0x22aa22, 0x000000, 1, 4);
    }
    
    setBackgroundColor(fillColor, borderColor, alpha=1, radius=4, lineWidth){
        this.graphics.clear();
        this.graphics.fillStyle(fillColor, alpha); // color & transparency
        this.graphics.fillRoundedRect(this.rect.left,
            this.rect.top,
            this.rect.width,
            this.rect.height,
            radius);
           
        if(!lineWidth) return this;
        this.graphics.lineStyle(lineWidth, borderColor, 1); //width, color and transparency
        this.graphics.strokeRoundedRect(this.rect.left,
            this.rect.top,
            this.rect.width,
            this.rect.height,
            8);
        
    }
    show(fillColor = 0x22aa22, borderColor = 0x000000, alpha=1, radius=4, lineWidth){
        this.graphics.clear();
        this.label.setActive(true).setVisible(true);
        this.hitArea.setActive(true).setVisible(true).setInteractive();
        this.setBackgroundColor(fillColor, borderColor, alpha, radius, lineWidth);
    }
    hide(){
        this.graphics.clear();
        this.label.setActive(false).setVisible(false);
        this.hitArea.setActive(false).setVisible(false).disableInteractive();
    }
    changePosition(rect){
            this.label.setPosition(this.rect.centerX - this.label.width/2, this.rect.centerY - this.label.height/2);
    }
    deactivate(){ this.active = false; return this;}
    enterHoverState() {
        if(this.active) return;
        const fillColor = 0x0000aa;
        const strokeColor = 0x0000aa;
        this.setBackgroundColor(fillColor, strokeColor);
    }

    enterRestState() {
        if(!this.active){
            const fillColor = 0x22aa22;
            const strokeColor = 0x0056b3;
            this.setBackgroundColor(fillColor);
        } 
    }
    enterActiveState() {
        this.toggleActive();
        const fillColor = 0xaa0000;
        const strokeColor = 0xaa0000;
        this.setBackgroundColor(fillColor, strokeColor);
        this.preloadScene.audio.play(this.preloadScene.audio.buttonClickSound);
    }
    toggleActive(){
        this.active = !this.active;
    }
    updateFontSize(time, delta){
        if(this.label.width < (this.rect.width*0.92) ){
            this.currentFontSize++;
            this.label.setFontSize(this.currentFontSize);
            this.label.setPosition(this.rect.centerX - this.label.width/2, this.rect.centerY - this.label.height/2);
        }
        else{
            return;
        }
    }
}