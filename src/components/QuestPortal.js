import React from "react";
import PropTypes from 'prop-types';
import Player from "../logic/Player";
import {cx} from "./Quest";
import * as ACTIONS from "../logic/actions"
import Challenge from "../logic/Challenge";

const QuestPortal = ({challenge, actions, player, dispatch}) => {
    let moveText = '';
    if (challenge.task) {
        const byAbs = Math.abs(challenge.task.by);
        moveText = `Moved ${byAbs} tile${byAbs > 1 ? 's' : ''} ${challenge.task.by > 0 ? 'forwards.' : 'backwards.'}`;
    }
    return (
        <div>
            <div className={cx.body}>
                <p className={cx.type}>{challenge.type}</p>
                <p className={`${cx.task} ${cx.taskLarge}`}>
                    <span className={cx.accent}>{`${player.name} `}</span>
                    enters the portal and appears at a random place! {moveText}
                </p>
            </div>
            <button onClick={e => {
                dispatch(ACTIONS.TELEPORT_PLAYER, {targetPlayer: player, targetPosition: challenge.task.to});
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
