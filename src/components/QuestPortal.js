import React from "react";
import PropTypes from 'prop-types';
import Player from "../logic/Player";
import {cx} from "./Quest";
import * as ACTIONS from "../logic/actions"
import Challenge from "../logic/Challenge";

const QuestPortal = ({challenge, actions, player, dispatch}) => {
    return (
        <div>
            <div className={cx.body}>
                <p className={cx.type}>{challenge.type}</p>
                <p className={`${cx.task} ${cx.taskLarge}`}>
                    <span className={cx.accent}>{`${player.name} `}</span>
                    enters the portal and appears at a random place!
                </p>
            </div>
            <button onClick={e => {
                console.log('TELEPORTING TO ', challenge.task)
                dispatch(ACTIONS.TELEPORT_PLAYER, {targetPlayer: player, targetPosition: challenge.task});
                actions.onFulfill();
            }} className={cx.fulfillBtn}>✓
            </button>
        </div>
    )
}

QuestPortal.propTypes = {
    actions: PropTypes.object.isRequired,
    player: PropTypes.instanceOf(Player).isRequired,
    dispatch: PropTypes.func.isRequired,
    challenge: PropTypes.instanceOf(Challenge).isRequired
};

export default QuestPortal
