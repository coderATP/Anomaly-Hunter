export class Turn7Progress{
    constructor(scene){
        this.scene = scene;
        const { PlayScene } = scene.game.scene.keys;
        const {top, left, botom, right, width} = PlayScene.gameplayUI.turnProgressRect;
        const {x, y, displayWidth, displayHeight} = PlayScene.gameplayUI.turnProgressHeader;
        this.x = left;
        this.y = y + displayHeight + 40;
        this.displayWidth = width;
    }
    add(){
        //Jack and Queen
        this.msg1 = this.scene.add.text(this.x+5, this.y, 0, {fontSize: 30, fontFamily: "myOtherFont", color: "white"})
            .setOrigin(0).setDepth(20);
        this.msg1Appendix = this.scene.add.text(this.msg1.x+this.msg1.displayWidth, this.y, " Jack🤺",{fontSize: 28, fontFamily: "myOtherFont", color: "gold"})
            .setOrigin(0);
            
        this.msg2 = this.scene.add.text(this.x+5, this.msg1.y+this.msg1.displayHeight+10, 0, {fontSize: 30, fontFamily: "myOtherFont", color: "white"})
            .setOrigin(0);
        this.msg2Appendix = this.scene.add.text(this.msg2.x+this.msg2.displayWidth, this.msg2.y, " Queen👑 ",{fontSize: 28, fontFamily: "myOtherFont", color: "gold"})
            .setOrigin(0);
          
        if(this.msg1.displayWidth > this.displayWidth){
            this.msg1.setWordWrapWidth(this.displayWidth).setAlign("justify")
        }
           
        this.messages = [this.msg1,];
        return this;
    }
    clear(index){
        if(index > 3) return;
        this.messages[index].setText(0);
        return this;
    }
    clearAll(){
        this.messages.forEach(msg=>{ msg.destroy() });
        return this;
    }
}