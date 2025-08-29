/**@type {import("../typings/phaser")} */
import { BaseScene } from "./BaseScene.js";
import { eventEmitter } from "../events/EventEmitter.js";
//messages
import { TurnEndedMessage, GoToNextAnomalyMessage } from "../entities/TurnEndedMessage.js";
    
export class TurnEndedScene extends BaseScene{
    constructor(config){
        super("TurnEndedScene", config);
        this.config = config;
        this.turnEndedMode = false;
   
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
        this.turnEndedMessage.buttons.back.hitArea.on("pointerdown", ()=>{
            this.goingBackInTime = false;
            if(this.goingBackInTime) return;
            
            this.goingBackInTime = true;
        })
    }
    goToNextAnomaly(){
        this.turnEndedMessage.buttons.next.hitArea.once("pointerdown", ()=>{
            this.goingToNextAnomaly = false;
            if(this.goingToNextAnomaly) return;
            this.turnEndedMessage.hide();
            this.scene.start("GoToNextAnomalyScene");
            this.goingToNextAnomaly = true;
        })
    }
    create(){
        const { PreloadScene, PlayScene } = this.game.scene.keys;
        this.preloadScene = PreloadScene;
        this.playScene = PlayScene;
        this.turnEndedMessage = new TurnEndedMessage(this);
        this.turnEndedMessage.show();

        this.enter();
        this.initEvents();
        this.preloadScene.audio.playerWinSound.play();

        this.goToNextAnomaly();
    }
    
    update(time, delta){
        //update the font size of the message
        Object.values(this.turnEndedMessage.buttons).forEach(btn=>{ btn.updateFontSize(time, delta); })
    }
    
    initEvents(){
       
    }
}