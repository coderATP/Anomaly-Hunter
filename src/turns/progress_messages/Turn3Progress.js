export class Turn3Progress{
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
        //cards from Discard pile (5 of diamonds)
        this.msg1 = this.scene.add.text(this.x+5, this.y, "0 card from Discard Pile", {fontSize: 29, fontFamily: "myOtherFont", color: "black"})
            .setOrigin(0).setDepth(20);
        if(this.msg1.displayWidth > this.displayWidth){
            this.msg1.setWordWrapWidth(this.displayWidth).setAlign("justify")
        }
           
        //suits
        this.msg2 = this.scene.add.text(this.x+5, this.msg1.y+this.msg1.displayHeight+10, 0, {fontSize: 30, fontFamily: "myOtherFont", color: "white"})
            .setOrigin(0);
        this.msg2Appendix = this.scene.add.text(this.msg2.x+this.msg2.displayWidth, this.msg2.y, " Clubs♣️ ",{fontSize: 25, fontFamily: "myOtherFont", color: "gold"})
            .setOrigin(0);
            
        this.msg3 = this.scene.add.text(this.x+5, this.msg2.y+this.msg2.displayHeight+10, 0, {fontSize: 30, fontFamily: "myOtherFont", color: "white"})
            .setOrigin(0);
        this.msg3Appendix = this.scene.add.text(this.msg3.x+this.msg3.displayWidth, this.msg3.y, " Diamonds♦️ ",{fontSize: 25, fontFamily: "myOtherFont", color: "gold"})
            .setOrigin(0); 
            
        this.msg4 = this.scene.add.text(this.x+5, this.msg3.y+this.msg3.displayHeight+10, 0, {fontSize: 30, fontFamily: "myOtherFont", color: "white"})
            .setOrigin(0);
        this.msg4Appendix = this.scene.add.text(this.msg4.x+this.msg4.displayWidth, this.msg4.y, " Hearts♥️ ",{fontSize: 25, fontFamily: "myOtherFont", color: "gold"})
            .setOrigin(0); 
            
        this.msg5 = this.scene.add.text(this.x+5, this.msg4.y+this.msg4.displayHeight+10, 0, {fontSize: 30, fontFamily: "myOtherFont", color: "white"})
            .setOrigin(0);
        this.msg5Appendix = this.scene.add.text(this.msg5.x+this.msg5.displayWidth, this.msg5.y, " Spades♠️ ",{fontSize: 25, fontFamily: "myOtherFont", color: "gold"})
            .setOrigin(0); 
            
        this.messages = [this.msg1, this.msg2, this.msg3, this.msg4, this.msg2Appendix, this.msg3Appendix, this.msg4Appendix];
        return this;
    }
    clear(index){
        if(index > 3) return;
        this.messages[index].setText(0);
        return this;
    }
    clearAll(){
        console.log("clearing old progress message for level 3")
        this.messages.forEach(msg=>{ 
            msg.setActive(false)
                .setVisible(false)
            msg.destroy();
            
            });
        return this;
    }
}