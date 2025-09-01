import { Movement } from "./Movement.js";

export class DeckToHand extends Movement{
    constructor(scene, numberOfCardsToDeal = 5){
        super(scene);
        this.id = "deckToHand";
        this.movementCount = 0;
        this.numberOfCardsToDeal = numberOfCardsToDeal;
        this.timeout = 200 * numberOfCardsToDeal;
    }
    
    execute(){
        const {hand, deck, discard, anomalyPile} = this.scene.gameplayUI.piles;
        
        const sourcePile = deck;
        //target container must be one of the empty piles
        //get the first empty container
        let targetContainer;
        for(let i = 0; i < hand.containers.length; ++i){
            const container = hand.containers[i];
            if(!container.length){
                targetContainer = hand.containers[i];
                break;
            }
        }
        this.card = sourcePile.container.list[sourcePile.container.length-1];
        //display card frame
        if(!targetContainer) return;
        this.card.setFrame(this.card.getData("frame"));
        
        this.targetY = targetContainer.y - sourcePile.y;
        this.targetX = targetContainer.x - sourcePile.x;
       
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
                    .setFrame(this.card.getData("frame"));
                card.setData({
                    x: card.x,
                    y: card.y,
                    sourceZone: "DeckZone",
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
                
                targetContainer.add(card);
                card.setPosition(0, 0);
                card.setData({x: card.x, y: card.y}) 
                
                sourcePile.container.list.pop();
                sourcePile.container.list.forEach((card, i)=>{ card.setPosition(-i*0.25, 0)})
                
                //move four more cards
                this.movementCount++;
                if(this.movementCount < this.numberOfCardsToDeal) this.execute();
            }
        })
    }
}