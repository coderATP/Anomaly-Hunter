import { GameplayButtonState } from "./GameplayButtonState.js";

export class ResolveState extends GameplayButtonState{
    enter(){
        this.gameplayButtons.forEach(btn=>{
            if(btn.id !== 'Resolve'){
                btn.active = false;
                btn.enterRestState();
            }
        })
        return this;
    }
}

export class DiscardState extends GameplayButtonState{
    enter(){
        this.gameplayButtons.forEach(btn=>{
            if(btn.id !== 'Discard'){
                btn.active = false;
                btn.enterRestState();
            }
        })
        return this;
    }
}

export class RecallState extends GameplayButtonState{
    enter(){
        this.gameplayButtons.forEach(btn=>{
            if(btn.id !== 'Recall'){
                btn.active = false;
                btn.enterRestState();
            }
        })
        return this;
    }
}

export class SwapState extends GameplayButtonState{
    enter(){
        this.gameplayButtons.forEach(btn=>{
            if(btn.id !== 'Swap'){
                btn.active = false;
                btn.enterRestState();
            }
        })
        return this;
    }
}

export class EndState extends GameplayButtonState{
    enter(){
        this.gameplayButtons.forEach(btn=>{
            if(btn.id !== 'End'){
                btn.active = false;
                btn.enterRestState();
            }
        })
        return this;
    }
}