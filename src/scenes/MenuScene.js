import { BaseScene } from "./BaseScene.js";
import { eventEmitter } from "../events/EventEmitter.js";
import { Button } from "../entities/Button.js";

export class MenuScene extends BaseScene{
    constructor(config){
        super("MenuScene", config);
        this.config = config;
        this.clicked = true;
    }
    
    showInterface(){
        const { PreloadScene, PlayScene } = this.game.scene.keys; 
        this.hideAllScreens();
        //this.showOne(this.menuScreen, "grid", -1);
        this.scene.stop("PlayScene");
        PreloadScene.audio.playSong.isPlaying&& PreloadScene.audio.playSong.stop();
        !PreloadScene.audio.menuSong.isPlaying&& PreloadScene.audio.menuSong.play();
        
        this.createLogo();
        this.createButtons();
    }
    
    createLogo(){
        //add logo
        this.graphics = this.add.graphics();
        this.graphics.fillStyle(0x002200);
        this.graphics.fillRect(0,0,this.config.width, this.config.height);
        this.logo = this.add.image(0, 0, "logo")
            .setOrigin(0)
            .setDepth(0);
        this.logo.displayHeight =  this.logo.displayWidth = this.config.height*0.9;
        this.logo.setPosition(this.config.width/2 - this.logo.displayHeight/2, 0);
    }
    
    createButtons(){
        this.buttonRects = [];
        const marginX = 0.05 * this.config.width;
        const marginY = 10;
        const paddingX = 30;
        
        const availableWidth = this.config.width;
        const height = 0.10 * this.config.height;
        
        const numberOfButtons = 5;
        const widthPerButton = (availableWidth - (marginX*2) - paddingX*(numberOfButtons-1) )/numberOfButtons;
        
        for(let i = 0; i < numberOfButtons; ++i){
            const rect = new Phaser.Geom.Rectangle(marginX + i*(widthPerButton+paddingX), this.config.height - height - marginY, widthPerButton, height);
            this.buttonRects.push(rect);
        }
        this.playBtn = new Button(this, this.buttonRects[0], "PLAY");
        this.optionsBtn = new Button(this, this.buttonRects[1], "OPTIONS");
        this.leaderboardBtn = new Button(this, this.buttonRects[2], "LEADERBOARD");
        this.creditsBtn = new Button(this, this.buttonRects[3], "CREDITS");
        this.exitBtn = new Button(this, this.buttonRects[4], "EXIT");
        this.buttons = [this.playBtn, this.optionsBtn, this.leaderboardBtn, this.creditsBtn, this.exitBtn];
    }
    
    playButtonSound(){
        const { PreloadScene } = this.game.scene.keys;
        this.ui.menuBtns.forEach(btn=>{
            btn.addEventListener('click', ()=>{
                PreloadScene.audio.play(PreloadScene.audio.buttonClickSound);
            })
        })
        this.ui.tableSelectionBtns.forEach(btn=>{
            btn.addEventListener('click', ()=>{
                PreloadScene.audio.play(PreloadScene.audio.buttonClickSound);
            })
        })
        this.ui.pauseBtns.forEach(btn=>{
            btn.addEventListener('click', ()=>{
                PreloadScene.audio.play(PreloadScene.audio.buttonClickSound);
            })
        }) 
    }
    
    create(){
        const { PlayScene } = this.game.scene.keys;
        this.showInterface();
        this.playButtonSound()

        this.playBtn.hitArea.once("pointerdown", ()=>{
            eventEmitter.emit("MenuToPlay");
        }, {once: true}) 
        this.optionsBtn.hitArea.once("pointerdown", ()=>{
            eventEmitter.emit("MenuToOptions");
        }, {once: true} )
        this.creditsBtn.hitArea.once("pointerdown", ()=>{
            eventEmitter.emit("MenuToCredits");
        }, {once: true});
        this.exitBtn.hitArea.once("pointerdown", ()=>{
            eventEmitter.emit("MenuToExit");
        }, {once: true});
        eventEmitter.once("MenuToPlay", ()=>{
            this.scene.start("PlayScene");
        });
        eventEmitter.once("MenuToOptions", ()=>{
            this.scene.start("OptionsScene");
        });
        eventEmitter.once("MenuToCredits", ()=>{
            this.scene.start("CreditsScene");
        });
        eventEmitter.once("MenuToExit", ()=>{
            PlayScene.ui.confirmText.innerText = "Quit Game?";
            this.scene.start("ConfirmScene");
        });
        
    }
    
    update(time, delta){
        this.leaderboardBtn.updateFontSize(time, delta);
        this.buttons.forEach((btn, i)=> {
            btn.label.setFontSize(this.leaderboardBtn.currentFontSize) 
            btn.changePosition(this.buttonRects[i])
        });
    }
}