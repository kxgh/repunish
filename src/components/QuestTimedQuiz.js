import React from "react";
import PropTypes from 'prop-types';
import {cx} from "./Quest";
import withTimedQuiz, {TQ_PHASES} from "./withTimedQuiz";
import Challenge from "../logic/Challenge";
import Player from "../logic/Player";
import Verdict from "./Verdict";

const Task = ({task, isImg}) => {
    if (!isImg)
        return <p className={cx.task}>{task}</p>;
    const bgStyle = {backgroundImage: `url(${task})`};
    return <div className={`${cx.task} ${cx.imageTask}`} style={bgStyle}/>
};

class QuestTimedQuiz extends React.Component {

    render() {
        // passed by withTimedQuiz
        const {timeLimit, tqPhase, answer, revealOpts, setOnIncorrect, setOnCorrect} = this.props;

        // passed explicitly
        const {challenge, actions, taskIsImg, typeText, introText, player} = this.props;
        const {task, options, correct} = challenge;

        setOnCorrect(actions.onCorrect);
        setOnIncorrect(actions.onIncorrect);

        const progStyle = {animationDuration: (timeLimit / 1000) + 's'};
        const progClassName = [cx.timer, tqPhase !== TQ_PHASES.SOLVING ? cx.timerStopped : ''].join(' ');
        if (tqPhase > TQ_PHASES.SOLVED)
            progStyle.animationPlayState = 'paused';

        const puzzleClassName = tqPhase > TQ_PHASES.INTRO ? cx.puzzleShown : cx.puzzleShown;

        const getOptBtnClassName = isCorrect => {
            const c = [cx.questOptBtn];
            if (tqPhase > TQ_PHASES.SOLVED)
                c.push(isCorrect ? cx.questOptBtnCorrect : cx.questOptBtnIncorrect);
            return c.join(' ')
        };

        const revealOptsClicked = () => {
            revealOpts(taskIsImg ? task : null);
        };

        return (
            <>
                <div className={cx.body}>
                    {tqPhase < TQ_PHASES.SOLVING && <>
                        <p className={cx.type}>{typeText}</p>
                        <p className={cx.task}>{introText}</p>
                        <button className={cx.revealBtn} onClick={revealOptsClicked}>
                            {tqPhase === TQ_PHASES.INTRO && "I'm ready"}
                            {tqPhase === TQ_PHASES.LOADING &&
                            <span><i className={"ra ra-stopwatch"}/>&nbsp;Loading...</span>}
                        </button>
                    </>}

                    {tqPhase > TQ_PHASES.LOADING &&
                    <div className={puzzleClassName}>

                        <Task task={task} isImg={taskIsImg}/>

                        <div style={progStyle}
                             className={progClassName}/>

                        <div className={cx.questOpts}>
                            {options.map(o => {
                                    const _correct = o === correct;
                                    return <button className={getOptBtnClassName(_correct)}
                                                   onClick={e => answer(_correct)}
                                                   key={o}>
                                        {o}
                                    </button>
                                }
                            )}
                        </div>

                        {tqPhase > TQ_PHASES.SOLVED &&
                        <p className={cx.questSolvedStatus}>
                            {tqPhase === TQ_PHASES.TIMEDOUT ? 'Out of time!' : (tqPhase === TQ_PHASES.CORRECT ?
                                    'Correct' : 'INCORRECT'
                            )}
                        </p>}
                    </div>}
                </div>
                {tqPhase > TQ_PHASES.SOLVING &&
                <Verdict players={player} challenge={challenge}/>}
                {tqPhase > TQ_PHASES.SOLVING &&
                <button onClick={actions.onFulfill} className={cx.fulfillBtn}>✓</button>}
            </>
        )
    }
}

QuestTimedQuiz.propTypes = {
    challenge: PropTypes.instanceOf(Challenge).isRequired,
    timeLimit: PropTypes.number.isRequired,
    tqPhase: PropTypes.number.isRequired,
    actions: PropTypes.object.isRequired,
    typeText: PropTypes.string.isRequired,
    introText: PropTypes.string.isRequired,
    taskIsImg: PropTypes.bool,
    player: PropTypes.instanceOf(Player)
};

export default withTimedQuiz(QuestTimedQuiz)
