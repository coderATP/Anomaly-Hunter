import { Movement } from "./Movement.js";

export class HandToDiscard extends Movement{
    constructor(scene, sourceContainer){
        super(scene);
        this.id = "handToDiscard";
        this.sourceContainer = sourceContainer;
    }
    
    execute(){
        const {hand, deck, discard, anomalyPile} = this.scene.gameplayUI.piles;
        
        const sourceContainer = this.sourceContainer;
        //target container must be one of the empty piles
        //get the first empty container
        const targetContainer = discard.container;

        this.card = sourceContainer.list[sourceContainer.length-1];
        //display card frame
        if(!targetContainer) return;
        this.card.setFrame(this.card.getData("frame"));
        
        this.targetY = targetContainer.y - sourceContainer.y;
        this.targetX = targetContainer.x - sourceContainer.x;
       
        const points = [
            sourceContainer.x+sourceContainer.width, sourceContainer.y,
            anomalyPile.container.x - anomalyPile.container.width, anomalyPile.container.y + anomalyPile.container.height,
            anomalyPile.container.x + anomalyPile.container.width, anomalyPile.container.y + anomalyPile.container.height,
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
                    sourceZone: "marketZone",
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
                
                sourceContainer.list.pop();
                this.card = null; 
            }
        })
      /*const path = this.scene.moveAlongSpline(this.scene, this.card, points, 2000);
        
        const graphics = this.scene.add.graphics();
        graphics.clear();
        graphics.lineStyle(10, 0x303030, 1)
        curve.draw(graphics)
       */ 
       /*
        this.scene.tweens.add({
            targets: this.card,
            x: this.targetX,
            y: this.targetY,
            displayWidth: targetContainer.width,
            displayHeight: targetContainer.height,
            duration: 2000,
            ease: 'Linear',
            onUpdate: (tween, progress)=>{
               // const p = curve.getPoint(time.value);
               // this.card.setPosition(p.x, p.y);
            },
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
                
                sourceContainer.list.pop();
                this.card = null;
            }
        })
        */
    }
}