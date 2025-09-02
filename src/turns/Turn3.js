import { Turn } from "./Turn.js";

export class Turn3 extends Turn{
    constructor(scene){
        super(scene);
        this.pastCardsDealt = 0;
        this.presentCardsDealt = 0;
        this.futureCardsDealt = 0;
    }
    
    solveObjectivesWith(card){
        this.playScene.registry.set("currentTurnIndex", 2);

        const suitToMatch = this.playScene.registry.get("recycledSuit");
        
        if(suitToMatch === undefined){
            alert("no saved data in the turn 3 suit registry");
            return;
        }
        if(card.getData("suit") === suitToMatch){
            this.playScene.registry.inc("turn3_suitToMatchCount", 1);
            const count = this.playScene.registry.get("turn3_suitToMatchCount");
            if(count >= 2){
                this.preloadScene.audio.play(this.preloadScene.audio.solveObjectiveSound);
                this.anomalyPile.scroll.checkBox(1);
            }
        }
        
        else if(card.getData("title") === this.CARD_TITLES.TIME_AGENT){
            if(card.getData("category") === "Expert"){
                this.preloadScene.audio.play(this.preloadScene.audio.solveObjectiveSound);
               this.anomalyPile.scroll.checkBox(1);
            }
        }
        else if(card.getData("title") === this.CARD_TITLES.TIME_THIEF){
            //alert("olè!!!");
        }
        else{ return; }
        this.checkAnomalyResolved();
    }
}