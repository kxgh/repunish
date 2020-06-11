import Player from "./Player";
import Item from "./Item";
import Punishment from "./Punishment";
import * as Consts from "./consts";
import Challenge from "./Challenge";

// global classnames
export const gcx = {
    attentionBg: 'pgg-attention-bg',
    btnLarge: 'pgg-btn-l',
    appearAnim: 'pgg-appear-anim',
    skewedBorder: 'pgg-skewed-border'
};

export const stats = (() => {
    const createPlayerPunishmentsRecord = () => {
        const punishmentCountMap = new Map();
        return {
            onPunish(punishment) {
                const v = punishmentCountMap.get(punishment.id);
                if (!v)
                    punishmentCountMap.set(punishment.id, 1);
                else punishmentCountMap.set(punishment.id, v + 1);
            },
            countAllPunishments() {
                const m = punishmentCountMap;
                let sum = 0;
                for (let key of [...m.keys()]) {
                    sum += m.get(key);
                }
                return sum
            },
            getMap() {
                return punishmentCountMap
            }
        }
    };
    const playerRollCountMap = new Map();
    const playerDiceResultSumMap = new Map();
    const playerPunishmentRecMap = new Map();
    let firstInFinishPlayerId = null;
    return {
        playerRolled(player) {
            const v = playerRollCountMap.get(player.id);
            if (!v)
                playerRollCountMap.set(player.id, 1);
            else playerRollCountMap.set(player.id, v + 1)
        },
        playerGotDiceResults(player, results) {
            if (!Array.isArray(results) || typeof results[0] !== 'number' || typeof results[1] !== 'number') {
                console.warn('Stat got invalid dice results');
                return;
            }
            const sum = results[0] + results[1];
            const v = playerDiceResultSumMap.get(player.id);
            if (!v)
                playerDiceResultSumMap.set(player.id, sum);
            else playerDiceResultSumMap.set(player.id, v + sum)
        },
        playerGotPunished(player, punishment) {
            let rec = playerPunishmentRecMap.get(player.id);
            if (!rec) {
                rec = createPlayerPunishmentsRecord(player);
                playerPunishmentRecMap.set(player.id, rec);
            }
            rec.onPunish(punishment)
        },
        playerReachedFinish(player) {
            if (firstInFinishPlayerId === null)
                firstInFinishPlayerId = player.id;
        },
        summarize(players) {
            const playersStats = [];
            for (let player of players) {
                const ppr = playerPunishmentRecMap.get(player.id);
                playersStats.push({
                    player,
                    rollCount: playerRollCountMap.get(player.id),
                    diceResultSum: playerDiceResultSumMap.get(player.id),
                    punishCount: ppr ? ppr.countAllPunishments() : 0
                });
            }
            let mostPunishedPlayer;
            {
                let candidate = playersStats[0].player;
                let currMax = playersStats[0].punishCount;
                for (let ps of playersStats) {
                    if (ps.punishCount > currMax) {
                        candidate = ps.player;
                        currMax = ps.punishCount;
                    }
                }
                mostPunishedPlayer = candidate;
            }
            const globalStats = {
                mostPunishedPlayer,
                firstFinished: players.filter(p => p.id === firstInFinishPlayerId)[0],
                punishCount: playersStats.map(ps => ps.punishCount).reduce((pc, pc2) => (pc + pc2)),
                diceResultSum: playersStats.map(ps => ps.diceResultSum).reduce((d1, d2) => (d1 + d2))
            };
            return {playersStats, globalStats}
        }
    }
})();

export const punishments = (() => {
    const classBase = 'ra ra-lg ';
    let currentPunishments = [];
    let allPunishments = [];
    allPunishments.push(new Punishment({
        name: 'exercise',
        className: classBase + 'ra-muscle-up',
        text: 'must exercise'
    }));
    allPunishments.push(new Punishment({
        name: 'slap',
        className: classBase + 'ra-hand',
        text: 'must get a slap'
    }));
    allPunishments.push(new Punishment({
        name: 'zap',
        className: classBase + ' ra-focused-lightning',
        text: 'must get zapped'
    }));
    allPunishments.push(new Punishment({
        name: 'ice',
        className: classBase + 'ra-ice-cube',
        text: 'must get iced'
    }));
    allPunishments.push(new Punishment({
        name: 'drink',
        className: classBase + 'ra-beer',
        text: 'must drink'
    }));
    allPunishments.push(new Punishment({
        name: 'point lose',
        className: classBase + 'ra-fall-down',
        text: 'loses a point'
    }));
    const defP = new Punishment({
        name: 'point lose',
        className: classBase + 'ra-fall-down',
        text: 'loses a point'
    });
    return {
        getActive: () => {
            if (!currentPunishments || !currentPunishments.length)
                return [defP];
            return currentPunishments;
        },
        setActive: ps => currentPunishments = ps,
        getAll: () => allPunishments,
        getRandom() {
            return random.choice(this.getActive())
        },
        createFor(player) {
            player.punishment = this.getRandom();
        },
        clearFor(player) {
            player.punishment = null;
        }
    };
})();

