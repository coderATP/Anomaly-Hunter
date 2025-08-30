import { BaseScene } from "./BaseScene.js";
//command handler for card movements
import { CommandHandler } from "../CommandHandler.js";
//movements
import { DeckToHand } from "../movements/DeckToHand.js";
import { OutworldToAnomaly } from "../movements/OutworldToAnomaly.js";
import { HandToVacant } from "../movements/HandToVacant.js";
import { VisitorToHost } from "../movements/VisitorToHost.js";
import { HandToDiscard } from "../movements/HandToDiscard.js";

import { HandsOfTime } from "../HandsOfTime.js";
import { eventEmitter } from "../events/EventEmitter.js";
import { Time } from "../events/Time.js";

import { GameplayUI } from "../ui/GameplayUI.js";

//text boxes
import { RegularCardTextbox } from "../entities/textboxes/RegularCardTextbox.js";
import { AnomalyTextbox } from "../entities/textboxes/AnomalyTextbox.js";
//states
import { ResolveState, RecallState, DiscardState, SwapState, EndState} from "../states/gameplayButtons/ButtonStates.js";
import { DeckClickState } from "../states/DeckClickState.js";
//progress messages
import { Turn1Progress } from "../turns/progress_messages/Turn1Progress.js";


export class PlayScene extends BaseScene{
    constructor(config){
        super("PlayScene", config);
        this.config = config;
        this.commandHandler = new CommandHandler(this);
        this.handsOfTime = new HandsOfTime(this);
        this.textDisplayTimer = 0;
        this.textDisplayInterval = 2300;
        this.canDrawACard = false;
    }
    initRegistry(){
        this.registry.set("pastCardsDealt", 0);
        this.registry.set("presentCardsDealt", 0);
        this.registry.set("futureCardsDealt", 0);
        
        this.registry.set("pastPairHasSolvedAnomaly", 0);
        this.registry.set("presentPairHasSolvedAnomaly", 0);
        this.registry.set("futurePairHasSolvedAnomaly", 0);
        
        this.registry.set("pastTrioHasSolvedAnomaly", 0);
        this.registry.set("presentTrioHasSolvedAnomaly", 0);
        this.registry.set("futureTrioHasSolvedAnomaly", 0);
 
    }
    showInterface(){
        this.initRegistry();
        this.hideAllScreens();
        this.showOne(this.playScreen, "grid", -1);
        this.backgroundImage = this.add.image(0,0, "background1").setOrigin(0);
        this.backgroundImage.setDisplaySize(this.config.width, this.config.height).setDepth(-1);
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
        const zone = this.add.zone(x, y, w, h).setRectangleDropZone(w, h)
        .setName(zoneType).setOrigin(0);
        if(this.config.debug){
            this.add.rectangle(x, y, w, h, 0x09144ff, 0.0).setDepth(0).setOrigin(0);
        }
        return zone;
    }
    
