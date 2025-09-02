import { Turn } from "./Turn.js";

export class Turn5 extends Turn{
    constructor(scene){
        super(scene);
    }
    
    executeFirstAction(card){
        this.firstCard = this.anomalyPile.container.list[0].getData("firstCard");
        this.secondCard = this.anomalyPile.container.list[0].getData("secondCard");
        this.thirdCard = this.anomalyPile.container.list[0].getData("thirdCard");
      
        if( ( ( (card.getData("value") < this.firstCard || card.getData("value") > this.thirdCard) &&
                card.getData("title") !== this.CARD_TITLES.TIME_AGENT) )&&
                this.playScene.registry.get("turn5_canProceed") === undefined){
                    alert("Play a Time Agent or one of "+ this.firstCard+ ", " + this.secondCard+", and "+ this.thirdCard);
                    return;
        }
        if((card.getData("value") >= this.firstCard || card.getData("value") <= this.secondCard) || card.getData("title") === this.CARD_TITLES.TIME_AGENT){
            this.playScene.registry.set("turn5_canProceed", 1);
            this.playScene.registry.inc("turn5_cardCounts", 1);
            
            if(card.getData("title") === this.CARD_TITLES.TIME_AGENT){
                const cardAttributes = {value: "wild", suit: "wild" }
                this.playScene.registry.get("turn5_cardsInfo").push(cardAttributes);
            }
            else{
                const cardAttributes = {value: card.getData("value"), suit: card.getData("suit") }
                this.playScene.registry.get("turn5_cardsInfo").push(cardAttributes);
            }
        }
        //if only one card has been played and is valid, check first box and play the sound
        if(this.playScene.registry.get("turn5_cardCounts") === 1){
            this.preloadScene.audio.play(this.preloadScene.audio.solveObjectiveSound);
            this.anomalyPile.scroll.checkBox(0);
        } 
    }
    executeSecondAction(card){
        const arrayOfCardsPlayed = this.playScene.registry.get("turn5_cardsInfo")
        const newCard = arrayOfCardsPlayed[arrayOfCardsPlayed.length-1] // same as 'card'
        const previousCard = arrayOfCardsPlayed[arrayOfCardsPlayed.length - 2];

        if(previousCard.value !== "wild"){

            if( (newCard.value === previousCard.value+1 || newCard.value === previousCard.value-1 || newCard.value == "wild") ){
                this.playScene.registry.inc("turn5_nextCheckboxProgress", 1);
                this.anomalyPile.scroll.checkBox(1);
                this.preloadScene.audio.play(this.preloadScene.audio.solveObjectiveSound);
            }
            else{
                arrayOfCardsPlayed.pop();
                this.preloadScene.audio.play(this.preloadScene.audio.errorSound);
                alert("The card (" +newCard.value +") you just played is more than 1 higher/lower than the first card ("+previousCard.value+")");
                return;
            }
        }
        else{
           this.playScene.registry.inc("turn5_nextCheckboxProgress", 1);
           this.anomalyPile.scroll.checkBox(1);
           this.preloadScene.audio.play(this.preloadScene.audio.solveObjectiveSound);
        }
    }
    executeThirdAction(card){
        const arrayOfCardsPlayed = this.playScene.registry.get("turn5_cardsInfo");
        const newCard = arrayOfCardsPlayed[arrayOfCardsPlayed.length-1] // same as 'card'
        const previousCard = arrayOfCardsPlayed[arrayOfCardsPlayed.length - 2];
        const firstCard = arrayOfCardsPlayed[arrayOfCardsPlayed.length - 3];
        if(previousCard.value !== "wild"){
            
            if(newCard.value === "wild"){
                this.playScene.registry.inc("turn5_nextCheckboxProgress", 1);
                this.anomalyPile.scroll.checkBox(2);
                this.preloadScene.audio.play(this.preloadScene.audio.solveObjectiveSound);
            }
            else if( (newCard.value === previousCard.value-1) ){
                if( (previousCard.value === firstCard.value-1) )
                    this.playScene.registry.inc("turn5_nextCheckboxProgress", 1);
                    this.anomalyPile.scroll.checkBox(2);
                    this.preloadScene.audio.play(this.preloadScene.audio.solveObjectiveSound);
            }
            else if( (newCard.value === previousCard.value+1) ){
                if( (previousCard.value === firstCard.value+1) )
                    this.playScene.registry.inc("turn5_nextCheckboxProgress", 1);
                    this.anomalyPile.scroll.checkBox(2);
                    this.preloadScene.audio.play(this.preloadScene.audio.solveObjectiveSound);
            }
            else{
                arrayOfCardsPlayed.pop();
                this.preloadScene.audio.play(this.preloadScene.audio.errorSound);
                alert("The card (" +newCard.value +") you just played is more than 1 higher/lower than the first card ("+previousCard.value+")");
                return;
            }
        }
        else{
            //let Time Agent serve as a bridge between first card and third card
            if(firstCard.value === newCard.value+2 || firstCard.value === newCard.value - 2){
                this.playScene.registry.inc("turn5_nextCheckboxProgress", 1);
                this.anomalyPile.scroll.checkBox(2);
                this.preloadScene.audio.play(this.preloadScene.audio.solveObjectiveSound); 
            }
        }
    }
    finishRound(){
        if(this.playScene.registry.get("turn5_nextCheckboxProgress") >= 2){
            this.preloadScene.audio.play(this.preloadScene.audio.solveObjectiveSound);
            this.anomalyPile.scroll.checkBox(1);
        }
        setTimeout(()=>{ this.checkAnomalyResolved(); }, 100)
    }
    solveObjectivesWith(card){
        
        this.playScene.registry.set("currentTurnIndex", 3);
        this.executeFirstAction(card);
        
        const arrayOfCardsPlayed = this.playScene.registry.get("turn5_cardsInfo");
        if(arrayOfCardsPlayed.length === 2){
            this.executeSecondAction(card);
        }
        if (arrayOfCardsPlayed.length >= 3) {
            this.executeThirdAction(card);
        }
        if (arrayOfCardsPlayed.length >= 7) {
            alert("WARNING⚠️  You have already played " + arrayOfCardsPlayed.length + " cards");
        }
        this.finishRound();
    }
}