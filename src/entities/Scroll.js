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
        this.setSize().fit();
        
      return this;
    }
    
    setSize(){
        this.width = this.rect.width*3.5;
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