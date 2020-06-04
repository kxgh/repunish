import React from 'react';
import {punishments} from "./logic/globals";
import Home from "./components/Home";
import * as Phase from './logic/game-phase';
//import Game from "./components/Game";
import Spinner from "./components/Spinner";
import LoadingScreen from "./components/LoadingScreen";

const Game = React.lazy(() => new Promise((resolve) => {
    setTimeout(() => {
        resolve(import('./components/Game'));
    }, 333);
}));

/*

const Game = React.lazy(() =>
    import('./components/Game')
);
 */

const initState = {
    phase: Phase.GAME_LOADING_SETUP,
    selectedPunishments: []
};

//initState.players[1].items = [ItemFactory.createItemOfType(Item.TYPES.CLOVER)];


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = initState;
        this.startGame = this.startGame.bind(this);
        this.introLoaded = this.introLoaded.bind(this);
        this.loadBoard = this.loadBoard.bind(this);
    }

    loadBoard({players, chosenPunishments}) {
        if (this.state.phase === Phase.GAME_SETUP) {
            this.chosenPlayers = players;
            this.chosenPunishments = chosenPunishments;
            this.setState({
                phase: Phase.GAME_LOADING_BOARD
            });
        }
    }

    startGame() {
        punishments.setActive(this.chosenPunishments);
        if (this.state.phase === Phase.GAME_LOADING_BOARD) {
            this.setState({
                phase: Phase.GAME_STARTED,
                players: this.chosenPlayers
            });
        }
    }

    introLoaded() {
        if (this.state.phase === Phase.GAME_LOADING_SETUP)
            this.setState(prevState => {
                return {phase: Phase.GAME_SETUP}
            })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    componentWillUnmount() {
    }

    render() {
        const {phase, selectedPunishments} = this.state;
        const {startGame, punishmentSelect, loadBoard, introLoaded} = this;
        if (phase === Phase.GAME_LOADING_SETUP)
            return <LoadingScreen phase={phase} onLoadComplete={introLoaded}/>;
        if (phase === Phase.GAME_LOADING_BOARD)
            return <LoadingScreen phase={phase} onLoadComplete={startGame}/>;
        return (
            <>
                {phase === Phase.GAME_SETUP ?
                    <Home onStart={loadBoard}
                          punishmentSelect={punishmentSelect}
                          selectedPunishments={selectedPunishments}
                    /> :
                    <React.Suspense fallback={<Spinner/>}>
                        <Game {...this.state}/>
                    </React.Suspense>
                }
            </>
        );
    }
}

export default App;

/*
{showLarge && <React.Suspense fallback={<Spinner/>}>
                    <LargeComponent/>
                </React.Suspense>}
                <Game {...this.state}/>
 */