const CARD_TITLES = {
    PAST_CARD: "Past Card",
    PRESENT_CARD: "Present Card",
    FUTURE_CARD: "Future Card",
    TIME_AGENT: "Time Agent",
    TIME_THIEF: "Time Thief"
};

export class Turn2{
    constructor(scene){
        this.scene = scene;
        const { hand, anomalyPile} = scene.gameplayUI;
        this.anomalyPile = anomalyPile;
        this.hand = hand;
    }
    
    
    solveObjectivesWith(card){
        if(card.getData("title")=== CARD_TITLES.PAST_CARD){
            this.anomalyPile.scroll.checkBox(0);
        }
        else if(card.getData("title") === CARD_TITLES.PRESENT_CARD){
            this.anomalyPile.scroll.checkBox(1); 
        }
        else if(card.getData("title") === CARD_TITLES.FUTURE_CARD){
            this.anomalyPile.scroll.checkBox(2);
        }
        else if(card.getData("title") === CARD_TITLES.TIME_AGENT){
            if(card.getData("category") === "Expert"){
                this.anomalyPile.scroll.checkBox(0);
                setTimeout(()=>{ this.anomalyPile.scroll.checkBox(1); }, 200)
                setTimeout(()=>{ this.anomalyPile.scroll.checkBox(2); }, 400)
            }
        }
        else if(card.getData("title") === CARD_TITLES.TIME_THIEF){
            alert("olè!!!");
        }
    }
}