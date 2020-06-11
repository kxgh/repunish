import Tile from './Tile';
import Challenge from "./Challenge";
import {random, MISC} from "./globals";
import * as Consts from "./consts";

const typeGen = (() => {
    const t = Challenge.TYPES;

    const multis = [t.MULTI_COND, t.GROUP_RELAY, t.DUEL];
    const others = [];
    others.push(t.TIMED_CAPITAL, t.TIMED_FLAG, t.TIMED_EMBLEM, t.TIMED_MATH, t.REST, t.COUNTDOWN);

    return () => random.choice(random.rollForChance(35) ? multis : others)
})();

const setDragon = (tiles, players) => {
    tiles[Math.floor((tiles.length * 3) / 4)].type = Challenge.TYPES.DRAGON;
    MISC.DRAGON_TARGET_NAME = random.choice(players.map(p => p.name));
};

const setPortals = (tiles, players) => {
    let count = tiles.length < 50 ? 1 : random.randomInRange(1, Math.round(tiles.length / 25));
    while (count > 0) {
        const pos = random.randomInRange(1, tiles.length - 2);
        if (tiles[pos].type === Challenge.TYPES.DRAGON || tiles[pos].type === Challenge.TYPES.FINISH) {
            continue;
        }
        tiles[pos].type = Challenge.TYPES.PORTAL;
        count--;
    }
};

const TileFactory = (_ => {
    const create = (players) => {
        const tileCount = Consts.TILES_COUNT;

        let position = 0;
        const usedTiles = [new Tile({type: Challenge.TYPES.START, position: position++})];

        while (usedTiles.length < tileCount - 1) {
            let type = typeGen();
            usedTiles.push(
                new Tile({
                        type,
                        position: position++
                    }
                ))
        }
        setDragon(usedTiles, players);
        setPortals(usedTiles, players);
        usedTiles.push(new Tile({type: Challenge.TYPES.FINISH, position: position++}));

        return usedTiles
    };
    return {create}
})();

export default TileFactory;