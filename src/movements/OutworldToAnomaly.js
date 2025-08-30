import { Movement } from "./Movement.js";

export class OutworldToAnomaly extends Movement{
    constructor(scene){
        super(scene);
        this.id = "outworldToAnomaly";
        this.timeout = 1500;
    }
    
    execute(){
        const {hand, deck, discard, anomalyPile} = this.scene.gameplayUI.piles;
        const { outworlders } = this.scene.handsOfTime;
        const sourceContainer = outworlders;
        const targetContainer = anomalyPile.container;
        
        if(!sourceContainer.length) return;
        //DEVELOPER MODE TO QUICKLY RESOLVE ANY ANOMALY
        sourceContainer.bringToTop(sourceContainer.list[6])
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
            ease: 'Bounce.out' || 'Linear' || 'Sine.easeInOut',
            onComplete: ()=>{
                const card = this.scene.createCard(targetContainer.getData("ownerID")+"Card", true)
                    .setDisplaySize(targetContainer.width, targetContainer.height)
                    .setFrame(this.card.getData("frame"))
                card.setData({
                    x: card.x,
                    y: card.y,
                    sourceZone: "outworld",
                    frame: this.card.getData("frame"),
                    suit: this.card.getData("suit"),
                    colour: this.card.getData("colour"),
                    value: this.card.getData("value"),
                    index: targetContainer.getData("index"),
                    zone: "anomaly",
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
                //add objectives
                anomalyPile.scroll.addObjectives(card).addCheckboxes();
            }
        })
    }
}