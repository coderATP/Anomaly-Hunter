/**@type {import("../typings/phaser")} */
import { BaseScene } from "./BaseScene.js";
import { eventEmitter } from "../events/EventEmitter.js";
//messages
import { TurnEndedMessage, GoToNextAnomalyMessage } from "../entities/TurnEndedMessage.js";
    
export class GoToNextAnomalyScene extends BaseScene{
    constructor(config){
        super("GoToNextAnomalyScene", config);
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
        this.goToNextAnomalyMessage.buttons.back.hitArea.once("pointerdown", ()=>{
            this.goingBackInTime = false;
            if(this.goingBackInTime) return;
            this.goToNextAnomalyMessage.hide();
            this.scene.start("TurnEndedScene");
            this.goingBackInTime = true;
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
    }
    
    update(time, delta){
        //update the font size of the message
        Object.values(this.goToNextAnomalyMessage.buttons).forEach(btn=>{ btn.updateFontSize(time, delta); })
    }
    
    initEvents(){
       
    }
}