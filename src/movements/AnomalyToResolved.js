import { Movement } from "./Movement.js";

export class AnomalyToResolved extends Movement{
    constructor(scene){
        super(scene);
        this.id = "anomalyToResolved";
        this.timeout = 500;
    }
    
    execute(){
        const {hand, deck, discard, anomalyPile, resolvedPile} = this.scene.gameplayUI.piles;
        const { outworlders } = this.scene.handsOfTime;
        const sourceContainer = anomalyPile.container;
        const targetContainer = resolvedPile.container;
        
        if(!sourceContainer.length) return;
        //DEVELOPER MODE TO QUICKLY RESOLVE ANY ANOMALY
       // sourceContainer.bringToTop(sourceContainer.list[6])
        this.card = sourceContainer.list[sourceContainer.length-1];
        //display card frame
        this.card.setFrame(this.card.getData("frame"));
        
        this.targetY = targetContainer.y - sourceContainer.y;
        this.targetX = targetContainer.x - sourceContainer.x;
       
        this.scene.tweens.add({
            targets: this.card,
            y: this.targetY,
            x: this.targetX,
            displayWidth: targetContainer.width,
            displayHeight: targetContainer.height,
            duration: this.timeout,
            ease: 'Linear',
            onComplete: ()=>{
                const card = this.scene.createCard(targetContainer.getData("ownerID")+"Card", true)
                    .setDisplaySize(targetContainer.width, targetContainer.height)
                    .setFrame(this.card.getData("frame"))
                card.setData({
                    x: card.x,
                    y: card.y,
                    sourceZone: "anomaly",
                    frame: this.card.getData("frame"),
                    suit: this.card.getData("suit"),
                    colour: this.card.getData("colour"),
                    value: this.card.getData("value"),
                    index: targetContainer.getData("index"),
                    zone: "resolved",
                    rect: new Phaser.Geom.Rectangle(targetContainer.x, targetContainer.y, targetContainer.width, targetContainer.height),
                    title: this.card.getData("title"),
                    attributes: this.card.getData("attributes"),
                    category: this.card.getData("category"),
                    level: this.card.getData("level"),
                    reward: this.card.getData("reward"),
                    objectives: this.card.getData("objectives")
                });
                
                targetContainer.add(card);
                card.setPosition(0, 0);
                card.setData({x: card.x, y: card.y}) 
                
                sourceContainer.list.pop();
                this.card = null;
                // clear the contents of scroll
                anomalyPile.scroll.clearContents();
            }
        })
    }
}