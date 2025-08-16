import { Button } from "../entities/Button.js";
import { Icon } from "../entities/Icon.js";
//piles
import { AnomalyPile } from "../piles/Anomaly.js";
import { Hand } from "../piles/Hand.js";
import { Deck } from "../piles/Deck.js";
import { Discard } from "../piles/Discard.js";

export class GameplayUI {
    constructor(scene){
        this.scene = scene;
        this.config = scene.config;
        
        this.marginX = this.config.width*0.025;
        
        this.leftSection = new Phaser.Geom.Rectangle(0,0,this.config.width*0.25, this.config.height);
        this.rightSection = new Phaser.Geom.Rectangle(this.leftSection.right, 0,this.config.width*0.75, this.config.height);
 

        this.setBackgroundColor(this.leftSection, 0x000000, 0x0000ff, 1, 16);
        this.setBackgroundColor(this.rightSection, 0x330000, 0x0000ff, 1, 16);
        
        //PILES INSTANTIATION
        this.anomalyPile = new AnomalyPile(scene, "Time Anomaly");
        this.hand = new Hand(scene, "Hand");
        this.discard = new Discard(scene, "Discard");
        this.deck = new Deck(scene, "Deck");
        //PILES CREATION
        this.createPiles();

        this.createButtons();
        this.createIcons();
        scene.hideMultiple([scene.playScreenTopUI, scene.playScreenBottomUI]);
 
    }
    setBackgroundColor(rect, fillColor, borderColor, alpha = 1, radius = 8, lineWidth){
        this.graphics = this.scene.add.graphics().setDepth(0);
        this.graphics.clear();
        this.graphics.fillStyle(fillColor, alpha); // color & transparency
        this.graphics.fillRoundedRect(rect.left,
            rect.top,
            rect.width,
            rect.height,
            radius);
           
        if(!lineWidth) return this;
        this.graphics.lineStyle(lineWidth, borderColor, 1); //width, color and transparency
        this.graphics.strokeRoundedRect(rect.left,
            rect.top,
            rect.width,
            rect.height,
            8);
 
        return this; 
    }
    createIcons(){
        return this;
    }
    createButtons(){
        //FIVE GENERIC BTNS
        return this;
    }
    createPiles(){
        //anomaly
        this.createAnomalyPile(this.anomalyPile);
        //deck 
        this.createDeck(this.deck);
        //discard
        this.createDiscard(this.discard);
        //hand
        this.createHand(this.hand);
    }
    
    //PILES
    createAnomalyPile(pile){
        const scaleFactor = 2;
        const cardDimensions = this.scene.getCardDimensions();

        const anomalyWidth = cardDimensions.originalWidth * scaleFactor;
        const anomalyHeight = cardDimensions.originalHeight * scaleFactor;
        
        let anomalyX = this.rightSection.centerX - anomalyWidth/2;
        let anomalyY = this.rightSection.centerY - anomalyHeight/2;
        
        pile.create(anomalyX, anomalyY, anomalyWidth, anomalyHeight);
    }
    createDeck(pile){
        const scaleFactor = 1;
        const cardDimensions = this.scene.getCardDimensions();

        const deckWidth = cardDimensions.originalWidth * scaleFactor;
        const deckHeight = cardDimensions.originalHeight * scaleFactor;
        
        let deckX = this.rightSection.left + 5;
        let deckY = this.rightSection.bottom - deckHeight - 5;
        
        pile.create(deckX, deckY, deckWidth, deckHeight);
    }
    createDiscard(pile){
        const scaleFactor = 1;
        const cardDimensions = this.scene.getCardDimensions();

        const discardWidth = cardDimensions.originalWidth * scaleFactor;
        const discardHeight = cardDimensions.originalHeight * scaleFactor;
        
        let discardX = this.rightSection.right - discardWidth - 5;
        let discardY = this.rightSection.bottom - discardHeight - 5;
        
        pile.create(discardX, discardY, discardWidth, discardHeight);
    }  
    createHand(pile){
        //i want to determine the scale factor based on the height of the screen
        //so that all the cards would fit the whole screen
        const totalHeight = this.config.height;
        const marginY = 5;
        const paddingY = 10;
        const rows = 4;
        const cols = 2;
        const marginX = 5;
        const paddingX = 10;
        const availableHeight = totalHeight - (marginY * 2) - (paddingY * (rows-1));
        
        //const scaleFactor = 1.3;
        const cardDimensions = this.scene.getCardDimensions();
        const cardAspectRatio = cardDimensions.originalWidth/cardDimensions.originalHeight;
        
        const handHeight = availableHeight/rows;
        const handWidth = handHeight * cardAspectRatio;
        
        let handX, handY;
        for(let i = 0; i < cols; ++i){
            handX = this.leftSection.left + i*(handWidth+paddingX) + marginX;
            for(let j = 0; j < rows; ++j){
                handY = j*(handHeight+paddingY) +marginY;
                pile.create(handX, handY, handWidth, handHeight); 
            }
        }

    }
    
}