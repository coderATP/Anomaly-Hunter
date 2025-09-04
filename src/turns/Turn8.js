import { Turn } from "./Turn.js";

export class Turn8 extends Turn{
    playFirstValidCard(card){
        if( (card.getData("title") === this.CARD_TITLES.TIME_THIEF || card.getData("title") === this.CARD_TITLES.TIME_AGENT)&&
                this.playScene.registry.get("turn8_canProceed") === undefined){
                    alert("Play any non-face card (2-10) to proceed.");
                    return;
        }
        //create a 9-object container for each of the non-face cards (2-10)
        //card2 sits at index 0, ..., card10 sits at index 8
        this.cards = this.playScene.registry.get("turn8_allCards");
        this.cards.forEach((c, i) => {
            if (card.getData("value") === i+2){
                this.cards[i].value++;
                if(this.cards[i].value >= 2 && this.cards[i].resolved === false){
                    this.cards[i].resolved = true;
                    this.checkAnEmptyBox();
                    this.preloadScene.audio.play(this.preloadScene.audio.solveObjectiveSound);
                }
            }
        })
    }
    solveObjectivesWith(card){
        this.playScene.registry.set("currentTurnIndex", 7);
        this.playFirstValidCard(card);
        setTimeout(()=>{ this.checkAnomalyResolved(); }, 100)
    }
}