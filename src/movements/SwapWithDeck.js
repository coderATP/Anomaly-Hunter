import { Movement } from "./Movement.js";
import { DeckToHand } from "./DeckToHand.js";


export class SwapWithDeck extends Movement{
    constructor(scene, sourceContainer){
        super(scene);
        this.id = "SwapWithDeck";
        this.sourceContainer = sourceContainer;
    }
    
    execute(){
        const {hand, deck, discard, anomalyPile} = this.scene.gameplayUI.piles;
        
        const sourceContainer = this.sourceContainer;
        const targetContainer = deck.container;
        
        this.card = sourceContainer.list[sourceContainer.length-1];
        
        this.targetY = targetContainer.y - sourceContainer.y;
        this.targetX = targetContainer.x - sourceContainer.x;
       
        this.scene.tweens.add({
            targets: this.card,
            y: this.targetY,
            x: this.targetX,
            displayWidth: targetContainer.width,
            displayHeight: targetContainer.height,
            duration: 100,
            ease: 'Linear',
            onComplete: ()=>{
                const card = this.scene.createCard(targetContainer.getData("ownerID")+"Card", true)
                    .setDisplaySize(targetContainer.width, targetContainer.height)
                    .setInteractive({draggable: false})
                    .setFrame(this.card.getData("frame"));
                card.setData({
                    x: card.x,
                    y: card.y,
                    sourceZone: "HandZone",
                    frame: this.card.getData("frame"),
                    suit: this.card.getData("suit"),
                    colour: this.card.getData("colour"),
                    value: this.card.getData("value"),
                    index: targetContainer.getData("index"),
                    zone: "deck",
                    rect: new Phaser.Geom.Rectangle(targetContainer.x, targetContainer.y, targetContainer.width, targetContainer.height),
                    title: this.card.getData("title"),
                    attributes: this.card.getData("attributes"),
                    category: this.card.getData("category"),
                    level: this.card.getData("level"),
                    reward: this.card.getData("reward"), 
                });
                
                targetContainer.addAt(card, 0);
                card.setPosition(0, 0);
                targetContainer.list.forEach((card, i)=>{ card.setPosition(-i*0.25, 0)})
                card.setData({x: card.x, y: card.y}) 
                
                sourceContainer.list.pop();
                this.card = null;
                //send card from deck
                return new Promise((resolve, reject) => {
                    const command = new DeckToHand(this.scene, 1);
                    this.scene.commandHandler.execute(command);
                    this.scene.gameplayUI.swapBtn.deactivate().enterRestState();
                    this.scene.time.delayedCall(50, resolve);
                })
            }
        })
    }
}