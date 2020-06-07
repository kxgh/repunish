import React from "react";
import PropTypes from 'prop-types';
import Player from "../logic/Player";
import Board from "./Board";
import tileFactory from "../logic/tile-factory";
import reducer from "../logic/reducer";
import PhaseContext from "../PhaseContext";
import * as Phase from "../logic/game-phase";
import GameOverScreen from "./GameOverScreen";
import {stats} from "../logic/globals";

const cx = {
    game: 'game'
};

class Game extends React.Component {
    constructor(props) {
        super(props);
        window.onbeforeunload = function () {
            return 'Are you sure you want to leave?';
        };
        // set passed state explicitly
        this.state = {
            turn: 0,
            phase: props.phase,

            players: props.players,
            finishedCount: 0,

            challenge: null,

            tiles: tileFactory.create(props.players),
            diceResult: [1, 1]
        };

        this.dispatch = this.dispatch.bind(this);
    }

    dispatch(type, payload) {
        const ns = reducer({...this.state}, {type, payload});
        ns && this.setState(ns);
    }

    render() {
        const {players, tiles, turn, phase, diceResult, challenge} = this.state;
        const {dispatch} = this;
        let content = null;
        if (phase < Phase.GAME_OVER)
            content = <div className={cx.game}>
                <main>
                    <Board
                        turn={turn}
                        players={players}
                        tiles={tiles}
                        diceResult={diceResult}
                        challenge={challenge}
                        dispatch={dispatch}
                    />
                </main>
            </div>;
        else
            content = <GameOverScreen summary={stats.summarize(players)} players={players}/>

        return (
            <PhaseContext.Provider value={phase}>
                {content}
            </PhaseContext.Provider>
        )
    }
}

Game.propTypes = {
    players: PropTypes.arrayOf(PropTypes.instanceOf(Player).isRequired).isRequired,
    phase: PropTypes.number.isRequired
};
export default Game;