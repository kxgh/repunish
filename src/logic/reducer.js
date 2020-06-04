import * as ACTIONS from "./actions"
import * as Phase from "./game-phase";
import sage from "./challenge-factory";
import {utils, stats, random, punishments} from "./globals";
import Challenge from "./Challenge";
import * as Consts from "../logic/consts";

function reducer(state, {type, payload = {}}) {
    const {players, turn, phase} = state;
    const currPlayer = players[turn];
    switch (type) {
        case ACTIONS.ROLL_DICE:
            if (state.phase === Phase.QUEST_FULFILLED || state.phase === Phase.GAME_STARTED) {
                stats.playerRolled(currPlayer);
                return {
                    phase: Phase.ROLLING_DICE
                };
            }
            return null;
        case ACTIONS.SETTLE_DICE:
            if (state.phase === Phase.ROLLING_DICE) {
                const diceResult = random.rollDiceForPlayer(currPlayer, state.tiles);
                stats.playerGotDiceResults(currPlayer, diceResult);
                return {
                    diceResult,
                    phase: Phase.SHOWING_DICE_RESULT
                };
            }
            return null;
        case ACTIONS.OFFER_STEPS:
            if (state.phase === Phase.SHOWING_DICE_RESULT) {
                const [dr1, dr2] = state.diceResult;
                let hasChoices = currPlayer.position + dr1 < Consts.TILES_COUNT ||
                    currPlayer.position + dr2 < Consts.TILES_COUNT;
                if (!hasChoices)
                    return reducer(state, {type: ACTIONS.OFFER_NEXT_TURN});
                return {
                    phase: Phase.CHOOSING_STEP
                };
            }
            return null;
        case ACTIONS.STEP_CHOOSE:
            const tileChosen = payload;
            if (phase === Phase.CHOOSING_STEP) {
                const currPlayerClone = utils.clonePlayer(currPlayer);
                currPlayerClone.position = tileChosen.position;
                currPlayerClone.finished = tileChosen.type === Challenge.TYPES.FINISH;
                currPlayerClone.finished && stats.playerReachedFinish(currPlayerClone);
                const finishedCount = currPlayerClone.finished ? (state.finishedCount + 1) : state.finishedCount;
                return {
                    phase: Phase.WALKING,
                    challenge: sage.generate(state.tiles, tileChosen.type, players[turn]),
                    players: utils.mergePlayers(players, currPlayerClone),
                    tile: tileChosen,
                    finishedCount
                };
            }
            return null;
        case ACTIONS.SHOW_QUEST:
            return {
                phase: Phase.QUEST_PENDING_SHOWING
            };
        case ACTIONS.FULFILL_QUEST:
            if (phase === Phase.QUEST_PENDING_SHOWING) {
                // clear all players of punishments
                const clones = players.map(p => utils.clonePlayer(p));
                clones.forEach(p => punishments.clearFor(p));
                return {
                    phase: Phase.QUEST_FULFILLED,
                    players: clones
                };
            }
            /*if (payload.pickedItems) {
                utils.passRoundForPlayer(currPlayerClone);
                utils.giveItemsToPlayer(currPlayerClone, payload.pickedItems);
                if (state.phase === Phase.QUEST_PENDING_SHOWING)
                    return {
                        phase: Phase.QUEST_FULFILLED,
                        players: utils.mergePlayers(players, currPlayerClone)
                    };
            } else {
                if (state.phase === Phase.QUEST_PENDING_SHOWING)
                    return {
                        phase: Phase.QUEST_FULFILLED,
                        players: utils.mergePlayers(players, currPlayerClone)
                    };
            }*/
            return null;
        case ACTIONS.OFFER_NEXT_TURN:
            if (state.phase === Phase.QUEST_FULFILLED || state.phase === Phase.SHOWING_DICE_RESULT) {
                if (state.finishedCount === players.length)
                    return {phase: Phase.GAME_OVER}
                let newTurn = turn;
                let safeCount = 0;
                do {
                    newTurn = (newTurn + 1) % players.length;
                    if (safeCount++ > Consts.MAX_PLAYERS) {
                        console.warn('Unexpected loop, cannot offer next turn!');
                        return {phase: Phase.GAME_OVER}
                    }
                } while (players[newTurn].finished);
                const ns = {
                    turn: newTurn,
                    phase: Phase.GAME_STARTED
                };
                return ns;
            }
            return null;
        case ACTIONS.QUIZ_ANSWER_INCORRECT:
            const mistakenPlayers = utils.filterImmunePlayers(Array.isArray(payload) ? payload : [payload]);
            const ns = {
                players
            };
            for (let mistaken of mistakenPlayers) {
                mistaken = utils.clonePlayer(mistaken);
                punishments.createFor(mistaken);
                stats.playerGotPunished(mistaken, mistaken.punishment);
                ns.players = utils.mergePlayers(ns.players, mistaken);
            }
            return ns;
        case ACTIONS.TELEPORT_PLAYER:
            const {targetPlayer, targetPosition} = payload;
            const clone = utils.clonePlayer(targetPlayer);
            targetPlayer.position = Math.max(0, targetPosition);
            targetPlayer.position = Math.min(state.tiles.length - 1, targetPosition);
            return {
                players: utils.mergePlayers(players, clone)
            };
        default:
            return null
    }
}

export default reducer