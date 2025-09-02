import { Turn } from "./Turn.js";

export class Turn6 extends Turn{
    constructor(scene){
        super(scene);
    }
    
    executeFirstAction(card){
      
        if( ( ( card.getData("title") === this.CARD_TITLES.TIME_THIEF) )&&
                this.playScene.registry.get("turn6_canProceed") === undefined){
                    alert("Play any non-face card (2-10) or a Time Agent to proceed.");
                    return;
        }
        if((card.getData("value") <= 10) || card.getData("title") === this.CARD_TITLES.TIME_AGENT){
            this.playScene.registry.set("turn6_canProceed", 1);
            this.playScene.registry.inc("turn6_cardCounts", 1);
            
            if(card.getData("title") === this.CARD_TITLES.TIME_AGENT){
                const cardAttributes = {value: "wild", suit: "wild" }
                this.playScene.registry.get("turn6_cardsInfo").push(cardAttributes);
            }
            else{
                const cardAttributes = {value: card.getData("value"), suit: card.getData("suit") }
                this.playScene.registry.get("turn6_cardsInfo").push(cardAttributes);
            }
        }
        //if only one card has been played and is valid, check first box and play the sound
        if(this.playScene.registry.get("turn6_cardCounts") === 1){
            this.preloadScene.audio.play(this.preloadScene.audio.solveObjectiveSound);
            this.anomalyPile.scroll.checkBox(0);
        } 
    }
    executeNextAction(card,  boxIndexToTick){
        const arrayOfCardsPlayed = this.playScene.registry.get("turn6_cardsInfo")
        const newCard = arrayOfCardsPlayed[arrayOfCardsPlayed.length-1] // same as 'card'
        const previousCard = arrayOfCardsPlayed[arrayOfCardsPlayed.length - 2];

        if(previousCard.suit !== "wild"){

            if(newCard.suit === previousCard.suit || newCard.suit === "wild"){
                this.playScene.registry.inc("turn6_nextCheckboxProgress", 1);
                this.anomalyPile.scroll.checkBox(boxIndexToTick);
                this.preloadScene.audio.play(this.preloadScene.audio.solveObjectiveSound);
            }
            else{
                arrayOfCardsPlayed.pop();
                this.preloadScene.audio.play(this.preloadScene.audio.errorSound);
                alert("The card (" +newCard.suit +") you just played isn't the same suit as the first card ("+arrayOfCardsPlayed[0].suit+")");
                return;
            }
        }
        else{
           this.playScene.registry.inc("turn6_nextCheckboxProgress", 1);
           this.anomalyPile.scroll.checkBox(boxIndexToTick);
           this.preloadScene.audio.play(this.preloadScene.audio.solveObjectiveSound);
        }
    }
    
    finishRound(){
        if(this.playScene.registry.get("turn6_nextCheckboxProgress") >= 2){
            this.preloadScene.audio.play(this.preloadScene.audio.solveObjectiveSound);
            this.anomalyPile.scroll.checkBox(1);
        }
        setTimeout(()=>{ this.checkAnomalyResolved(); }, 100)
    }
    solveObjectivesWith(card){
        
        this.playScene.registry.set("currentTurnIndex", 3);
        this.executeFirstAction(card);
        
        const arrayOfCardsPlayed = this.playScene.registry.get("turn6_cardsInfo");
        if(arrayOfCardsPlayed.length === 2){
            this.executeNextAction(card, 1);
        }
        if (arrayOfCardsPlayed.length === 3) {
            this.executeNextAction(card, 2);
        }
        if (arrayOfCardsPlayed.length > 3) {
            this.executeNextAction(card, 3);
        }
        if (arrayOfCardsPlayed.length >= 7) {
            alert("WARNING⚠️  You have already played " + arrayOfCardsPlayed.length + " cards");
        }
        this.finishRound();
    }
}