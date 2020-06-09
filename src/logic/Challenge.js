import * as Consts from "./consts";

class Challenge {

    /**
     * @param props
     * @param {string} [props.task]
     * @param {array<string>} [props.options]
     * @param {string} [props.correctOpt]
     * @param {string} [props.type]
     * @param {string} [props.prefix]
     * @param {function} [props.generator]
     */
    constructor(props = {}) {
        this.task = props.task;
        this.options = props.options;
        this.correct = props.correctOpt;
        this.type = props.type;
        this.prefix = props.prefix;
        this.generator = props.generator;
    }

}

Challenge.TYPES = {
    START: 'Start',
    MULTI_COND: 'Storm',
    TIMED_MATH: 'Math Quiz',
    TIMED_FLAG: 'Flag Quiz',
    TIMED_EMBLEM: 'Emblem Quiz',
    TIMED_CAPITAL: 'Capital Quiz',
    DRAGON: 'Dragon',
    PORTAL: 'Portal',
    GROUP_RELAY: 'Bomb',
    DUEL: 'Duel',
    REST: 'Rest',
    FINISH: 'Finish'
};

(() => {
    const t = Challenge.TYPES;
    const base = `${Consts.ASSET_PATH}img/`;
    Challenge.IMGS = {
        [t.START]: `${base}finish.png`,
        [t.MULTI_COND]: `${base}lightning.png`,
        [t.TIMED_MATH]: `${base}math.png`,
        [t.TIMED_FLAG]: `${base}flag.png`,
        [t.TIMED_EMBLEM]: `${base}emblem.png`,
        [t.GROUP_RELAY]: `${base}bomb.png`,
        [t.DUEL]: `${base}duel.png`,
        [t.DRAGON]: `${base}dragon.png`,
        [t.PORTAL]: `${base}portal.png`,
        [t.TIMED_CAPITAL]: `${base}geo.png`,
        [t.REST]: `${base}rest.png`,
        [t.FINISH]: `${base}finish.png`
    };
})();

/**
 * how attractive the challenge is. from 0 to 10
 */
Challenge.getTypeAllure = type => {
    const t = Challenge.TYPES;
    switch (type) {
        case t.TIMED_FLAG:
            return 3;
        case t.TIMED_CAPITAL:
            return 6;
        case t.TIMED_EMBLEM:
            return 1;
        case t.DUEL:
            return 1;
        case t.TIMED_MATH:
            return 3;
        case t.DRAGON:
            return 0;
        case t.FINISH:
            return 10;
        case t.GROUP_RELAY:
            return 6;
        case t.PORTAL:
            return 5;
        case t.MULTI_COND:
            return 2;
        default: return 5
    }
};

export default Challenge
