import React from "react";
import PropTypes from 'prop-types';
import Challenge from "../logic/Challenge";
import QuestTimedQuiz from "./QuestTimedQuiz";
import Player from "../logic/Player";


const QuestTimedQuizMath = ({challenge, actions, player}) => {
    const it = `${player.name} will try to solve a simple math problem within a time limit.`;
    const tt = challenge.type;
    return (
        <QuestTimedQuiz challenge={challenge}
                        actions={actions}
                        introText={it} typeText={tt}
                        player={player}
        />
    )
};

QuestTimedQuizMath.propTypes = {
    challenge: PropTypes.instanceOf(Challenge).isRequired,
    actions: PropTypes.object.isRequired,
    player: PropTypes.instanceOf(Player).isRequired
};

export default QuestTimedQuizMath