import React from "react";
import PropTypes from 'prop-types';
import Challenge from "../logic/Challenge";
import QuestTimedQuiz from "./QuestTimedQuiz";
import Player from "../logic/Player";


const QuestTimedQuizFlag = ({challenge, actions, player}) => {
    const it = `${player.name} will try to answer a flag quiz within a time limit.`;
    const tt = challenge.type;
    return (
        <QuestTimedQuiz challenge={challenge}
                        actions={actions}
                        introText={it} typeText={tt} taskIsImg={true}
                        player={player}
        />
    )
};

QuestTimedQuizFlag.propTypes = {
    challenge: PropTypes.instanceOf(Challenge).isRequired,
    actions: PropTypes.object.isRequired,
    player: PropTypes.instanceOf(Player).isRequired
};

export default QuestTimedQuizFlag