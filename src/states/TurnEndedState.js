import { GameplayButtonState } from "./gameplayButtons/GameplayButtonState.js";

export class TurnEndedState extends GameplayButtonState{
    enter(){
        this.gameplayButtons.forEach(btn=>{
            btn.active = false;
            btn.enterRestState();
        })
        return this;
    }
}
