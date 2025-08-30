import { eventEmitter } from "../events/EventEmitter.js";

const CARD_TITLES = {
    PAST_CARD: "Past Card",
    PRESENT_CARD: "Present Card",
    FUTURE_CARD: "Future Card",
    TIME_AGENT: "Time Agent",
    TIME_THIEF: "Time Thief"
};


export class Turn{
    constructor(scene){
        this.scene = scene;
        const { PreloadScene, TurnEndedScene, PlayScene } = scene.game.scene.keys;
        this.turnEndedScene = TurnEndedScene;
        this.preloadScene = PreloadScene;
        this.playScene = PlayScene;
        const { hand, anomalyPile } = scene.gameplayUI;
      
        this.anomalyPile = anomalyPile;
        this.hand = hand;
        this.solvedObjectives = 0;
        this.CARD_TITLES = CARD_TITLES;
    }
    
    checkAnomalyResolved(){
        this.anomalyPile.scroll.checkboxGraphics.forEach((g)=>{
            if(g.name !== "") this.solvedObjectives++;
        })
        if(this.solvedObjectives=== this.anomalyPile.scroll.checkboxGraphics.length){
            eventEmitter.emit("TURN_ENDED");
        }
        this.turnEndedScene.turnEndedMode = false;
        
        eventEmitter.on("TURN_ENDED", ()=>{
            if(this.turnEndedScene.turnEndedMode) return;
            if(!this.scene.scene.isPaused("PlayScene")){
                setTimeout(()=>{ this.scene.scene.pause(); }, 610);
                this.scene.scene.launch("TurnEndedScene");
                this.turnEndedScene.turnEndedMode = true;
            }
        })
    }
    checkAnEmptyBox(){
        for(let i = 0; i < this.anomalyPile.scroll.checkboxGraphics.length; ++i){
            const graphics = this.anomalyPile.scroll.checkboxGraphics[i];
            if(!graphics.checked){
                this.preloadScene.audio.play(this.preloadScene.audio.solveObjectiveSound);
                this.anomalyPile.scroll.checkBox(i);
                break;
            }
        }
    }
}