export class AnomalyPile{
    constructor(scene, id){
        this.scene = scene;
        this.id = id;
        this.container = undefined;
    }
    create(x,y,w,h, containerIndex = 0){
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.containerIndex = containerIndex;
       //pile rectangle 
        this.rect = this.scene.createPileRect(x,y,w,h);
       //container
       this.container = this.scene.add.container(x, y).setSize(w,h)//.setInteractive();
       this.container.setData({index: containerIndex-1, ownerID: this.id});
        
       this.zone = this.scene.createDropZone(this.id + "Zone", x,y,w,h)
       this.zone.setData({index: containerIndex-1}); 
       return this; 
    }
}