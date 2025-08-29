import { GameplayButtonState } from "./gameplayButtons/GameplayButtonState.js";

export class DeckClickState extends GameplayButtonState{
    enter(){
        this.gameplayButtons.forEach(btn=>{
            btn.active = false;
            btn.enterRestState();
        })
        return this;
    }
}