    handleDragEvent(){
        const { hand } = this.gameplayUI;
        this.input.on("dragstart", (pointer, gameobject, dragX, dragY)=>{
            let card = gameobject&& gameobject.type === "Image" ? gameobject : null;
            if(!card) return;
            let zoneType = card.getData("zone");
            switch(zoneType){
                case "hand":{
                    //hide box when dragging
                    this.regularCardTextbox.infoDisplayTimer = this.regularCardTextbox.infoDisplayInterval;
                    break;
                }
            } 
        }) 
        this.input.on("drag", (pointer, gameobject, dragX, dragY)=>{
            let card = gameobject&& gameobject.type === "Image" ? gameobject : null;
            if(!card) return;
            let zoneType = card.getData("zone");
            switch(zoneType){
                case "hand":{
                    card.setPosition(dragX, dragY);
                    //hide box when dragging
                    this.regularCardTextbox.infoDisplayTimer = this.regularCardTextbox.infoDisplayInterval;
                    break;
                }
            } 
        });
        this.input.on("dragend", (pointer, gameobject, dropped)=>{
           //for invalid moves, snap back to original location
           let card = gameobject&& gameobject.type === "Image" ? gameobject : null;
           if(!card) return; 
           let zoneType = card.getData("zone"); 
           const sourcePileIndex = card.getData("index");
           const sourceContainer = hand.containers[sourcePileIndex]; 
           
           switch(zoneType){
               case "hand":{
                   //rough movement
                   //if(!dropped) hand.handleMoveCardToWrongSpace(gameobject);
                   //smooth movement
                   if(!dropped){
                       const command = new HandToVacant(this, sourceContainer, sourceContainer);
                       this.commandHandler.execute(command);  
                   }
                     
               break;
               }
               default:{ break; }
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
                    if(sourcePileIndex===targetPileIndex){
                        //rough movement
                         //card.setPosition(0,0);
                        //smooth movement
                        const command = new HandToVacant(this, sourceContainer, sourceContainer);
                        this.commandHandler.execute(command); 
                    }
                    else{
                        //if target container is vacant , move
                        if(!targetContainer.length){
                            const command = new HandToVacant(this, sourceContainer, targetContainer);
                            this.commandHandler.execute(command); 
                        }
                        //if target container is occupied, swap
                        else{
                            const command = new VisitorToHost(this, sourceContainer, targetContainer);
                            this.commandHandler.execute(command); 
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
    
    resolveAnomaly(){
        this.gameplayUI.resolveBtn.hitArea.on('pointerdown', ()=>{
            this.resolving = false;
            if(this.resolving) return;
            //enter resolve button state
            new ResolveState(this).enter();
            const {hand} = this.gameplayUI;
            hand.containers.forEach((container, i)=>{
                if(container.length){
                    container.list.forEach(card=>{
                        card.on("pointerdown", ()=>{
                            if(!this.gameplayUI.resolveBtn.active) return; 
                            const command = new HandToDiscard(this, container);
                            this.commandHandler.execute(command);
                        })
                    })
                }
            })
            this.resolving = true;
        })
    }
    recallLastAction(){
        this.gameplayUI.recallBtn.hitArea.on('pointerdown', ()=>{
            this.recalling = false;
            if(this.recalling) return;
            //enter recall button state
            new RecallState(this).enter();
            this.recalling = true;
        })
    }
    manuallyDealFromDeck(){
        if(!this.canDrawACard){
            this.canDrawACard = true;
            new DeckClickState(this).enter();
            this.drawACardFromDeck()
                .then(value => { return this.reduceDP() })
            setTimeout(()=>{ this.canDrawACard = false; }, 1000)
        }
        /*else{ 
            console.log("Wait a second before drawing another card")
        }*/
    }
    swapWithDeck(){
        this.gameplayUI.swapBtn.hitArea.on('pointerdown', ()=>{
            this.swapping = false;
            if(this.swapping) return;
            //enter swap button state
            new SwapState(this).enter();
            this.swapping = true;
        })
    }
    discardAHand(){
        this.gameplayUI.discardBtn.hitArea.on('pointerdown', ()=>{
            this.discarding = false;
            if(this.discarding) return;
            //enter diacard button state
            new DiscardState(this).enter();
            this.discarding = true;
        })
    }
    endTurn(){
        this.gameplayUI.endBtn.hitArea.on('pointerdown', ()=>{
            this.ending = false;
            if(this.ending) return;
            //enter resolve button state
            new EndState(this).enter();
            this.ending = true;
        })
    }
    
    handleClickEvent(){
        //hand card clicked
        const { hand } = this.gameplayUI;
        //enter states for each of the five buttons
        //Resolve, Recall, Discard, Swap and End
        this.resolveAnomaly();
        this.recallLastAction();
        this.discardAHand();
        this.swapWithDeck();
        this.endTurn();
        //turn ended message buttons (back and next)
        this.input.on("pointerdown", (pointer, gameobject)=>{
            if(!gameobject[0]) return;
            //I'm tapping on a card image
            if(gameobject[0].type === "Image"){
                
                const zoneType = gameobject[0].getData("zone");
                const card = gameobject[0];
                switch(zoneType){
                        //drag event is very sensitive, it triggers at the slightest drag on the card
                        //to prevent textbox from disappearing immediately after pointerdown event,
                        //only display it after 50 milliseconds
                        //if drag function needs to kick in, it will have done so before 50 ms 
                    case "hand":{
                        //display if none of the gameplay buttons is in active state
                        let numberOfActiveButtons = 0;
                        this.gameplayUI.gameplayButtons.forEach(btn=>{
                            if(btn.active) numberOfActiveButtons++;
                        })
                        if(numberOfActiveButtons === 0)
                            setTimeout(()=>{ this.regularCardTextbox.show(card) }, 50) 
                    break;
                    }
                    case "anomaly":{
                        setTimeout(()=>{ this.anomalyTextbox.show(card) }, 50)
                    break;
                    }
                    case "deck":{
                        this.manuallyDealFromDeck();
                        
                    break;
                    }
                    case "discard":{
                      //  alert("discard")
                    break;
                    }
                    default:{ break; }
                }
            }
            else{ console.log("you're clicking on a " + gameobject[0].type + " gameobject")}
        })
        return this;
        
    }
    //STEPS involved in drawing card from deck
    //step 1: pick a card
    drawACardFromDeck(){
        const { DPText, hand } = this.gameplayUI;
        
        return new Promise((resolve, reject) => {
            const newPoints = parseInt(DPText.text);
            let targetContainer;
            
            for(let i = 0; i < hand.containers.length; ++i){
                const container = hand.containers[i];
                if(!container.length){
                    targetContainer = hand.containers[i];
                    break;
                }
            }
            if(!targetContainer && newPoints < 1) reject("No empty containers AND you do not have enough Draw Points");
            else if(newPoints < 1) reject("You do not have enough Draw Points");
            else if(!targetContainer) reject("You do not have an empty Hand");
            else{
                const command = new DeckToHand(this, 1);
                resolve( this.commandHandler.execute(command) );
                resolve( this.preloadScene.audio.drawSound.play() );
            }
                
        })
      
    }
    //reduce draw points by 1
    reduceDP(){
        const { DPText, DPRect, hand} = this.gameplayUI;
       
        //if there's no vacant container to deal into, return early
        //if there are no draw points available to player, return early
            //console.log(targetContainer, newPoints)
        return new Promise((resolve, reject)=>{
            
            setTimeout(()=>{
                let newPoints = parseInt(DPText.text) - 1;
                if(newPoints < 0){
                    reject("You do not have enough DPs");
                }
                else{
                    resolve( DPText.setText(newPoints) );
                    resolve( DPText.setPosition(DPRect.centerX - DPText.displayWidth/2, DPRect.bottom - DPText.height - 10) );
                }
            }, 30)
        })
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
    //old school array shufling method 
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
    getCardDimensions(){
        let card = this.createCard("null", 0,0);
        const originalWidth = card.displayWidth;
        const originalHeight = card.displayHeight;
        card.destroy();
        card = null;
        return {originalWidth, originalHeight}
    } 
    //STEPS in beginning first round
    //step 1
    showNewTurnMessage(){
        return new Promise((resolve, reject) => {
            resolve( this.gameplayUI.createNewTurnMessage(1) );
        })
    }
    //step 2
    sendAnomalyCardFromOutworld(){
        return new Promise((resolve, reject)=>{
            //remove message after 2 sec
            //and send anomaly card down from outworld
            setTimeout(()=>{
                const command = new OutworldToAnomaly(this);
                resolve( this.commandHandler.execute(command) );
                resolve( this.gameplayUI.hideMessage() )
            }, 2000)
        })
    }
    //step 3
    //addProgressMessage
    addProgressMessage(){
        return new Promise((resolve, reject) => {
            setTimeout(()=>{
                this.progressMessage = new Turn1Progress(this).add();
                resolve( this.progressMessage.add() )
            }, 800)

        })
    }
    sendCardsToHand(){
        return new Promise((resolve, reject) => {
            //send cards to Hand afterward
            setTimeout(()=>{
                const command = new DeckToHand(this, 5);
                this.commandHandler.execute(command); 
            }, 2000)
        })
    }
    beginFirstRound(){
        this.showNewTurnMessage()
            .then(value=> { return this.sendAnomalyCardFromOutworld() })
            .then(value=> { return this.addProgressMessage() })
            .then(value=>{ return this.sendCardsToHand() })
    }

    create(){
        const { PreloadScene } = this.game.scene.keys;
        this.preloadScene = PreloadScene;
        this.showInterface();
        //graphics creation
        this.graphics = this.add.graphics({lineStyle:  {width: 1, color: "0xffffff"} }) 
        //ui
        this.gameplayUI = new GameplayUI(this,0,0);
        //watch
        this.watch = new Time(this);
        //this.watch.setUpWatch(this.gameplayUI.timeIcon.label).startWatch(this.gameplayUI.timeIcon.label);
        //game
        this.handsOfTime.newGame();
        this.beginFirstRound();
        //events
        this.handleClickEvent().handleDragEvent().handleDropEvent();
 
        //instantiate each display textbox
        this.regularCardTextbox = new RegularCardTextbox(this);
        this.anomalyTextbox = new AnomalyTextbox(this);
       // this.timeAgentTextbox = new TimeAgentTextbox(this);
        //events
       
    }
    
    update(time, delta){
        this.regularCardTextbox.displayCardInfo(delta);
        this.anomalyTextbox.displayCardInfo(delta);
        this.gameplayUI.update(time, delta);
    }
}