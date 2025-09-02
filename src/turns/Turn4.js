import { Turn } from "./Turn.js";

export class Turn4 extends Turn{
    constructor(scene){
        super(scene);
    }
    
    executeFirstAction(card){
        if( ( (card.getData("value") < 4 &&
                card.getData("title") !== this.CARD_TITLES.TIME_AGENT) )&&
                this.playScene.registry.get("turn4_canProceed") === undefined){
                    alert("Play a Time Agent or any other card higher than 3 to proceed");
                    return;
        }
        if(card.getData("value") >=4 || card.getData("title") === this.CARD_TITLES.TIME_AGENT){
            this.playScene.registry.set("turn4_canProceed", 1);
            this.playScene.registry.inc("turn4_cardCounts", 1);
            
            if(card.getData("title") === this.CARD_TITLES.TIME_AGENT){
                const cardAttributes = {value: "wild", suit: "wild" }
                this.playScene.registry.get("turn4_cardsInfo").push(cardAttributes);
            }
            else{
                const cardAttributes = {value: card.getData("value"), suit: card.getData("suit") }
                this.playScene.registry.get("turn4_cardsInfo").push(cardAttributes);
            }
        }
        //if only one card has been played and is valid, check first box and play the sound
        if(this.playScene.registry.get("turn4_cardCounts") === 1){
            this.preloadScene.audio.play(this.preloadScene.audio.solveObjectiveSound);
            this.anomalyPile.scroll.checkBox(0);
        } 
    }
    executeSecondAction(card){
        const arrayOfCardsPlayed = this.playScene.registry.get("turn4_cardsInfo")
        const newCard = arrayOfCardsPlayed[arrayOfCardsPlayed.length-1] // same as 'card'
        const previousCard = arrayOfCardsPlayed[arrayOfCardsPlayed.length - 2];

        if(previousCard.value !== "wild"){

            if( (newCard.value < previousCard.value) && newCard.suit !== previousCard.suit ){
                this.playScene.registry.inc("turn4_nextCheckboxProgress", 1);
                this.preloadScene.audio.play(this.preloadScene.audio.solveObjectiveSound);
            }
        }
        else
           this.playScene.registry.inc("turn4_nextCheckboxProgress", 1);
    }
    executeThirdAction(card){
        const arrayOfCardsPlayed = this.playScene.registry.get("turn4_cardsInfo");
        const newCard = arrayOfCardsPlayed[arrayOfCardsPlayed.length-1] // same as 'card'
        const previousCard = arrayOfCardsPlayed[arrayOfCardsPlayed.length - 2];
        const firstCard = arrayOfCardsPlayed[arrayOfCardsPlayed.length - 3];
        
        if(previousCard.value !== "wild"){

            if( (newCard.value < previousCard.value) && (newCard.suit != previousCard.suit && newCard.suit != firstCard.suit && previousCard.suit != firstCard.suit) )
                this.playScene.registry.inc("turn4_nextCheckboxProgress", 1);
        }
        else
           this.playScene.registry.inc("turn4_nextCheckboxProgress", 1);
    }
    finishRound(){
        if(this.playScene.registry.get("turn4_nextCheckboxProgress") >= 2){
            this.preloadScene.audio.play(this.preloadScene.audio.solveObjectiveSound);
            this.anomalyPile.scroll.checkBox(1);
        }
        setTimeout(()=>{ this.checkAnomalyResolved(); }, 100)
    }
    solveObjectivesWith(card){
        
        this.playScene.registry.set("currentTurnIndex", 3);
        this.executeFirstAction(card);
        
        const arrayOfCardsPlayed = this.playScene.registry.get("turn4_cardsInfo");
        if(arrayOfCardsPlayed.length === 2){
            this.executeSecondAction(card);
        }
        if (arrayOfCardsPlayed.length >= 3) {
            const arrayOfCardsPlayed = this.playScene.registry.get("turn4_cardsInfo");
            this.executeThirdAction(card);
        }
        if (arrayOfCardsPlayed.length >= 7) {
            alert("WARNING⚠️  You have already played " + arrayOfCardsPlayed.length + " cards");
        }
        this.finishRound();
    }
}