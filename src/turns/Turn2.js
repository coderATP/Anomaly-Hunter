import { Turn } from "./Turn.js";

export class Turn2 extends Turn{

    solveObjectivesWith(card){
        if(card.getData("title")=== this.CARD_TITLES.PAST_CARD){
            this.scene.registry.inc("pastCardsDealt", 1);
            if(this.scene.registry.get("pastCardsDealt") >= 2){
                if(this.scene.registry.get("pastPairHasSolvedAnomaly") === 0){
                    this.checkAnEmptyBox();
                    this.scene.registry.set("pastPairHasSolvedAnomaly", 1);
                }
            }
        }
        else if(card.getData("title") === this.CARD_TITLES.PRESENT_CARD){
            this.scene.registry.inc("presentCardsDealt", 1);
            if(this.scene.registry.get("presentCardsDealt") >= 2){
                if(this.scene.registry.get("presentPairHasSolvedAnomaly") === 0){
                    this.checkAnEmptyBox();
                    this.scene.registry.set("presentPairHasSolvedAnomaly", 1);
                }
            }
        }
        else if(card.getData("title") === this.CARD_TITLES.FUTURE_CARD){
            this.scene.registry.inc("futureCardsDealt", 1);
            if(this.scene.registry.get("futureCardsDealt") >= 2){
                if(this.scene.registry.get("futurePairHasSolvedAnomaly") === 0){
                    this.checkAnEmptyBox();
                    this.scene.registry.set("futurePairHasSolvedAnomaly", 1);
                }
            }
        }
        else if(card.getData("title") === this.CARD_TITLES.TIME_AGENT){
            if(card.getData("category") === "Expert"){
                this.anomalyPile.scroll.checkBox(0);
                setTimeout(()=>{ this.anomalyPile.scroll.checkBox(1); }, 200);
            }
        }
        else if(card.getData("title") === this.CARD_TITLES.TIME_THIEF){
            //alert("olè!!!");
        }
        console.log(this.scene.registry.get("pastCardsDealt"), this.scene.registry.get("presentCardsDealt"), this.scene.registry.get("futureCardsDealt"),);
        this.checkAnomalyResolved();
    }
}