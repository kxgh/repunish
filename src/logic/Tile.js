let _id = 0;
class Tile {
    constructor({type, position}) {
        this.id = _id++;
        this.type = type;
        this.position = position;
    }
}

export default Tile