export const utils = (() => {

    const utils = {
        cloneItem: item => Object.assign(new Item(), item),
        cloneItems: items => {
            return items.map(item => utils.cloneItem(item))
        },
        clonePlayer: (p) => {
            const np = Object.assign(new Player({id: p.id}), p);
            np.items = utils.cloneItems(np.items);
            return np
        },
        mergePlayers: (allPlayers, modifiedPlayer) => {
            return allPlayers.map(p => p.id !== modifiedPlayer.id ? p : modifiedPlayer);
        },
        passRoundForPlayer: player => {
            player.items.forEach(item => {
                item.charges--
            });
            player.items = player.items.filter(item => item.charges > 0)
        },
        giveItemsToPlayer: (player, items) => {
            player.items = player.items.concat(items);
        },
        getPlayersLuck: (player) => {
            let luck = player.luck || 0;
            player.items.forEach(item => luck += Item.MODIFS.luckFor(item));
            return luck;
        },
        filterImmunePlayers(players) {
            return players.filter(p => !p.finished);
        }
    };
    return utils
})();

export const random = (() => {
    const random = {
        randomInRange(start, end) {
            return Math.floor(Math.random() * (end - start + 1) + start);
        },
        choice(enumerable) {
            const keys = Object.keys(enumerable);
            return enumerable[keys[random.randomInRange(0, keys.length - 1)]];
        },
        rollDiceForPlayer(player, tiles) {
            const luck = utils.getPlayersLuck(player);
            let result = [1, 4];
            if (!luck)
                result = [random.randomInRange(1, 6), random.randomInRange(1, 6)];
            const possibles = [...Array(6).keys()].map(i => (i + 1));
            if (luck < 0)
                possibles.push(1, 2);
            if (luck < -1)
                possibles.push(1, 2);
            result = [random.choice(possibles), random.choice(possibles)];
            if (!tiles[player.position + 6] || random.rollForChance(15 + luck * 5))
                return result;

            const alterResult = i => {
                if (result[i] > 4) {
                    let allure = 10;
                    let newResult = result[i];
                    for (let j = 4; j <= 6; j++) {
                        const currA = Challenge.getTypeAllure(tiles[player.position + j].type);
                        if (currA < allure) {
                            allure = currA;
                            newResult = j;
                        }
                    }
                    result[i] = newResult;
                }
            };
            alterResult(0);
            alterResult(1);
            return result;
        },
        pickPlayerForDuel(allPlayers, forPlayer) {
            allPlayers = allPlayers.filter(p => p.id !== forPlayer.id);
            const possible = [];
            allPlayers.forEach(p => {
                const luck = utils.getPlayersLuck(p);
                possible.push(p);
                possible.push(p);
                if (luck === -1)
                    possible.push(p);
                if (luck === -2)
                    possible.push(p);
            });
            return this.choice(possible)
        },
        shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array
        },
        rollForChance(chance) {
            return random.randomInRange(0, 100) <= chance;
        }
    };
    return random
})();

export const MISC = {
    DRAGON_TARGET_NAME: null,
    ON_TOUCH_DEVICE: navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)
};

export const avatars = (() => {
    let avatars;
    const size = Consts.AVATAR_COUNT;
    return {
        getNthSrc(n) {
            return `${Consts.ASSET_PATH}img/avatars/${n % size}.jpg`
        },
        getAll() {
            if (!avatars)
                avatars = random.shuffle([...Array(size).keys()].map(i => this.getNthSrc(i)));
            return avatars
        },
        size() {
            return size
        }
    }
})();

export const DURATIONS = (() => {
    const base = 1000;
    return {
        QUIZ_DEF: 6000,
        QUEST_DUEL: 1250,
        DICE_ROLL: base * 2,
        DICE_SETTLE: base,
        STEP_CHOOSE: base,
        FULFILLED: base * 1.5
    };
})();
