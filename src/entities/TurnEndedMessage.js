import { Button } from "../entities/Button.js";
class DialogueBox{
    constructor(scene){
        this.scene = scene;
        this.config = scene.config;
        const {PreloadScene } = scene.game.scene.keys;
        this.preloadScene = this.scene;
        this.containerGraphics = scene.add.graphics().setDepth(20);
        this.container;
        this.buttons;
    }
    
    createContainer(){}
    
    show(fillColor = 0x000000, borderColor = 0x000000, alpha=1, radius=4, lineWidth = 4){
        this.container = this.createContainer();
        this.containerGraphics.fillStyle(fillColor, 0.5);
        this.containerGraphics.fillRoundedRect(this.container.x, this.container.y, this.container.width, this.container.height, 30);
        this.buttons = this.createButtons(this.container);
        //set box depth above all other objects on the screen
        Object.values(this.buttons).forEach(btn=>{
            btn.graphics.setDepth(this.containerGraphics.depth+1);
            btn.label.setDepth(this.containerGraphics.depth+2);
        })
        return this;
    }
    
    hide(){
        this.containerGraphics.clear();
        Object.values(this.buttons).forEach(btn=>{
            btn.hide();
        })
    }
}

export class TurnEndedMessage extends DialogueBox{
    
    createContainer(){
        const width = this.scene.config.width * 0.7;
        const height = this.scene.config.height * 0.7;
        const x = this.scene.config.width * 0.5 - width * 0.5;
        const y = this.scene.config.height * 0.5 - height * 0.5;
       
        const  rect = new Phaser.Geom.Rectangle(x, y, width, height);
        return rect;
    }
    createButtons(container){
        const width = container.width * 0.4;
        const height = container.height * 0.2;
        const paddingX = 10;
        const paddingY = 10;
        const backBtnRect = new Phaser.Geom.Rectangle(container.left + paddingX, container.bottom - height - paddingY, width, height);
        const nextBtnRect = new Phaser.Geom.Rectangle(container.right - width - paddingX, container.bottom - height - paddingY, width, height);
        this.backButton = new Button(this.scene, backBtnRect, "Go Back In Time");
        this.nextButton = new Button(this.scene, nextBtnRect, "To Next Anomaly");
        return { back: this.backButton, next: this.nextButton};
    }
    
}

export class GoToNextAnomalyMessage extends DialogueBox{
    createContainer(){
        const width = this.scene.config.width * 0.6;
        const height = this.scene.config.height * 0.6;
        const x = this.scene.config.width * 0.5 - width * 0.5;
        const y = this.scene.config.height * 0.5 - height * 0.5;
       
        const  rect = new Phaser.Geom.Rectangle(x, y, width, height);
        return rect;
    }
    createButtons(container){
        const width = container.width * 0.3;
        const height = container.height * 0.2;
        const paddingX = 10;
        const paddingY = 10;
        const retainBtnRect = new Phaser.Geom.Rectangle(container.left + paddingX, container.bottom - height - paddingY, width, height);
        const recycleBtnRect = new Phaser.Geom.Rectangle(container.centerX - width/2, container.bottom - height - paddingY, width, height);
        const returnBtnRect = new Phaser.Geom.Rectangle(container.right - width - paddingX, container.bottom - height - paddingY, width, height);

        this.retainButton = new Button(this.scene, retainBtnRect, "Retain");
        this.recycleButton = new Button(this.scene, recycleBtnRect, "Recycle");
        this.returnButton = new Button(this.scene, returnBtnRect, "Return");
        return { retain: this.retainButton, recycle: this.recycleButton, back: this.returnButton};
    }
    
}