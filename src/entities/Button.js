export class Button {
    constructor(scene, rect, text) {
        this.rect = rect;
        this.scene = scene;
        this.id = text;
        const { PreloadScene } = this.scene.game.scene.keys;
        this.preloadScene = PreloadScene;
        
        this.config = scene.config;
        this.graphics = scene.add.graphics().setDepth(0);
        this.currentFontSize = 1;
        this.active = false;
        //background color
        this.setBackgroundColor(rect, 0x22aa22, 0x000000, 1, 4);
        //label (text)
        this.label = scene.add.text(0, 0,text,
            {fontSize: this.currentFontSize+"px", fontFamily: "myOtherFont", color: "white"}
        ).setOrigin(0).setDepth(0);
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
        const fillColor = 0xaa0000;
        const strokeColor = 0xaa0000;
        this.changeBG(fillColor, strokeColor);
    }

    enterRestState() {
        if(!this.active){
            const fillColor = 0x22aa22;
            const strokeColor = 0x0056b3;
            setTimeout(()=>{ this.changeBG(fillColor) }, 50) 
        } 
    }
    enterActiveState() {
        this.toggleActive();
        const fillColor = 0xaa0000;
        const strokeColor = 0xaa0000;
        this.changeBG(fillColor, strokeColor);
        this.preloadScene.audio.play(this.preloadScene.audio.buttonClickSound);
    }
    toggleActive(){
        this.active = !this.active;
    }
    updateFontSize(time, delta){
        if(this.label.width < (this.rect.width*0.8) ){
            this.currentFontSize++;
            this.label.setFontSize(this.currentFontSize);
            this.label.setPosition(this.rect.centerX - this.label.width/2, this.rect.centerY - this.label.height/2);
        }
    }
}