import React from "react";
import PropTypes from 'prop-types';
import {cx} from "./Quest";
import Player from "../logic/Player";

const QuestFinish = ({player, actions}) => {
    return (
        <>
            <div className={cx.body}>
                <p className={cx.type}>Congratulations!</p>
                <p className={`${cx.task} ${cx.taskLarge}`}><span
                    className={cx.accent}>{player.name}</span> reaches the finish line and is out of the punishment
                    game!</p>
            </div>
            <button onClick={actions.onFulfill} className={cx.fulfillBtn}>✓</button>
        </>
    )
};

QuestFinish.propTypes = {
    player: PropTypes.instanceOf(Player).isRequired,
    actions: PropTypes.object.isRequired
};

export default QuestFinish