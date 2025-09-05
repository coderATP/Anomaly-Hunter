import { Button } from "../entities/Button.js";
import { Icon } from "../entities/Icon.js";
//piles
import { AnomalyPile } from "../piles/Anomaly.js";
import { Hand } from "../piles/Hand.js";
import { Deck } from "../piles/Deck.js";
import { Discard } from "../piles/Discard.js";
import { ResolvedPile } from "../piles/Resolved.js";

export class GameplayUI {
    constructor(scene){
        this.scene = scene;
        this.config = scene.config;
        
        const { PreloadScene } = scene.game.scene.keys;
        this.preloadScene = PreloadScene;
        
        this.marginX = this.config.width*0.025;
        
        //PILES INSTANTIATION
        this.anomalyPile = new AnomalyPile(scene, "Time Anomaly");
        this.hand = new Hand(scene, "Hand");
        this.discard = new Discard(scene, "Discard");
        this.deck = new Deck(scene, "Deck");
        this.resolvedPile = new ResolvedPile(scene, "Resolved");
     
        //PILES CREATION
        this.leftSection = this.middleSection = this.rightSection = undefined;
        
        this.createHand(this.hand);
        
        this.middleSection = new Phaser.Geom.Rectangle(this.leftSection.right, 0, this.config.width*0.6, this.config.height);
        //this.setBackgroundColor(this.middleSection, 0x628410, 0x0000ff, 1);
       
        const remainingSpace = this.config.width - this.middleSection.right;
        this.rightSection = new Phaser.Geom.Rectangle(this.middleSection.right, 0, remainingSpace, this.config.height);
       // this.setBackgroundColor(this.rightSection, 0x000000, 0x0000ff, 1);
        
        this.createDeck(this.deck);
        this.createDiscard(this.discard);
        this.createAnomalyPile(this.anomalyPile);
        this.createResolvedPile(this.resolvedPile);
        this.piles = {anomalyPile: this.anomalyPile, deck: this.deck, discard: this.discard, hand: this.hand, resolvedPile: this.resolvedPile};
 
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
        const marginY = 30;
        const paddingY = 20;
        const numberOfSections = 3;
        const totalHeight = this.config.height;
        const totalAvailableHeight = totalHeight - marginY*2 - paddingY*(numberOfSections-1);
        //calculate width of button
        const totalWidth = this.rightSection.width;
        const marginX = 5;
        const maxWidth = totalWidth - marginX*2;  
        const sectionHeight = 0.15*this.config.height;

        //texts
        this.displayHeaders = [];
        this.displayRects = [];
        this.displayTexts = [];
        for(let i = 0; i < numberOfSections; ++i){
            const x = this.rightSection.left+marginX
            const y = this.config.height - sectionHeight - (i*sectionHeight) - marginY;
            const rect = new Phaser.Geom.Rectangle(x, y, maxWidth, sectionHeight);
            this.setRoundedBackgroundColor(rect, 0x22aa22, 0x0000ff, 0.8);
            //add headers
            const header = this.scene.add.text(rect.left+marginX, rect.top, "Swap Point", {fontSize: "25px", fontFamily: "myOtherFont", color: "gold"}).setOrigin(0);
            const text = this.scene.add.text(rect.left+marginX, rect.top, "0", {fontSize: "40px", fontFamily: "myOtherFont", color: "gold"}).setOrigin(0);
            text.setPosition(rect.left+marginX, rect.bottom-text.displayHeight);
            this.displayRects.push(rect);
            this.displayHeaders.push(header);
            this.displayTexts.push(text);
        }
        
       
        //rects
        this.SPRect = this.displayRects[0];
        this.RPRect = this.displayRects[1];
        this.DPRect = this.displayRects[2];
        //set headers
        this.SPHeader = this.displayHeaders[0];
        this.RPHeader = this.displayHeaders[1];
        this.DPHeader = this.displayHeaders[2];
        this.RPHeader.setText("Resource Point");
        this.DPHeader.setText("Draw Point");
        this.displayHeaders.forEach(header=>{ header.setPosition(this.rightSection.centerX - header.width/2, header.y+10); })
        //texts
        this.SPText = this.displayTexts[0];
        this.RPText = this.displayTexts[1];
        this.DPText = this.displayTexts[2];
        this.SPText.setText(2);
        this.DPText.setText(3);
        this.displayTexts.forEach((text, i)=>{ text.setPosition(this.displayRects[i].centerX - text.width/2, this.displayRects[i].bottom - text.displayHeight - 10) })
        //create progress section for each turn
        this.turnProgressRect = new Phaser.Geom.Rectangle(this.rightSection.left + marginX, this.rightSection.top + marginY, maxWidth, this.DPRect.top-marginY);
        this.setRoundedBackgroundColor(this.turnProgressRect, 0x22aa22, 0x0000ff, 0.8);
        this.turnProgressHeader = this.scene.add.text(this.turnProgressRect.left+marginX, this.turnProgressRect.top, "This Round", {fontSize: "30px", fontFamily: "myOtherFont", color: "gold"}).setOrigin(0);
        this.turnProgressHeader.appendText("You've Dealt:")
            .setWordWrapWidth(this.turnProgressRect.width)
            .setAlign("center");
        this.createCardsPlayedSection();
    }
    
