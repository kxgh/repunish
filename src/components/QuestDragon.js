import React from "react";
import PropTypes from 'prop-types';
import Player from "../logic/Player";
import {cx} from "./Quest";
import * as ACTIONS from "../logic/actions"
import Challenge from "../logic/Challenge";

const QuestDragon = ({challenge, actions, player, dispatch}) => {
    const target = challenge.task || 'someone else';
    const found = target === player.name;
    return (
        <div>
            <div className={cx.body}>
                <p className={cx.type}>{challenge.type}</p>
                {!found && <p className={`${cx.task} ${cx.taskLarge}`}>
                    It is not you who I seek. I demand head of
                    <span className={cx.accent}>{` ${target} `}</span>
                    Now get lost.
                </p>}
                {found && <p className={`${cx.task} ${cx.taskLarge}`}>
                    At last!
                    <span className={cx.accent}>{` ${target} !`}</span>
                    You are mine!
                </p>}
            </div>
            <button onClick={e => {
                if (found)
                    dispatch(ACTIONS.TELEPORT_PLAYER, {targetPlayer: player, targetPosition: 0});
                actions.onFulfill();
            }} className={cx.fulfillBtn}>✓
            </button>
        </div>
    )
};

QuestDragon.propTypes = {
    actions: PropTypes.object.isRequired,
    player: PropTypes.instanceOf(Player).isRequired,
    dispatch: PropTypes.func.isRequired,
    challenge: PropTypes.instanceOf(Challenge).isRequired
};

export default QuestDragon
