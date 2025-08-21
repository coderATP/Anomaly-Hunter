export class Scroll{
    constructor(scene, rect){
        this.scene = scene;
        this.config = scene.config;
        this.rect = rect;
    }
    createScroll(){
        this.body = this.scene.add.image(0,0,'scrollBody')
            .setOrigin(0,0);
        this.top = this.scene.add.image(0, 0, 'scrollEnd')
            .setOrigin(0, 0);
        this.bottom = this.scene.add.image(0,0,'scrollEnd')
            .setOrigin(0,0);
        
        this.marginY = 5;
        this.body.setPosition(this.rect.centerX - this.body.displayWidth/2, this.rect.bottom + this.top.displayHeight + this.marginY);
        const bodyRect = new Phaser.Geom.Rectangle(this.body.x, this.body.y, this.body.width, this.body.height);
        
        this.top.setPosition(bodyRect.centerX - this.top.displayWidth/2,
            bodyRect.top - this.top.displayHeight)
        this.bottom.setPosition(bodyRect.centerX - this.top.displayWidth/2,
            bodyRect.bottom) 
        
        
        this.resizeToFitSection()
      return this;
    }
    
    resizeToFitSection(){
        //get aspect ratio of scroll sections
        const endAspectRatio = this.top.displayWidth / this.top.displayHeight;
        const bodyAspectRatio = this.body.displayWidth / this.body.displayHeight;
        
        const availableHeight = this.config.height - this.top.y - this.marginY*3;
        
        this.body.setDisplaySize(availableHeight*bodyAspectRatio, availableHeight);
        const bodyScaleFactorX = (this.body.displayWidth/this.body.width);
        const bodyScaleFactorY = (this.body.displayHeight/this.body.height);
        this.top.setDisplaySize(this.top.displayWidth*bodyScaleFactorX, this.top.displayHeight*bodyScaleFactorY);
        this.bottom.setDisplaySize(this.bottom.displayWidth*bodyScaleFactorX, this.bottom.displayHeight*bodyScaleFactorY);
        
        this.body.setPosition(this.rect.centerX - this.body.displayWidth/2, this.rect.bottom + this.top.displayHeight + this.marginY);
        const bodyRect = new Phaser.Geom.Rectangle(this.body.x, this.body.y, this.body.displayWidth, this.body.displayHeight);
        this.top.setPosition(bodyRect.centerX - this.top.displayWidth/2,
            bodyRect.top - this.top.displayHeight)
        this.bottom.setPosition(bodyRect.centerX - this.top.displayWidth/2,
            this.body.y + this.body.displayHeight - this.bottom.displayHeight)  
        
    }
    addTweens(){
        this.scene.tweens.add({
            targets: this.body,
            displayHeight: 0,
            ease: 'Linear',
            yoyo: true,
            repeat: -1
        })
        this.scene.tweens.add({
            targets: this.bottom,
            y: this.top.y + this.top.displayHeight,
            ease: 'Linear',
            yoyo: true,
            repeat: -1
        })
        
        return this;
    } 
}