import {Turn } from "./Turn.js";

export class Turn1 extends Turn{
    
    solveObjectivesWith(card){
        if(card.getData("title")=== this.CARD_TITLES.PAST_CARD){
            this.preloadScene.audio.play(this.preloadScene.audio.solveObjectiveSound);
            this.anomalyPile.scroll.checkBox(0);
        }
        else if(card.getData("title") === this.CARD_TITLES.PRESENT_CARD){
            this.preloadScene.audio.play(this.preloadScene.audio.solveObjectiveSound);
            this.anomalyPile.scroll.checkBox(1); 
        }
        else if(card.getData("title") === this.CARD_TITLES.FUTURE_CARD){
            this.preloadScene.audio.play(this.preloadScene.audio.solveObjectiveSound);
            this.anomalyPile.scroll.checkBox(2);
        }
        else if(card.getData("title") === this.CARD_TITLES.TIME_AGENT){
            if(card.getData("level") === "EXPERT"){
                this.preloadScene.audio.play(this.preloadScene.audio.solveObjectiveSound);
                this.anomalyPile.scroll.checkBox(0);
                setTimeout(()=>{ this.anomalyPile.scroll.checkBox(1); }, 200)
                setTimeout(()=>{ this.anomalyPile.scroll.checkBox(2); }, 400)
            }
        }
        else if(card.getData("title") === this.CARD_TITLES.TIME_THIEF){
           // alert("olè!!!");
        }
        else{
            alert("no title");
        }
        this.checkAnomalyResolved();
    }
}