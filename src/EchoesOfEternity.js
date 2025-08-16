export class EchoesOfEternity{
    static CARD_BACK_FRAMES = [52, 53, 54, 55, 56, 57, 58, 59];
    static CARD_VALUES = [1,2,3,4,5,6,7,8,9,10,11,12,13];
    static CARD_START_FRAMES = {
        CLUB: 0,
        DIAMOND: 13,
        HEART: 26,
        SPADE: 39
    }
    static CARD_COLOURS = {
        CLUB: "BLACK",
        DIAMOND: "RED",
        HEART: "RED",
        SPADE: "BLACK"
    } 
    static CARD_SUITS = ["CLUB", "DIAMOND", "HEART", "SPADE"];
    constructor(scene){
        this.scene = scene;
        this.config = scene.config;
        this.opponentPiles = [];
        this.deck = [];
        this.table = undefined;
    }
    createDeck(){
        for(let i = 0; i < EchoesOfEternity.CARD_SUITS.length; ++i ){
            
            const startFrame = Object.values(EchoesOfEternity.CARD_START_FRAMES)[i];
            for(let j = 0; j < 13; ++j){
               const card = this.scene.createCard("null", this.config.width-120, 0)
                   .setOrigin(0)
                   .setFrame(59)
                   .setData({
                       frame: startFrame + j,
                       value: j+1,
                       suit: EchoesOfEternity.CARD_SUITS[i],
                       colour: Object.values(EchoesOfEternity.CARD_COLOURS)[i],
                       index: "unknown",
                       description: (j+1) + " OF " + EchoesOfEternity.CARD_SUITS[i] + "S"
                   })
               
               this.deck.push(card);
            }
        }
        return this.deck;
    }
    
    getNumberOfOpponents(number){
        return number;
    }
    
    shuffleDeck(){
        let tempDeck = [];
        while(this.deck.length){
            const randomPos = Math.floor(Math.random() * this.deck.length);
            const randomCard = (this.deck.splice(randomPos, 1))[0];
            tempDeck.push(randomCard);
        }
        this.deck = tempDeck;
        tempDeck = [];
        return this.deck;
    }
    
    addCardToPiles(){
        const {anomalyPile, deck, discard, hand } = this.scene.gameplayUI;
        
        //anomalies 4 Kings (rifts), 4 Aces (paradoxes)
        this.rifts = [], this.paradoxes = [];
        //add 4 Aces to paradoxes
        this.deck.forEach((card, i)=>{
            if(card.getData("value") === 1){
                this.paradoxes.push( ...(this.deck.splice(i, 1)) );
            }
        });
        //add 4 Kings to Rifts
        this.deck.forEach((card, i)=>{
            if(card.getData("value") === 13){
                this.rifts.push( ...(this.deck.splice(i, 1)) );
            }
        });
        this.anomalies = [...this.rifts, ...this.paradoxes];
        
        //add remaining 44 cards to deck
        deck.container.add(this.deck.splice(0, this.deck.length)); 
        deck.container.list.forEach((card, i)=>{
            card.setPosition(0, -i*0.25)
        })
    }
    setAnomalyCardsInfo(){
        const {anomalyPile} = this.scene.gameplayUI;
        if(!this.anomalies) return;
        this.anomalies.forEach((card, i)=>{
            switch(card.getData("value")){
                case 1:{
                    card.setData({
                        category: "Time Paradox"
                    })
                    if(card.getData("suit") === "CLUB"){
                        card.setData({
                            level: "3",
                            title: "Resource Recycle",
                            attributes: "Play a random card from the discard pile and deal three more cards of the same suit.",
                            reward: "4 resources"
                        }) 
                    }
                    else if(card.getData("suit") === "DIAMOND"){
                        card.setData({
                            level: "5",
                            title: "Sequence Shift",
                            attributes: "Create a new sequence of 3 cards in sequential order, using at least one card that is currently out of sequence.",
                            reward: "5 resources"
                        })
                    }
                    else if(card.getData("suit") === "HEART"){
                        card.setData({
                            level: "7",
                            title: "Time Theft",
                            attributes: "Play a Jack and neutralize its effect with an Expert Queen.",
                            reward: "6 resources"
                        })
                    }
                    else if(card.getData("suit") === "SPADE"){
                        card.setData({
                            level: "6",
                            title: "Suit Surge",
                            attributes: "Play four cards of the same suit in any order.",
                            reward: "5 resources"
                        })
                    } 
                break;
                }
                case 13:{
                    card.setData({
                        category: "Time Rift"
                    })
                    if(card.getData("suit") === "CLUB"){
                        card.setData({
                            level: "4",
                            title: "Flux Frenzy",
                            attributes: "Play three cards with different suits and ranks in descending pattern",
                            reward: "4 resources"
                        }) 
                    }
                    else if(card.getData("suit") === "DIAMOND"){
                        card.setData({
                            level: "8",
                            title: "Echo Effect",
                            attributes: "Play 2 sets of three cards with different ranks (e.g. 2-2-4-4-9-9), creating an 'echo' effect.",
                            reward: "10 resources"
                        })
                    }
                    else if(card.getData("suit") === "HEART"){
                        card.setData({
                            level: "2",
                            title: "Chrono Chaos",
                            attributes: "Play a pair of cards each from any two of Past, Present and Future Cards. (e.g. 2-4-7-6, or 4-3-10-10)",
                            reward: "3 resources"
                        })
                    }
                    else if(card.getData("suit") === "SPADE"){
                        card.setData({
                            level: "1",
                            title: "Temporal Turbulence",
                            attributes: "Play 3 cards, from each of Past, Present and Future(e.g. 2-5-8 or 3-6-10)",
                            reward: "2 resources"
                        })
                    }  
                break;
                }
            }
        })
        
    }
    setDeckCardsInfo(){
        const {anomalyPile, deck, discard, hand } = this.scene.gameplayUI;
        //DECK INFO
        deck.container.list.forEach((card, i)=>{
            switch(card.getData("value")){
                case 2: case 3: case 4:{
                    card.setData({
                        title: "Past Card",
                        attributes: "Can generate 0.5 resource"
                    })
                break;
                }
                case 5: case 6: case 7:{
                    card.setData({
                        title: "Present Card",
                        attributes: "Can generate 1 resource"
                    })
                break;
                }
                case 8: case 9: case 10:{
                    card.setData({
                        title: "Future Card",
                        attributes: "Can generate 2 resources"
                    })
                break;
                }
                case 11:{
                    card.setData({
                        title: "Time Thief"
                    });
                    if(card.getData("suit") === "CLUB"){
                        card.setData({
                            level: "NOVICE",
                            attributes: "Forces player to play a random card without getting rewarded"
                        }) 
                    }
                    else if(card.getData("suit") === "DIAMOND"){
                        card.setData({
                            level: "NOVICE",
                            attributes: "Forces the player to discard 1 card",
                        })
                    }
                    else if(card.getData("suit") === "HEART"){
                        card.setData({
                            attributes: "Steals 2 resources"
                        })
                    }
                    else if(card.getData("suit") === "SPADE"){
                        card.setData({
                            attributes: "Makes player solve current anomaly without collecting rewards"
                        })
                    }
                break;
                }
                case 12:{
                    card.setData({
                        title: "Time Agent"
                    })
                    if(card.getData("suit") === "CLUB"){
                        card.setData({
                            level: "NOVICE",
                            attributes: "Can generate 5 resources"
                        })
                    }
                    else if(card.getData("suit") === "DIAMOND"){
                        card.setData({
                            level: "EXPERT",
                            attributes: "Can resolve Time Theft Anomaly along with a Jack of any Suit",
                        })
                    }
                    else if(card.getData("suit") === "HEART"){
                        card.setData({
                            level: "EXPERT",
                            attributes: "Can resolve Time Theft Anomaly along with a Jack of any Suit",
 
                        })
                    }
                    else if(card.getData("suit") === "SPADE"){
                        card.setData({
                            level: "NOVICE",
                            attributes: "Can generate 5 resources"
                        })
                    } 
                break;
                } 
            }
        })
    }
    newGame(){
        if(!this.deck.length) this.deck = this.createDeck();
        //shuffle deck
        this.shuffleDeck(); 
        //distribute cards to deck & anomaly piles
        this.addCardToPiles();
        //set info
        this.setDeckCardsInfo();
        this.setAnomalyCardsInfo();
        const {deck} = this.scene.gameplayUI;
    }
    
    
    onRestart(){
        this.deck = [];
    }
}