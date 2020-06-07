import React from "react";
import PropTypes from "prop-types";
import QuestMultiCond from "./QuestMultiCond";
import QuestRest from "./QuestRest";
import QuestTimedQuizCapital from "./QuestTimedQuizCapital";
import QuestGroupRelay from "./QuestGroupRelay";
import Player from "../logic/Player";
import * as Actions from "../logic/actions";
import Challenge from "../logic/Challenge";
import QuestTimedQuizMath from "./QuestTimedQuizMath";
import QuestTimedQuizFlag from "./QuestTimedQuizFlag";
import QuestFinish from "./QuestFinish";
import QuestTimedQuizEmblem from "./QuestTimedQuizEmblem";
import QuestDragon from "./QuestDragon";
import QuestPortal from "./QuestPortal";
import {DURATIONS} from "../logic/globals";
import QuestDuel from "./QuestDuel";

export const cx = {
    questContainer: 'quest',
    question: 'quest__question',
    image: 'quest__image',
    type: 'quest__type',
    body: 'quest__body',
    fulfillBtn: 'quest__fulfill-btn',
    revealBtn: 'quest__reveal-btn',
    task: 'quest__task',
    imageTask: 'quest__image-task',
    taskLarge: 'quest__task--large',
    avatarBtns: 'quest__avatar-btns',
    avatarBtn: 'quest__avatar-btn',
    accent: 'quest__task--accent',
    puzzleHidden: 'quest__puzzle--hidden',
    puzzleShown: 'quest__puzzle--shown',
    questOpts: 'quest__opts',
    questOptBtn: 'quest__opt-btn',
    questOptBtnCorrect: 'quest__opt-btn--correct',
    questOptBtnIncorrect: 'quest__opt-btn--incorrect',
    questSolvedStatus: 'quest__solved-status'
};


class Quest extends React.Component {
    render() {
        const {challenge, player, players, dispatch} = this.props;

        const defaultQuestActions = {
            onFulfill: () => {
                dispatch(Actions.FULFILL_QUEST);
                setTimeout(() => {
                    dispatch(Actions.OFFER_NEXT_TURN);
                }, DURATIONS.FULFILLED);
            },
            onIncorrect: (ansPlayer) => {
                dispatch(Actions.QUIZ_ANSWER_INCORRECT, ansPlayer || player)
            },
            onCorrect: (ansPlayer) => {
                dispatch(Actions.QUIZ_ANSWER_CORRECT, ansPlayer || player)
            }
        };

        /*const fulfill = e => {
            const newItems = [];
            if(delme++ === 1)
                newItems.push(ItemFactory.createItemOfType('CLOVER'));
            //dispatch(Actions.FULFILL_QUEST,{pickedItems:newItems});
        };*/
        if (!challenge)
            return <div className={cx.questContainer}>((((empty))))</div>;
        const bgStyle = {backgroundImage: `url('${Challenge.IMGS[challenge.type]}')`};

        return (
            <div className={`${cx.questContainer}`}>
                <div className={cx.image} style={bgStyle}/>

                {challenge.type === Challenge.TYPES.MULTI_COND &&
                <QuestMultiCond challenge={challenge} actions={defaultQuestActions} players={players}/>}
                {challenge.type === Challenge.TYPES.REST &&
                <QuestRest challenge={challenge} actions={defaultQuestActions}/>}
                {challenge.type === Challenge.TYPES.DRAGON &&
                <QuestDragon challenge={challenge} actions={defaultQuestActions} player={player} dispatch={dispatch}/>}
                {challenge.type === Challenge.TYPES.DUEL &&
                <QuestDuel players={players} challenge={challenge} actions={defaultQuestActions} player={player}
                           dispatch={dispatch}/>}
                {challenge.type === Challenge.TYPES.PORTAL &&
                <QuestPortal challenge={challenge} actions={defaultQuestActions} player={player} dispatch={dispatch}/>}
                {challenge.type === Challenge.TYPES.GROUP_RELAY &&
                <QuestGroupRelay challenge={challenge} actions={defaultQuestActions} players={players}/>}
                {challenge.type === Challenge.TYPES.TIMED_CAPITAL &&
                <QuestTimedQuizCapital challenge={challenge} actions={defaultQuestActions} player={player}/>}
                {challenge.type === Challenge.TYPES.TIMED_MATH &&
                <QuestTimedQuizMath challenge={challenge} actions={defaultQuestActions} player={player}/>}
                {challenge.type === Challenge.TYPES.TIMED_FLAG &&
                <QuestTimedQuizFlag challenge={challenge} actions={defaultQuestActions} player={player}/>}
                {challenge.type === Challenge.TYPES.TIMED_EMBLEM &&
                <QuestTimedQuizEmblem challenge={challenge} actions={defaultQuestActions} player={player}/>}
                {challenge.type === Challenge.TYPES.FINISH &&
                <QuestFinish actions={defaultQuestActions} player={player}/>}
            </div>
        )
    }
}

Quest.propTypes = {
    challenge: PropTypes.instanceOf(Challenge).isRequired,
    player: PropTypes.instanceOf(Player).isRequired,
    players: PropTypes.arrayOf(PropTypes.instanceOf(Player)).isRequired,
    dispatch: PropTypes.func.isRequired
};
export default Quest
