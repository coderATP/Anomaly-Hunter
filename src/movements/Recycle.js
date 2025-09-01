import { Movement } from "./Movement.js";
import { Turn1 } from "../turns/Turn1.js";
import { Turn2 } from "../turns/Turn2.js";
import { Turn3 } from "../turns/Turn3.js";

export class Recycle extends Movement{
    constructor(scene){
        super(scene);
        this.id = "recycle";
        const {hand, deck, discard, anomalyPile} = this.scene.gameplayUI.piles;
        const { PreloadScene } = scene.game.scene.keys;
        this.preloadScene = PreloadScene;
        this.hand = hand;
        this.discard = discard;
        this.anomalyPile = anomalyPile;
        this.card = undefined;
    }
    
    execute(){
        this.preloadScene.audio.play(this.preloadScene.audio.swooshSound);
        const sourceContainer = this.discard.container;
        const targetContainer = this.discard.container;
        
        this.card = sourceContainer.list[sourceContainer.length-1];
        this.card.setFrame(this.card.getData("frame"));
        
        this.targetY = targetContainer.y - sourceContainer.y;
        this.targetX = targetContainer.x - sourceContainer.x;
       
        const points = [
            sourceContainer.x-sourceContainer.width, sourceContainer.y,
            this.anomalyPile.container.x - this.anomalyPile.container.width, 0,
            this.hand.containers[0].width, this.hand.containers[0].y,
            targetContainer.x+targetContainer.width/2, targetContainer.y+targetContainer.height/2,
        ]
        const path = new Phaser.Curves.Path(sourceContainer.x, sourceContainer.y);
        path.splineTo(points);
        let follower = this.scene.add.follower(path, sourceContainer.x, sourceContainer.y, 'cards')
            .setDisplaySize(targetContainer.width, targetContainer.height)
            .setFrame(this.card.frame)
            .setDepth(sourceContainer.depth+1);
        //hide card until ready to destroy
        this.card.setVisible(false);
        
        follower.startFollow({
            duration: 1000,
            ease: 'Linear',
            rotateToPath: true,
            onComplete: ()=>{
                //destroy follower
                follower.destroy();
                follower = null;
                //create a proper card
                const card = this.scene.createCard(targetContainer.getData("ownerID")+"Card")
                    .setInteractive({draggable: false})
                    .setDisplaySize(targetContainer.width, targetContainer.height)
                    .setFrame(this.card.getData("frame"));
                card.setData({
                    x: card.x,
                    y: card.y,
                    sourceZone: "discardZone",
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
                
                sourceContainer.list.shift();
                this.card = null; 
            }
        })
    }
    
}