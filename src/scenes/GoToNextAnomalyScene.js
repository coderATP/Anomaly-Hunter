/**@type {import("../typings/phaser")} */
import { BaseScene } from "./BaseScene.js";
import { eventEmitter } from "../events/EventEmitter.js";
//messages
import { TurnEndedMessage, GoToNextAnomalyMessage } from "../entities/TurnEndedMessage.js";
//Movements
import { AnomalyToResolved } from "../movements/AnomalyToResolved.js";
import { OutworldToAnomaly } from "../movements/OutworldToAnomaly.js";
import { MultipleHandToDeck } from "../movements/MultipleHandToDeck.js";
import { DeckToHand } from "../movements/DeckToHand.js";

export class GoToNextAnomalyScene extends BaseScene{
    constructor(config){
        super("GoToNextAnomalyScene", config);
        this.config = config;
        this.turnEndedMode = false;
        this.recycling = false;
        this.retaining = false;
    }
    
    destroyEvents(){
       // eventEmitter.destroy("MenuToOptions");
    }
    
    enter(){
        this.destroyEvents();
       // this.hideAllScreens();
        //this.showOne(this., "grid", 0);
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
            this.hideMessageAndResumePlayScene()
                .then(value=> { return this.getDPReward() } )
                .then(value=>{ return this.recycleRemainingCards() })
                .then(value=>{ return this.getRPReward() })
                .then(value=>{ return this.carryOutOtherTasks() })
            //get rewarded
            this.recycling = false;
        })
        
        this.goToNextAnomalyMessage.buttons.retain.hitArea.once("pointerdown", ()=>{
            this.retaining = true;
            if(!this.retaining) return;
            //hide message and carry out the remaining tasks
            this.hideMessageAndResumePlayScene()
                .then(value=>{ return this.getDPReward() })
                .then(value=>{ return this.carryOutOtherTasks() })
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
            setTimeout(()=>{
                resolve( this.goToNextAnomalyMessage.hide() );
            }, 100)
        })
    }
    //STEP 2: resume play scene
    resumePlayScene(){
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                resolve( this.scene.resume("PlayScene") );
            }, 10);
        })
    }
     //STEP 2:
    //recycle cards in hand if user wants so:
    recycleRemainingCards(){
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                const command = new MultipleHandToDeck(this.playScene);
                resolve( this.playScene.commandHandler.execute(command) ); 
            }, 1000)
        })
    }
    //STEP 3: 
    //get rewarded with x RP and 3 DP
    //where x = number of cards recycled
    getDPReward(){
        const { DPText, DPRect} = this.playScene.gameplayUI;
        const newPoints = parseInt(DPText.text) + 3;

        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                resolve( DPText.setText(newPoints) );
                resolve( DPText.setPosition(DPRect.centerX - DPText.displayWidth/2, DPRect.bottom - DPText.height - 10) );
            }, 500)
        })
    }
    getRPReward(){
        const { RPText, RPRect} = this.playScene.gameplayUI;
        const newPoints = parseInt(RPText.text) + this.numberOfOccupiedContainers;
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                resolve( RPText.setText(newPoints) );
                resolve( RPText.setPosition(RPRect.centerX - RPText.displayWidth/2, RPRect.bottom - RPText.height - 10) );
            }, 500)
        })
    }
    //STEP 3: 
    // send resolved anomaly to resolved pile
    castResolvedAnomalyOut(){
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                const command = new AnomalyToResolved(this.playScene)
                resolve( this.playScene.commandHandler.execute(command) )
            }, 1000)
        })
    }
    //STEP 4:
    //send next anomaly down
    sendNextAnomalyDown(){
        return new Promise((resolve, reject)=>{
            const command = new OutworldToAnomaly(this.playScene);
            setTimeout(()=>{
                resolve( this.playScene.commandHandler.execute(command) )
            }, 500);
        })
    }
    //STEP 5:
    //shuffle deck
    shuffleDeck(){
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                const { deck } = this.playScene.gameplayUI.piles;
                resolve( this.preloadScene.audio.shuffleSound.play() );
                resolve( deck.container.shuffle() );
            }, 1000)
        })
    }
    //STEP 6:
    //send cards to hand
    sendCardsToHand(){
        return new Promise((resolve, reject)=>{
            let num = this.numberOfOccupiedContainers;
            const numberOfCardsToDeal = 5 - num;
            setTimeout(()=>{ 
                const command = new DeckToHand(this.playScene, numberOfCardsToDeal);
                resolve( this.playScene.commandHandler.execute(command) )
            }, 1200);
        })
    }
    
    async hideMessageAndResumePlayScene(){
        await this.hideMessage();
        await this.resumePlayScene();
    }

    async carryOutOtherTasks(){
        await this.castResolvedAnomalyOut();
        await this.sendNextAnomalyDown();
        await this.shuffleDeck();
        await this.sendCardsToHand();
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