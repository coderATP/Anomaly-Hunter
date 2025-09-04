export class ProgressMessage{
    constructor(scene){
        this.scene = scene;
        const { PlayScene } = scene.game.scene.keys;
        const {top, left, botom, right} = PlayScene.gameplayUI.turnProgressRect;
        const {x, y, displayWidth, displayHeight} = PlayScene.gameplayUI.turnProgressHeader;
        this.x = left;
        this.y = y + displayHeight + 40;
        this.messages = scene.add.container(this.x, this.y);
    }
    
    
    add(card){
        //SUIT
        let appendix;
        switch (card.getData("suit")) {
            case "CLUB": {
                appendix = "♣️ ";
                break;
            }
            case "DIAMOND": {
                appendix = "♦️ ";
                break;
            }
            case "HEART": {
                appendix = "♥️ ";
                break;
            }
            case "SPADE": {
                appendix = "♠️ ";
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
        switch(this.messages.length){
            case  0:{
                msg = this.scene.add.text(0, 0, val+appendix, {fontSize: 40, fontFamily: "myOtherFont", color: "white"})
                    .setOrigin(0).setDepth(20);
                this.messages.add(msg);
            break;
            }
            case 1: case 2: case 3: case 4: case 5: {
                const topMessage = this.messages.list[this.messages.length-1];
                msg = this.scene.add.text(0, topMessage.y+topMessage.displayHeight+5, val+appendix, {fontSize: 40, fontFamily: "myOtherFont", color: "white"})
                    .setOrigin(0).setDepth(20);
                this.messages.add(msg);
            break;
            }
            default: {
                this.messages.removeAt(0, true);
                this.messages.list.forEach((message, i)=>{
                    message.setPosition(0, i*(this.messages.list[i].displayHeight)+5)
                })
                const topMessage = this.messages.list[this.messages.length-1];
                msg = this.scene.add.text(0, topMessage.y+topMessage.displayHeight+5, val+appendix, {fontSize: 40, fontFamily: "myOtherFont", color: "white"})
                    .setOrigin(0).setDepth(20);
                this.messages.add(msg);
            break;
            }
        }
        
        //ADD TEXT
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
        this.messages = this.scene.add.container(this.x, this.y);
        
        return this;
    }
}