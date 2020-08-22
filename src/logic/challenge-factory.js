import axios from "axios";
import {MISC, random, utils} from "./globals";
import Challenge from "./Challenge";
import * as Consts from "./consts";

let questions = {empty: true};
const QS_USED_INDEX_KEY = 'currentUsedIndex';

const init = async _ => {
    if (!questions.empty)
        return questions;
    const resp = await axios.get(Consts.ASSET_PATH + 'resources.json');
    questions = prepareReceivedQs(resp.data['questions']);
    return questions
};

/**
 * @param {Object} qs
 */
const prepareReceivedQs = qs => {
    const putIndexProperty = targetArray => {
        Object.defineProperty(targetArray, QS_USED_INDEX_KEY, {
            enumerable: false,
            value: 0,
            configurable: false,
            writable: true
        })
    };
    Object.keys(qs).forEach(key => {
        const flat = qs[key];
        if (Array.isArray(flat)) {
            qs[key] = random.shuffle(flat);
            putIndexProperty(qs[key]);
        } else if (typeof flat === 'object') {
            Object.keys(flat).forEach(dkey => {
                if (['easy', 'normal', 'hard', 'impossible'].includes(dkey.toLowerCase())) {
                    flat[dkey] = random.shuffle(flat[dkey]);
                    putIndexProperty(flat[dkey]);
                }
            })
        }
    });
    return qs
};

/**
 *
 * @param {*[]} arr
 * @returns {*}
 */
const pickNextUnique = arr => {
    arr[QS_USED_INDEX_KEY] = (arr[QS_USED_INDEX_KEY] + 1) % arr.length;
    return arr[arr[QS_USED_INDEX_KEY]]
};

/**
 * @param {Player} p
 */
const genMultiCond = p => {
    const r = pickNextUnique(questions.multiCond);
    const prefix = r[0] === '@' ? 'Every' : 'Everyone who';
    return new Challenge({task: r.replace('@', ''), type: Challenge.TYPES.MULTI_COND, prefix});
};

/**
 * @param {Player} p
 */
const genGroupRelay = p => {
    const r = pickNextUnique(questions.groupRelay);
    return new Challenge({task: r, type: Challenge.TYPES.GROUP_RELAY});
};

/**
 * @param {Player} p
 */
const genCountdown = p => {
    const luck = Math.max(Math.min(utils.getPlayersLuck(p), 2), -2);
    const hideAt = random.randomInRange(1, Math.max(4 + luck, 2))
    const startFrom = hideAt + random.randomInRange(3, Math.max(5 - luck, 4));
    const interval = random.randomInRange(500, 720) + luck * 60;
    const tolerance = Math.floor((3 * interval / 4) * (1.1 + 0.1 * luck));
    const task = {
        startFrom,
        hideAt,
        interval,
        tolerance
    };
    return new Challenge({
        task,
        type: Challenge.TYPES.COUNTDOWN
    });
};

/**
 * @param {Player} p
 */
const genTimedMath = p => {
    const possibleOperations = ['+', '-', '*'];
    const luck = utils.getPlayersLuck(p);
    if (luck > 0)
        possibleOperations.push('+');
    if (luck > 1)
        possibleOperations.push('+', '+');
    if (luck < 0)
        possibleOperations.push('-', '*');
    if (luck < -1)
        possibleOperations.push('-');
    if (luck < -2)
        possibleOperations.push('*');

    const operation = random.choice(possibleOperations);
    const result = new Challenge({
        type: Challenge.TYPES.TIMED_MATH
    });

    let n1, n2;
    if (operation === '*') {
        n1 = random.randomInRange(11, Math.max(20, 98 - luck * 40));
        n2 = random.randomInRange(3, 9);
        if (luck < 1 && (n1 % 10 === 0 || n1 % 11 === 0))
            n1++;

    } else if (operation === '-') {
        n1 = random.randomInRange(100, Math.max(200 - luck * 30, 110));
        n2 = random.randomInRange(50, 199 - 20 * luck);
    } else {
        n1 = random.rollForChance(20 + luck * 10) ? random.randomInRange(19, 59) : random.randomInRange(100, 800);
        n2 = random.rollForChance(20 + luck * 10) ? random.randomInRange(19, 59) : random.randomInRange(100, 800);
    }

    // eslint-disable-next-line no-eval
    const correct = eval(`${n1}${operation}${n2}`);
    const task = `${n1}${operation === '*' ? 'x' : operation}${n2}=?`;
    if (operation === '+' || operation === '-') {
        result.options = random.shuffle([1, 2, 3]
            .map(i => random.rollForChance(50) ? i * 10 : i * -10)
            .map(i => i + correct)
            .concat([correct]))
            .map(i => '' + i);
    } else {
        result.options = random.shuffle([1, -1, 2, -2, 3, -3, 4, -4]
            .map(i => n1 * (n2 + i))
            .slice(0, 3)
            .concat([correct]))
            .map(i => '' + i);
    }
    result.task = task;
    result.correct = '' + correct;
    return result
};

