import { BaseScene } from "./BaseScene.js";
//command handler for card movements
import { CommandHandler } from "../CommandHandler.js";
//movements
import { SingleDeckToHand } from "../movements/SingleDeckToHand.js";
import { MultipleDeckToHand } from "../movements/MultipleDeckToHand.js";
import { OutworldToAnomaly } from "../movements/OutworldToAnomaly.js";
 
import { AnomalyHunter } from "../AnomalyHunter.js";
import { eventEmitter } from "../events/EventEmitter.js";
import { Time } from "../events/Time.js";

import { GameplayUI } from "../ui/GameplayUI.js";

//text boxes
import { RegularCardTextbox } from "../entities/textboxes/RegularCardTextbox.js";


export class PlayScene extends BaseScene{
    constructor(config){
        super("PlayScene", config);
        this.config = config;
        this.commandHandler = new CommandHandler(this);
        this.anomalyHunter = new AnomalyHunter(this);
        this.textDisplayTimer = 0;
        this.textDisplayInterval = 2300;
    }
    
    showInterface(){
        const { PreloadScene } = this.game.scene.keys;
        this.hideAllScreens();
        this.showOne(this.playScreen, "grid", -1);
        this.showMultiple([this.playScreenTopUI, this.playScreenBottomUI], "flex", 0);
        this.preloadScene.audio.menuSong.stop();
        this.preloadScene.audio.playSong.play();

    }
    createCard(type, x, y){
        const card =  this.add.image(x,y,"cards").setName(type).setOrigin(0).setScale(1).setDepth(1)
        .setInteractive({draggable: true})
        return card
    }
    createPileRect(x, y, w, h){
        const rect = new Phaser.Geom.Rectangle(x, y, w, h);
        const graphics = this.add.graphics({lineStyle: {width: 1, color: "0xffffff"}});
        graphics.clear();
        graphics.strokeRectShape(rect).setDepth(0);
        return rect;
    }
    createDropZone(zoneType, x, y, w, h){
        const zone = this.add.zone(x, y, w, h).setRectangleDropZone(w, h).setDepth(0)
        .setName(zoneType).setOrigin(0);
        if(this.config.debug){
            this.add.rectangle(x, y, w, h, 0x09144ff, 0.0).setDepth(0).setOrigin(0);
        }
        return zone;
    }
    
    handleDragEvent(){
        const { hand } = this.gameplayUI;
        this.input.on("drag", (pointer, gameobject, dragX, dragY)=>{
            let card = gameobject&& gameobject.type === "Image" ? gameobject : null;
            switch(card.name){
                case "HandCard":{
                    card.setPosition(dragX, dragY);
                    
                    break;
                }
            } 
        })
        this.input.on("dragend", (pointer, gameobject, dropped)=>{
          //  gameobject.setPosition(gameobject.getData("x"), gameobject.getData("y")); 
           //for invalid moves, snap back to original location
           switch(gameobject.name){
               case "HandCard":{
                   if(!dropped) hand.handleMoveCardToWrongSpace(gameobject);
               break;
               }
           }
        })
        return this;
    }
    
    handleDropEvent(){
        const { hand } = this.gameplayUI;
        this.input.on("drop", (pointer, gameobject, dropZone)=>{
           
            switch(dropZone.name){
                //FOUNDATION DROP ZONE
                case "HandZone":{
                    const card = gameobject;
                    const sourcePileIndex = card.getData("index");
                    const targetPileIndex = dropZone.getData("index");
                    const sourceContainer = hand.containers[sourcePileIndex];
                    const targetContainer = hand.containers[targetPileIndex];
                    
                    //snap card back to (0,0) if dropped on same pile
                    if(sourcePileIndex===targetPileIndex) card.setPosition(0,0);
                    else{
                        //if target container isn't occupied, move
                        if(!targetContainer.length){
                            
                        }
                        //if target container is occupied, swap
                        else{
                            
                        }
                    }
                break;
                }
                default:{
                    hand.handleMoveCardToWrongSpace(gameobject);
                }
            }
        })
        return this;
    }
    
