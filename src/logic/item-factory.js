import Item from "./Item";

const ItemFactory = (() => {
    let id = 0;
    return {
        createItemOfType: (type) => {
            switch (type) {
                case Item.TYPES.CLOVER:
                    return new Item({
                        id: id++,
                        usable: false,
                        type,
                        name: 'Clover',
                        charges: 1
                    });
                default:
                    throw new Error('Unknown item type at createItemOfType');
            }
        }
    }
})();

export default ItemFactory;