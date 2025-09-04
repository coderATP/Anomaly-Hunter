export class Turn1Progress{
    constructor(scene){
        this.scene = scene;
        const { PlayScene } = scene.game.scene.keys;
        const {top, left, botom, right} = PlayScene.gameplayUI.turnProgressRect;
        const {x, y, displayWidth, displayHeight} = PlayScene.gameplayUI.turnProgressHeader;
        this.x = left;
        this.y = y + displayHeight + 40;
    }
    add(){
        this.msg1 = this.scene.add.text(this.x, this.y, 0, {fontSize: 30, fontFamily: "myOtherFont", color: "white"})
            .setOrigin(0).setDepth(20);
        this.msg1Appendix = this.scene.add.text(this.msg1.x+this.msg1.displayWidth, this.y, " Past Cards",{fontSize: 22, fontFamily: "myOtherFont", color: "gold"})
            .setOrigin(0);
            
        this.msg2 = this.scene.add.text(this.x, this.msg1.y+this.msg1.displayHeight, 0, {fontSize: 30, fontFamily: "myOtherFont", color: "white"})
            .setOrigin(0);
        this.msg2Appendix = this.scene.add.text(this.msg2.x+this.msg2.displayWidth, this.msg2.y, " Present Cards",{fontSize: 22, fontFamily: "myOtherFont", color: "gold"})
            .setOrigin(0);
            
        this.msg3 = this.scene.add.text(this.x, this.msg2.y+this.msg2.displayHeight, 0, {fontSize: 30, fontFamily: "myOtherFont", color: "white"})
            .setOrigin(0);
        this.msg3Appendix = this.scene.add.text(this.msg3.x+this.msg3.displayWidth, this.msg3.y, " Future Cards",{fontSize: 22, fontFamily: "myOtherFont", color: "gold"})
            .setOrigin(0);
        this.messages = [this.msg1, this.msg2, this.msg3, this.msg1Appendix, this.msg2Appendix, this.msg3Appendix];
        return this;
    }
    clear(index){
        if(index > 2) return;
        this.messages[index].setText(0);
        return this;
    }
    clearAll(){
        this.messages.forEach(msg=>{ 
            msg.setActive(false)
                .setVisible(false)
            msg.destroy();
            });
        return this;
    }
}