    handleClickEvent(){
        //hand card clicked
        const { hand } = this.gameplayUI;
        this.input.on("pointerup", (pointer, gameobject)=>{
            if(!gameobject[0]) return;
            //I'm tapping on a card image
            if(gameobject[0].type === "Image"){
                const zoneType = gameobject[0].getData("zone");
                const card = gameobject[0];
               // this.regularCardTextbox.setPosition(card).changeText(card);
            }
        })
        return this;
    }
    
    onGameplayButtonPressed(btn){
        btn.hitArea.disableInteractive();
        btn.enterInactiveState();
    }
    onPlayersTurn(btn){
        btn.hitArea.setInteractive();
        btn.enterRestState();
    }
    processEvents(){
        const { GameCompleteScene, PauseScene, TutorialScene } = this.game.scene.keys;
        //flags
        TutorialScene.tutorialMode = false;
        PauseScene.gamePaused = false;
        //TO PAUSE SCENE
        eventEmitter.on("PlayToPause", ()=>{
            
            this.lastAction = "";
            this.textDisplayTimer = this.textDisplayInterval;
            
            if(PauseScene.gamePaused) return;
            if(!this.scene.isPaused("PlayScene")){
                this.scene.pause(); 
                this.scene.launch("PauseScene");
            }
            PauseScene.gamePaused = true;
        });
        //TO TUTORIAL SCENE
        eventEmitter.on("PlayToTutorial", ()=>{
            //flags to avoid multiple event calling
            if(!TutorialScene.tutorialMode){
                this.scene.pause();
                this.preloadScene.audio.popUpSound.play();
                this.scene.launch("TutorialScene");
                TutorialScene.tutorialMode = true;
            }
        }) 
        eventEmitter.on("GameComplete", ()=>{
            //PAUSE GAME
            if(!this.scene.isPaused("PlayScene")) this.scene.pause();
            this.scene.launch("GameCompleteScene");
            this.preloadScene.audio.popUpSound.play();
            //this.preloadScene.audio.playSong.stop();
            GameCompleteScene.gamePaused = true;
        });
        eventEmitter.on("ToggleClockTick", ()=>{
            this.watch.canPlayTickSound = !this.watch.canPlayTickSound;
        });
    }
     
    shuffle(array){
        let tempDeck = [];
        while(array.length){
            const randomPos = Math.floor(Math.random() * array.length);
            const randomCard = (array.splice(randomPos, 1))[0];
            tempDeck.push(randomCard);
        }
        array = tempDeck;
        tempDeck = [];
        return array;
    }
    adjustInGameTextDisplayRate(delta){
        if(this.textDisplayTimer < this.textDisplayInterval){
            this.textDisplayTimer+= delta;
            this.showOne(this.playByPlayScreen, "grid", 0);
        }
        else{
            this.hideOne(this.playByPlayScreen);
            this.textDisplayTimer = this.textDisplayInterval;
        }
    }
    endTurn(){
        this.lastAction = "end";
        this.textDisplayTimer = 0;
        this.ui.gameplayText.innerText = "turn ended";
        this.computerExecuting = true;
        if(!this.computerExecuting) return;
        const command = new ComputerMovement(this);
        this.commandHandler.execute(command);
        this.computerExecuting = false; //stop executing
        //disable all gameplay buttons, to indicate it's no longer player's turn
        this.gameplayUI.gameplayButtons.forEach(btn=>{
            this.onGameplayButtonPressed(btn);
        })
    }
    undoMove(event){
        this.lastAction = "undo";
        this.textDisplayTimer = 0;
        this.ui.gameplayText.innerText = ("undoing last action"); 
    }
    redoMove(event){
        this.lastAction = "redo";
        this.textDisplayTimer = 0;
        this.ui.gameplayText.innerText = ("redoing last action"); 
    }
    
