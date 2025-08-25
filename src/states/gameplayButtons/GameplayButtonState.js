
export class GameplayButtonState{
    constructor(scene){
        this.scene = scene;
        const { gameplayButtons } = scene.gameplayUI;
        this.gameplayButtons = gameplayButtons;
    }
}