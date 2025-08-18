import { Movement } from "./Movement.js";

export class MultipleDeckToHand extends Movement{
    constructor(scene){
        super(scene);
        this.id = "multipleDeckToHand";
        this.movementCount = 0;
    }
    
    execute(){
        const {hand, deck, discard, anomalyPile} = this.scene.gameplayUI.piles;
        
        const sourcePile = deck;
        //target container must be one of the empty piles
        //get the first empty container
        let targetContainer;
        hand.containers.forEach((container, i)=>{
            if(container.length) return;
            targetContainer = hand.containers[i];
        });
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
                const card = this.scene.createCard(targetContainer.getData("ownerID")+"Card")
                    .setInteractive({draggable: false})
                    .setDisplaySize(targetContainer.width, targetContainer.height)
                    .setFrame(this.card.getData("frame"));
                card.setData({
                    x: card.x,
                    y: card.y,
                    sourceZone: "marketZone",
                    frame: this.card.getData("frame"),
                    suit: this.card.getData("suit"),
                    colour: this.card.getData("colour"),
                    value: this.card.getData("value"),
                    index: targetContainer.getData("index")
                });
                
                targetContainer.add(card);
                card.setPosition(0, 0);
                card.setData({x: card.x, y: card.y}) 
                
                sourcePile.container.list.pop();
                this.card = null;
                
                //move four more cards
                this.movementCount++;
                if(this.movementCount < 5) this.execute();
            }
        })
    }
}