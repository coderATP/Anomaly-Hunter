export class AnomalyHunter{
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
        this.deck = undefined;
        this.table = undefined;
    }
    createDeck(){
        this.deck = this.scene.add.container(0,0);
        for(let i = 0; i < AnomalyHunter.CARD_SUITS.length; ++i ){
            
            const startFrame = Object.values(AnomalyHunter.CARD_START_FRAMES)[i];
            for(let j = 0; j < 13; ++j){
               const card = this.scene.createCard("null", this.config.width-120, 0, true)
                   .setOrigin(0)
                   .setFrame(59)
                   .setData({
                       frame: startFrame + j,
                       value: j+1,
                       suit: AnomalyHunter.CARD_SUITS[i],
                       colour: Object.values(AnomalyHunter.CARD_COLOURS)[i],
                       index: "unknown",
                       description: (j+1) + " OF " + AnomalyHunter.CARD_SUITS[i] + "S"
                   })
               
               this.deck.add(card);
            }
        }
        return this.deck;
    }
    
    getNumberOfOpponents(number){
        return number;
    }
    
    shuffleDeck(){
        let tempDeck = this.scene.add.container();
        while(this.deck.length){
            const randomPos = Math.floor(Math.random() * this.deck.length);
            const randomCard = (this.deck.list.splice(randomPos, 1))[0];
            tempDeck.add(randomCard);
        }
        this.deck = tempDeck;
        tempDeck = null;
        return this.deck;
    }
    
    addCardToPiles(){
        const {anomalyPile, deck, discard, hand } = this.scene.gameplayUI;
        
        //anomalies 4 Kings (rifts), 4 Aces (paradoxes)
        this.rifts = this.scene.add.container(0,0), this.paradoxes = this.scene.add.container(0,0);
        //add 4 Aces to paradoxes
        this.deck.getAll().forEach((card, i)=>{
            if(card.getData("value") === 1){
                this.paradoxes.add(card); 
            }
            else if(card.getData("value") === 13){
                this.rifts.add(card);
            } 
        })
 
        const cardDimensions = this.scene.getCardDimensions();
        
        const centerX = this.scene.gameplayUI.middleSection.centerX - cardDimensions.originalWidth/2;
        this.outworlders = this.scene.add.container(centerX, -200).setDepth(1);
        this.outworlders.add( [...this.rifts.list, ...this.paradoxes.list] );

        //add remaining 44 cards to deck
        deck.container.add(this.deck.list.splice(0, this.deck.length));
        //adjust size of cards to fit in container
        
        deck.container.list.forEach((card, i)=>{
            card.setDisplaySize(deck.width, deck.height)
                .setPosition(-i*0.15, 0)
        })
        //set all emptied containers to null;
        this.rifts = this.anomalies = this.deck = null;
    }
    setAnomalyCardsInfo(){
        const {anomalyPile} = this.scene.gameplayUI;
        if(!this.outworlders) return;
        this.outworlders.list.forEach((card, i)=>{
            card.setPosition(0,0).setData({zone: "anomaly"});
            switch(card.getData("value")){
                case 1:{
                    card.setData({
                        category: "Time Paradox"
                    })
                    if(card.getData("suit") === "CLUB"){
                        card.difficulty = 3;
                        card.setData({
                            level: "3",
                            title: "Resource Recycle",
                            attributes: "Play a random card from the discard pile and deal three more cards of the same suit.",
                            reward: "4 resources",
                            objectives: {
                                dealDiscardCard: "Deal a card from Discard",
                                dealThreeMore: "Deal 3 more cards of same suit"
                            }
                        })
                    }
                    else if(card.getData("suit") === "DIAMOND"){
                        card.difficulty = 5;
                        const cards = [2,3,4,5,6,7,8,9,10];
                        const firstCard = cards[Math.floor(Math.random()* (cards.length - 2)) ];
                        const secondCard = cards[ (cards.indexOf(firstCard) + 1) ];
                        const thirdCard = cards[ (cards.indexOf(secondCard) + 1) ];
                        
                        card.setData({
                            level: "5",
                            title: "Sequence Shift",
                            attributes: "Create a new sequence of 3 cards in sequential order, using at least one of "+firstCard+', '+secondCard+', or '+thirdCard,
                            reward: "5 resources",
                            objectives: {
                                playOneOfTheCards: "Play one of "+firstCard+', '+secondCard+', or '+thirdCard,
                                playNextCard: "Play second card",
                                playThirdCard: "Play third card"
                            }
                        })
                    }
                    else if(card.getData("suit") === "HEART"){
                        card.difficulty = 7;

                        card.setData({
                            level: "7",
                            title: "Time Theft",
                            attributes: "Play a Jack and neutralize its effect with an Expert Queen.",
                            reward: "6 resources",
                            objectives:{
                                playAJack: "Play A Jack",
                                playAnExpertQueen: "Play an Expert Queen"
                            }
                        })
                    }
                    else if(card.getData("suit") === "SPADE"){
                        card.difficulty = 6;

                        card.setData({
                            level: "6",
                            title: "Suit Surge",
                            attributes: "Play four cards of the same suit in any order.",
                            reward: "5 resources",
                            objectives:{
                                playFirstCard: "Play first card",
                                playSecondCard: "Play second card",
                                playThirdCard: "Play third card",
                                playFourthCard: "Play fourth card",
                            }
                        })
                    } 
                break;
                }
                case 13:{
                    card.setData({
                        category: "Time Rift"
                    })
                    if(card.getData("suit") === "CLUB"){
                        card.difficulty = 4;

                        card.setData({
                            level: "4",
                            title: "Flux Frenzy",
                            attributes: "Play three cards with different suits and ranks in descending pattern",
                            reward: "4 resources",
                            objectives: {
                                playFirstCard: "Play first card",
                                playNextCards: "Play 2 more cards in descending pattern",
                            }
                        })
                    }
                    else if(card.getData("suit") === "DIAMOND"){
                        card.difficulty = 8;

                        card.setData({
                            level: "8",
                            title: "Echo Effect",
                            attributes: "Play 2 sets of three cards with different ranks (e.g. 2-2-4-4-9-9), creating an 'echo' effect.",
                            reward: "10 resources",
                            objectives:{
                                playFirstSet: "Play first set of 3 cards",
                                playSecondSet: "Play second set of 3 cards", 
                            }
                        })
                    }
                    else if(card.getData("suit") === "HEART"){
                        card.difficulty = 2;

                        card.setData({
                            level: "2",
                            title: "Chrono Chaos",
                            attributes: "Play a pair of cards each from any two of Past, Present and Future Cards. (e.g. 2-4/7-6, or 4-3/10-10)",
                            reward: "3 resources",
                            objectives: {
                                playFirstPair: "Play first pair",
                                playSecondPair: "Play second pair"
                            }
                        })
                    }
                    else if(card.getData("suit") === "SPADE"){
                        card.difficulty = 1;

                        card.setData({
                            level: "1",
                            title: "Temporal Turbulence",
                            attributes: "Play 3 cards, from each of Past, Present and Future(e.g. 2-5-8 or 3-6-10)",
                            reward: "2 resources",
                            objectives: {
                                playPastCard: "Play Past Card",
                                playPresentCard: "Play Present Card",
                                playFutureCard: "Play Future Card"
                            }
                        })
                    }  
                break;
                }
            }
        });
        this.sortAnomalyCardsBasedOnDifficulty();
    }
    
    sortAnomalyCardsBasedOnDifficulty(){ this.outworlders.sort('difficulty').reverse();  }
    
    setDeckCardsInfo(){
        const {anomalyPile, deck, discard, hand } = this.scene.gameplayUI;
        //DECK INFO
        deck.container.list.forEach((card, i)=>{
            card.setData({
                zone: "deck",
                rect: new Phaser.Geom.Rectangle(deck.container.x, deck.container.y, deck.container.width, deck.container.height)
            })
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
        this.deck = this.createDeck();
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