/**
 * @param {Player} p
 * @param {Challenge.TYPES} challengeType
 */
const genQuizGeneric = (p, challengeType) => {
    let timedWhatProp = challengeType;
    if (challengeType === Challenge.TYPES.TIMED_CAPITAL)
        timedWhatProp = 'timedCapital';

    const luck = utils.getPlayersLuck(p);
    const diffs = ['easy', 'normal', luck < 2 ? 'hard' : 'normal'];
    if (luck > 0)
        diffs.push('easy', 'normal');
    if (luck > 1)
        diffs.push('easy', 'easy');
    if (luck < 0)
        diffs.push('hard', 'impossible');
    if (luck < -1)
        diffs.push('hard', 'impossible');

    const decidedDiff = random.choice(diffs);
    const candidates = random.shuffle(questions[timedWhatProp][decidedDiff]);
    const options = candidates.slice(0, 4);
    const correctOpt = options[0].c;
    const task = `${options[0].q}`;

    return new Challenge({
        type: challengeType,
        task,
        options: random.shuffle(options).map(opt => opt.c),
        correctOpt
    })
};

/**
 * @param {Player} p
 * @param {Challenge.TYPES} challengeType
 */
const genImgQuizGeneric = (p, challengeType) => {
    let timedWhatProp = challengeType;
    if (challengeType === Challenge.TYPES.TIMED_FLAG)
        timedWhatProp = 'timedFlag';
    if (challengeType === Challenge.TYPES.TIMED_EMBLEM)
        timedWhatProp = 'timedEmblem';

    const luck = utils.getPlayersLuck(p);
    const diffs = ['easy', 'normal', luck < 2 ? 'hard' : 'normal'];
    if (luck > 0)
        diffs.push('easy', 'normal');
    if (luck > 1)
        diffs.push('easy', 'easy');
    if (luck < 0)
        diffs.push('hard', 'impossible');
    if (luck < -1)
        diffs.push('hard', 'impossible');

    const decidedDiff = random.choice(diffs);
    const candidates = random.shuffle(questions[timedWhatProp][decidedDiff]);
    const options = candidates.slice(0, 4);
    const correctOpt = candidates[0];
    const task = `${Consts.ASSET_PATH}${questions[timedWhatProp].pathBase}` +
        `${correctOpt.replace(/\s/g, '_')}${questions[timedWhatProp].pathExt}`;

    return new Challenge({
        type: challengeType,
        task,
        options: random.shuffle(options),
        correctOpt
    })
};