    listenToGameplayEvents(){
        //last action
        this.lastAction = "";
        //flags
        this.swapping = false; this.dealing = false; this.computerExecuting = false;
        this.preloadScene.audio.play(this.preloadScene.audio.popUpSound);
        //add event listeners to each button
        //some multiple events, others one-time
        //this.gameplayUI.swapBtn.hitArea.on("pointerdown", this.swapCard, this);
        //this.gameplayUI.dealBtn.hitArea.on("pointerdown", this.dealCard, this);
        //this.gameplayUI.endBtn.hitArea.once("pointerdown", this.endTurn, this);
       // this.gameplayUI.undoBtn.hitArea.on("pointerdown", this.undoMove, this);
        //this.gameplayUI.redoBtn.hitArea.on("pointerdown", this.redoMove, this);
    }
    swapPlayerTopCard(){
        const foundationCardsArray = this.elewenjewe.table.foundationPile.container.list;
        const playerCardsArray = this.elewenjewe.table.playerPile.container.list;
        let foundationTopmostCard = foundationCardsArray[foundationCardsArray.length-1];
        let playerTopmostCard = playerCardsArray[0]; 
        let cardToSwap;
        
        if(!foundationCardsArray.length || !playerCardsArray.length) return;
        for(let i = playerCardsArray.length-1; i >= 0; --i){
            const playerCard = playerCardsArray[i];
            if(foundationTopmostCard.getData("suit") === playerCard.getData("suit")){
                cardToSwap = playerCard;
                break;
            }
        }
        if(cardToSwap){
            this.elewenjewe.table.playerPile.container.bringToTop(cardToSwap);
            playerCardsArray.forEach((card, i)=>{
                card.setPosition(-i*0.5, -i*0.5)
                card.setData({x: card.x, y: card.y})
                card.setFrame(card.getData("frame"))
            })
        }
        return cardToSwap;
    }
    
    sortPile(array){
        array.sort((a, b)=> a.getData("value") - b.getData("value"))
    }
   
    getCardDimensions(){
        let card = this.createCard("null", 0,0);
        const originalWidth = card.displayWidth;
        const originalHeight = card.displayHeight;
        card.destroy();
        card = null;
        return {originalWidth, originalHeight}
    } 
    create(){
        const { PreloadScene } = this.game.scene.keys;
        this.preloadScene = PreloadScene;
        this.showInterface();
        //graphics creation
        this.graphics = this.add.graphics({lineStyle:  {width: 1, color: "0xffffff"} }) 
        //ui
        this.gameplayUI = new GameplayUI(this,0,0);
        
        this.listenToGameplayEvents();

        //watch
        this.watch = new Time(this);
        //this.watch.setUpWatch(this.gameplayUI.timeIcon.label).startWatch(this.gameplayUI.timeIcon.label);
        //game
        this.anomalyHunter.newGame();
        //events
        this.beginRound();
        this.handleClickEvent();
        this.handleDragEvent();
        this.handleDropEvent();
        setTimeout(()=>{

        }, 5000);
 
        //instantiate each display textbox
        this.regularCardTextbox = new RegularCardTextbox(this);
      //  this.anomalyTextbox = new AnomalyTextbox(this);
       // this.timeAgentTextbox = new TimeAgentTextbox(this);
        //events
       
    }
    
    beginRound(){
        //display Round 1
        this.gameplayUI.createNewTurnMessage(1);
        //remove message after 2 sec
        //and send anomaly card down from outworld
        setTimeout(()=>{
            this.gameplayUI.hideMessage();
            const command = new OutworldToAnomaly(this);
            this.commandHandler.execute(command);
        }, 2000)
        //send cards to Hand afterward
        setTimeout(()=>{
            const otherCommand = new MultipleDeckToHand(this);
            this.commandHandler.execute(otherCommand); 
        }, 3500)
    }
    update(time, delta){
       // this.adjustInGameTextDisplayRate(delta);
       this.gameplayUI.update(time, delta);
    }
}