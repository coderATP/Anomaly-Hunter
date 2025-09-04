import { Turn } from "./Turn.js";

export class Turn7 extends Turn{
    constructor(scene){
        super(scene);
    }
    
    executeFirstAction(card){
      
        if(card.getData("title") !== this.CARD_TITLES.TIME_THIEF &&
            this.playScene.registry.get("turn7_canProceed") === undefined){
                this.preloadScene.audio.play(this.preloadScene.audio.errorSound);
                alert("Play a Jack to proceed.");
                return;
        }
        if(card.getData("title") === this.CARD_TITLES.TIME_THIEF){
            this.playScene.registry.set("turn7_canProceed", 1);
            this.playScene.registry.inc("turn7_cardCounts", 1);
        }
        //if only one card has been played and is valid, check first box and play the sound
        if(this.playScene.registry.get("turn7_cardCounts") === 1){
            if(card.getData("title") === this.CARD_TITLES.TIME_THIEF ){
                this.preloadScene.audio.play(this.preloadScene.audio.solveObjectiveSound);
                this.anomalyPile.scroll.checkBox(0);
            }
            else{ return; }
        } 
    }
    executeSecondAction(card){
        if( this.playScene.registry.set("turn7_cardCounts" === 2) ){

            if( card.getData("title") === this.CARD_TITLES.TIME_AGENT ){
                this.playScene.registry.inc("turn7_nextCheckboxProgress", 1);
            }
        }
        else { return; }
    }
    
    finishRound(){
        if(this.playScene.registry.get("turn7_nextCheckboxProgress") >= 1){
            this.preloadScene.audio.play(this.preloadScene.audio.solveObjectiveSound);
            this.anomalyPile.scroll.checkBox(1);
        }
        setTimeout(()=>{ this.checkAnomalyResolved(); }, 100)
    }
    solveObjectivesWith(card){
        
        this.playScene.registry.set("currentTurnIndex", 6);
        this.executeFirstAction(card);
        
        const canProceed = this.playScene.registry.get("turn7_canProceed");
        if (canProceed) {
            this.executeSecondAction(card);
        }
        if (canProceed >= 7) {
            alert("WARNING⚠️  You have already played " + arrayOfCardsPlayed.length + " cards");
        }
        this.finishRound();
    }
}