const genDuel = (() => {
    const optsAnimals = ['beetle', 'dinosaur', 'sea-serpent', 'snail', 'snake', 'seagull', 'octopus', 'fish', 'dragonfly'];
    optsAnimals.push('butterfly', 'fox', 'rabbit', 'wolf-head', 'sheep', 'raven', 'gecko', 'cat');
    const optsWeapons = ['archer', 'axe', 'battered-axe', 'bombs', 'bowie-knife', 'bullets', 'croc-sword'];
    optsWeapons.push('crossbow', 'crossed-axes', 'crossed-sabers', 'crossed-swords', 'daggers', 'gavel');
    optsWeapons.push('harpoon-trident', 'relic-blade', 'musket', 'mp5', 'revolver', 'trident');
    const optsOther = ['vest', 'round-shield', 'anchor', 'bowling-pin', 'bell', 'campfire', 'castle-emblem', 'capitol'];
    optsOther.push('fedora', 'hand', 'horn-call', 'metal-gate', 'omega', 'ocean-emblem', 'overmind', 'podium');
    optsOther.push('shoe-prints', 'queen-crown', 'shovel', 'trail', 'tooth', 'anvil', 'triforce', 'snowflake');
    optsOther.push('kaleidoscope', 'gold-bar', 'gloop', 'gem', 'eyeball', 'crystals', 'diamond', 'droplet', 'magnet');
    optsOther.push('tombstone', 'aquarius', 'palm-tree', 'clover', 'daisy', 'flower');
    optsOther.push('egg', 'toast', 'honeycomb', 'clovers', 'hearts', 'suits', 'spades', 'diamonds', 'wifi');

    const taskWep = 'weapon';
    const taskAni = 'animal';

    const createGenerator = task => {
        return () => {
            const gendCount = random.randomInRange(5, 9);
            const options = random.shuffle(optsOther.concat(task === taskAni ? optsWeapons : optsAnimals))
                .slice(0, gendCount);
            let correct = false;
            if (random.rollForChance(20)) {
                correct = true;
                const i = random.randomInRange(0, options.length - 1);
                options[i] = task === taskAni ? random.choice(optsAnimals) : random.choice(optsWeapons);
            }
            return {
                options,
                correct
            }
        }
    };

    return () => {
        const chosenTask = random.choice([taskWep, taskAni]);
        return new Challenge({
            type: Challenge.TYPES.DUEL,
            task: chosenTask,
            generator: createGenerator(chosenTask)
        });
    }
})();

/**
 * @param {Player} player
 */
const genDragon = (player) => {
    return new Challenge({
        type: Challenge.TYPES.DRAGON,
        correctOpt: MISC.DRAGON_TARGET_NAME,
        task: MISC.DRAGON_TARGET_NAME
    });
};

/**
 * @param {Player} player
 * @param {array<Tile>} tiles
 */
const genPortal = (player, tiles) => {
    let moveBy, luck = utils.getPlayersLuck(player);
    if (random.rollForChance(95 - luck)) {
        const offset = Math.floor(tiles.length / 5);
        moveBy = random.randomInRange(-offset, offset + 5 * Math.max(luck, 0));
    } else moveBy = random.randomInRange(0, tiles.length - 2 + 5 * luck);
    const truePos = Math.min(tiles.length - 2, Math.max(0, moveBy + player.position));
    return new Challenge({
        type: Challenge.TYPES.PORTAL,
        task: {
            by: moveBy,
            to: truePos
        }
    });
};

/**
 * @param {array<Tile>} tiles
 * @param {string} tileType
 * @param {Player} player
 */
const generate = (tiles, tileType, player) => {
    switch (tileType) {
        case Challenge.TYPES.MULTI_COND:
            return genMultiCond(player);
        case Challenge.TYPES.DRAGON:
            return genDragon(player);
        case Challenge.TYPES.PORTAL:
            return genPortal(player, tiles);
        case Challenge.TYPES.DUEL:
            return genDuel();
        case Challenge.TYPES.TIMED_MATH:
            return genTimedMath(player);
        case Challenge.TYPES.COUNTDOWN:
            return genCountdown(player);
        case Challenge.TYPES.TIMED_FLAG:
            return genImgQuizGeneric(player, Challenge.TYPES.TIMED_FLAG);
        case Challenge.TYPES.TIMED_EMBLEM:
            return genImgQuizGeneric(player, Challenge.TYPES.TIMED_EMBLEM);
        case Challenge.TYPES.GROUP_RELAY:
            return genGroupRelay(player);
        case Challenge.TYPES.REST:
            return new Challenge({type: Challenge.TYPES.REST});
        case Challenge.TYPES.TIMED_CAPITAL:
            return genQuizGeneric(player, Challenge.TYPES.TIMED_CAPITAL);
        case Challenge.TYPES.FINISH:
            return new Challenge({type: Challenge.TYPES.FINISH});
        default:
            throw new Error('UNKNOWN ROUND TYPE');
    }
};
export default {generate, init}
