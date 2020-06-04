import React, {useContext} from "react";
import PropTypes from 'prop-types';
import Dice from "./Dice";
import {gcx} from "../logic/globals";
import PhaseContext from "../PhaseContext";
import * as Phase from "../logic/game-phase"

const cx = {
    container: 'board-dice-roller',
    btnRoll: 'board-dice-roller__btn-roll',
    btnRollHidden: 'board-dice-roller__btn-roll--hidden',
    diceContainer: 'board-dice-roller-dice'
};

const BoardDiceRoller = ({onRoll, diceResult}) => {
    const phase = useContext(PhaseContext);
    const hideDice = !(phase >= Phase.ROLLING_DICE && phase <= Phase.CHOOSING_STEP);
    const tap2diceBtnClassName = `${gcx.attentionBg} ${gcx.btnLarge} ${cx.btnRoll} ` +
        `${phase >= Phase.ROLLING_DICE ? cx.btnRollHidden : ''}`;
    return (
        <div className={cx.container}>
            <h2 className={tap2diceBtnClassName}
                onClick={onRoll}>
                <p><i className="ra ra-4x ra-perspective-dice-four"/></p>
                <p>roll the dice</p>
            </h2>
            <div className={cx.diceContainer}>
                <Dice hidden={hideDice}
                      num={diceResult[0]}
                      rolling={phase === Phase.ROLLING_DICE}/>
                <Dice hidden={hideDice}
                      num={diceResult[1]}
                      rolling={phase === Phase.ROLLING_DICE}/>
            </div>
        </div>
    )
};

BoardDiceRoller.propTypes = {
    diceResult: PropTypes.arrayOf(PropTypes.number),
    onRoll: PropTypes.func.isRequired
};

export default BoardDiceRoller