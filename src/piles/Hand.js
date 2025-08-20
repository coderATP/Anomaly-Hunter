export class Hand{
    constructor(scene, id){
        this.scene = scene;
        this.id = id;
        this.rects = [];
        this.zones = [];
        this.containers = [];
        this.names = [];
    }
    create(x,y,w,h, containerIndex = 0){
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
       //pile rectangles
       this.rects.push(this.scene.createPileRect(x,y,w,h));
       //container
       const zone = this.scene.createDropZone(this.id + "Zone", x,y,w,h)
       zone.setData({index: containerIndex});
       this.zones.push(zone);
       
       const container = this.scene.add.container(x, y).setSize(w,h);
       container.setData({index: containerIndex, ownerID: this.id});
       this.containers.push(container);

       return this; 
    }
    generateName(){
       //name
       let tag;
       if(this.id === "P") tag = this.id+this.containerIndex;
       else tag = this.id;
       this.name = this.scene.add.text(0,0, tag, { fontSize: "32px", fontFamily: "myOtherFont", color: "gold"}).setOrigin(0)
       return this;
    }
    setNameParams(x, y){
       this.name.setPosition(x/* + w/2 - name.width/2*/, y/*+h*/);
       this.names.push(name);
       return this;
    }
    
    handleMoveCardToWrongSpace(card){
        card.setPosition(0,0);
    }
}