import React from "react";
import PropTypes from 'prop-types';
import Challenge from "../logic/Challenge";
import QuestTimedQuiz from "./QuestTimedQuiz";
import Player from "../logic/Player";


const QuestTimedQuizCapital = ({challenge, actions, player}) => {
    const it = `${player.name} will try to pair a capital to a country.`;
    const tt = challenge.type;
    return (
        <QuestTimedQuiz challenge={challenge}
                        actions={actions}
                        introText={it} typeText={tt}
                        player={player}
        />
    )
};

QuestTimedQuizCapital.propTypes = {
    challenge: PropTypes.instanceOf(Challenge).isRequired,
    actions: PropTypes.object.isRequired,
    player: PropTypes.instanceOf(Player).isRequired
};

export default QuestTimedQuizCapital