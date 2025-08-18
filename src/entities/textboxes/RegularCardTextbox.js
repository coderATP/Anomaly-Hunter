export class RegularCardTextbox {
    constructor(scene, rect, titleText, attributeText) {
        this.rect = rect;
        this.scene = scene;
        this.config = scene.config;
        this.graphics = scene.add.graphics().setDepth(0);
        this.currentFontSize = 25;

        this.width = rect.width*2;
        this.height = rect.height/2;
        this.x = rect.centerX;
        this.y = rect.top;
        //label (text)
        this.titleLabel = scene.add.text(this.x, this.y,titleText,
            {fontSize: this.currentFontSize+"px", fontFamily: "myOtherFont", color: "white"}
        ).setOrigin(0.5).setDepth(11);
        this.attributeLabel = scene.add.text(this.x, this.titleLabel.y, attributeText,
            {fontSize: this.currentFontSize+"px", fontFamily: "myOtherFont", color: "white"}
        ).setOrigin(0.5).setDepth(11);
        this.setBackgroundColor();
    }
    
    setBackgroundColor(){
        this.graphics.clear();
        this.graphics.fillStyle(0xaaaaaa, 1); // color & transparency

        this.graphics.fillRoundedRect(this.rect.centerX - this.attributeLabel.width/2,
            this.rect.top - this.titleLabel.height - this.attributeLabel.Height ,
            this.rect.width*2,
            this.rect.height/2,
            2);
           
        if(!lineWidth) return this;
        this.graphics.lineStyle(2, 0x303030, 1); //width, color and transparency
 
        return this; 
    }
    
    updateFontSize(time, delta){
        if(this.label.width < this.rect.width-2){
            this.currentFontSize++;
            this.titleLabel.setFontSize(this.currentFontSize);
            this.titleLabel.setPosition(this.rect.centerX - this.label.width/2, this.rect.centerY - this.label.height/2);
        }
    }
}