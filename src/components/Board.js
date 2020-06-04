import React from "react";
import PropTypes from 'prop-types';
import Tile from "../logic/Tile";
import BoardTile from "./BoardTile";
import Player from "../logic/Player";
import * as ACTIONS from "../logic/actions"
import PhaseContext from "../PhaseContext";
import * as Phase from "../logic/game-phase"
import Quest from "./Quest";
import Challenge from "../logic/Challenge";
import BoardTurnInfo from "./BoardTurnInfo";
import BoardDiceRoller from "./BoardDiceRoller";
import BoardHelp from "./BoardHelp";
import {gcx, DURATIONS} from "../logic/globals";

const cx = {
    boardContainer: 'board',
    tilesContainer: 'board__board-tiles',
    diceContainer: 'board__dice-container',
    desktop: 'board__desktop',
    desktopControls: 'board__desktop-controls',
    tap2dice: 'board__tap2dice',
    btnTap2dice: 'board__tap2dice__btn',
    btnTap2diceHidden: 'board__tap2dice__btn--hidden',
    btnHelping: 'board__help__btn',
    btnHelpingHidden: 'board__help__btn--hidden'
};

const onRollClick = dispatch => {
    dispatch(ACTIONS.ROLL_DICE);
    setTimeout(() => {
        dispatch(ACTIONS.SETTLE_DICE);
        setTimeout(() => {
            dispatch(ACTIONS.OFFER_STEPS)
        }, DURATIONS.DICE_SETTLE);
    }, DURATIONS.DICE_ROLL)
};

const onTileClicked = (tile, dispatch) => {
    console.log('step chosen')
    dispatch(ACTIONS.STEP_CHOOSE, tile);
    setTimeout(() => {
        dispatch(ACTIONS.SHOW_QUEST);
    }, DURATIONS.STEP_CHOOSE)
};

const scrollToCurrentPlayer = (board, insta) => {
    if (board) {
        if (!insta && board.currentPlayerTileRef && board.currentPlayerTileRef.scrollIntoView) {
            board.currentPlayerTileRef.scrollIntoView({behavior: 'smooth'});
        } else window.scrollTo(0, board.currentPlayerTileRef.offsetTop);
    } else console.warn('err: no board specified to scroller')
};

const BoardTiles = ({gameProps, phase, refSetter, helping, onHelp}) => {
    const {players, turn, diceResult, tiles, dispatch} = gameProps;
    if (phase === Phase.QUEST_PENDING_SHOWING)
        return null;
    let clickable1 = -1;
    let clickable2 = -1;
    if (phase === Phase.CHOOSING_STEP && !helping) {
        clickable1 = players[turn].position + diceResult[0];
        clickable2 = players[turn].position + diceResult[1];
    }
    return (
        <div className={cx.tilesContainer}>
            {tiles.map(t => {
                    const standing = [].concat(players.filter(p => p.position === t.position));
                    const clickable = t.position === clickable1 || t.position === clickable2;
                    const onTileClick = helping ? () => onHelp(t.type) : (clickable ? tile => onTileClicked(tile, dispatch) : _ => _);
                    let modifier = null;
                    clickable && (modifier = BoardTile.MODIFIERS.CLICKABLE);
                    helping && (modifier = BoardTile.MODIFIERS.HELPABLE);
                    return (
                        <BoardTile key={t.id}
                                   players={standing}
                                   tile={t}
                                   modifier={modifier}
                                   onTileClick={onTileClick}
                                   turnPlayer={players[turn]}
                                   ref={ref => {
                                       t.position === players[turn].position && refSetter(ref)
                                   }}
                        />
                    )
                }
            )}
        </div>
    )
};

class Board extends React.Component {

    constructor(props) {
        super(props);
        this.currentPlayerTileRef = React.createRef();
        this.state = {
            helping: false,
            helpForType: null
        };
        this.toggleHelping = this.toggleHelping.bind(this);
        this.showHelpForType = this.showHelpForType.bind(this);
    }

    toggleHelping() {
        this.setState(prevState => {
            return {helping: !prevState.helping, helpForType: null}
        })
    }

    showHelpForType(type) {
        this.setState({
            helpForType: type
        })
    }

    render() {
        const {challenge, players, turn, diceResult, dispatch} = this.props;
        const {helping, helpForType} = this.state;
        const phase = this.context;

        (phase === Phase.GAME_STARTED || phase === Phase.QUEST_FULFILLED) && !helping && setImmediate(() => {
            scrollToCurrentPlayer(this, phase === Phase.QUEST_FULFILLED);
        });

        const helpVisible = phase < Phase.WALKING;

        return (
            <div className={cx.boardContainer}>
                <BoardTiles gameProps={this.props} refSetter={ref => {
                    this.currentPlayerTileRef = ref
                }} phase={phase} helping={helping} onHelp={this.showHelpForType}/>
                <div className={cx.desktop}>
                    {phase !== Phase.QUEST_PENDING_SHOWING &&
                    <div className={cx.desktopControls}>
                        {!helping && <>
                            <BoardTurnInfo turnPlayer={players[turn]} onImgClick={e => {
                                scrollToCurrentPlayer(this)
                            }}/>
                            <BoardDiceRoller onRoll={e => onRollClick(dispatch)} diceResult={diceResult}/>
                            <p onClick={arg => (helpVisible && this.toggleHelping(arg))} className={cx.btnHelping}><i
                                className={`ra ra-help ra-lg ${gcx.appearAnim} ${!helpVisible ? cx.btnHelpingHidden : ''}`}/>
                            </p>
                        </>}
                        {helping && <BoardHelp type={helpForType} onDismiss={this.toggleHelping}/>}
                    </div>}
                    {phase === Phase.QUEST_PENDING_SHOWING &&
                    <Quest challenge={challenge} dispatch={dispatch} player={players[turn]} players={players}/>}
                </div>
            </div>
        )
    }
}

Board.contextType = PhaseContext;

Board.propTypes = {
    tiles: PropTypes.arrayOf(PropTypes.instanceOf(Tile).isRequired).isRequired,
    players: PropTypes.arrayOf(PropTypes.instanceOf(Player).isRequired).isRequired,
    turn: PropTypes.number.isRequired,
    diceResult: PropTypes.arrayOf(PropTypes.number),
    dispatch: PropTypes.func.isRequired,
    challenge: PropTypes.instanceOf(Challenge)
};
export default Board;