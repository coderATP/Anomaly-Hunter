export class Turn5Progress{
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
        this.msg1 = this.scene.add.text(this.x+5, this.y, "NO card yet", {fontSize: 29, fontFamily: "myOtherFont", color: "black"})
            .setOrigin(0).setDepth(20);
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