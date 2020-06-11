import {avatars} from "./globals";

let _id = 1;

class Player {
    constructor({id, name} = {}) {
        this.id = id || id === 0 ? id : _id++;
        this.name = name || `Player ${this.id}`;

        this.avatar = avatars.getAll()[(this.id - 1) % avatars.size()];
        this.position = 0;
        this.luck = 0;
        this.items = [];
        this.finished = false;
        this.punishment = null;
    }
}

export default Player