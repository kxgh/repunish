let _id = 0;
export default class Punishment {
    /**
     * @param props
     * @param {string} [props.name]
     * @param {string} [props.text]
     * @param {string} [props.className]
     */
    constructor(props = {}) {
        this.id = _id++;
        this.name = props.name;
        this.text = props.text;
        this.className = props.className;
    }
}