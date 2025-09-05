export class ProgressMessage{
    constructor(scene){
        this.scene = scene;
        const { PlayScene } = scene.game.scene.keys;
        const {top, left, botom, right} = PlayScene.gameplayUI.turnProgressRect;
        const {x, y, displayWidth, displayHeight} = PlayScene.gameplayUI.turnProgressHeader;
        const { turnProgressMessageFontSize, progressSectionRects } = PlayScene.gameplayUI;
        this.x = left;
        this.y = y + displayHeight + 40;
        this.messages = scene.add.container(0,0);
        this.fontSize = turnProgressMessageFontSize;
        this.sections = progressSectionRects;
    }
    
    
    add(card){

        //SUIT
        let appendix;
        switch (card.getData("suit")) {
            case "CLUB": {
                appendix = "♣️";
                break;
            }
            case "DIAMOND": {
                appendix = "♦️";
                break;
            }
            case "HEART": {
                appendix = "♥️";
                break;
            }
            case "SPADE": {
                appendix = "♠️"
                break;
            }
        }
        //VALUE
        let val;
        if(card.getData("value") === 11){
            val = "J"
        }
        else if (card.getData("value") === 12) {
            val = "Q"
        }
        else val = card.getData("value");
        
        //POSITION
        let msg;
        if(this.messages.length < 8){
            msg = this.scene.add.text(this.sections[this.messages.length].x, this.sections[this.messages.length].y, val+appendix, {fontSize: this.fontSize, fontFamily: "myOtherFont", color: "white"})
                .setOrigin(0).setDepth(20);
            msg.setPosition(this.sections[this.messages.length].centerX - msg.displayWidth/2, this.sections[this.messages.length].centerY - msg.displayHeight/2);
            this.messages.add(msg);
        }
        else{
            this.messages.removeAt(0, true);
            this.messages.list.forEach((message, i)=>{
                message.setPosition(this.sections[i].centerX - message.displayWidth/2, this.sections[i].centerY - message.displayHeight/2);
            })
            const topMessage = this.messages.list[this.messages.length-1];
            msg = this.scene.add.text(this.sections[this.messages.length].x, this.sections[this.messages.length].y, val+appendix, {fontSize: this.fontSize, fontFamily: "myOtherFont", color: "white"})
                .setOrigin(0).setDepth(20);
            msg.setPosition(this.sections[this.messages.length].centerX - msg.displayWidth/2, this.sections[this.messages.length].centerY - msg.displayHeight/2);

            this.messages.add(msg);
        }
        return this;
    }
    
    clear(index) {
        this.messages[index]
            .setActive(false)
            .setVisible(false)
        this.messages[index].destroy();
        
        return this;
}
    clearAll(){
        this.messages.destroy(true);
        this.messages = this.scene.add.container(0, 0);
        
        return this;
    }
}