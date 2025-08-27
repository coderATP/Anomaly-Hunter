export class AudioControl{
    constructor(scene){
        this.menuSong = scene.sound.add('menuSong');
        this.playSong = scene.sound.add('playSong');
        this.playerWinSound = scene.sound.add('playerWinSound');
        this.gameCompleteSound = scene.sound.add('gameCompleteSound');
        this.errorSound = scene.sound.add('errorSound');

        this.menuSong.loop = true;
        
        this.buttonClickSound = scene.sound.add('buttonClickSound');
        this.drawSound = scene.sound.add('drawSound');
        this.clockTickSound = scene.sound.add('clockTickSound');
        this.popUpSound = scene.sound.add('popUpSound');
        this.swooshSound = scene.sound.add('swooshSound');
        this.swapSound = scene.sound.add('swapSound');
        this.shuffleSound = scene.sound.add('shuffleSound');
        this.solveObjectiveSound = scene.sound.add('solveObjectiveSound');

        this.songs = [ /*this.menuSong, this.playSong */];
        this.sounds = [this.drawSound, this.shuffleSound, this.swooshSound, this.swapSound, this.popUpSound, this.solveObjectiveSound, this.gameCompleteSound, this.playerWinSound, this.buttonClickSound, this.clockTickSound, this.errorSound];
        //REDUCE VOLUME AT STARTUP, UNLESS OTHERWISE SPECIFIED BY USER
        this.playSong.volume = 0.4;
        this.clockTickSound.volume = 0.3;
        this.buttonClickSound.volume = 0.2;
        this.solveObjectiveSound.volume = 0.2;
    }
    
    play(audio){
        audio.currentTime = 0;
        audio.play();
    }
    
    stop(audio){
        audio.currentTime = 0;
        audio.pause();
    }
    stopAllSongs(){
        this.songs.forEach(song=>{
            //song.currentTime = 0;
            //song.pause();
        })
    }
    
}