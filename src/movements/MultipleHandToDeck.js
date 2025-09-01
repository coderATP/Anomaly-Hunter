import { Movement } from "./Movement.js";

export class MultipleHandToDeck extends Movement{
    constructor(scene){
        super(scene);
        this.id = "multipleHandToDeck";
        this.movementCount = 0;
        this.numberOfRemainingCards = 0;
        this.timeout;
    }
    
    execute(){
        const {hand, deck, discard, anomalyPile} = this.scene.gameplayUI.piles;
        
        const targetContainer = deck.container;
        //get the first empty container
        let sourceContainer;
        for(let i = 0; i < hand.containers.length; ++i){
            const container = hand.containers[i];
            if(container.length){
                sourceContainer = hand.containers[i];
                break;
            }
        }
        //get the number of remaining cards
        for(let i = 0; i < hand.containers.length; ++i){
            const container = hand.containers[i];
            if(container.length){
                this.numberOfRemainingCards++;
            }
        }
        if(!sourceContainer) return;
        //get total time taken
        this.timeout = 200 * this.numberOfRemainingCards;
        this.card = sourceContainer.list[sourceContainer.length-1];
        //display card frame
        
        this.targetY = targetContainer.y - sourceContainer.y;
        this.targetX = targetContainer.x - sourceContainer.x;
       
        this.scene.tweens.add({
            targets: this.card,
            y: this.targetY,
            x: this.targetX,
            displayWidth: targetContainer.width,
            displayHeight: targetContainer.height,
            duration: 200,
            onComplete: ()=>{
                const card = this.scene.createCard(targetContainer.getData("ownerID")+"Card", true)
                    .setDisplaySize(targetContainer.width, targetContainer.height)
                    .setInteractive({draggable: false})
                    .setFrame(59);
                card.setData({
                    x: card.x,
                    y: card.y,
                    sourceZone: "HandZone",
                    frame: this.card.getData("frame"),
                    suit: this.card.getData("suit"),
                    colour: this.card.getData("colour"),
                    value: this.card.getData("value"),
                    index: targetContainer.getData("index"),
                    zone: "hand",
                    rect: new Phaser.Geom.Rectangle(targetContainer.x, targetContainer.y, targetContainer.width, targetContainer.height),
                    title: this.card.getData("title"),
                    attributes: this.card.getData("attributes"),
                    category: this.card.getData("category"),
                    level: this.card.getData("level"),
                    reward: this.card.getData("reward"),
                });
                
                targetContainer.addAt(card, 0);
                card.setPosition(0, 0);
                targetContainer.list.forEach((card, i)=>{ card.setPosition(-i*0.25, 0.15) })
                card.setData({x: card.x, y: card.y}) 
                
                sourceContainer.list.pop();
                this.card = null;
                
                //move all the remaining cards in hand
                this.movementCount++;
                if(this.movementCount < this.numberOfRemainingCards) this.execute();
            }
        })
    }
}