/**@type {import("../typings/phaser")} */
import { BaseScene } from "./BaseScene.js";
import { eventEmitter } from "../events/EventEmitter.js";

//Movements
import { AnomalyToResolved } from "../movements/AnomalyToResolved.js";
import { OutworldToAnomaly } from "../movements/OutworldToAnomaly.js";
import { MultipleHandToDeck } from "../movements/MultipleHandToDeck.js";
import { DeckToHand } from "../movements/DeckToHand.js";
import { RecycleMovement } from "../movements/RecycleMovement.js";
//messages
import { TurnEndedMessage, GoToNextAnomalyMessage } from "../entities/TurnEndedMessage.js";
  
export class GoToNextAnomalyScene extends BaseScene{
    constructor(config){
        super("GoToNextAnomalyScene", config);
        this.config = config;
        this.turnEndedMode = false;
        this.recycling = false;
        this.retaining = false;
    }
    
    destroyEvents(){
    }
    
    enter(){
        this.destroyEvents();
    }
    
    goBackInTime(){
        this.goToNextAnomalyMessage.buttons.back.hitArea.once("pointerdown", ()=>{
            this.goingBackInTime = false;
            if(this.goingBackInTime) return;
            this.goToNextAnomalyMessage.hide();
            this.scene.start("TurnEndedScene");
            this.goingBackInTime = true;
        })
    }
    
    startNextTurn(){
        const { deck  } = this.playScene.gameplayUI.piles;
        
        this.goToNextAnomalyMessage.buttons.recycle.hitArea.once("pointerdown", ()=>{
            this.recycling = true;
            if(!this.recycling) return;
            //hide message, recycle remaining cards left in hand and then carry out the remaining tasks
            
            this.toNextScene();
            
            //get rewarded
            this.recycling = false;
        })
        
        this.goToNextAnomalyMessage.buttons.retain.hitArea.once("pointerdown", ()=>{
            this.retaining = true;
            if(!this.retaining) return;
            //hide message and carry out the remaining tasks
            this.retaining = false;
        })
    }
    
    get numberOfOccupiedContainers(){
        let num = 0;
        const { hand  } = this.playScene.gameplayUI.piles;
        for(let i = 0; i < hand.containers.length; ++i){
            const container = hand.containers[i];
            if(container.length) num++;
        }
        return num;
    }
    //STEP 1: hide message
    hideMessage(){
        return new Promise((resolve, reject)=>{
            this.goToNextAnomalyMessage.hide();
            this.time.delayedCall(100, resolve);
        })
    }
    //STEP 2: resume play scene
    resumePlayScene(){
        return new Promise((resolve, reject)=>{
            this.scene.resume("PlayScene");
            this.playScene.initRegistry();
            this.time.delayedCall(100, resolve);
        })
    }
     //STEP 2:
    //recycle cards in hand if user wants so:
    recycleRemainingCards(){
        return new Promise((resolve, reject)=>{
            const command = new MultipleHandToDeck(this.playScene);
            this.playScene.commandHandler.execute(command)
            this.time.delayedCall(500, resolve);
        })
    }
    //STEP 3: 
    //get rewarded with x RP and 3 DP
    //where x = number of cards recycled
    getDPReward(){
        return new Promise((resolve, reject)=>{
            const { DPText, DPRect} = this.playScene.gameplayUI;
            const newPoints = parseInt(DPText.text) + 3;
            DPText.setText(newPoints);
            DPText.setPosition(DPRect.centerX - DPText.displayWidth/2, DPRect.bottom - DPText.height - 10);
            this.time.delayedCall(250, resolve);
        })
    }
    getRPReward(){
        const { RPText, RPRect} = this.playScene.gameplayUI;
        const newPoints = parseInt(RPText.text) + this.numberOfOccupiedContainers;
        return new Promise((resolve, reject)=>{
            RPText.setText(newPoints);
            RPText.setPosition(RPRect.centerX - RPText.displayWidth/2, RPRect.bottom - RPText.height - 10);
            this.time.delayedCall(250, resolve);
        })
    }
    //STEP 3: 
    // send resolved anomaly to resolved pile
    castResolvedAnomalyOut(){
        return new Promise((resolve, reject)=>{
            const command = new AnomalyToResolved(this.playScene)
            this.playScene.commandHandler.execute(command);
            this.time.delayedCall(600, resolve);
        })
    }
    //STEP 4:
    //send next anomaly down
    sendNextAnomalyDown(){
        return new Promise((resolve, reject)=>{
            const command = new OutworldToAnomaly(this.playScene);
            this.playScene.commandHandler.execute(command);
            this.time.delayedCall(400, resolve);
        })
    }
    //STEP 5:
    //shuffle deck
    shuffleDeck(){
        return new Promise((resolve, reject)=>{
            const { deck } = this.playScene.gameplayUI.piles;
            this.preloadScene.audio.shuffleSound.play();
            deck.container.shuffle();
            this.time.delayedCall(1000, resolve);
        })
    }
    //STEP 6:
    //send cards to hand
    sendCardsToHand(){
        return new Promise((resolve, reject)=>{
            let num = this.numberOfOccupiedContainers;
            const numberOfCardsToDeal = 5 - num;
            const command = new DeckToHand(this.playScene, numberOfCardsToDeal);
            this.playScene.commandHandler.execute(command);
            this.time.delayedCall(600, resolve);
        })
    }
    clearOldMessages(){
        return new Promise((resolve, reject) => {
            this.playScene.progressMessage.clearAll();
            this.time.delayedCall(100, resolve);
        })
    }

    async toNextScene(){
        await this.hideMessage();
        await this.clearOldMessages();
        await this.resumePlayScene();
        await this.getDPReward();
        await this.getRPReward();
        await this.recycleRemainingCards();
        await this.castResolvedAnomalyOut();
        await this.sendNextAnomalyDown();
 
        await this.shuffleDeck();
        await this.sendCardsToHand();
       // await this.createProgressMessage();
        // extra functions for level 3
        await this.shuffleDiscard();
        await this.recycleFromDiscard();
    }
    
    shuffleDiscard(){
        return new Promise((resolve, reject) => {
            const turnIndex = this.playScene.gameplayUI.anomalyPile.container.list[0].getData("level") - 1;
            
            if(turnIndex !== 2){
                this.time.delayedCall(1, resolve);
            }
            else{
                this.preloadScene.audio.shuffleSound.play();
                this.time.delayedCall(10, resolve);
            }

        })
    }
    recycleFromDiscard(){
        return new Promise((resolve, reject)=>{
            const turnIndex = this.playScene.gameplayUI.anomalyPile.container.list[0].getData("level") - 1;
            if(turnIndex !== 2) {
               // console.log("not yet level 3");
                this.playScene.time.delayedCall(1, resolve);
            }
            else{
                const command = new RecycleMovement(this.playScene);
                this.playScene.commandHandler.execute(command);
                this.time.delayedCall(1000, resolve);
            }
            
        })
    }
   
    create(){
        const { PreloadScene, PlayScene } = this.game.scene.keys;
        this.preloadScene = PreloadScene;
        this.playScene = PlayScene;
        this.goToNextAnomalyMessage = new GoToNextAnomalyMessage(this);
        this.goToNextAnomalyMessage.show();

        this.enter();
        this.initEvents();
        this.goBackInTime();
        this.startNextTurn();
    }
    
    update(time, delta){
        //update the font size of the message
        Object.values(this.goToNextAnomalyMessage.buttons).forEach(btn=>{ btn.updateFontSize(time, delta); })
    }
    
    initEvents(){
       
    }
}