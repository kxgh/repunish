class Item {
    constructor({id, type, usable, name, charges} = {}) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.usable = usable;
        this.charges = charges || Number.POSITIVE_INFINITY;
    }
}

Item.TYPES = {
    CLOVER: 'CLOVER'
};

Item.MODIFS = {
    luckFor: item => {
        if (typeof item === 'object')
            item = item.type;
        switch (item) {
            case Item.TYPES.CLOVER:
                return 1;
            default:
                return 0;
        }
    }
};

export default Item;