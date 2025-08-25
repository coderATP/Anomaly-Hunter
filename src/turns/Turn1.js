const CARD_TITLES = {
    PAST_CARD: "Past Card",
    PRESENT_CARD: "Present Card",
    FUTURE_CARD: "Future Card",
    TIME_AGENT: "Time Agent",
    TIME_THIEF: "Time Thief"
};

export class Turn1{
    constructor(scene){
        this.scene = scene;
        const { PreloadScene } = scene.game.scene.keys;
        this.preloadScene = PreloadScene;
        const { hand, anomalyPile} = scene.gameplayUI;
        this.anomalyPile = anomalyPile;
        this.hand = hand;
        this.solvedObjectives = 0;
    }
    
    
    solveObjectivesWith(card){
        if(card.getData("title")=== CARD_TITLES.PAST_CARD){
            this.preloadScene.audio.play(this.preloadScene.audio.solveObjectiveSound);
            this.anomalyPile.scroll.checkBox(0);
        }
        else if(card.getData("title") === CARD_TITLES.PRESENT_CARD){
            this.preloadScene.audio.play(this.preloadScene.audio.solveObjectiveSound);
            this.anomalyPile.scroll.checkBox(1); 
        }
        else if(card.getData("title") === CARD_TITLES.FUTURE_CARD){
            this.preloadScene.audio.play(this.preloadScene.audio.solveObjectiveSound);
            this.anomalyPile.scroll.checkBox(2);
        }
        else if(card.getData("title") === CARD_TITLES.TIME_AGENT){
            if(card.getData("level") === "EXPERT"){
                this.preloadScene.audio.play(this.preloadScene.audio.solveObjectiveSound);
                this.anomalyPile.scroll.checkBox(0);
                setTimeout(()=>{ this.anomalyPile.scroll.checkBox(1); }, 200)
                setTimeout(()=>{ this.anomalyPile.scroll.checkBox(2); }, 400)
            }
        }
        else if(card.getData("title") === CARD_TITLES.TIME_THIEF){
            alert("olè!!!");
        }
        else{
            alert("no title")
        }
        this.anomalyPile.scroll.checkboxGraphics.forEach((g)=>{
            if(g.name !== "") this.solvedObjectives++;
        })
        if(this.solvedObjectives===3) alert("done solving anomaly ")
    }
}