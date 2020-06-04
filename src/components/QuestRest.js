import React from "react";
import PropTypes from 'prop-types';
import {cx} from "./Quest";
import Challenge from "../logic/Challenge";

const QuestRest = ({challenge, actions}) => (
    <div>
        <div className={cx.body}>
            <p className={cx.type}>{challenge.type}</p>
            <p className={`${cx.task} ${cx.taskLarge}`}>
                <span className={cx.accent}>Nothing happens.&nbsp;</span>
                That's a good thing, right?
            </p>
        </div>
        <button onClick={actions.onFulfill} className={cx.fulfillBtn}>✓</button>
    </div>
)

QuestRest.propTypes = {
    actions: PropTypes.object.isRequired,
    challenge: PropTypes.instanceOf(Challenge).isRequired
};

export default QuestRest