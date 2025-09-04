export class Turn8Progress{
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
        this.msg1Appendix = this.scene.add.text(this.msg1.x+this.msg1.displayWidth, this.y, " Card-2",{fontSize: 27, fontFamily: "myOtherFont", color: "gold"})
            .setOrigin(0);
            
            
        this.msg2 = this.scene.add.text(this.x, this.msg1.y+this.msg1.displayHeight, 0, {fontSize: 30, fontFamily: "myOtherFont", color: "white"})
            .setOrigin(0);
        this.msg2Appendix = this.scene.add.text(this.msg2.x+this.msg2.displayWidth, this.msg2.y, " Card-3",{fontSize: 27, fontFamily: "myOtherFont", color: "gold"})
            .setOrigin(0);
            
            
        this.msg3 = this.scene.add.text(this.x, this.msg2.y+this.msg2.displayHeight, 0, {fontSize: 30, fontFamily: "myOtherFont", color: "white"})
            .setOrigin(0);
        this.msg3Appendix = this.scene.add.text(this.msg3.x+this.msg3.displayWidth, this.msg3.y, " Card-4",{fontSize: 27, fontFamily: "myOtherFont", color: "gold"})
            .setOrigin(0);
        
            
        this.msg4 = this.scene.add.text(this.x, this.msg3.y+this.msg3.displayHeight, 0, {fontSize: 30, fontFamily: "myOtherFont", color: "white"})
            .setOrigin(0);
        this.msg4Appendix = this.scene.add.text(this.msg4.x+this.msg4.displayWidth, this.msg4.y, " Card-5",{fontSize: 27, fontFamily: "myOtherFont", color: "gold"})
            .setOrigin(0);   
         
            
        this.msg5 = this.scene.add.text(this.x, this.msg4.y+this.msg4.displayHeight, 0, {fontSize: 30, fontFamily: "myOtherFont", color: "white"})
            .setOrigin(0);
        this.msg5Appendix = this.scene.add.text(this.msg5.x+this.msg5.displayWidth, this.msg5.y, " Card-6",{fontSize: 27, fontFamily: "myOtherFont", color: "gold"})
            .setOrigin(0);   
            
               
        this.msg6 = this.scene.add.text(this.x, this.msg5.y+this.msg5.displayHeight, 0, {fontSize: 30, fontFamily: "myOtherFont", color: "white"})
            .setOrigin(0);
        this.msg6Appendix = this.scene.add.text(this.msg6.x+this.msg6.displayWidth, this.msg6.y, " Card-7",{fontSize: 27, fontFamily: "myOtherFont", color: "gold"})
            .setOrigin(0);   
        
         
        this.msg7 = this.scene.add.text(this.x, this.msg6.y+this.msg6.displayHeight, 0, {fontSize: 30, fontFamily: "myOtherFont", color: "white"})
            .setOrigin(0);
        this.msg7Appendix = this.scene.add.text(this.msg7.x+this.msg7.displayWidth, this.msg7.y, " Card-8",{fontSize: 27, fontFamily: "myOtherFont", color: "gold"})
            .setOrigin(0);   
        
        
        this.msg8 = this.scene.add.text(this.x, this.msg7.y+this.msg7.displayHeight, 0, {fontSize: 30, fontFamily: "myOtherFont", color: "white"})
            .setOrigin(0);
        this.msg8Appendix = this.scene.add.text(this.msg8.x+this.msg8.displayWidth, this.msg8.y, " Card-9",{fontSize: 27, fontFamily: "myOtherFont", color: "gold"})
            .setOrigin(0);   
        
        
        this.msg9 = this.scene.add.text(this.x, this.msg8.y+this.msg8.displayHeight, 0, {fontSize: 30, fontFamily: "myOtherFont", color: "white"})
            .setOrigin(0);
        this.msg9Appendix = this.scene.add.text(this.msg9.x+this.msg9.displayWidth, this.msg9.y, " Card-10",{fontSize: 27, fontFamily: "myOtherFont", color: "gold"})
            .setOrigin(0);   
        
        this.messages = [this.msg1, this.msg2, this.msg3, this.msg4, this.msg5, 
            this.msg6, this.msg7, this.msg8, this.msg9,
            this.msg1Appendix, this.msg2Appendix, this.msg3Appendix, this.msg4Appendix,
            this.msg5Appendix,
            this.msg6Appendix,
            this.msg7Appendix, this.msg8Appendix, this.msg9Appendix
        ];
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