    createCardsPlayedSection(){
        //same as we did for hand section
        //four rows,two columns
        if(!this.turnProgressHeader || !this.turnProgressRect) return;
        
        let paddingX = 5, paddingY = 5;
        let marginX = 5, marginY = 5;
        const x = this.turnProgressRect.left - marginX;
        const y = this.turnProgressHeader.y + this.turnProgressHeader.displayHeight + marginY;
        const totalWidth = this.turnProgressRect.width - marginX*2;
        const totalHeight = this.turnProgressRect.height - (this.turnProgressHeader.y+this.turnProgressHeader.displayHeight) - marginY*2;
        
        
        const rows = 4;
        const cols = 2;
        
        const sectionWidth = totalWidth/cols;
        const sectionHeight = sectionWidth;
        
        this.progressSectionRects = [];
        let rectX, rectY;
        for(let i = 0; i < cols; ++i){
            rectX = x+ i*(sectionWidth+paddingX) + marginX;
            for(let j = 0; j < rows; ++j){
                rectY = y + j*(sectionHeight+paddingY) +marginY;
                const rect = new Phaser.Geom.Rectangle(rectX, rectY, sectionWidth, sectionHeight);
                const graphics = this.scene.add.graphics().setDepth(1);
                graphics.clear();
                graphics.strokeRectShape(rect);
                this.progressSectionRects.push(rect);
            }
        }

    }

    //BUTTONS
    createButtons(){
        //SIX GENERIC BTNS
        //set button parameters
        //calculate height of 1 button
        const marginY = 40;
        const paddingY = 25;
        const numberOfButtons = 5;
        const totalHeight = this.config.height;
        const totalAvailableHeight = totalHeight - marginY*2 - paddingY*(numberOfButtons-1);
        const buttonHeight = totalAvailableHeight/numberOfButtons;
        //calculate width of button
        const totalWidth = this.leftSection.left;
        const marginX = 2.5;
        const buttonWidth = totalWidth - marginX*2;
        //create buttons
        this.gameplayButtonRects = [];
        for(let i = 0; i < numberOfButtons; ++i){
            const rect = new Phaser.Geom.Rectangle(marginX, marginY + (i*(buttonHeight+paddingY)), buttonWidth, buttonHeight);
            this.gameplayButtonRects.push(rect);
        }

        //set reference
        this.resolveBtn = new Button(this.scene, this.gameplayButtonRects[0], "Resolve");
        this.recallBtn = new Button(this.scene, this.gameplayButtonRects[1], "Recall");
        this.discardBtn = new Button(this.scene, this.gameplayButtonRects[2], "Discard");
        this.swapBtn = new Button(this.scene, this.gameplayButtonRects[3], "Swap");
        this.endBtn = new Button(this.scene, this.gameplayButtonRects[4], "End");
        this.gameplayButtons = [this.resolveBtn, this.recallBtn, this.discardBtn, this.swapBtn, this.endBtn];

        //adjust position
        this.gameplayButtons.forEach((btn, i)=>{
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
    createResolvedPile(pile){
        //scale factor = 10% game width
        //get card aspect ratio first
        const cardDimensions = this.scene.getCardDimensions();
        const cardAspectRatio = cardDimensions.originalWidth/cardDimensions.originalHeight;
        
        const resolvedWidth = 0.1 * this.middleSection.width;
        const resolvedHeight = resolvedWidth / cardAspectRatio;
        
        let resolvedX = this.middleSection.left;
        let resolvedY = this.middleSection.centerY - resolvedHeight/2;
        
        pile.create(resolvedX, resolvedY, resolvedWidth, resolvedHeight);
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
        const marginY = 80;
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
        //this.setBackgroundColor(this.leftSection, 0x000000, 0x0000ff, 1);

        let handX, handY;
        for(let i = 0; i < cols; ++i){
            handX = this.leftSection.left + i*(handWidth+paddingX) + marginX;
            for(let j = 0; j < rows; ++j){
                handY = j*(handHeight+paddingY) +marginY;
                pile.create(handX, handY, handWidth, handHeight, i*rows+j); 
            }
        }

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