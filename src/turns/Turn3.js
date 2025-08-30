import { Turn } from "./Turn.js";

export class Turn3 extends Turn{
    constructor(scene){
        super(scene);
        this.pastCardsDealt = 0;
        this.presentCardsDealt = 0;
        this.futureCardsDealt = 0;
    }

    solveObjectivesWith(card){
        if(card.getData("title")=== CARD_TITLES.PAST_CARD){
            this.pastCardsDealt++;
            if(this.pastCardsDealt >= 2){
                this.checkAnEmptyBox();
            }
        }
        else if(card.getData("title") === CARD_TITLES.PRESENT_CARD){
            this.presentCardsDealt++;
            if(this.presentCardsDealt>= 2) {
                this.checkAnEmptyBox();
            } 
        }
        else if(card.getData("title") === CARD_TITLES.FUTURE_CARD){
            this.futureCardsDealt++;
            if(this.futureCardsDealt >= 2) {
                this.checkAnEmptyBox();
            }
        }
        else if(card.getData("title") === CARD_TITLES.TIME_AGENT){
            if(card.getData("category") === "Expert"){
               /* this.anomalyPile.scroll.checkBox(0);
                setTimeout(()=>{ this.anomalyPile.scroll.checkBox(1); }, 200)
                setTimeout(()=>{ this.anomalyPile.scroll.checkBox(2); }, 400)*/
            }
        }
        else if(card.getData("title") === CARD_TITLES.TIME_THIEF){
            //alert("olè!!!");
        }
        this.checkAnomalyResolved();
    }
}