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
        
        //PILES INSTANTIATION
        this.anomalyPile = new AnomalyPile(scene, "Time Anomaly");
        this.hand = new Hand(scene, "Hand");
        this.discard = new Discard(scene, "Discard");
        this.deck = new Deck(scene, "Deck");
        //PILES CREATION
        this.leftSection = this.middleSection = this.rightSection = undefined;
        
        this.createHand(this.hand);
        
        this.middleSection = new Phaser.Geom.Rectangle(this.leftSection.right, 0, this.config.width*0.6, this.config.height);
        //this.setBackgroundColor(this.middleSection, 0x000000, 0x0000ff, 1);
       
        const remainingSpace = this.config.width - this.middleSection.right;
        this.rightSection = new Phaser.Geom.Rectangle(this.middleSection.right, 0, remainingSpace, this.config.height);
        this.setBackgroundColor(this.rightSection, 0x000000, 0x0000ff, 1);
        
        this.createDeck(this.deck);
        this.createDiscard(this.discard);
        this.createAnomalyPile(this.anomalyPile);
        
        this.piles = {anomalyPile: this.anomalyPile, deck: this.deck, discard: this.discard, hand: this.hand};
 
        this.createButtons();
        this.createDisplayScreen();
        this.createIcons();
        scene.hideMultiple([scene.playScreenTopUI, scene.playScreenBottomUI]);
 
    }
    setBackgroundColor(rect, fillColor, borderColor, alpha = 1, lineWidth){
        this.graphics = this.scene.add.graphics().setDepth(0);
        this.graphics.clear();
        this.graphics.fillStyle(fillColor, alpha); // color & transparency
        this.graphics.fillRect(rect.left,
            rect.top,
            rect.width,
            rect.height);
           
        if(!lineWidth) return this;
        this.graphics.lineStyle(lineWidth, borderColor, 1); //width, color and transparency
        this.graphics.strokeRect(rect.left,
            rect.top,
            rect.width,
            rect.height);
 
        return this; 
    }
    setRoundedBackgroundColor(rect, fillColor, borderColor, alpha = 1, lineWidth){
        this.graphics = this.scene.add.graphics().setDepth(0);
        this.graphics.clear();
        this.graphics.fillStyle(fillColor, alpha); // color & transparency
        this.graphics.fillRoundedRect(rect.left,
            rect.top,
            rect.width,
            rect.height);
           
        if(!lineWidth) return this;
        this.graphics.lineStyle(lineWidth, borderColor, 1); //width, color and transparency
        this.graphics.strokeRoundedRect(rect.left,
            rect.top,
            rect.width,
            rect.height);
 
        return this; 
    } 
    createIcons(){
        return this;
    }
    //RIGHT UI
    createDisplayScreen(){
        //three sections, equal sizes
        //set parameters
        //calculate height of 1 section
        const marginY = 40;
        const paddingY = 25;
        const numberOfSections = 3;
        const totalHeight = this.config.height;
        const totalAvailableHeight = totalHeight - marginY*2 - paddingY*(numberOfSections-1);
        const sectionHeight = totalAvailableHeight/numberOfSections;
        //calculate width of button
        const totalWidth = this.rightSection.width;
        const marginX = 5;
        const maxWidth = totalWidth - marginX*2;        
        //texts
        this.displayHeaders = [];
        this.displayRects = [];
        this.displayTexts = [];
        for(let i = 0; i < numberOfSections; ++i){
            const rect = new Phaser.Geom.Rectangle(this.rightSection.left+marginX, marginY + (i*(sectionHeight+paddingY)), maxWidth, sectionHeight);
            this.setRoundedBackgroundColor(rect, 0x22aa22, 0x0000ff, 0.8);
            //add headers
            const header = this.scene.add.text(rect.left+marginX, rect.top, "Section "+(i+1), {fontSize: "40px", fontFamily: "myOtherFont", color: "gold"}).setOrigin(0);
            this.displayRects.push(rect);
            this.displayHeaders.push(header);
            
        }
    }
    //BUTTONS
    createButtons(){
        //SIX GENERIC BTNS
        //set button parameters
        //calculate height of 1 button
        const marginY = 40;
        const paddingY = 25;
        const numberOfButtons = 6;
        const totalHeight = this.config.height;
        const totalAvailableHeight = totalHeight - marginY*2 - paddingY*(numberOfButtons-1);
        const buttonHeight = totalAvailableHeight/numberOfButtons;
        //calculate width of button
        const totalWidth = this.leftSection.left;
        const marginX = 2.5;
        const buttonWidth = totalWidth - marginX*2;
        //create buttons
        this.gameplayButtons = [];
        for(let i = 0; i < numberOfButtons; ++i){
            const rect = new Phaser.Geom.Rectangle(marginX, marginY + (i*(buttonHeight+paddingY)), buttonWidth, buttonHeight);
            const btn = new Button(this.scene, rect, "Deal");
            this.gameplayButtons.push(btn);
        }
        //set text
        this.gameplayButtons[0].label.setText("Deal");
        this.gameplayButtons[1].label.setText("Swap");
        this.gameplayButtons[2].label.setText("Discard");
        this.gameplayButtons[3].label.setText("Undo");
        this.gameplayButtons[4].label.setText("Redo");
        this.gameplayButtons[5].label.setText("End");
        //set reference
        this.dealBtn = this.gameplayButtons[0];
        this.swapBtn = this.gameplayButtons[1];
        this.discardBtn = this.gameplayButtons[2];
        this.undoBtn = this.gameplayButtons[3];
        this.redoBtn = this.gameplayButtons[4];
        this.endBttn = this.gameplayButtons[5];

        //adjust position
        this.gameplayButtons.forEach(btn=>{
            btn.label.setFontFamily("myOtherFont");
            btn.label.setPosition(btn.rect.centerX - btn.label.width/2, btn.rect.centerY - btn.label.height/2);
        })
        return this;
    }
    //PILES
    createAnomalyPile(pile){
        //scale factor = 10% game width
        //get card aspect ratio first
        const cardDimensions = this.scene.getCardDimensions();
        const cardAspectRatio = cardDimensions.originalWidth/cardDimensions.originalHeight;
        
        const anomalyWidth = 0.1 * this.middleSection.width;
        const anomalyHeight = anomalyWidth / cardAspectRatio;
        
        let anomalyX = this.middleSection.centerX - anomalyWidth/2;
        let anomalyY = this.middleSection.centerY - anomalyHeight/2;
        
        pile.create(anomalyX, anomalyY, anomalyWidth, anomalyHeight);
    }
    createDeck(pile){
        //scale factor = 5% game width;
        const cardDimensions = this.scene.getCardDimensions();
        const cardAspectRatio = cardDimensions.originalWidth/cardDimensions.originalHeight;

        const deckHeight = 0.20 * this.config.height;
        const deckWidth = deckHeight * cardAspectRatio;
        
        let deckX = this.middleSection.right - deckWidth - 5;
        let deckY = this.middleSection.top + 5;
        
        pile.create(deckX, deckY, deckWidth, deckHeight);
    }
    createDiscard(pile){
        //scale factor = 10% game height
        const cardDimensions = this.scene.getCardDimensions();
        const cardAspectRatio = cardDimensions.originalWidth/cardDimensions.originalHeight;

        const discardHeight = 0.20 * this.config.height;
        const discardWidth = discardHeight * cardAspectRatio;
        
        let discardX = this.middleSection.right - discardWidth - 5;
        let discardY = this.middleSection.bottom - discardHeight - 5;
        
        pile.create(discardX, discardY, discardWidth, discardHeight);
    }  
    createHand(pile){
        //i want to determine the scale factor based on the height of the screen
        //i want to create four rows and two columns for the cards
        //so that all the rows would fit the whole screen
        const totalHeight = this.config.height;
        const marginY = 5;
        const paddingY = 10;
        const rows = 4;
        const cols = 2;
        const marginX = 5;
        const paddingX = 10;
        const availableHeight = totalHeight - (marginY * 2) - (paddingY * (rows-1));
        //get card aspect ratio
        const cardDimensions = this.scene.getCardDimensions();
        const cardAspectRatio = cardDimensions.originalWidth/cardDimensions.originalHeight;
        
        const handHeight = availableHeight/rows;
        const handWidth = handHeight * cardAspectRatio;

        const totalOccupiedWidth = marginX*2 + handWidth*cols + paddingX*(cols-1);
        this.leftSection = new Phaser.Geom.Rectangle(this.config.width*0.1, 0, totalOccupiedWidth, this.config.height);
        this.setBackgroundColor(this.leftSection, 0x000000, 0x0000ff, 1);

        let handX, handY;
        for(let i = 0; i < cols; ++i){
            handX = this.leftSection.left + i*(handWidth+paddingX) + marginX;
            for(let j = 0; j < rows; ++j){
                handY = j*(handHeight+paddingY) +marginY;
                pile.create(handX, handY, handWidth, handHeight, i*rows+j); 
            }
        }

    }
    
    onOrientationChange(){
        if(!screen.orientation) return;
        screen.orientation.addEventListener("change",()=>{
            if(screen.orientation.type.startsWith("portrait")){
               
            }
            else if(screen.orientation.type.startsWith("landscape")){
                this.leftSection = new Phaser.Geom.Rectangle(0,0,this.config.width*0.25, this.config.height);
                this.rightSection = new Phaser.Geom.Rectangle(this.leftSection.right, 0,this.config.width*0.75, this.config.height);
            }
        })
    }
    
    update(time, delta){
        //update the font size of the button with longest word
        this.discardBtn&& this.discardBtn.updateFontSize(time, delta);
        this.gameplayButtons.forEach(btn=>{
            btn.label.setFontSize(this.discardBtn.currentFontSize);
            btn.label.setPosition(btn.rect.centerX - btn.label.width/2, btn.rect.centerY - btn.label.height/2);
        })
    }
    createNewTurnMessage(turn){
        this.turn = turn;
        this.turnMessage = this.scene.add.text(0, 0, "Turn " + turn, {fontFamily: "myOtherFont", fontSize: "60px", color: "white"}).setOrigin(0)
    
        this.turnMessage.setPosition(this.middleSection.centerX - this.turnMessage.width/2, this.middleSection.centerY - this.turnMessage.height/2)
            .setVisible(true);
    }
    hideMessage(){
        this.turnMessage.setVisible(false);
    }
}